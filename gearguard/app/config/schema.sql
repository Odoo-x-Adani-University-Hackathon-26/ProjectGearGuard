-- ================================
-- DATABASE: gearguard
-- ================================
CREATE DATABASE IF NOT EXISTS gearguard;
USE gearguard;

-- ================================
-- 1. USERS
-- ================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'technician', 'employee') NOT NULL,
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- 2. DEPARTMENTS
-- ================================
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- ================================
-- 3. MAINTENANCE TEAMS
-- ================================
CREATE TABLE maintenance_teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- ================================
-- 4. MAINTENANCE TEAM MEMBERS
-- (Many-to-Many: Users <-> Teams)
-- ================================
CREATE TABLE maintenance_team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (team_id) REFERENCES maintenance_teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ================================
-- 5. EQUIPMENT
-- ================================
CREATE TABLE equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    serial_number VARCHAR(100) UNIQUE,
    department_id INT,
    owner_id INT,
    maintenance_team_id INT,
    default_technician_id INT,
    location VARCHAR(150),
    purchase_date DATE,
    warranty_end_date DATE,
    status ENUM('active', 'scrapped') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (maintenance_team_id) REFERENCES maintenance_teams(id),
    FOREIGN KEY (default_technician_id) REFERENCES users(id)
);

-- ================================
-- 6. MAINTENANCE REQUESTS
-- ================================
CREATE TABLE maintenance_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    equipment_id INT NOT NULL,
    team_id INT NOT NULL,
    technician_id INT,
    request_type ENUM('corrective', 'preventive') NOT NULL,
    status ENUM('new', 'in_progress', 'repaired', 'scrap') DEFAULT 'new',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    scheduled_date DATE,
    duration_hours DECIMAL(5,2),
    is_overdue BOOLEAN DEFAULT FALSE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (equipment_id) REFERENCES equipment(id),
    FOREIGN KEY (team_id) REFERENCES maintenance_teams(id),
    FOREIGN KEY (technician_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ================================
-- 7. MAINTENANCE LOGS (Optional)
-- ================================
CREATE TABLE maintenance_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    maintenance_request_id INT NOT NULL,
    technician_id INT NOT NULL,
    note TEXT,
    hours_spent DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (maintenance_request_id) REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES users(id)
);

-- ================================
-- 8. NOTIFICATIONS (Optional)
-- ================================
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);