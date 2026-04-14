import { useState } from "react";
import "./Register.css";

export default function Register() {
  const BASE_URL = "http://localhost:3000";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("pegawai");
  const [showPw, setShowPw] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [pwStrength, setPwStrength] = useState({
    width: "0%",
    color: "",
    text: ""
  });

  // 🔥 PASSWORD STRENGTH
  const checkPw = (val) => {
    setPassword(val);

    if (!val) {
      setPwStrength({ width: "0%", color: "", text: "" });
      return;
    }

    let s = 0;
    if (val.length >= 6) s++;
    if (val.length >= 10) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;

    const lvl = [
      { w:"20%",  c:"#ef4444", t:"Sangat lemah" },
      { w:"40%",  c:"#f97316", t:"Lemah" },
      { w:"60%",  c:"#f59e0b", t:"Sedang" },
      { w:"80%",  c:"#84cc16", t:"Kuat" },
      { w:"100%", c:"#22c55e", t:"Sangat kuat ✓" }
    ][Math.min(s, 4)];

    setPwStrength({
      width: lvl.w,
      color: lvl.c,
      text: lvl.t
    });
  };

  // 🔐 REGISTER
  const doRegister = async () => {
    setError("");
    setSuccess("");

    if (!username) {
      setError("Username wajib diisi!");
      return;
    }

    if (username.length < 3) {
      setError("Username minimal 3 karakter!");
      return;
    }

    if (!password) {
      setError("Password wajib diisi!");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter!");
      return;
    }

    try {
      const res = await fetch(BASE_URL + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password,
          role
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("✅ Registrasi berhasil! Mengarahkan ke login...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setError(data.message || "Registrasi gagal");
      }
    } catch {
      setError("Tidak bisa connect ke server");
    }
  };

  return (
    <div>
      <div className="bg"></div>
      <div className="glow"></div>

      <div className="wrap">

        <div className="brand">
          <div className="bi">✦</div>
          <span className="bn">TaskTeam</span>
        </div>

        <h2>Buat Akun Baru</h2>
        <p className="sub">
          Sudah punya akun? <a href="/">Masuk di sini</a>
        </p>

        {error && <div className="err show">{error}</div>}
        {success && <div className="suc show">{success}</div>}

        {/* USERNAME */}
        <div className="fg">
          <label>Username *</label>
          <input
            type="text"
            placeholder="Pilih username..."
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="fg">
          <label>Password *</label>

          <div className="pw-wrap">
            <input
              type={showPw ? "text" : "password"}
              placeholder="Minimal 6 karakter..."
              value={password}
              onChange={e => checkPw(e.target.value)}
            />

            <button
              className="pw-toggle"
              type="button"
              onClick={() => setShowPw(!showPw)}
            >
              {showPw ? "🙈" : "👁"}
            </button>
          </div>

          <div className="pw-bar">
            <div
              className="pw-fill"
              style={{
                width: pwStrength.width,
                background: pwStrength.color
              }}
            ></div>
          </div>

          <div
            className="pw-lbl"
            style={{ color: pwStrength.color }}
          >
            {pwStrength.text}
          </div>
        </div>

        {/* ROLE */}
        <div className="fg">
          <label>Role *</label>

          <div className="roles">

            <div
              className={`role-opt ${role === "pegawai" ? "on" : ""}`}
              onClick={() => setRole("pegawai")}
            >
              <span className="ri">👤</span>
              <span className="rl">Pegawai</span>
            </div>

            <div
              className={`role-opt ${role === "manager" ? "on" : ""}`}
              onClick={() => setRole("manager")}
            >
              <span className="ri">📋</span>
              <span className="rl">Manager</span>
            </div>

            <div
              className={`role-opt ${role === "admin" ? "on" : ""}`}
              onClick={() => setRole("admin")}
            >
              <span className="ri">🛡️</span>
              <span className="rl">Admin</span>
            </div>

          </div>
        </div>

        <button className="btn" onClick={doRegister}>
          Daftar Sekarang →
        </button>

      </div>
    </div>
  );
}