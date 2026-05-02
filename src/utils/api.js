// const BASE_URL = "http://localhost:5050/api";

// export const api = {
//   get: (endpoint) => fetch(`${BASE_URL}${endpoint}`).then(res => res.json()),
//   post: (endpoint, data) => fetch(`${BASE_URL}${endpoint}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   }).then(res => res.json()),
//   put: (endpoint, data) => fetch(`${BASE_URL}${endpoint}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   }).then(res => res.json()),
// };

const BASE_URL = "https://silah-o7po.onrender.com/api";

async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res.json();
  } catch (err) {
    clearTimeout(id);
    throw new Error("Server not reachable.");
  }
}

export const api = {
  get: (endpoint) => fetch(`${BASE_URL}${endpoint}`).then(res => res.json()),
  post: (endpoint, data) => fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json()),
  put: (endpoint, data) => fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json()),

  delete: (endpoint) => fetchWithTimeout(`${BASE_URL}${endpoint}`, {  // 👈 add this
    method: "DELETE",
  }),
};

