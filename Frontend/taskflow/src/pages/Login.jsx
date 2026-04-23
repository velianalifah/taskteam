import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API, Auth } from "../app";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverStatus, setServerStatus] = useState("loading");

  useEffect(() => {
    const currentUser = Auth.get();
    if (currentUser) {
      navigate("/dashboard", { replace: true });
      return;
    }

    checkServer();
  }, []);

  async function checkServer() {
    const res = await API.get("/");
    setServerStatus(res.ok ? "ok" : "err");
  }

  async function doLogin(e) {
    e.preventDefault();

    if (!username || !password) {
      setError("Username dan password wajib diisi!");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await API.post("/login", { username, password });
      const data = res.data;

      if (res.ok && data?.user) {
        Auth.set(data.user);
        navigate("/dashboard", { replace: true });
      } else {
        setError(data?.message || "Login gagal!");
      }
    } catch {
      setError("Tidak bisa connect ke server");
    } finally {
      setIsSubmitting(false);
    }
  }

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
              Selesaikan Lebih Cepat!
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

          {/* SERVER STATUS (tanpa "Server terhubung") */}
          <div className="svr">
            {serverStatus === "loading" && <span>Memeriksa server...</span>}
            {serverStatus === "err" && (
              <span style={{ color: "red" }}>Server tidak terdeteksi</span>
            )}
          </div>

          {error && <div className="err show">{error}</div>}

          <form onSubmit={doLogin}>
            <div className="fg">
              <label>Username</label>
              <input
                type="text"
                placeholder="Masukkan username..."
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="fg">
              <label>Password</label>
              <input
                type="password"
                placeholder="Masukkan password..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : "Masuk"}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}