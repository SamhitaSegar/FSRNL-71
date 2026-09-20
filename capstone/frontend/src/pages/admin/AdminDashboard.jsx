import { useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/admin/kitchens", label: "Kitchens", icon: "🏪" },
  { to: "/admin/menu", label: "Menu", icon: "🍽️" },
  { to: "/admin/orders", label: "Orders", icon: "📦" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);

  // The admin area requires a logged-in admin. Guard runs after the
  // profile hydrates (user may be null briefly right after a reload while
  // fetchProfile is in flight, so we wait for `user` before role-checking).
  useEffect(() => {
    if (!isAuthenticated && !token) {
      navigate("/login");
    } else if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, token, user, navigate]);

  return (
    <section className="min-h-screen bg-cream pt-24 dark:bg-night-soft">
      <div className="container-x pb-16">
        <div className="mb-8">
          <span className="eyebrow">Admin</span>
          <h1 className="section-title mt-2">Kitchen Dashboard</h1>
          <p className="mt-2 text-muted dark:text-white/60">
            Welcome{user?.username ? `, ${user.username}` : ""}. Manage your
            kitchens, menu, and orders.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          {/* Sidebar nav */}
          <aside>
            <nav className="sticky top-24 space-y-1 rounded-2xl bg-white p-3 shadow-card dark:bg-night-card">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-brand text-white shadow-soft"
                        : "text-ink hover:bg-cream hover:text-brand dark:text-white/80 dark:hover:bg-white/10"
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Routed content */}
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
}
