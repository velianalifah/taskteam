import { useEffect, useState } from "react";
import "./User.css";
import Sidebar from "../components/Sidebar";

export default function User() {
  const BASE_URL = "http://localhost:3000";

  const user = JSON.parse(localStorage.getItem("tt_user"));

  // 🔐 PROTECT HALAMAN
  if (!user) {
    window.location.href = "/";
    return null;
  }

  if (user.role === "pegawai") {
    window.location.href = "/dashboard";
    return null;
  }

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "pegawai",
    divisi: "IT"
  });

  const isAdmin = user.role === "admin";

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [ur, tr] = await Promise.all([
      fetch(BASE_URL + "/users").then(r => r.json()),
      fetch(BASE_URL + "/tasks").then(r => r.json())
    ]);

    setUsers(ur);
    setTasks(tr);
  };

  let list = users;
  if (search) {
    list = list.filter(u =>
      u.username?.toLowerCase().includes(search.toLowerCase())
    );
  }

  const save = async () => {
    if (!form.username) return alert("Username wajib!");
    if (!editId && !form.password) return alert("Password wajib!");

    const url = editId ? `/users/${editId}` : "/register";
    const method = editId ? "PUT" : "POST";

    await fetch(BASE_URL + url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        created_by: user.id
      })
    });

    setFormOpen(false);
    setEditId(null);
    setForm({
      username: "",
      password: "",
      role: "pegawai",
      divisi: "IT"
    });

    loadAll();
  };

  const del = async (id) => {
    if (!confirm("Hapus user?")) return;

    await fetch(BASE_URL + "/users/" + id, {
      method: "DELETE"
    });

    loadAll();
  };

  const getTaskInfo = (uid) => {
    const uTasks = tasks.filter(t => t.assignee_id == uid);
    const done = uTasks.filter(t => t.status === "done").length;

    return `${uTasks.length} tugas (${done} selesai)`;
  };

  return (
    <div className="app">
      <Sidebar active="users" />

      <main className="main">

        {/* TOPBAR */}
        <div className="topbar">
          <span className="topbar-title">👥 Manajemen User</span>
        </div>

        {/* PAGE */}
        <div className="page">

          {/* HEADER */}
          <div className="page-head">
            <h2>👥 Manajemen User</h2>

            {isAdmin && (
              <button
                className="btn-primary"
                onClick={() => {
                  setEditId(null);
                  setForm({
                    username: "",
                    password: "",
                    role: "pegawai",
                    divisi: "IT"
                  });
                  setFormOpen(true);
                }}
              >
                ＋ Tambah User
              </button>
            )}
          </div>

          {/* SEARCH */}
          <input
            className="search"
            placeholder="🔍 Cari username..."
            onChange={e => setSearch(e.target.value)}
          />

          {/* TABLE */}
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Role</th>
                <th>Divisi</th>
                <th>Tugas</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {list.map((u, i) => (
                <tr key={u.id}>
                  <td>{i + 1}</td>
                  <td>@{u.username}</td>
                  <td>{u.role}</td>
                  <td>{u.divisi || "-"}</td>
                  <td>{getTaskInfo(u.id)}</td>

                  <td>
                    {isAdmin && (
                      <div className="actions">

                        <button
                          className="btn-sm"
                          onClick={() => {
                            setEditId(u.id);
                            setForm({
                              username: u.username,
                              password: "",
                              role: u.role,
                              divisi: u.divisi || "IT"
                            });
                            setFormOpen(true);
                          }}
                        >
                          ✏️
                        </button>

                        {u.id !== user.id && (
                          <button
                            className="btn-sm btn-del"
                            onClick={() => del(u.id)}
                          >
                            🗑
                          </button>
                        )}

                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

        {/* MODAL */}
        <div className={`overlay ${formOpen ? "open" : ""}`}>
          <div className="modal">

            <h3>{editId ? "Edit User" : "Tambah User"}</h3>

            <div className="fg">
              <label>Username</label>
              <input
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
              />
            </div>

            <div className="fg">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="fg">
              <label>Role</label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="pegawai">Pegawai</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="fg">
              <label>Divisi</label>
              <select
                value={form.divisi}
                onChange={e => setForm({ ...form, divisi: e.target.value })}
              >
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="Keuangan">Keuangan</option>
              </select>
            </div>

            <div className="modal-foot">
              <button className="btn-primary" onClick={save}>
                💾 Simpan
              </button>
              <button onClick={() => setFormOpen(false)}>
                Batal
              </button>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}