const BASE_URL = "http://localhost:3000";

const API = {
  async req(method, path, body) {
    try {
      const opt = {
        method,
        headers: { "Content-Type": "application/json" }
      };
      if (body) opt.body = JSON.stringify(body);

      const res = await fetch(BASE_URL + path, opt);
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, status: res.status, data };
    } catch {
      return { ok: false, status: 0, data: { message: "Server error" } };
    }
  },
  get: (p) => API.req("GET", p),
  post: (p, b) => API.req("POST", p, b),
  put: (p, b) => API.req("PUT", p, b),
  delete: (p) => API.req("DELETE", p)
};

const Auth = {
  get: () => JSON.parse(localStorage.getItem("tt_user") || "null"),
  set: (u) => localStorage.setItem("tt_user", JSON.stringify(u)),
  clear: () => localStorage.removeItem("tt_user"),
};

export { API, Auth };