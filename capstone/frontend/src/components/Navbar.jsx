import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { navLinks } from '../data/content.js'
import ThemeToggle from './ThemeToggle.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <header
      id="top"
      className={`fixed inset-x-0 top-0 z-50 transition ${
        scrolled
          ? 'bg-white/95 shadow-card backdrop-blur dark:bg-night-soft/95'
          : 'bg-transparent'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <a href="#top" className="flex items-center gap-2 text-xl font-extrabold" onClick={close}>
          <span className="text-2xl">🍽️</span>
          <span className="font-script text-2xl text-brand">Foodie</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-7 text-sm font-semibold text-ink dark:text-white/85">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link to={`/${link.href}`} className="transition hover:text-brand">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login" className="btn-ghost dark:text-white/85 dark:hover:text-brand">Sign In</Link>
            <Link to="/signup" className="btn-primary">Order Now</Link>
          </div>
        </nav>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`h-0.5 w-6 bg-ink transition dark:bg-white ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-0.5 w-6 bg-ink transition dark:bg-white ${open ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-ink transition dark:bg-white ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <nav
        className={`md:hidden ${
          open ? 'max-h-96 border-t border-black/5 dark:border-white/10' : 'max-h-0'
        } overflow-hidden bg-white transition-all duration-300 dark:bg-night-soft`}
      >
        <ul className="container-x flex flex-col gap-1 py-4 text-sm font-semibold dark:text-white/85">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={`/${link.href}`}
                className="block rounded-lg px-3 py-2.5 transition hover:bg-cream hover:text-brand dark:hover:bg-white/10"
                onClick={close}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 flex gap-2 px-1">
            <Link to="/login" className="btn-ghost flex-1 border border-black/10 dark:border-white/15 dark:text-white/85" onClick={close}>Sign In</Link>
            <Link to="/signup" className="btn-primary flex-1" onClick={close}>Order Now</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
