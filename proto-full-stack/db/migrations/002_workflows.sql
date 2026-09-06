BEGIN;
CREATE TABLE IF NOT EXISTS producers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL, email varchar(255) NOT NULL,
  responsible varchar(255) NOT NULL, whatsapp varchar(255) NOT NULL,
  legal_name varchar(255) NOT NULL, address varchar(255) NOT NULL,
  active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS producers_email_unique ON producers (lower(email));
CREATE TABLE IF NOT EXISTS actor_credentials (
  actor_id uuid PRIMARY KEY,
  role text NOT NULL CHECK (role IN ('operator', 'producer')),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash text PRIMARY KEY, role text NOT NULL, username text NOT NULL,
  actor_id text, expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions (expires_at);
CREATE TABLE IF NOT EXISTS publications (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id text NOT NULL, role text NOT NULL CHECK (role IN ('operator', 'producer')),
  species_id integer NOT NULL, combination jsonb NOT NULL,
  price numeric(12,2) NOT NULL CHECK (price > 0), photo text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(actor_id, species_id, combination)
);
CREATE TABLE IF NOT EXISTS market_settings (
  actor_id text PRIMARY KEY,
  schedule jsonb NOT NULL DEFAULT '{"days":["mon","tue","wed","thu","fri","sat"],"opening":"04:00","closing":"13:00"}',
  vacation jsonb NOT NULL DEFAULT '{"start":"","end":"","description":"","substitute":null}'
);
CREATE TABLE IF NOT EXISTS smart_recommendations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  species_id integer NOT NULL UNIQUE, description text NOT NULL
);
CREATE TABLE IF NOT EXISTS recovery_requests (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL, email text NOT NULL, problem text NOT NULL,
  status text NOT NULL DEFAULT 'Pendiente' CHECK(status IN ('Pendiente', 'Resuelta')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS recommended_prices (
  species_id integer PRIMARY KEY, price numeric(12,2) NOT NULL CHECK(price > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMIT;
