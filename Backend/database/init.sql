CREATE DATABASE IF NOT EXISTS taskteam CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE taskteam;

DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'pegawai') NOT NULL DEFAULT 'pegawai',
    divisi ENUM('IT', 'Marketing', 'Keuangan') NULL,
    full_name VARCHAR(100) NULL,
    email VARCHAR(100) NULL UNIQUE,
    bio TEXT NULL,
    profile_photo VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    assignee_id INT NULL,
    deadline DATETIME NULL,
    status ENUM('todo', 'in_progress', 'done') NOT NULL DEFAULT 'todo',
    priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    divisi ENUM('IT', 'Marketing', 'Keuangan') NULL,
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tasks_assignee FOREIGN KEY (assignee_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_tasks_creator FOREIGN KEY (created_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    task_id INT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_logs_user FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_logs_task FOREIGN KEY (task_id) REFERENCES tasks(id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

INSERT INTO users (username, password, role, divisi, full_name, email, bio) VALUES
('admin', 'admin123', 'admin', 'IT', 'Admin TaskTeam', 'admin@taskteam.local', 'Akun administrator utama'),
('manager1', 'manager123', 'manager', 'IT', 'Raka Manager', 'manager1@taskteam.local', 'Mengelola tim IT'),
('pegawai1', 'pegawai123', 'pegawai', 'IT', 'Dina Pegawai', 'pegawai1@taskteam.local', 'Frontend engineer'),
('pegawai2', 'pegawai123', 'pegawai', 'Marketing', 'Bima Pegawai', 'pegawai2@taskteam.local', 'Content specialist');

INSERT INTO tasks (title, description, assignee_id, deadline, status, priority, divisi, created_by) VALUES
('Bangun API Login', 'Membuat endpoint login dan validasi input', 3, DATE_ADD(NOW(), INTERVAL 3 DAY), 'in_progress', 'high', 'IT', 2),
('Desain Dashboard', 'Menyusun layout card ringkasan dan tabel tugas', 3, DATE_ADD(NOW(), INTERVAL 5 DAY), 'todo', 'medium', 'IT', 2),
('Rencana Kampanye Mei', 'Menyusun strategi konten bulanan', 4, DATE_ADD(NOW(), INTERVAL 2 DAY), 'todo', 'high', 'Marketing', 2),
('Uji Integrasi Frontend', 'Testing integrasi endpoint tugas', 3, DATE_ADD(NOW(), INTERVAL 1 DAY), 'done', 'medium', 'IT', 2);

INSERT INTO activity_logs (user_id, task_id, action, details) VALUES
(2, 1, 'create_task', 'Manager membuat tugas Bangun API Login'),
(3, 1, 'update_status', 'Status tugas diubah menjadi in_progress'),
(4, 3, 'view_task', 'Membuka detail tugas Rencana Kampanye Mei'),
(3, 4, 'update_status', 'Tugas Uji Integrasi Frontend selesai');
