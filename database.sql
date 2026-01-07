-- Skill Matching System Database Schema

-- Create Database
CREATE DATABASE IF NOT EXISTS skill_matching_db;
USE skill_matching_db;

-- Create Skills Table
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skillName VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category)
);

-- Create Personnel Table
CREATE TABLE personnel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(255),
    position VARCHAR(255),
    experience_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_department (department),
    INDEX idx_experience_level (experience_level)
);

-- Create Projects Table
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
);

-- Create Personnel-Skills Junction Table
CREATE TABLE personnel_skills (
    personnel_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency_level ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') NOT NULL DEFAULT 'Beginner',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (personnel_id, skill_id),
    FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    INDEX idx_proficiency_level (proficiency_level)
);

-- Create Project-Skills Junction Table
CREATE TABLE project_skills (
    project_id INT NOT NULL,
    skill_id INT NOT NULL,
    required_level ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, skill_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Optional: Insert initial seed data

-- Insert some initial skills
INSERT INTO skills (skillName, category, description) VALUES
('JavaScript', 'Programming Language', 'Programming language for web development'),
('React', 'Frontend', 'JavaScript library for building user interfaces'),
('Node.js', 'Backend', 'JavaScript runtime environment'),
('Python', 'Programming Language', 'High-level programming language'),
('MySQL', 'Database', 'Open-source relational database management system'),
('AWS', 'Cloud', 'Amazon Web Services cloud platform'),
('Docker', 'DevOps', 'Containerization platform'),
('Git', 'DevOps', 'Version control system'),
('TypeScript', 'Programming Language', 'Typed superset of JavaScript'),
('MongoDB', 'Database', 'NoSQL database system');

-- Insert some initial personnel
INSERT INTO personnel (name, email, department, position, experience_level) VALUES
('John Doe', 'john.doe@example.com', 'Engineering', 'Senior Developer', 'Senior'),
('Jane Smith', 'jane.smith@example.com', 'Engineering', 'Frontend Developer', 'Mid-level'),
('Mike Johnson', 'mike.johnson@example.com', 'Engineering', 'Backend Developer', 'Senior'),
('Sarah Wilson', 'sarah.wilson@example.com', 'Marketing', 'Marketing Manager', 'Mid-level'),
('David Brown', 'david.brown@example.com', 'Sales', 'Sales Executive', 'Junior');

-- Insert some initial projects
INSERT INTO projects (name, description, start_date, end_date, status) VALUES
('E-commerce Platform', 'Full-featured online shopping platform', '2026-02-01', '2026-08-01', 'Active'),
('Mobile Banking App', 'Secure mobile application for banking services', '2026-03-15', '2026-09-15', 'Planning'),
('Analytics Dashboard', 'Real-time business analytics dashboard', '2026-01-10', '2026-06-30', 'Active'),
('Customer Portal', 'Self-service customer portal system', '2026-04-01', '2026-10-01', 'Active'),
('API Gateway', 'Enterprise API management solution', '2026-05-01', '2026-11-01', 'Planning');

-- Assign some skills to personnel
INSERT INTO personnel_skills (personnel_id, skill_id, proficiency_level) VALUES
(1, 1, 'Expert'),      -- John Doe: JavaScript - Expert
(1, 2, 'Expert'),      -- John Doe: React - Expert
(1, 3, 'Advanced'),    -- John Doe: Node.js - Advanced
(2, 1, 'Advanced'),    -- Jane Smith: JavaScript - Advanced
(2, 2, 'Expert'),      -- Jane Smith: React - Expert
(3, 1, 'Advanced'),    -- Mike Johnson: JavaScript - Advanced
(3, 3, 'Expert'),      -- Mike Johnson: Node.js - Expert
(3, 4, 'Intermediate'); -- Mike Johnson: Python - Intermediate

-- Define required skills for projects
INSERT INTO project_skills (project_id, skill_id, required_level) VALUES
(1, 1, 'Advanced'),    -- E-commerce: JavaScript - Advanced
(1, 2, 'Advanced'),    -- E-commerce: React - Advanced
(1, 3, 'Intermediate'), -- E-commerce: Node.js - Intermediate
(2, 3, 'Expert'),      -- Mobile Banking: Node.js - Expert
(2, 5, 'Advanced'),    -- Mobile Banking: MySQL - Advanced
(3, 4, 'Expert'),      -- Analytics: Python - Expert
(3, 1, 'Intermediate'); -- Analytics: JavaScript - Intermediate

-- Create a view for personnel with their skills
CREATE VIEW personnel_with_skills AS
SELECT 
    p.id,
    p.name,
    p.email,
    p.department,
    p.position,
    p.experience_level,
    p.created_at,
    s.skillName,
    s.category,
    ps.proficiency_level,
    ps.assigned_at
FROM personnel p
LEFT JOIN personnel_skills ps ON p.id = ps.personnel_id
LEFT JOIN skills s ON ps.skill_id = s.id;

-- Create a view for projects with their required skills
CREATE VIEW projects_with_skills AS
SELECT 
    pr.id,
    pr.name,
    pr.description,
    pr.start_date,
    pr.end_date,
    pr.status,
    pr.created_at,
    s.skillName,
    s.category,
    prs.required_level
FROM projects pr
LEFT JOIN project_skills prs ON pr.id = prs.project_id
LEFT JOIN skills s ON prs.skill_id = s.id;

-- Add some additional indexes for better performance
ALTER TABLE personnel ADD INDEX idx_name (name);
ALTER TABLE projects ADD INDEX idx_name (name);
ALTER TABLE skills ADD INDEX idx_skillName (skillName);