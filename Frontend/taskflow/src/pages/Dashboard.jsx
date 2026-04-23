import { useEffect, useState } from "react";
import "./Style.css";
import "./Dashboard.css";

import { API, Auth } from "../app";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const user = Auth.get();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  useEffect(() => {
    if (!user) {
      window.location.href = "/Login";
      return;
    }

    loadData();
  }, []);

  async function loadData() {
    const res = await API.get("/tasks");

    if (res.ok) {
      setTasks(res.data);
    }

    setLoading(false);
  }

  const mine =
    user.role === "pegawai"
      ? tasks.filter(t => t.assignee_id == user.id)
      : tasks;

  const todoList = mine.filter(t => t.status === "todo");
  const progList = mine.filter(t => t.status === "in-progress");
  const doneList = mine.filter(t => t.status === "done");

  const showBoard = user.role !== "admin";
  const showLog = user.role === "admin";

  if (loading) {
    return <div className="loading">⏳ Memuat...</div>;
  }

  return (
    <div className="app">
      <Sidebar active="dashboard" />

      <main className="main">
        <div className="topbar">
          <span className="topbar-title">📊 Dashboard</span>
          <span className="date-text">{today}</span>
        </div>

        <div className="page">

          <div className="welcome">
            <div>
              <h2>Selamat datang, {user.username}! 👋</h2>
            </div>
            <div className="emoji">🚀</div>
          </div>

          {showBoard && (
            <div className="board-mini">
              {col("To Do", todoList)}
              {col("In Progress", progList)}
              {col("Done", doneList)}
            </div>
          )}

          {showLog && (
            <div className="admin-grid">
              <div className="card">
                <div className="card-head">📋 Aktivitas Terbaru</div>

                <div className="card-body">
                  <div className="activity-list">
                    {buildLog(tasks)}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

/* COMPONENT */
function col(title, data) {
  return (
    <div className="col-mini">
      <div className="col-head">
        {title} ({data.length})
      </div>

      <div className="col-body">
        {data.length === 0 ? (
          <div className="empty">Kosong</div>
        ) : (
          data.map(t => <TaskMini key={t.id} t={t} />)
        )}
      </div>
    </div>
  );
}

function TaskMini({ t }) {
  return <div className="task-mini">{t.title}</div>;
}

function buildLog(tasks) {
  if (tasks.length === 0) {
    return <div className="activity-empty">Belum ada aktivitas</div>;
  }

  const latest = tasks.slice(-6).reverse();

  return latest.map((t, i) => {
    if (t.status === "done") {
      return (
        <div key={i} className="activity-item">
          ✅ Task <b>{t.title}</b> selesai
        </div>
      );
    }

    if (t.status === "in-progress") {
      return (
        <div key={i} className="activity-item">
          ⚙️ Task <b>{t.title}</b> sedang dikerjakan
        </div>
      );
    }

    return (
      <div key={i} className="activity-item">
        🆕 Task <b>{t.title}</b> dibuat
      </div>
    );
  });
}