-- ============================================================
-- JobPortal Database Setup Script
-- Run this ONCE before starting the backend
-- ============================================================

CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

-- The tables are auto-created by Spring JPA (ddl-auto=update)
-- This script only seeds the initial ADMIN user

-- Admin password is: admin123
-- BCrypt hash of "admin123"
INSERT IGNORE INTO users (email, password, role, active)
VALUES (
  'admin@jobportal.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh7y',
  'ADMIN',
  1
);

-- Seed some job categories
INSERT IGNORE INTO job_categories (name) VALUES
  ('Software Engineering'),
  ('Data Science & AI'),
  ('Product Management'),
  ('Design & UX'),
  ('Marketing'),
  ('Finance & Accounting'),
  ('Human Resources'),
  ('Sales'),
  ('DevOps & Cloud'),
  ('Cybersecurity');

SELECT 'Database seeded successfully!' AS status;
