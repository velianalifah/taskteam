const express = require("express");
const mysql   = require("mysql2");
const cors    = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── DB ─────────────────────────────────
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "taskteam"
});

db.connect(err => {
    if (err) return console.error("DB gagal:", err.message);
    console.log("DB connected");
});

// ── ROOT ───────────────────────────────
app.get("/", (req, res) => {
    res.json({ message: "API jalan 🔥" });
});


// ═════════ AUTH ═════════

//  REGISTER (ADMIN ONLY + VALIDASI)
app.post("/register", (req, res) => {
    let { username, password, role, divisi, created_by } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username & password wajib" });
    }

    // VALIDASI ROLE
    const validRole = ["admin", "manager", "pegawai"];
    role = validRole.includes(role) ? role : "pegawai";

    // VALIDASI DIVISI
    const validDivisi = ["IT", "Marketing", "Keuangan"];
    divisi = validDivisi.includes(divisi) ? divisi : null;

    db.query(
        "SELECT role FROM users WHERE id=?",
        [created_by],
        (err, rows) => {
            if (err) return res.status(500).json({ message: "Error DB" });

            if (!rows.length || rows[0].role !== "admin") {
                return res.status(403).json({ message: "Hanya admin boleh buat user" });
            }

            db.query(
                "INSERT INTO users (username,password,role,divisi) VALUES (?,?,?,?)",
                [username, password, role, divisi],
                err => {
                    if (err) {
                        if (err.code === "ER_DUP_ENTRY")
                            return res.status(409).json({ message: "Username sudah ada" });

                        return res.status(500).json({ message: "Gagal register" });
                    }

                    res.json({ message: "User berhasil dibuat" });
                }
            );
        }
    );
});


// LOGIN 
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT id,username,role,divisi FROM users WHERE username=? AND password=?",
        [username, password],
        (err, rows) => {
            if (err) return res.status(500).json({ message: "Error" });

            if (!rows.length)
                return res.status(401).json({ message: "Login gagal" });

            res.json({ user: rows[0] });
        }
    );
});


// ═════════ USERS ═════════

// GET USERS
app.get("/users", (req, res) => {
    db.query(
        "SELECT id,username,role,divisi,created_at FROM users",
        (e, r) => {
            if (e) return res.status(500).json({ message: "err" });
            res.json(r);
        }
    );
});


// UPDATE USER 
app.put("/users/:id", (req, res) => {
    let { username, password, role, divisi } = req.body;

    const validRole = ["admin", "manager", "pegawai"];
    role = validRole.includes(role) ? role : "pegawai";

    const validDivisi = ["IT", "Marketing", "Keuangan"];
    divisi = validDivisi.includes(divisi) ? divisi : null;

    db.query(
        "UPDATE users SET username=?, password=?, role=?, divisi=? WHERE id=?",
        [username, password, role, divisi, req.params.id],
        e => {
            if (e) return res.status(500).json({ message: "err" });
            res.json({ message: "updated" });
        }
    );
});


// DELETE USER
app.delete("/users/:id", (req, res) => {
    db.query("DELETE FROM users WHERE id=?", [req.params.id], () => {
        res.json({ message: "deleted" });
    });
});


// ═════════ TASKS ═════════

// GET TASKS 
app.get("/tasks", (req, res) => {
    db.query(`
        SELECT t.*, u.username as assignee_name, u.divisi
        FROM tasks t
        LEFT JOIN users u ON t.assignee_id = u.id
    `, (e, r) => {
        if (e) return res.status(500).json({ message: "err" });
        res.json(r);
    });
});


// CREATE TASK 
app.post("/tasks", (req, res) => {
    let { title, description, assignee_id, deadline, status, priority, divisi } = req.body;

    const validDivisi = ["IT", "Marketing", "Keuangan"];
    divisi = validDivisi.includes(divisi) ? divisi : null;

    db.query(
        "INSERT INTO tasks (title,description,assignee_id,deadline,status,priority,divisi) VALUES (?,?,?,?,?,?,?)",
        [title, description, assignee_id, deadline, status, priority, divisi],
        () => res.json({ message: "created" })
    );
});


// UPDATE TASK
app.put("/tasks/:id", (req, res) => {
    let { title, description, assignee_id, deadline, status, priority, divisi } = req.body;

    const validDivisi = ["IT", "Marketing", "Keuangan"];
    divisi = validDivisi.includes(divisi) ? divisi : null;

    db.query(
        "UPDATE tasks SET title=?,description=?,assignee_id=?,deadline=?,status=?,priority=?,divisi=? WHERE id=?",
        [title, description, assignee_id, deadline, status, priority, divisi, req.params.id],
        () => res.json({ message: "updated" })
    );
});


// DELETE TASK
app.delete("/tasks/:id", (req, res) => {
    db.query("DELETE FROM tasks WHERE id=?", [req.params.id], () => {
        res.json({ message: "deleted" });
    });
});


// ── START SERVER ───────────────────────
app.listen(3000, () => console.log("Server http://localhost:3000"));