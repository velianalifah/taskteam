import { Auth } from "../app";

function Sidebar({ active }) {
  const u = Auth.get();
  if (!u) return null;

  const role = u.role || "pegawai";

  const nav = [
    { id:"dashboard", icon:"📊", label:"Dashboard", href:"/dashboard" },

    ...(role !== "admin" ? [
      { id:"tasks", icon:"✅", label:"Manajemen Tugas", href:"/tasks" }
    ] : []),

    ...(role !== "pegawai" ? [
      { id:"users", icon:"👥", label:"Manajemen User", href:"/users" }
    ] : []),

    { id:"about", icon:"ℹ️", label:"About Us", href:"/about" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">✦</div>
        <span className="logo-text">TaskTeam</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-label">Menu</div>

        {nav.map(n => (
          <a
            key={n.id}
            className={`nav-item ${active === n.id ? "active" : ""}`}
            href={n.href}
          >
            <span className="nav-icon">{n.icon}</span>
            {n.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="foot-avatar">
          {role === "admin" ? "🛡️" : role === "manager" ? "📋" : "👤"}
        </div>

        <div>
          <div className="foot-name">{u.username}</div>
          <div className="foot-role">{role}</div>
        </div>

        <button className="btn-logout" onClick={Auth.logout} title="Logout">
          ⏏
        </button>
      </div>
    </div>
  );
}

export default Sidebar;