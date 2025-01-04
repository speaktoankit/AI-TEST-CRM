/*
  # Integrations Schema

  1. New Tables
    - `integrations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (enum: gmail, google_calendar, google_contacts, whatsapp)
      - `status` (enum: connected, disconnected)
      - `config` (jsonb, for storing integration-specific settings)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  type text NOT NULL CHECK (type IN ('gmail', 'google_calendar', 'google_contacts', 'whatsapp')),
  status text NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected')),
  config jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own integrations"
  ON integrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own integrations"
  ON integrations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);