import { useEffect, useState } from "react";
import "./Board.css";
import "./Style.css";

const BASE_URL = "http://localhost:3000";

export default function Board() {
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("tt_user"));

  useEffect(() => {
    if (!user) {
      window.location.href = "/Login";
      return;
    }

    loadBoard();
  }, []);

  async function loadBoard() {
    try {
      const res = await fetch(BASE_URL + "/tasks");
      const data = await res.json();

      let list = data || [];

      // 🔥 FILTER BERDASARKAN ROLE + DIVISI
      if (user.role === "pegawai") {
        list = list.filter(t => t.divisi === user.divisi);
      }

      setTasks(list);
    } catch (err) {
      console.error(err);
    }
  }

  const todo = tasks.filter(t => t.status === "todo");
  const prog = tasks.filter(t => t.status === "in-progress");
  const done = tasks.filter(t => t.status === "done");

  return (
    <div className="app">
      
      {/* MAIN */}
      <main className="main">
        <div className="topbar">
          <span className="topbar-title">📋 Task Board</span>
        </div>

        <div className="board">
          <Column title="To Do" data={todo} />
          <Column title="In Progress" data={prog} />
          <Column title="Done" data={done} />
        </div>
      </main>
    </div>
  );
}

/* COLUMN */
function Column({ title, data }) {
  return (
    <div className="col">
      <div className="col-head">
        {title} ({data.length})
      </div>

      <div className="col-body">
        {data.length === 0 ? (
          <div className="empty">Kosong</div>
        ) : (
          data.map(t => <TaskCard key={t.id} t={t} />)
        )}
      </div>
    </div>
  );
}

/* TASK CARD */
function TaskCard({ t }) {
  return (
    <div className="task">
      <div className="task-title">{t.title}</div>
      <div className="task-user">{t.assignee_name || "-"}</div>
      <div className="task-deadline">
        {t.deadline ? daysLeft(t.deadline) : "-"}
      </div>
    </div>
  );
}

/* HELPER */
function daysLeft(date) {
  const d = Math.ceil((new Date(date) - new Date()) / 86400000);

  if (d < 0) return `${Math.abs(d)} hari terlambat`;
  if (d === 0) return "Hari ini";

  return `${d} hari lagi`;
}