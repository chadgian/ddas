CREATE DATABASE IF NOT EXISTS ddas_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ddas_db;

CREATE TABLE IF NOT EXISTS settings (
  setting_key VARCHAR(100) NOT NULL PRIMARY KEY,
  setting_value TEXT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NULL,
  access_group ENUM('PSED Admin', 'Internal', 'Agency') NOT NULL,
  department VARCHAR(150) NULL,
  agency_name VARCHAR(150) NULL,
  status ENUM('Active', 'Suspended') NOT NULL DEFAULT 'Active',
  must_change_password TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_internal_roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  role_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_internal_role (user_id, role_name),
  CONSTRAINT fk_user_internal_roles_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS documents (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  document_code VARCHAR(30) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  source_office VARCHAR(150) NOT NULL,
  document_type VARCHAR(150) NOT NULL,
  description TEXT NULL,
  retention_period VARCHAR(50) NULL,
  status ENUM('active', 'archived', 'pending', 'processing') NOT NULL DEFAULT 'active',
  is_all_personnel TINYINT(1) NOT NULL DEFAULT 0,
  extra_metadata JSON NULL,
  original_filename VARCHAR(255) NOT NULL,
  stored_filename VARCHAR(255) NOT NULL,
  relative_path VARCHAR(500) NOT NULL,
  file_size_bytes BIGINT NOT NULL DEFAULT 0,
  uploaded_by INT NOT NULL,
  uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_documents_uploaded_by
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS document_visibility_roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  document_id INT NOT NULL,
  role_name VARCHAR(100) NOT NULL,
  UNIQUE KEY uniq_document_role (document_id, role_name),
  CONSTRAINT fk_document_visibility_document
    FOREIGN KEY (document_id) REFERENCES documents(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS prime_submissions (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  submission_code VARCHAR(30) NOT NULL UNIQUE,
  agency_user_id INT NOT NULL,
  agency_name VARCHAR(150) NOT NULL,
  core_area VARCHAR(255) NOT NULL,
  pillar VARCHAR(255) NOT NULL,
  pillar_element VARCHAR(255) NOT NULL,
  indicator_code VARCHAR(100) NOT NULL,
  indicator_label VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  stored_filename VARCHAR(255) NOT NULL,
  relative_path VARCHAR(500) NOT NULL,
  status ENUM('submitted', 'under review', 'received', 'rejected') NOT NULL DEFAULT 'submitted',
  remarks TEXT NULL,
  file_size_bytes BIGINT NOT NULL DEFAULT 0,
  submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_prime_submissions_agency_user
    FOREIGN KEY (agency_user_id) REFERENCES users(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS activity_logs (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  username VARCHAR(100) NULL,
  action_type VARCHAR(100) NOT NULL,
  action_label VARCHAR(255) NOT NULL,
  metadata JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activity_logs_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS visit_logs (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ip_address VARCHAR(45) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  page VARCHAR(255) DEFAULT NULL,
  visit_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
