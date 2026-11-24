-- ============================================================
-- ONUFAST
-- Actualización de la tabla rutas
-- Fecha: 24/11/2026
-- ============================================================

-- Agregar el estado de la ruta si todavía no existe.
-- Las rutas existentes quedarán con estado "Pendiente".

ALTER TABLE rutas
ADD COLUMN IF NOT EXISTS estado VARCHAR(30)
NOT NULL DEFAULT 'Pendiente';
