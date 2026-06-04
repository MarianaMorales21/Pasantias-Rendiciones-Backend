-- =============================================
-- MIGRACIÓN FINAL: Todo por cod_ctd / cod_ben
-- =============================================

-- 1. DROP FK constraints viejas
ALTER TABLE opg_ren DROP FOREIGN KEY fk_opg_ctd;
ALTER TABLE ndb_ren DROP FOREIGN KEY fk_ndb_ben;

-- 2. DROP índices viejos (NO se dropean automáticamente al dropear la FK)
ALTER TABLE opg_ren DROP INDEX fk_opg_ctd;
ALTER TABLE ndb_ren DROP INDEX fk_ndb_ben;

-- 3. Agregar columnas INT
ALTER TABLE opg_ren ADD ctd_opg INT UNSIGNED AFTER ced_opg;
ALTER TABLE ndb_ren ADD ben_ndb INT UNSIGNED AFTER rif_ndb;

-- 4. Migrar datos existentes
UPDATE opg_ren o JOIN ctd_ren c ON o.ced_opg = c.ced_ctd SET o.ctd_opg = c.cod_ctd;
UPDATE ndb_ren n JOIN ben_ren b ON n.rif_ndb = b.rif_ben SET n.ben_ndb = b.cod_ben;

-- 5. Hacer NOT NULL
ALTER TABLE opg_ren MODIFY ctd_opg INT UNSIGNED NOT NULL;
ALTER TABLE ndb_ren MODIFY ben_ndb INT UNSIGNED NOT NULL;

-- 6. Nuevas FK apuntando a cod_ctd / cod_ben
ALTER TABLE opg_ren ADD CONSTRAINT fk_opg_ctd FOREIGN KEY (ctd_opg) REFERENCES ctd_ren(cod_ctd);
ALTER TABLE ndb_ren ADD CONSTRAINT fk_ndb_ben FOREIGN KEY (ben_ndb) REFERENCES ben_ren(cod_ben);

-- 7. Eliminar columnas viejas
ALTER TABLE opg_ren DROP COLUMN ced_opg;
ALTER TABLE ndb_ren DROP COLUMN rif_ndb;

-- Verificación
SELECT TABLE_NAME, COLUMN_NAME, COLUMN_KEY, EXTRA
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('ctd_ren', 'ben_ren', 'opg_ren', 'ndb_ren')
  AND (COLUMN_KEY IN ('PRI', 'UNI', 'MUL'))
ORDER BY TABLE_NAME, ORDINAL_POSITION;
