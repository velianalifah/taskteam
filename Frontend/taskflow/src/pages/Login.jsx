import { useEffect, useState } from "react";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [serverStatus, setServerStatus] = useState("loading");

  const BASE_URL = "http://localhost:3000";

  // 🔥 CHECK SERVER
  useEffect(() => {
    fetch(BASE_URL + "/")
      .then(res => {
        if (res.ok) setServerStatus("ok");
        else throw new Error();
      })
      .catch(() => setServerStatus("err"));
  }, []);

  // 🔐 LOGIN
  const doLogin = async () => {
    if (!username || !password) {
      setError("Username dan password wajib diisi!");
      return;
    }

    setError("");

    try {
      const res = await fetch(BASE_URL + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.user) {
        localStorage.setItem("tt_user", JSON.stringify(data.user));
        alert("Login berhasil 👋");
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Login gagal!");
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

        {/* LEFT */}
        <div className="left">
          <div className="brand">
            <div className="logo-box">✦</div>
            <span className="logo-text">TaskTeam</span>
          </div>

          <div className="lc">
            <h1>
              Kelola Tim Anda.<br />
              Selesaikan Lebih Cepat.
            </h1>

            <p>
              Platform manajemen tugas modern untuk kolaborasi tim yang lebih rapi,
              terstruktur, dan efisien.
            </p>

            <div className="feats">
              <div className="feat">✔ Delegasi tugas secara real-time</div>
              <div className="feat">✔ Pantau progres & deadline dengan mudah</div>
            </div>
          </div>

          <div className="lfoot">© 2026 TaskTeam — Kelompok 3</div>
        </div>

        {/* RIGHT */}
        <div className="right">
          <h2>Login</h2>
          <p className="sub">Silakan login menggunakan akun yang diberikan admin</p>

          {/* SERVER STATUS */}
          <div className="svr">
            {serverStatus === "loading" && <span>Memeriksa server...</span>}
            {serverStatus === "ok" && <span style={{ color: "lime" }}>Server terhubung ✓</span>}
            {serverStatus === "err" && <span style={{ color: "red" }}>Server tidak terdeteksi</span>}
          </div>

          {/* ERROR */}
          {error && <div className="err show">{error}</div>}

          <div className="fg">
            <label>Username</label>
            <input
              type="text"
              placeholder="Masukkan username..."
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div className="fg">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password..."
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button className="btn" onClick={doLogin}>
            Masuk →
          </button>
        </div>

      </div>
    </div>
  );
}