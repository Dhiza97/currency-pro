import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // send the httpOnly refresh cookie
});

// Attach access token from context to every request
// (Set via setAccessTokenGetter below from AuthContext)
let _getToken = () => null;
let _refresh  = () => null;

export const setAuthHandlers = (getToken, refresh) => {
  _getToken = getToken;
  _refresh  = refresh;
};

API.interceptors.request.use((config) => {
  const token = _getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queue = [];

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        // Queue requests while refresh is in flight
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return API(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      const newToken = await _refresh();
      isRefreshing = false;

      if (newToken) {
        queue.forEach(({ resolve }) => resolve(newToken));
        queue = [];
        original.headers.Authorization = `Bearer ${newToken}`;
        return API(original);
      } else {
        queue.forEach(({ reject }) => reject(err));
        queue = [];
      }
    }
    return Promise.reject(err);
  }
);

export default API;