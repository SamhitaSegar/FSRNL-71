// Public browse API helpers (no auth required).
//
//   GET /api/browse/kitchens                    -> { count, kitchens }
//   GET /api/browse/kitchens/:kitchenId/menu    -> { count, kitchen, menu }

import api from "./auth.js";

export async function getKitchens() {
  const { data } = await api.get("/browse/kitchens");
  return data.kitchens || [];
}

export async function getKitchenMenu(kitchenId) {
  const { data } = await api.get(`/browse/kitchens/${kitchenId}/menu`);
  return { kitchen: data.kitchen, menu: data.menu || [] };
}
