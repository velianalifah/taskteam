import { Link, useNavigate } from "react-router-dom";
import { Auth } from "../app";

export default function Sidebar({ active }) {
  const user = Auth.get();
  const navigate = useNavigate();

  function handleLogout() {
    Auth.logout();
    navigate("/Login");
  }

  // 🔥 BIKIN ROLE AMAN (anti typo, spasi, huruf besar)
  const role = user?.role?.toLowerCase().trim();

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">
        <div className="logo-icon">✦</div>
        <div className="logo-text">TaskTeam</div>
      </div>

      {/* NAV */}
      <div className="sidebar-nav">

        {/* DASHBOARD (SEMUA ROLE) */}
        <Link
          to="/dashboard"
          className={`nav-item ${active === "dashboard" ? "active" : ""}`}
        >
          <span className="nav-icon">📊</span>
          Dashboard
        </Link>

        {/* 🔥 HANYA MANAGER */}
        {role === "manager" && (
          <Link
            to="/tasks"
            className={`nav-item ${active === "tasks" ? "active" : ""}`}
          >
            <span className="nav-icon">✅</span>
            Manajemen Tugas
          </Link>
        )}

        {/* 🔥 HANYA ADMIN */}
        {role === "admin" && (
          <Link
            to="/users"
            className={`nav-item ${active === "users" ? "active" : ""}`}
          >
            <span className="nav-icon">👥</span>
            Manajemen User
          </Link>
        )}

        {/* SEMUA ROLE */}
        <Link
          to="/about"
          className={`nav-item ${active === "about" ? "active" : ""}`}
        >
          <span className="nav-icon">ℹ️</span>
          About Us
        </Link>

      </div>

      {/* FOOTER */}
      <div className="sidebar-foot">

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div className="foot-avatar">👤</div>

          <div>
            <div className="foot-name">{user?.username}</div>
            <div className="foot-role">{user?.role}</div>
          </div>
        </div>

        <button className="btn-logout" onClick={handleLogout}>
          🚪 Keluar
        </button>

      </div>

    </aside>
  );
}