import Link from "next/link";
export default function NotFound() {
  return (
    <section className="container empty-state">
      <span className="eyebrow">A LITTLE DETOUR</span>
      <h1>This page wandered off.</h1>
      <p>Let’s find our way back to our little home.</p>
      <Link href="/" className="button">
        Back home ↗
      </Link>
    </section>
  );
}
