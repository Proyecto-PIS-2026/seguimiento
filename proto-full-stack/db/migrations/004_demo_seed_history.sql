CREATE TABLE IF NOT EXISTS prototype_seeds (
  name text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);
