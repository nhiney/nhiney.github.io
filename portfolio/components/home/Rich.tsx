// Renders `**keyword**` markers from the copy as <strong>.
export function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/);
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
    </>
  );
}

/** Same copy with the markers stripped, for places that need plain text. */
export function plain(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1");
}
