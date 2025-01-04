/*
  # Calendar Events Schema

  1. New Tables
    - `calendar_events`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `location` (text)
      - `description` (text)
      - `organizer_user_id` (uuid, references auth.users)
      - `google_event_id` (text)
      - `contact_id` (uuid, references contacts)
      - `deal_id` (uuid, references deals)
      - `all_day` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location text,
  description text,
  organizer_user_id uuid REFERENCES auth.users(id),
  google_event_id text,
  contact_id uuid REFERENCES contacts(id),
  deal_id uuid REFERENCES deals(id),
  all_day boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own events"
  ON calendar_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own events"
  ON calendar_events
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);