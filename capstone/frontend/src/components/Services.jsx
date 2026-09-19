import { services } from '../data/content.js'

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-24">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Why Choose Us</span>
          <h2 className="section-title mt-4">We Serve The Best Experience</h2>
          <p className="mt-3 text-muted dark:text-white/60">
            From the first bite to the last, everything is crafted for your delight.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <article
              key={s.title}
              className="group rounded-2xl border border-black/5 bg-white p-7 text-center shadow-card transition hover:-translate-y-1 hover:border-brand/20 dark:border-white/10 dark:bg-night-card dark:hover:border-brand/30"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cream text-3xl transition group-hover:bg-brand/10 dark:bg-night-soft dark:group-hover:bg-brand/20">
                {s.icon}
              </div>
              <h3 className="mt-5 text-lg font-bold dark:text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted dark:text-white/60">{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
