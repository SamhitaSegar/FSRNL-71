import { reviews } from '../data/content.js'

export default function Reviews() {
  return (
    <section id="reviews" className="bg-cream py-20 dark:bg-night md:py-24">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Testimonials</span>
          <h2 className="section-title mt-4">What Our Customers Say</h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <article key={r.id} className="rounded-2xl bg-white p-7 shadow-card dark:bg-night-card">
              <div className="text-lg text-amber-400">★★★★★</div>
              <p className="mt-4 leading-relaxed text-muted dark:text-white/70">{r.text}</p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={r.avatar}
                  alt={`Portrait of ${r.name}`}
                  loading="lazy"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <strong className="block text-sm font-bold dark:text-white">{r.name}</strong>
                  <small className="text-xs text-muted dark:text-white/60">{r.role}</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
