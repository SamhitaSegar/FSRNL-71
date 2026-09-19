import { stats } from '../data/content.js'

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-cream pt-28 pb-20 dark:bg-night md:pt-36 md:pb-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        {/* Copy */}
        <div className="animate-fade-up">
          <span className="eyebrow">🔥 Trending this week</span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight dark:text-white sm:text-5xl lg:text-6xl">
            Delicious Food <br />
            Delivered <span className="text-brand">Fresh</span> To You
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted dark:text-white/60 sm:text-lg">
            Handcrafted meals made from farm-fresh ingredients by our expert
            chefs. Order in seconds and enjoy restaurant-quality food at home.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#menu" className="btn-primary btn-lg">Explore Menu</a>
            <a href="#about" className="inline-flex items-center gap-3 font-semibold text-ink dark:text-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand shadow-card dark:bg-night-card">
                ▶
              </span>
              Watch Story
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <strong className="block text-2xl font-extrabold text-ink dark:text-white">{s.value}</strong>
                <span className="text-sm text-muted dark:text-white/60">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-0 -z-0 scale-110 rounded-full bg-brand/15 blur-2xl" aria-hidden="true" />
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80"
            alt="A vibrant, healthy bowl of fresh food"
            className="relative z-10 aspect-square w-full rounded-[2rem] object-cover shadow-soft"
          />

          <div className="absolute -left-4 top-10 z-20 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-card animate-float dark:bg-night-card">
            <span className="text-2xl">⭐</span>
            <div>
              <strong className="block text-sm font-bold dark:text-white">4.9</strong>
              <small className="text-xs text-muted dark:text-white/60">Trusted Rating</small>
            </div>
          </div>

          <div
            className="absolute -right-3 bottom-10 z-20 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-card animate-float dark:bg-night-card"
            style={{ animationDelay: '1.2s' }}
          >
            <span className="text-2xl">🛵</span>
            <div>
              <strong className="block text-sm font-bold dark:text-white">Fast Delivery</strong>
              <small className="text-xs text-muted dark:text-white/60">Within 30 mins</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
