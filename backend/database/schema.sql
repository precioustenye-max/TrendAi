CREATE DATABASE IF NOT EXISTS trendai
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE trendai;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(80) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  account_type ENUM('free', 'pro') NOT NULL DEFAULT 'free',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
);

CREATE TABLE IF NOT EXISTS uploads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  size BIGINT UNSIGNED NOT NULL,
  local_path VARCHAR(600) NOT NULL,
  public_url VARCHAR(600) NULL,
  provider VARCHAR(40) NOT NULL DEFAULT 'local',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY uploads_user_id_index (user_id),
  CONSTRAINT uploads_user_id_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS analyses (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  upload_id BIGINT UNSIGNED NULL,
  asset VARCHAR(120) NULL,
  timeframe VARCHAR(80) NULL,
  bias ENUM('Bullish', 'Bearish', 'Neutral') NOT NULL DEFAULT 'Neutral',
  confidence DECIMAL(5,2) NOT NULL DEFAULT 0,
  entry VARCHAR(120) NULL,
  stop_loss VARCHAR(120) NULL,
  take_profits JSON NULL,
  risk_reward VARCHAR(80) NULL,
  decision VARCHAR(20) NULL,
  quality_score INT NULL,
  risk_score INT NULL,
  expectancy_score DECIMAL(10,2) NULL,
  confidence_adjusted INT NULL,
  no_trade_reason TEXT NULL,
  final_decision VARCHAR(20) NULL,
  final_confidence INT NULL,
  ensemble_result JSON NULL,
  learning_adjustments JSON NULL,
  risk_warnings JSON NULL,
  expected_value DECIMAL(10,4) NULL,
  required_win_rate DECIMAL(10,2) NULL,
  historical_win_rate DECIMAL(10,2) NULL,
  rr_quality VARCHAR(50) NULL,
  explanation TEXT NULL,
  smc_notes JSON NULL,
  strategy_tags JSON NULL,
  raw_ai_response JSON NULL,
  status ENUM('completed', 'failed') NOT NULL DEFAULT 'completed',
  error_message VARCHAR(600) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY analyses_user_id_index (user_id),
  KEY analyses_upload_id_index (upload_id),
  KEY analyses_created_at_index (created_at),
  CONSTRAINT analyses_user_id_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT analyses_upload_id_fk FOREIGN KEY (upload_id) REFERENCES uploads (id) ON DELETE SET NULL
);

ALTER TABLE analyses
  ADD COLUMN IF NOT EXISTS decision VARCHAR(20) NULL AFTER risk_reward,
  ADD COLUMN IF NOT EXISTS quality_score INT NULL AFTER decision,
  ADD COLUMN IF NOT EXISTS risk_score INT NULL AFTER quality_score,
  ADD COLUMN IF NOT EXISTS expectancy_score DECIMAL(10,2) NULL AFTER risk_score,
  ADD COLUMN IF NOT EXISTS confidence_adjusted INT NULL AFTER expectancy_score,
  ADD COLUMN IF NOT EXISTS no_trade_reason TEXT NULL AFTER confidence_adjusted,
  ADD COLUMN IF NOT EXISTS final_decision VARCHAR(20) NULL AFTER no_trade_reason,
  ADD COLUMN IF NOT EXISTS final_confidence INT NULL AFTER final_decision,
  ADD COLUMN IF NOT EXISTS ensemble_result JSON NULL AFTER final_confidence,
  ADD COLUMN IF NOT EXISTS learning_adjustments JSON NULL AFTER ensemble_result,
  ADD COLUMN IF NOT EXISTS risk_warnings JSON NULL AFTER learning_adjustments,
  ADD COLUMN IF NOT EXISTS expected_value DECIMAL(10,4) NULL AFTER risk_warnings,
  ADD COLUMN IF NOT EXISTS required_win_rate DECIMAL(10,2) NULL AFTER expected_value,
  ADD COLUMN IF NOT EXISTS historical_win_rate DECIMAL(10,2) NULL AFTER required_win_rate,
  ADD COLUMN IF NOT EXISTS rr_quality VARCHAR(50) NULL AFTER historical_win_rate;

CREATE TABLE IF NOT EXISTS trade_results (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  analysis_id BIGINT UNSIGNED NOT NULL,
  result ENUM('win', 'loss', 'breakeven') NOT NULL,
  profit_loss DECIMAL(18,6) NULL,
  rr_achieved DECIMAL(10,4) NULL,
  notes TEXT NULL,
  closed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY trade_results_analysis_id_unique (analysis_id),
  KEY trade_results_user_id_index (user_id),
  CONSTRAINT trade_results_user_id_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT trade_results_analysis_id_fk FOREIGN KEY (analysis_id) REFERENCES analyses (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trade_mistakes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  analysis_id BIGINT UNSIGNED NOT NULL,
  mistake_tag VARCHAR(120) NOT NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY trade_mistakes_user_id_index (user_id),
  KEY trade_mistakes_analysis_id_index (analysis_id),
  KEY trade_mistakes_tag_index (mistake_tag),
  CONSTRAINT trade_mistakes_user_id_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT trade_mistakes_analysis_id_fk FOREIGN KEY (analysis_id) REFERENCES analyses (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trade_alerts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  analysis_id BIGINT UNSIGNED NOT NULL,
  asset VARCHAR(120) NULL,
  direction ENUM('buy', 'sell') NOT NULL,
  entry_price DECIMAL(18,6) NULL,
  stop_loss DECIMAL(18,6) NOT NULL,
  take_profits JSON NULL,
  status ENUM('active', 'triggered', 'cancelled') NOT NULL DEFAULT 'active',
  triggered_type ENUM('sl', 'tp') NULL,
  triggered_target VARCHAR(80) NULL,
  triggered_price DECIMAL(18,6) NULL,
  triggered_at DATETIME NULL,
  entry_notified_at DATETIME NULL,
  sl_notified_at DATETIME NULL,
  tp_notified_at DATETIME NULL,
  last_checked_price DECIMAL(18,6) NULL,
  last_checked_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY trade_alerts_user_id_index (user_id),
  KEY trade_alerts_analysis_id_index (analysis_id),
  KEY trade_alerts_status_index (status),
  CONSTRAINT trade_alerts_user_id_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT trade_alerts_analysis_id_fk FOREIGN KEY (analysis_id) REFERENCES analyses (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_settings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  theme VARCHAR(30) NOT NULL DEFAULT 'dark',
  preferred_risk VARCHAR(80) NULL,
  default_timeframe VARCHAR(80) NULL,
  default_asset VARCHAR(120) NULL,
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY user_settings_user_id_unique (user_id),
  CONSTRAINT user_settings_user_id_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NULL,
  message TEXT NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'new',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY contact_messages_status_index (status)
);
