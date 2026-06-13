CREATE TABLE IF NOT EXISTS clients (
  id       SERIAL PRIMARY KEY,
  name     TEXT        NOT NULL,
  type     TEXT        NOT NULL,
  services TEXT[]      NOT NULL DEFAULT '{}',
  amounts  JSONB       NOT NULL DEFAULT '{}',
  note     TEXT        NOT NULL DEFAULT ''
);
