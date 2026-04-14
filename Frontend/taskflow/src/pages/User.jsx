import { useEffect, useState } from "react";
import "./User.css";

export default function User() {
  const BASE_URL = "http://localhost:3000";

  const user = JSON.parse(localStorage.getItem("tt_user"));

  // ❌ pegawai ga boleh akses
  if (user.role === "pegawai") {
    window.location.href = "/dashboard";
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

  // LOAD DATA
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

  // FILTER
  let list = users;
  if (search) {
    list = list.filter(u =>
      u.username?.toLowerCase().includes(search.toLowerCase())
    );
  }

  // SAVE
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
    setForm({ username:"", password:"", role:"pegawai", divisi:"IT" });

    loadAll();
  };

  // DELETE
  const del = async (id) => {
    if (!confirm("Hapus user?")) return;

    await fetch(BASE_URL + "/users/" + id, {
      method: "DELETE"
    });

    loadAll();
  };

  // HITUNG TASK USER
  const getTaskInfo = (uid) => {
    const uTasks = tasks.filter(t => t.assignee_id == uid);
    const done = uTasks.filter(t => t.status === "done").length;

    return `${uTasks.length} tugas (${done} selesai)`;
  };

  return (
    <div className="page">

      <h2>👥 Manajemen User</h2>

      {/* SEARCH */}
      <input
        placeholder="🔍 Cari username..."
        onChange={e => setSearch(e.target.value)}
      />

      {/* BUTTON */}
      {isAdmin && (
        <button onClick={() => setFormOpen(true)}>
          ＋ Tambah User
        </button>
      )}

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
                  <>
                    <button onClick={() => {
                      setEditId(u.id);
                      setForm({
                        username: u.username,
                        password: "",
                        role: u.role,
                        divisi: u.divisi || "IT"
                      });
                      setFormOpen(true);
                    }}>
                      ✏️
                    </button>

                    {u.id !== user.id && (
                      <button onClick={() => del(u.id)}>🗑</button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {formOpen && (
        <div className="modal">

          <h3>{editId ? "Edit User" : "Tambah User"}</h3>

          <input
            placeholder="Username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />

          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="pegawai">Pegawai</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={form.divisi}
            onChange={e => setForm({ ...form, divisi: e.target.value })}
          >
            <option value="IT">IT</option>
            <option value="Marketing">Marketing</option>
            <option value="Keuangan">Keuangan</option>
          </select>

          <button onClick={save}>💾 Simpan</button>
          <button onClick={() => setFormOpen(false)}>Batal</button>

        </div>
      )}

    </div>
  );
}