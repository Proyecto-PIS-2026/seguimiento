BEGIN;

CREATE TABLE IF NOT EXISTS operators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL CHECK (length(trim(name)) > 0),
  nave varchar(255) NOT NULL CHECK (nave IN ('Nave 1', 'Nave 2', 'Nave 3', 'Nave 4')),
  puesto varchar(255) NOT NULL CHECK (length(trim(puesto)) > 0),
  email varchar(255) NOT NULL CHECK (length(trim(email)) > 0),
  responsible varchar(255) NOT NULL CHECK (length(trim(responsible)) > 0),
  whatsapp varchar(255) NOT NULL CHECK (length(trim(whatsapp)) > 0),
  legal_name varchar(255) NOT NULL CHECK (length(trim(legal_name)) > 0),
  address varchar(255) NOT NULL CHECK (length(trim(address)) > 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS operators_email_unique ON operators (lower(email));

COMMIT;
