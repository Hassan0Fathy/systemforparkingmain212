CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'customer',
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cars (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  plate_number text NOT NULL UNIQUE,
  owner_name text NOT NULL,
  qr_value text NOT NULL UNIQUE,
  qr_code text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS visits (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id varchar NOT NULL,
  plate_number text NOT NULL,
  owner_name text NOT NULL,
  check_in_time timestamp NOT NULL,
  check_out_time timestamp,
  duration integer,
  fee integer,
  is_checked_in boolean NOT NULL DEFAULT true
);
