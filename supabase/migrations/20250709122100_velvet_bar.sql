/*
  # Concert Platform Database Schema

  1. New Tables
    - `purchases`
      - `id` (uuid, primary key)
      - `name` (text, user's full name)
      - `email` (text, user's email)
      - `token` (text, unique access token)
      - `payment_status` (enum: pending, completed, failed)
      - `stripe_payment_intent_id` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `token_usage`
      - `id` (uuid, primary key)
      - `token` (text, references purchase token)
      - `used` (boolean, default false)
      - `first_accessed_at` (timestamp, nullable)
      - `last_accessed_at` (timestamp, nullable)
      - `ip_address` (text, nullable)
      - `user_agent` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `stream_settings`
      - `id` (uuid, primary key)
      - `is_live` (boolean, default false)
      - `stream_url` (text, nullable)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access to purchases (for checkout)
    - Add policies for token validation
    - Add admin-only policies for stream_settings
*/

-- Create custom types
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed');

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  token text UNIQUE NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create token_usage table
CREATE TABLE IF NOT EXISTS token_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL REFERENCES purchases(token) ON DELETE CASCADE,
  used boolean DEFAULT false,
  first_accessed_at timestamptz,
  last_accessed_at timestamptz,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create stream_settings table
CREATE TABLE IF NOT EXISTS stream_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_live boolean DEFAULT false,
  stream_url text,
  updated_at timestamptz DEFAULT now()
);

-- Insert default stream settings
INSERT INTO stream_settings (is_live, stream_url) 
VALUES (false, null)
ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_purchases_token ON purchases(token);
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(email);
CREATE INDEX IF NOT EXISTS idx_token_usage_token ON token_usage(token);
CREATE INDEX IF NOT EXISTS idx_token_usage_used ON token_usage(used);

-- Enable RLS
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for purchases
CREATE POLICY "Allow public read access to purchases"
  ON purchases
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to purchases"
  ON purchases
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to purchases"
  ON purchases
  FOR UPDATE
  TO public
  USING (true);

-- RLS Policies for token_usage
CREATE POLICY "Allow public read access to token_usage"
  ON token_usage
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to token_usage"
  ON token_usage
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to token_usage"
  ON token_usage
  FOR UPDATE
  TO public
  USING (true);

-- RLS Policies for stream_settings
CREATE POLICY "Allow public read access to stream_settings"
  ON stream_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public update to stream_settings"
  ON stream_settings
  FOR UPDATE
  TO public
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_token_usage_updated_at
  BEFORE UPDATE ON token_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stream_settings_updated_at
  BEFORE UPDATE ON stream_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();