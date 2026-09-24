import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/admin.js";

const roleStyles = {
  admin: "bg-brand/15 text-brand",
  moderator: "bg-indigo-100 text-indigo-700",
  user: "bg-gray-100 text-gray-700",
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setUsers(await getAllUsers());
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-night-card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold dark:text-white">Users</h2>
        {!loading && (
          <span className="text-sm text-muted dark:text-white/60">
            {users.length} total
          </span>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-4 text-sm text-muted dark:text-white/60">Loading…</p>
      ) : users.length === 0 ? (
        <p className="mt-4 text-sm text-muted dark:text-white/60">
          No users found.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-muted dark:text-white/50">
                <th className="pb-3 pr-4 font-semibold">User</th>
                <th className="pb-3 pr-4 font-semibold">Email</th>
                <th className="pb-3 pr-4 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {users.map((u) => (
                <tr key={u._id} className="dark:text-white/80">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar?.url}
                        alt={u.username}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span className="font-semibold">{u.username}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">{u.email}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        roleStyles[u.role] || roleStyles.user
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-muted dark:text-white/50">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
