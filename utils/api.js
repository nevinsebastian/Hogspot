/**
 * Central API base URL for Hogspot.
 *
 * Override at runtime with Expo env:
 *   EXPO_PUBLIC_API_URL=http://192.168.x.x:8000
 *
 * Defaults to local backend. Use your machine LAN IP (not localhost)
 * when testing on a physical phone.
 */
const DEFAULT_API_URL = "http://127.0.0.1:8003";

export const API_URL =
  (typeof process !== "undefined" &&
    process.env?.EXPO_PUBLIC_API_URL?.replace(/\/$/, "")) ||
  DEFAULT_API_URL;

export function apiUrl(path = "") {
  if (!path) return API_URL;
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export default API_URL;
