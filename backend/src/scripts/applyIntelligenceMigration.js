import { getDb } from "../config/db.js"

const analysisColumns = [
  ["decision", "VARCHAR(20) NULL AFTER risk_reward"],
  ["quality_score", "INT NULL AFTER decision"],
  ["risk_score", "INT NULL AFTER quality_score"],
  ["expectancy_score", "DECIMAL(10,2) NULL AFTER risk_score"],
  ["confidence_adjusted", "INT NULL AFTER expectancy_score"],
  ["no_trade_reason", "TEXT NULL AFTER confidence_adjusted"],
  ["final_decision", "VARCHAR(20) NULL AFTER no_trade_reason"],
  ["final_confidence", "INT NULL AFTER final_decision"],
  ["ensemble_result", "JSON NULL AFTER final_confidence"],
  ["learning_adjustments", "JSON NULL AFTER ensemble_result"],
  ["risk_warnings", "JSON NULL AFTER learning_adjustments"],
  ["expected_value", "DECIMAL(10,4) NULL AFTER risk_warnings"],
  ["required_win_rate", "DECIMAL(10,2) NULL AFTER expected_value"],
  ["historical_win_rate", "DECIMAL(10,2) NULL AFTER required_win_rate"],
  ["rr_quality", "VARCHAR(50) NULL AFTER historical_win_rate"],
]

async function applyMigration() {
  const db = getDb()
  const [columns] = await db.query(
    "SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ?",
    ["analyses"],
  )
  const existingColumns = new Set(columns.map((row) => row.COLUMN_NAME || row.column_name))

  for (const [name, definition] of analysisColumns) {
    if (!existingColumns.has(name)) {
      await db.query(`ALTER TABLE analyses ADD COLUMN ${name} ${definition}`)
    }
  }

  await db.query(
    `CREATE TABLE IF NOT EXISTS trade_mistakes (
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
    )`,
  )

  await db.query(
    `CREATE TABLE IF NOT EXISTS trade_alerts (
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
    )`,
  )

  const [alertColumns] = await db.query(
    "SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ?",
    ["trade_alerts"],
  )
  const existingAlertColumns = new Set(alertColumns.map((row) => row.COLUMN_NAME || row.column_name))
  const alertColumnsToAdd = [
    ["entry_notified_at", "DATETIME NULL AFTER triggered_at"],
    ["sl_notified_at", "DATETIME NULL AFTER entry_notified_at"],
    ["tp_notified_at", "DATETIME NULL AFTER sl_notified_at"],
  ]

  for (const [name, definition] of alertColumnsToAdd) {
    if (!existingAlertColumns.has(name)) {
      await db.query(`ALTER TABLE trade_alerts ADD COLUMN ${name} ${definition}`)
    }
  }

  const [updatedColumns] = await db.query(
    "SELECT column_name FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ?",
    ["analyses"],
  )
  const updatedColumnSet = new Set(updatedColumns.map((row) => row.COLUMN_NAME || row.column_name))

  console.log(
    JSON.stringify({
      missingAnalysisColumns: analysisColumns.map(([name]) => name).filter((name) => !updatedColumnSet.has(name)),
      tradeMistakes: true,
      tradeAlerts: true,
      emailAlertColumns: true,
    }),
  )

  await db.end?.()
}

applyMigration().catch((error) => {
  console.error(error)
  process.exit(1)
})
