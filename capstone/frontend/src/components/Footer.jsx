import { footerCols, contactInfo } from '../data/content.js'

const socials = [
  { label: 'Facebook', text: 'f' },
  { label: 'Twitter', text: 't' },
  { label: 'Instagram', text: 'ig' },
  { label: 'YouTube', text: 'yt' },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <a href="#top" className="flex items-center gap-2 text-xl font-extrabold text-white">
            <span className="text-2xl">🍽️</span>
            <span className="font-script text-2xl text-brand-light">Foodie</span>
          </a>
          <p className="mt-4 text-sm leading-relaxed">
            Delicious meals delivered fresh to your doorstep. Made with love, served with care.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold transition hover:bg-brand hover:text-white"
              >
                {s.text}
              </a>
            ))}
          </div>
        </div>

        {footerCols.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-bold uppercase tracking-wide text-white">{col.title}</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="transition hover:text-brand-light">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-white">Get In Touch</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {contactInfo.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-x text-center text-sm text-white/60">
          © 2026 Foodie. All rights reserved. Crafted with 🍴 &amp; passion.
        </div>
      </div>
    </footer>
  )
}
