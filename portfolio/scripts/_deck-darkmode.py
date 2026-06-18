"""One-shot: append dark: variants to the KLCN deck slides for synced dark mode.

Light tokens are kept; a matching dark variant is appended (opacity preserved
where it makes sense). Run ONCE — re-running would double-append.

Palette mapping
  INK    #0F172A -> #E2E8F0   (foreground)
  SUB    #475569 -> #94A3B8   (secondary)
  ACCENT #1D4ED8 -> #60A5FA   (blue accent)
  GREEN  #15803D -> #4ADE80
  CYAN   #0369A1 -> #38BDF8
  white surfaces -> dark slate / translucent white
"""
import re
import sys

FILES = ["slides-01-05.tsx", "slides-06-10.tsx", "slides-11-15.tsx", "shared.tsx"]

OPT = r"(/(?:\[[0-9.]+\]|[0-9.]+))?"  # optional opacity suffix, captured

# (regex, replacement) — replacement may use \1 = full match minus opacity isn't
# used; we rebuild explicitly. Each tuple: (pattern, dark_class_prefix)
# For preserve-opacity tokens we keep the same opacity on the dark side.
PRESERVE = [
    (r"text-\[#0F172A\]",   "dark:text-[#E2E8F0]"),
    (r"text-\[#475569\]",   "dark:text-[#94A3B8]"),
    (r"text-\[#1D4ED8\]",   "dark:text-[#60A5FA]"),
    (r"text-\[#15803D\]",   "dark:text-[#4ADE80]"),
    (r"text-\[#0369A1\]",   "dark:text-[#38BDF8]"),
    (r"border-\[#0F172A\]", "dark:border-white"),
    (r"border-\[#475569\]", "dark:border-[#94A3B8]"),
    (r"border-\[#1D4ED8\]", "dark:border-[#60A5FA]"),
    (r"border-\[#15803D\]", "dark:border-[#4ADE80]"),
    (r"border-\[#0369A1\]", "dark:border-[#38BDF8]"),
    (r"bg-\[#0F172A\]",     "dark:bg-white"),
]

def preserve_sub(text, token_re, dark_prefix):
    pat = re.compile(token_re + OPT)
    def repl(m):
        op = m.group(1) or ""
        return f"{m.group(0)} {dark_prefix}{op}"
    return pat.sub(repl, text)

def special_sub(text, token_re, dark_class, require_opacity):
    """Append a FIXED dark class. require_opacity=True matches only the
    opacity form; False matches the solid form (not followed by '/')."""
    # (?<!:) prevents matching dark: variants inserted by earlier steps
    # (e.g. a `dark:bg-white/15` produced from bg-[#0F172A]).
    if require_opacity:
        pat = re.compile(r"(?<!:)" + token_re + r"/(?:\[[0-9.]+\]|[0-9.]+)")
    else:
        pat = re.compile(r"(?<!:)" + token_re + r"(?![/\w-])")
    return pat.sub(lambda m: f"{m.group(0)} {dark_class}", text)

def transform(text):
    for token_re, dark_prefix in PRESERVE:
        text = preserve_sub(text, token_re, dark_prefix)
    # accent blue tints / fills
    text = special_sub(text, r"bg-\[#1D4ED8\]", "dark:bg-[#60A5FA]/10", True)
    text = special_sub(text, r"bg-\[#1D4ED8\]", "dark:bg-[#3B82F6]",    False)
    # green tints / fills
    text = special_sub(text, r"bg-\[#15803D\]", "dark:bg-[#4ADE80]/10", True)
    text = special_sub(text, r"bg-\[#15803D\]", "dark:bg-[#16A34A]",    False)
    # white surfaces
    text = special_sub(text, r"bg-white", "dark:bg-white/5",   True)
    text = special_sub(text, r"bg-white", "dark:bg-[#131C30]", False)
    return text

def main():
    for f in FILES:
        with open(f, encoding="utf-8") as fh:
            src = fh.read()
        if "dark:" in src:
            print(f"SKIP {f}: already contains dark: variants", file=sys.stderr)
            continue
        out = transform(src)
        with open(f, "w", encoding="utf-8") as fh:
            fh.write(out)
        print(f"OK {f}: {out.count('dark:')} dark variants added")

if __name__ == "__main__":
    main()
