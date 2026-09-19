// Centralized auth API helper.
//
// Set the backend URL via a Vite env var in `.env`:
//   VITE_API_URL=http://localhost:8000/api
// Falls back to "/api" (handy if you proxy the backend through Vite).
//
// Each function returns the parsed JSON on success and throws an Error with
// a readable message on failure, so pages can `try/catch` cleanly.

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      credentials: 'include', // send/receive httpOnly cookies if backend uses them
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Network error. Is the backend running?')
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    // non-JSON response (e.g. 204) — leave data as null
  }

  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`
    throw new Error(message)
  }

  return data
}

// --- Endpoints (adjust paths to match your backend routes) ---

export function loginUser({ email, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export function signupUser({ username, email, password }) {
  return request('/auth/register', {
    method: 'POST',
    body: { username, email, password },
  })
}

export function logoutUser(token) {
  return request('/auth/logout', { method: 'POST', token })
}

export function getCurrentUser(token) {
  return request('/auth/me', { token })
}
