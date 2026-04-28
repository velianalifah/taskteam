import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";
import "./About.css";

import Sidebar from "../components/Sidebar";

export default function About() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("tt_user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="app">

      {/* ✅ PAKAI SIDEBAR COMPONENT */}
      <Sidebar active="about" />

      {/* MAIN */}
      <main className="main">

        {/* TOPBAR */}
        <div className="topbar">
          <span className="topbar-title">ℹ️ About Us</span>
        </div>

        <div className="page">

          {/* HERO */}
          <div className="hero">
            <div className="logo">✦</div>
            <h1>TaskTeam</h1>
            <p>
              Aplikasi Manajemen Tugas dan Kolaborasi Tim berbasis Web — 
              Tugas Besar Teknologi Web Kelompok 3.
            </p>
          </div>

          {/* FITUR */}
          <div className="section-title">⚡ Fitur Aplikasi</div>

          <div className="feat-grid">

            <div className="feat-card">
              <div className="fi">🔐</div>
              <h4>Autentikasi</h4>
              <p>Login & Register dengan sistem role Admin, Manager, dan Pegawai.</p>
            </div>

            <div className="feat-card">
              <div className="fi">📊</div>
              <h4>Dashboard</h4>
              <p>Ringkasan tugas, progress, dan deadline terdekat secara real-time.</p>
            </div>

            {/* 🔥 HANYA ADMIN & MANAGER */}
            {user?.role !== "pegawai" && (
              <>
                <div className="feat-card">
                  <div className="fi">✅</div>
                  <h4>Manajemen Tugas</h4>
                  <p>CRUD tugas lengkap dengan status, prioritas, dan assignee.</p>
                </div>

                <div className="feat-card">
                  <div className="fi">👥</div>
                  <h4>Manajemen User</h4>
                  <p>Admin dapat mengelola seluruh akun pengguna di sistem.</p>
                </div>
              </>
            )}

            <div className="feat-card">
              <div className="fi">🔌</div>
              <h4>REST API</h4>
              <p>Backend Express.js + MySQL dengan endpoint lengkap.</p>
            </div>

            <div className="feat-card">
              <div className="fi">🛡️</div>
              <h4>Role-Based Access</h4>
              <p>Setiap role punya akses berbeda terhadap fitur aplikasi.</p>
            </div>

          </div>

          {/* TEAM */}
          <div className="section-title">👨‍💻 Tim Pengembang — Kelompok 3</div>

          <div className="team-grid">
            <div className="member">
              <div className="m-icon">👨‍💼</div>
              <div className="m-name">Rakhafi Surya P.</div>
              <div className="m-nim">2250081142</div>
              <span className="badge b-manager">Ketua / PM</span>
            </div>

            <div className="member">
              <div className="m-icon">👨‍💻</div>
              <div className="m-name">Muhammad Hanif N.</div>
              <div className="m-nim">2350081125</div>
              <span className="badge b-member">Backend Dev</span>
            </div>

            <div className="member">
              <div className="m-icon">👩‍🎨</div>
              <div className="m-name">Veliana Alifa N.</div>
              <div className="m-nim">2350081127</div>
              <span className="badge b-member">UI/UX</span>
            </div>

            <div className="member">
              <div className="m-icon">👩‍💻</div>
              <div className="m-name">Selvi Liana P. H.</div>
              <div className="m-nim">2350081137</div>
              <span className="badge b-member">Frontend Dev</span>
            </div>

            <div className="member">
              <div className="m-icon">🧪</div>
              <div className="m-name">Ruli Hardimulya</div>
              <div className="m-nim">2350081141</div>
              <span className="badge b-member">QA & Docs</span>
            </div>
          </div>

          {/* INFO */}
          <div className="info-bar">
            📍 Program Studi Teknik Informatika • Fakultas Sains dan Informatika<br/>
            🏛 Universitas Jenderal Achmad Yani (UNJANI), Kota Cimahi<br/>
            📅 Tahun Akademik 2025/2026
          </div>

        </div>
      </main>
    </div>
  );
}