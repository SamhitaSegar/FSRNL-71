import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { navLinks } from "../data/content.js";
import { fetchProfile, logout } from "../redux/slices/authSlice.js";
import { selectCartCount } from "../redux/slices/cartSlice.js";
import ThemeToggle from "./ThemeToggle.jsx";

// Cart icon with a live item-count badge. Links to the menu section.
function CartButton({ count, onClick }) {
  return (
    <Link
      to="/cart"
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:text-brand dark:text-white/85"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
    >
      <span className="text-xl">🛒</span>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold leading-none text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartCount);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // If we have a token but no user object (e.g. after a page reload),
  // hydrate the profile from the backend.
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [token, user, dispatch]);

  const close = () => setOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    close();
    navigate("/");
  };

  return (
    <header
      id="top"
      className={`fixed inset-x-0 top-0 z-50 transition ${
        scrolled
          ? "bg-white/95 shadow-card backdrop-blur dark:bg-night-soft/95"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <a
          href="#top"
          className="flex items-center gap-2 text-xl font-extrabold"
          onClick={close}
        >
          <span className="text-2xl">🍽️</span>
          <span className="font-script text-2xl text-brand">Foodie</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-7 text-sm font-semibold text-ink dark:text-white/85">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={`/${link.href}`}
                  className="transition hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <CartButton count={cartCount} />
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <span className="text-sm font-semibold text-ink dark:text-white/85">
                  Hi, {user?.username || "there"}
                </span>
                <button onClick={handleLogout} className="btn-primary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-ghost dark:text-white/85 dark:hover:text-brand"
                >
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary">
                  Order Now
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 md:hidden">
          <CartButton count={cartCount} onClick={close} />
          <ThemeToggle />
          <button
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`h-0.5 w-6 bg-ink transition dark:bg-white ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-6 bg-ink transition dark:bg-white ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-6 bg-ink transition dark:bg-white ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <nav
        className={`md:hidden ${
          open
            ? "max-h-96 border-t border-black/5 dark:border-white/10"
            : "max-h-0"
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
            {isAuthenticated ? (
              <>
                <span className="flex flex-1 items-center px-3 text-sm font-semibold text-ink dark:text-white/85">
                  Hi, {user?.username || "there"}
                </span>
                <button onClick={handleLogout} className="btn-primary flex-1">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-ghost flex-1 border border-black/10 dark:border-white/15 dark:text-white/85"
                  onClick={close}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary flex-1"
                  onClick={close}
                >
                  Order Now
                </Link>
              </>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
