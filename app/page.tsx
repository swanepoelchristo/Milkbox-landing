// @ts-nocheck
import InfoGate from "../components/InfoGate";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <InfoGate />

      <header className="mb-10 text-center">
        <h1 className="mb-3 text-4xl font-bold">AI tools anyone can use</h1>
        <p className="text-gray-600">Click-simple tools for CVs, invoices, farm &amp; bar ops — no coding needed.</p>
        <div className="mt-6 flex justify-center gap-3">
          <a href="#tools" className="inline-block rounded-lg bg-green-600 px-6 py-3 text-white shadow hover:bg-green-700">
            See Tool Shelf
          </a>
          <Link href="/thanks" className="inline-block rounded-lg border border-gray-300 px-6 py-3">
            Get Early Access
          </Link>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="mb-2 text-2xl font-semibold">Problem → Solution</h2>
        <ul className="list-disc space-y-1 pl-6 text-gray-700">
          <li>AI feels complicated and expensive.</li>
          <li>MilkBox AI gives ready-made tools you can click, not code.</li>
          <li>Low cost. Private data. Built in Pretoria, South Africa.</li>
        </ul>
      </section>

      <section id="tools" className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Tool shelf (preview)</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {["CV Maker","Invoice Generator","Bar Menu Writer","Bush Pig Tool"].map(t=>(
            <div key={t} className="rounded-xl border p-4 shadow-sm">
              <h3 className="text-lg font-bold">{t}</h3>
              <p className="text-sm text-gray-600">Click-simple output in minutes.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-2 text-2xl font-semibold">How it works</h2>
        <ol className="list-decimal space-y-1 pl-6 text-gray-700">
          <li>Pick a tool</li>
          <li>Fill a simple form</li>
          <li>Get your result</li>
        </ol>
      </section>

      <footer className="mt-16 border-t pt-6 text-center text-sm text-gray-600">
        Contact: <a href="mailto:aiorders@milkyroadscheese.com">aiorders@milkyroadscheese.com</a> • “Let’s not cry over spilled milk.”
      </footer>
    </main>
  );
}
