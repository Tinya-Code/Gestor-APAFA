-- ============================================================
-- Gestor APAFA — Esquema MySQL
-- Generado desde: doc/a2-entidades-atributos.md
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 👨‍👩‍👧 Padre
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `padre` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(100)    NOT NULL,
  `surname`       VARCHAR(100)    NOT NULL,
  `dni`           VARCHAR(20)     NOT NULL,
  `phone`         VARCHAR(30)     DEFAULT NULL,
  `email`         VARCHAR(150)    DEFAULT NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_padre_dni` (`dni`),
  KEY `idx_padre_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 🎓 Estudiante
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `estudiante` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(100)    NOT NULL,
  `surname`       VARCHAR(100)    NOT NULL,
  `grade`         VARCHAR(50)     NOT NULL,
  `section`       VARCHAR(50)     DEFAULT NULL,
  `parent_id`     BIGINT UNSIGNED NOT NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_estudiante_parent` (`parent_id`),
  KEY `idx_estudiante_deleted` (`deleted_at`),
  CONSTRAINT `fk_estudiante_padre`
    FOREIGN KEY (`parent_id`) REFERENCES `padre` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 🏛️ Directiva
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `directiva` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id`     BIGINT UNSIGNED NOT NULL,
  `role`          VARCHAR(50)     NOT NULL,
  `start_date`    DATE            NOT NULL,
  `end_date`      DATE            DEFAULT NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_directiva_parent` (`parent_id`),
  KEY `idx_directiva_deleted` (`deleted_at`),
  CONSTRAINT `fk_directiva_padre`
    FOREIGN KEY (`parent_id`) REFERENCES `padre` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 🗓️ Asamblea
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `asamblea` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`         VARCHAR(200)    NOT NULL,
  `date`          DATE            NOT NULL,
  `description`   TEXT            DEFAULT NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_asamblea_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 📋 Detalle de Asamblea
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `detalle_asamblea` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `assembly_id`         BIGINT UNSIGNED NOT NULL,
  `description`         TEXT            NOT NULL,
  `registration_date`   DATE            NOT NULL,
  `image_url`           VARCHAR(500)    DEFAULT NULL,
  `created_at`          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`          TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_detalle_asamblea_assembly` (`assembly_id`),
  KEY `idx_detalle_asamblea_deleted` (`deleted_at`),
  CONSTRAINT `fk_detalle_asamblea_asamblea`
    FOREIGN KEY (`assembly_id`) REFERENCES `asamblea` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 🎉 Evento
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `evento` (
  `id`                        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `assembly_id`               BIGINT UNSIGNED DEFAULT NULL,
  `title`                     VARCHAR(200)    NOT NULL,
  `date`                      DATE            NOT NULL,
  `description`               TEXT            DEFAULT NULL,
  `generates_fine`            TINYINT(1)      NOT NULL DEFAULT 0,
  `fine_amount`               DECIMAL(10,2)   DEFAULT NULL,
  `generates_attendance`      TINYINT(1)      NOT NULL DEFAULT 0,
  `generates_expense`         TINYINT(1)      NOT NULL DEFAULT 0,
  `generates_contribution`    TINYINT(1)      NOT NULL DEFAULT 0,
  `contribution_amount`       DECIMAL(10,2)   DEFAULT NULL,
  `created_at`                TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`                TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`                TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_evento_assembly` (`assembly_id`),
  KEY `idx_evento_deleted` (`deleted_at`),
  CONSTRAINT `fk_evento_asamblea`
    FOREIGN KEY (`assembly_id`) REFERENCES `asamblea` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- ✅ Asistencia
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `asistencia` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_id`          BIGINT UNSIGNED NOT NULL,
  `parent_id`         BIGINT UNSIGNED NOT NULL,
  `attended`          TINYINT(1)      NOT NULL DEFAULT 0,
  `registration_date` DATE            NOT NULL,
  `created_at`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`        TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_asistencia_evento_padre` (`event_id`, `parent_id`),
  KEY `idx_asistencia_parent` (`parent_id`),
  KEY `idx_asistencia_deleted` (`deleted_at`),
  CONSTRAINT `fk_asistencia_evento`
    FOREIGN KEY (`event_id`) REFERENCES `evento` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_asistencia_padre`
    FOREIGN KEY (`parent_id`) REFERENCES `padre` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 💸 Multa
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `multa` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id`       BIGINT UNSIGNED NOT NULL,
  `event_id`        BIGINT UNSIGNED NOT NULL,
  `amount`          DECIMAL(10,2)   NOT NULL,
  `paid`            TINYINT(1)      NOT NULL DEFAULT 0,
  `generated_date`  DATE            NOT NULL,
  `payment_date`    DATE            DEFAULT NULL,
  `created_at`      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`      TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_multa_parent` (`parent_id`),
  KEY `idx_multa_event` (`event_id`),
  KEY `idx_multa_deleted` (`deleted_at`),
  CONSTRAINT `fk_multa_padre`
    FOREIGN KEY (`parent_id`) REFERENCES `padre` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_multa_evento`
    FOREIGN KEY (`event_id`) REFERENCES `evento` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 💰 Ingreso
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ingreso` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id`         BIGINT UNSIGNED NOT NULL,
  `event_id`          BIGINT UNSIGNED DEFAULT NULL,
  `board_member_id`   BIGINT UNSIGNED NOT NULL,
  `amount`            DECIMAL(10,2)   NOT NULL,
  `date`              DATE            NOT NULL,
  `description`       TEXT            DEFAULT NULL,
  `type`              VARCHAR(50)     NOT NULL,
  `created_at`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`        TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ingreso_parent` (`parent_id`),
  KEY `idx_ingreso_event` (`event_id`),
  KEY `idx_ingreso_board` (`board_member_id`),
  KEY `idx_ingreso_deleted` (`deleted_at`),
  CONSTRAINT `fk_ingreso_padre`
    FOREIGN KEY (`parent_id`) REFERENCES `padre` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_ingreso_evento`
    FOREIGN KEY (`event_id`) REFERENCES `evento` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_ingreso_directiva`
    FOREIGN KEY (`board_member_id`) REFERENCES `directiva` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 🧾 Comprobante
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `comprobante` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `board_member_id`   BIGINT UNSIGNED NOT NULL,
  `receipt_number`    VARCHAR(100)    NOT NULL,
  `type`              VARCHAR(50)     NOT NULL,
  `date`              DATE            NOT NULL,
  `description`       TEXT            DEFAULT NULL,
  `created_at`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`        TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_comprobante_board` (`board_member_id`),
  KEY `idx_comprobante_deleted` (`deleted_at`),
  CONSTRAINT `fk_comprobante_directiva`
    FOREIGN KEY (`board_member_id`) REFERENCES `directiva` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 🧮 Item de Gasto
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `item_gasto` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `receipt_id`    BIGINT UNSIGNED NOT NULL,
  `description`   TEXT            NOT NULL,
  `amount`        DECIMAL(10,2)   NOT NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_item_gasto_receipt` (`receipt_id`),
  CONSTRAINT `fk_item_gasto_comprobante`
    FOREIGN KEY (`receipt_id`) REFERENCES `comprobante` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 🏗️ Gasto
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `gasto` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_id`          BIGINT UNSIGNED DEFAULT NULL,
  `receipt_id`        BIGINT UNSIGNED DEFAULT NULL,
  `board_member_id`   BIGINT UNSIGNED NOT NULL,
  `total`             DECIMAL(10,2)   NOT NULL,
  `type`              VARCHAR(50)     NOT NULL,
  `date`              DATE            NOT NULL,
  `description`       TEXT            DEFAULT NULL,
  `created_at`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`        TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_gasto_event` (`event_id`),
  KEY `idx_gasto_receipt` (`receipt_id`),
  KEY `idx_gasto_board` (`board_member_id`),
  KEY `idx_gasto_deleted` (`deleted_at`),
  CONSTRAINT `fk_gasto_evento`
    FOREIGN KEY (`event_id`) REFERENCES `evento` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_gasto_comprobante`
    FOREIGN KEY (`receipt_id`) REFERENCES `comprobante` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_gasto_directiva`
    FOREIGN KEY (`board_member_id`) REFERENCES `directiva` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 🔄 Movimiento (polimórfico)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `movimiento` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `type`            VARCHAR(20)     NOT NULL COMMENT 'ingreso o egreso',
  `amount`          DECIMAL(10,2)   NOT NULL,
  `date`            DATE            NOT NULL,
  `description`     TEXT            DEFAULT NULL,
  `reference_id`    BIGINT UNSIGNED DEFAULT NULL,
  `reference_type`  VARCHAR(50)     DEFAULT NULL COMMENT 'aporte, multa o gasto',
  `created_at`      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_movimiento_type` (`type`),
  KEY `idx_movimiento_reference` (`reference_type`, `reference_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 📢 Aviso (polimórfico)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `aviso` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `type`            VARCHAR(50)     NOT NULL COMMENT 'evento o multa',
  `reference_id`    BIGINT UNSIGNED DEFAULT NULL,
  `title`           VARCHAR(200)    NOT NULL,
  `message`         TEXT            NOT NULL,
  `date`            DATE            NOT NULL,
  `created_at`      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`      TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_aviso_type` (`type`),
  KEY `idx_aviso_reference` (`reference_type`, `reference_id`),
  KEY `idx_aviso_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
