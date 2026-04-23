import { Link } from "react-router-dom";
import { Auth } from "../app";

export default function Sidebar({ active }) {
  const user = Auth.get();

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">
        <div className="logo-icon">✦</div>
        <div className="logo-text">TaskTeam</div>
      </div>

      {/* NAV */}
      <div className="sidebar-nav">

        {/* ❌ INI DIHAPUS:
        <div className="nav-label">MENU</div>
        */}

        <Link
          to="/dashboard"
          className={`nav-item ${active === "dashboard" ? "active" : ""}`}
        >
          <span className="nav-icon">📊</span>
          Dashboard
        </Link>

        <Link
          to="/users"
          className={`nav-item ${active === "users" ? "active" : ""}`}
        >
          <span className="nav-icon">👥</span>
          Manajemen User
        </Link>

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
        <div className="foot-avatar">👤</div>

        <div>
          <div className="foot-name">{user?.username}</div>
          <div className="foot-role">{user?.role}</div>
        </div>

        <button
          className="btn-logout"
          onClick={() => {
            Auth.logout();
            navigate("/Login");
          }}
        >
          ⎋
        </button>
      </div>

    </aside>
  );
}