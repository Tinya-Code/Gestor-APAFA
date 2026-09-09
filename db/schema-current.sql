-- ============================================================
-- Gestor APAFA — Esquema MySQL (Multi-Tenant)
-- Módulos: M1 (Auth/Firebase), M2 (Parents/Students), M3 (Directiva)
-- Versión: 2.1 — Multi-Tenant + Directiva
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- FASE 0: Tablas Multi-Tenant
-- ============================================================

-- ------------------------------------------------------------
-- 🏫 Colegio (Tenant)
-- ------------------------------------------------------------
-- Cada colegio es un tenant separado lógicamente.
-- El super_admin NO tiene colegio asociado.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `colegio` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(200)    NOT NULL,
  `slug`          VARCHAR(100)    NOT NULL,  -- URL-friendly: "colegio-san-miguel"
  `address`       VARCHAR(300)    DEFAULT NULL,
  `phone`         VARCHAR(30)     DEFAULT NULL,
  `email`         VARCHAR(150)    DEFAULT NULL,
  `logo_url`      VARCHAR(500)    DEFAULT NULL,
  `is_active`     TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_colegio_slug` (`slug`),
  KEY `idx_colegio_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 👤 Usuario (separado de Padre)
-- ------------------------------------------------------------
-- Un usuario puede pertenecer a múltiples colegios.
-- El super_admin NO tiene colegio asociado.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuario` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email`         VARCHAR(150)    NOT NULL,
  `password_hash` VARCHAR(255)    DEFAULT NULL,  -- Para login local (opcional)
  `firebase_uid`  VARCHAR(255)    DEFAULT NULL,  -- Para login Firebase
  `name`          VARCHAR(100)    NOT NULL,
  `surname`       VARCHAR(100)    NOT NULL,
  `phone`         VARCHAR(30)     DEFAULT NULL,
  `is_super_admin` TINYINT(1)     NOT NULL DEFAULT 0,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_usuario_email` (`email`),
  UNIQUE KEY `uk_usuario_firebase` (`firebase_uid`),
  KEY `idx_usuario_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 🔗 Usuario ↔ Colegio (relación N:N)
-- ------------------------------------------------------------
-- Un usuario puede estar en múltiples colegios con distintos roles.
-- Roles: admin_colegio, presidente, vicepresidente, tesorero, secretario, vocal, padre
-- NOTA: Este role determina permisos de API (RolesGuard).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuario_colegio` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id`    BIGINT UNSIGNED NOT NULL,
  `colegio_id`    BIGINT UNSIGNED NOT NULL,
  `role`          VARCHAR(50)     NOT NULL,  -- admin_colegio, presidente, tesorero, etc.
  `is_active`     TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_usuario_colegio` (`usuario_id`, `colegio_id`),
  KEY `idx_uc_colegio` (`colegio_id`),
  CONSTRAINT `fk_uc_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_uc_colegio` FOREIGN KEY (`colegio_id`) REFERENCES `colegio` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- FASE 1: Tablas de Dominio (con colegio_id)
-- ============================================================

-- ------------------------------------------------------------
-- 👨‍👩‍👧 Padre (M2)
-- ------------------------------------------------------------
-- UNIQ: (dni, colegio_id) — mismo DNI puede existir en distintos colegios
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `padre` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `colegio_id`    BIGINT UNSIGNED NOT NULL,
  `usuario_id`    BIGINT UNSIGNED DEFAULT NULL,  -- Link con usuario (si se registra)
  `name`          VARCHAR(100)    NOT NULL,
  `surname`       VARCHAR(100)    NOT NULL,
  `dni`           VARCHAR(20)     NOT NULL,
  `phone`         VARCHAR(30)     DEFAULT NULL,
  `email`         VARCHAR(150)    DEFAULT NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_padre_dni_colegio` (`dni`, `colegio_id`),
  KEY `idx_padre_colegio` (`colegio_id`),
  KEY `idx_padre_usuario` (`usuario_id`),
  KEY `idx_padre_deleted` (`deleted_at`),
  CONSTRAINT `fk_padre_colegio` FOREIGN KEY (`colegio_id`) REFERENCES `colegio` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_padre_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 🎓 Estudiante (M2)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `estudiante` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `colegio_id`    BIGINT UNSIGNED NOT NULL,
  `name`          VARCHAR(100)    NOT NULL,
  `surname`       VARCHAR(100)    NOT NULL,
  `grade`         VARCHAR(50)     NOT NULL,
  `section`       VARCHAR(50)     DEFAULT NULL,
  `parent_id`     BIGINT UNSIGNED NOT NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_estudiante_colegio` (`colegio_id`),
  KEY `idx_estudiante_parent` (`parent_id`),
  KEY `idx_estudiante_deleted` (`deleted_at`),
  CONSTRAINT `fk_estudiante_colegio` FOREIGN KEY (`colegio_id`) REFERENCES `colegio` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_estudiante_padre` FOREIGN KEY (`parent_id`) REFERENCES `padre` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 🏛️ Directiva — Mandatos de la directiva del colegio
-- ------------------------------------------------------------
-- Cada registro es un mandato: un padre ocupa un cargo en un período.
--
-- SIN UNIQUE constraint en (parent_id, colegio_id, role):
--   MySQL UNIQUE no es compatible con soft delete — si un mandato se
--   soft-deletea (deleted_at NOT NULL), el UNIQUE sigue bloqueando
--   la reasignación del mismo rol al mismo padre.
--   La unicidad de mandatos activos se valida en la capa de aplicación
--   (DirectivaService.create() y .update()).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `directiva` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `colegio_id`    BIGINT UNSIGNED NOT NULL,
  `parent_id`     BIGINT UNSIGNED NOT NULL,
  `role`          VARCHAR(50)     NOT NULL,  -- presidente, vicepresidente, tesorero, secretario, vocal
  `start_date`    DATE            NOT NULL,
  `end_date`      DATE            DEFAULT NULL,  -- NULL = mandato vigente
  `notes`         TEXT            DEFAULT NULL,
  `is_active`     TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_directiva_colegio` (`colegio_id`),
  KEY `idx_directiva_parent` (`parent_id`),
  KEY `idx_directiva_role` (`colegio_id`, `role`),
  KEY `idx_directiva_active` (`colegio_id`, `is_active`),
  KEY `idx_directiva_deleted` (`deleted_at`),
  CONSTRAINT `fk_directiva_colegio` FOREIGN KEY (`colegio_id`) REFERENCES `colegio` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_directiva_parent` FOREIGN KEY (`parent_id`) REFERENCES `padre` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 🔄 Reemplazo de Directiva
-- ------------------------------------------------------------
-- Registra cuando un vocal reemplaza temporalmente a otro
-- miembro de la directiva (ej: tesorero ausente).
--
-- El campo effective_role determina qué permisos de API tiene
-- el vocal durante el reemplazo (RolesGuard lo usa).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `directiva_reemplazo` (
  `id`                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `colegio_id`            BIGINT UNSIGNED NOT NULL,
  `vocal_parent_id`       BIGINT UNSIGNED NOT NULL,  -- El vocal que reemplaza
  `replaced_role`         VARCHAR(50)     NOT NULL,   -- Rol que reemplaza (tesorero, etc.)
  `replaced_parent_id`    BIGINT UNSIGNED NOT NULL,   -- Directivo reemplazado
  `effective_role`        VARCHAR(50)     NOT NULL,   -- Rol efectivo para API (mismo que replaced_role)
  `start_date`            DATETIME        NOT NULL,   -- Inicio del reemplazo
  `end_date`              DATETIME        DEFAULT NULL, -- Fin del reemplazo (NULL = indefinido)
  `reason`                TEXT            DEFAULT NULL, -- Motivo del reemplazo
  `is_active`             TINYINT(1)      NOT NULL DEFAULT 1,
  `created_by`            BIGINT UNSIGNED NOT NULL,   -- Quien autoriza (presidente/admin)
  `created_at`            TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`            TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_reemplazo_colegio` (`colegio_id`),
  KEY `idx_reemplazo_vocal` (`vocal_parent_id`),
  KEY `idx_reemplazo_replaced` (`replaced_parent_id`),
  KEY `idx_reemplazo_active` (`colegio_id`, `is_active`),
  KEY `idx_reemplazo_effective` (`colegio_id`, `vocal_parent_id`, `is_active`),
  KEY `idx_reemplazo_deleted` (`deleted_at`),
  CONSTRAINT `fk_reemplazo_colegio` FOREIGN KEY (`colegio_id`) REFERENCES `colegio` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_reemplazo_vocal` FOREIGN KEY (`vocal_parent_id`) REFERENCES `padre` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_reemplazo_replaced` FOREIGN KEY (`replaced_parent_id`) REFERENCES `padre` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_reemplazo_created_by` FOREIGN KEY (`created_by`) REFERENCES `usuario` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- FASE 2: Datos de Desarrollo
-- ============================================================

-- ------------------------------------------------------------
-- Colegio de ejemplo
-- ------------------------------------------------------------
INSERT INTO `colegio` (`name`, `slug`, `address`, `phone`, `email`)
VALUES (
  'Colegio San Miguel',
  'colegio-san-miguel',
  'Av. Principal 1234, Buenos Aires',
  '+5491155550000',
  'info@colegio-san-miguel.edu.ar'
);

-- ------------------------------------------------------------
-- Super Admin (desarrollador) — INVISIBLE en listados
-- ------------------------------------------------------------
-- REGLA: Este registro NUNCA debe aparecer en listados de padres o directiva.
-- Tiene acceso TOTAL a todos los colegios.
-- ------------------------------------------------------------
INSERT INTO `usuario` (`email`, `firebase_uid`, `name`, `surname`, `is_super_admin`)
VALUES ('dev@gestor-apafa.com', 'firebase-uid-admin', 'Admin', 'Sistema', 1);

-- ------------------------------------------------------------
-- Usuarios de ejemplo (padres)
-- ------------------------------------------------------------
INSERT INTO `usuario` (`email`, `firebase_uid`, `name`, `surname`, `phone`)
VALUES
  ('alejandroleonpedro7@gmail.com',  'firebase-uid-juan',  'Pedro',  'Pérez',  '+5491155551234'),
  ('maria.gomez@email.com', 'firebase-uid-maria', 'María', 'Gómez',  '+5491155554321'),
  ('carlos.lopez@email.com','firebase-uid-carlos','Carlos','López',  '+549115556789');

-- ------------------------------------------------------------
-- Asignar usuarios al colegio (con roles de API)
-- ------------------------------------------------------------
-- Juan = presidente (acceso API de presidente)
-- María = tesorero (acceso API de tesorero)
-- Carlos = vocal (acceso API de vocal)
-- NOTA: Estos roles controlan el RolesGuard, NO la directiva.
-- ------------------------------------------------------------
INSERT INTO `usuario_colegio` (`usuario_id`, `colegio_id`, `role`)
VALUES
  (2, 1, 'presidente'),   -- Juan
  (3, 1, 'tesorero'),     -- María
  (4, 1, 'vocal');        -- Carlos

-- ------------------------------------------------------------
-- Padres de ejemplo (asociados al colegio y usuario)
-- ------------------------------------------------------------
INSERT INTO `padre` (`colegio_id`, `usuario_id`, `name`, `surname`, `dni`, `phone`, `email`)
VALUES
  (1, 2, 'Juan',  'Pérez',    '30123456', '+5491155551234', 'juan.perez@email.com'),
  (1, 3, 'María', 'Gómez',    '28654321', '+5491155554321', 'maria.gomez@email.com'),
  (1, 4, 'Carlos','López',    '32987654', '+549115556789', 'carlos.lopez@email.com');

-- ------------------------------------------------------------
-- Directiva de ejemplo (mandatos vigentes)
-- ------------------------------------------------------------
-- Mandatos con fechas de gestión (start_date → end_date)
-- parent_id = ID de la tabla padre (NO de usuario)
-- ------------------------------------------------------------
INSERT INTO `directiva` (`colegio_id`, `parent_id`, `role`, `start_date`, `end_date`)
VALUES
  (1, 1, 'presidente',    '2025-03-01', '2026-03-01'),  -- Juan = presidente
  (1, 2, 'tesorero',      '2025-03-01', '2026-03-01'),  -- María = tesorera
  (1, 3, 'vocal',         '2025-03-01', '2026-03-01');  -- Carlos = vocal

-- ------------------------------------------------------------
-- Estudiantes de ejemplo
-- ------------------------------------------------------------
INSERT INTO `estudiante` (`colegio_id`, `name`, `surname`, `grade`, `section`, `parent_id`)
VALUES
  (1, 'Lucas',    'Pérez',  '1°', 'A', 1),
  (1, 'Sofía',    'Gómez',  '2°', 'B', 2),
  (1, 'Mateo',    'López',  '3°', 'A', 3),
  (1, 'Valentina','Pérez',  '1°', 'A', 1);

SET FOREIGN_KEY_CHECKS = 1;
