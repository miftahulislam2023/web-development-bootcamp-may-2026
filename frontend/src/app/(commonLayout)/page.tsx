import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center py-24">
      <h1 className="text-4xl font-extrabold mb-4">FinanceApp</h1>
      <p className="text-lg text-muted-foreground mb-8">
        A small finance tracker starter template. Log in to view your dashboard.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/auth/login"
          className="btn-primary px-4 py-2 rounded bg-primary text-white"
        >
          Get started
        </Link>
        <Link href="/dashboard" className="px-4 py-2 rounded border">
          View demo
        </Link>
      </div>
    </div>
  );
}
