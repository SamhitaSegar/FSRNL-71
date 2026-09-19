export default function About() {
  return (
    <section id="about" className="py-20 md:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-md">
          <img
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80"
            alt="Interior of our warm, welcoming restaurant"
            className="w-full rounded-[2rem] object-cover shadow-soft"
          />
          <div className="absolute -bottom-6 -right-4 rounded-2xl bg-brand px-6 py-4 text-center text-white shadow-soft">
            <strong className="block text-2xl font-extrabold">25+</strong>
            <span className="text-xs">Years of Experience</span>
          </div>
        </div>

        <div>
          <span className="eyebrow">About Us</span>
          <h2 className="section-title mt-4">A Passion For Food, A Love For People</h2>
          <p className="mt-4 leading-relaxed text-muted dark:text-white/60">
            For over two decades we've been serving heartfelt meals that bring
            people together. Every dish tells a story of tradition, quality, and care.
          </p>
          <ul className="mt-6 space-y-3 text-ink dark:text-white/85">
            <li className="flex items-center gap-2 font-medium">
              <span className="text-brand">✔</span> Farm-to-table fresh ingredients
            </li>
            <li className="flex items-center gap-2 font-medium">
              <span className="text-brand">✔</span> Recipes perfected over generations
            </li>
            <li className="flex items-center gap-2 font-medium">
              <span className="text-brand">✔</span> A cozy space that feels like home
            </li>
          </ul>
          <a href="#menu" className="btn-primary mt-8">Discover More</a>
        </div>
      </div>
    </section>
  )
}
