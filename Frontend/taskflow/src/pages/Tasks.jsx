import { useEffect, useState } from "react";
import "./Tasks.css";

export default function Tasks() {
  const BASE_URL = "http://localhost:3000";

  const user = JSON.parse(localStorage.getItem("tt_user"));

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterS, setFilterS] = useState("");
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignee_id: "",
    deadline: "",
    status: "todo",
    priority: "low",
    divisi: ""
  });

  const isManager = user.role === "manager";
  const isPegawai = user.role === "pegawai";

  // LOAD DATA
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [tr, ur] = await Promise.all([
      fetch(BASE_URL + "/tasks").then(r => r.json()),
      fetch(BASE_URL + "/users").then(r => r.json())
    ]);

    setTasks(tr);
    setUsers(ur);
  };

  // FILTER
  let list = isPegawai
    ? tasks.filter(t => t.divisi === user.divisi)
    : tasks;

  if (filterS) list = list.filter(t => t.status === filterS);
  if (search) list = list.filter(t => t.title?.toLowerCase().includes(search.toLowerCase()));

  // SAVE
  const save = async () => {
    if (!form.title) return alert("Judul wajib!");

    const url = editId ? `/tasks/${editId}` : "/tasks";
    const method = editId ? "PUT" : "POST";

    await fetch(BASE_URL + url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        divisi: user.divisi // 🔥 otomatis ikut divisi manager
      })
    });

    setFormOpen(false);
    setEditId(null);
    setForm({ title:"", description:"", assignee_id:"", deadline:"", status:"todo", priority:"low" });

    loadAll();
  };

  // DELETE
  const del = async (id) => {
    if (!confirm("Hapus tugas?")) return;

    await fetch(BASE_URL + "/tasks/" + id, { method: "DELETE" });
    loadAll();
  };

  // UPDATE STATUS (pegawai)
  const cycle = async (t) => {
    const next = {
      "todo": "in-progress",
      "in-progress": "done",
      "done": "todo"
    };

    await fetch(BASE_URL + "/tasks/" + t.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...t, status: next[t.status] })
    });

    loadAll();
  };

  return (
    <div className="page">

      <h2>✅ Manajemen Tugas</h2>

      {/* FILTER */}
      <div className="filters">
        <input
          placeholder="🔍 Cari..."
          onChange={e => setSearch(e.target.value)}
        />

        <button onClick={() => setFilterS("")}>Semua</button>
        <button onClick={() => setFilterS("todo")}>To Do</button>
        <button onClick={() => setFilterS("in-progress")}>Dikerjakan</button>
        <button onClick={() => setFilterS("done")}>Selesai</button>
      </div>

      {/* BUTTON */}
      {isManager && (
        <button onClick={() => setFormOpen(true)}>＋ Tambah Tugas</button>
      )}

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Judul</th>
            <th>Divisi</th>
            <th>Assignee</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {list.map((t, i) => (
            <tr key={t.id}>
              <td>{i + 1}</td>
              <td>{t.title}</td>
              <td>{t.divisi || "-"}</td>
              <td>{t.assignee_name || "-"}</td>
              <td>{t.status}</td>

              <td>
                {isManager && (
                  <>
                    <button onClick={() => {
                      setEditId(t.id);
                      setForm(t);
                      setFormOpen(true);
                    }}>✏️</button>

                    <button onClick={() => del(t.id)}>🗑</button>
                  </>
                )}

                {isPegawai && (
                  <button onClick={() => cycle(t)}>🔄</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {formOpen && (
        <div className="modal">
          <h3>{editId ? "Edit" : "Tambah"} Tugas</h3>

          <input
            placeholder="Judul"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            placeholder="Deskripsi"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <select
            value={form.assignee_id}
            onChange={e => setForm({ ...form, assignee_id: e.target.value })}
          >
            <option value="">Pilih User</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>

          <button onClick={save}>💾 Simpan</button>
          <button onClick={() => setFormOpen(false)}>Batal</button>
        </div>
      )}

    </div>
  );
}