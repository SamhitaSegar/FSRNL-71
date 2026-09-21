// Admin API helpers for kitchen and menu management.
//
// These wrap the shared axios instance (which attaches the Bearer token).
// Endpoints that accept an image use multipart/form-data.
//
// Backend routes (all require auth; ownership enforced server-side):
//   POST   /api/kitchens                 create kitchen        -> { message, kitchen }
//   GET    /api/kitchens/my              my kitchens           -> { kitchens }
//   GET    /api/kitchens/:id/orders      kitchen orders        -> { count, orders }
//   POST   /api/menu/:kitchenId          add menu item         -> { message, menuItem }
//   PUT    /api/menu/:menuId             update menu item      -> { message, menuItem }
//   DELETE /api/menu/:menuId             delete menu item      -> { message }

import api from "./auth.js";

// Build a FormData body from a plain object, skipping empty values and
// letting a File be appended under the "image" key.
function toFormData(fields, imageFile) {
  const fd = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      fd.append(key, value);
    }
  });
  if (imageFile) fd.append("image", imageFile);
  return fd;
}

// --- Kitchens ---

export async function getMyKitchens() {
  const { data } = await api.get("/kitchens/my");
  return data.kitchens || [];
}

export async function createKitchen(fields, imageFile) {
  const { data } = await api.post("/kitchens", toFormData(fields, imageFile), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.kitchen;
}

export async function getKitchenOrders(kitchenId) {
  const { data } = await api.get(`/kitchens/${kitchenId}/orders`);
  return data.orders || [];
}

// --- Menu items ---

export async function addMenuItem(kitchenId, fields, imageFile) {
  const { data } = await api.post(
    `/menu/${kitchenId}`,
    toFormData(fields, imageFile),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.menuItem;
}

export async function updateMenuItem(menuId, fields, imageFile) {
  const { data } = await api.put(
    `/menu/${menuId}`,
    toFormData(fields, imageFile),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.menuItem;
}

export async function deleteMenuItem(menuId) {
  const { data } = await api.delete(`/menu/${menuId}`);
  return data;
}

// --- Platform admin (admin role required) ---
//   GET /api/admin/stats   -> { stats }
//   GET /api/admin/users   -> { count, users }
//   GET /api/admin/orders  -> { count, orders }

export async function getStats() {
  const { data } = await api.get("/admin/stats");
  return data.stats;
}

export async function getAllUsers() {
  const { data } = await api.get("/admin/users");
  return data.users || [];
}

export async function getAllOrders() {
  const { data } = await api.get("/admin/orders");
  return data.orders || [];
}

// PATCH /api/admin/orders/:orderId  -> { message, order }
export async function updateOrder(orderId, updates) {
  const { data } = await api.patch(`/admin/orders/${orderId}`, updates);
  return data.order;
}

// DELETE /api/admin/orders/:orderId  -> { message }
export async function deleteOrder(orderId) {
  const { data } = await api.delete(`/admin/orders/${orderId}`);
  return data;
}
