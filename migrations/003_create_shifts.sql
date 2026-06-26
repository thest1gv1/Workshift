CREATE TABLE IF NOT EXISTS shifts (
	id         				SERIAL PRIMARY KEY,
	started_at        TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
	ended_at          TIMESTAMPTZ        ,
	is_active					BOOLEAN            NOT NULL DEFAULT TRUE
);