import { Link, useSearchParams } from "react-router-dom";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <section className="bg-cream py-24 dark:bg-night-soft">
      <div className="container-x">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-10 text-center shadow-card dark:bg-night-card">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
            ✅
          </div>
          <h1 className="mt-6 text-2xl font-extrabold dark:text-white">
            Order placed!
          </h1>
          <p className="mt-2 text-muted dark:text-white/60">
            Thank you for your order. We&apos;re getting it ready.
          </p>
          {orderId && (
            <p className="mt-3 rounded-lg bg-cream px-3 py-2 text-sm font-semibold dark:bg-night dark:text-white/80">
              Order ID: {orderId.slice(-8).toUpperCase()}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2">
            <Link to="/#menu" className="btn-primary">
              Order more
            </Link>
            <Link
              to="/"
              className="text-sm font-semibold text-muted transition hover:text-brand dark:text-white/60"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
