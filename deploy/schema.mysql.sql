-- Import ONLY into the new v2 database using phpMyAdmin. Select that database first.
-- DDL commits implicitly; stop on errors, fix the cause, then rerun this idempotent initial migration.
SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET SESSION sql_mode = CONCAT(@@SESSION.sql_mode, ',STRICT_ALL_TABLES');
CREATE TABLE IF NOT EXISTS app_schema_migrations (
  id VARCHAR(191) NOT NULL PRIMARY KEY,
  checksum CHAR(64) NOT NULL,
  applied_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
-- 0001_enquiries.sql SHA256 e1f26a000300669df707b953325a7668209f44f9e80f98d3cfca2d169395d877
UPDATE app_schema_migrations SET checksum = IF(checksum = 'e1f26a000300669df707b953325a7668209f44f9e80f98d3cfca2d169395d877', checksum, NULL) WHERE id = '0001_enquiries.sql';
CREATE TABLE IF NOT EXISTS enquiries (
  id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL,
  phone VARCHAR(40) NOT NULL DEFAULT '',
  website VARCHAR(500) NOT NULL DEFAULT '',
  service VARCHAR(64) NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  INDEX idx_enquiries_email_created (email, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
CREATE TABLE IF NOT EXISTS enquiry_email_locks (
  email VARCHAR(254) NOT NULL PRIMARY KEY
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
INSERT INTO app_schema_migrations (id, checksum) VALUES ('0001_enquiries.sql', 'e1f26a000300669df707b953325a7668209f44f9e80f98d3cfca2d169395d877') ON DUPLICATE KEY UPDATE id = id;
SELECT id, checksum, applied_at FROM app_schema_migrations ORDER BY id;
