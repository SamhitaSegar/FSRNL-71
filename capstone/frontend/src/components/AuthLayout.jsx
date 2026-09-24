import { Link } from 'react-router-dom'

// Split-screen shell for auth pages: a branded panel + the form area.
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Branded panel */}
      <aside className="relative hidden overflow-hidden bg-ink lg:block">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80"
          alt="A beautifully plated dish at our restaurant"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold">
            <span className="text-2xl">🍽️</span>
            <span className="font-script text-2xl text-brand-light">Foodie</span>
          </Link>
          <div>
            <h2 className="text-3xl font-extrabold leading-tight">
              Fresh food, <br /> delivered with love.
            </h2>
            <p className="mt-3 max-w-sm text-white/80">
              Join thousands of food lovers enjoying restaurant-quality meals at home.
            </p>
          </div>
        </div>
      </aside>

      {/* Form area */}
      <main className="flex items-center justify-center bg-cream px-5 py-12 dark:bg-night">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xl font-extrabold lg:hidden"
          >
            <span className="text-2xl">🍽️</span>
            <span className="font-script text-2xl text-brand">Foodie</span>
          </Link>

          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">{title}</h1>
          <p className="mt-2 text-muted dark:text-white/60">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
