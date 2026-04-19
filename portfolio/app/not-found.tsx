import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";

export default function NotFound() {
  return (
    <Container>
      <Section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <FadeIn>
          <h1 className="text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            404
          </h1>
          <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-400">
            The page you are looking for does not exist.
          </p>
          <div className="mt-10">
            <Link
              href="/"
              className="rounded-md bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Go back home
            </Link>
          </div>
        </FadeIn>
      </Section>
    </Container>
  );
}
