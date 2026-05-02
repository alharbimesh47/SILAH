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

const BASE_URL = "http://localhost:5050/api";

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
};