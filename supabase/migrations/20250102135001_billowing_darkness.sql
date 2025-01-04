/*
  # Email Suggestions Schema

  1. New Tables
    - `email_suggestions`
      - `id` (uuid, primary key)
      - `email_id` (text, required)
      - `thread_id` (text)
      - `subject` (text, required)
      - `suggested_reply` (text, required)
      - `due_date` (timestamptz)
      - `type` (enum: follow_up, reply, task)
      - `status` (enum: pending, approved, dismissed)
      - `task_approved` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create email suggestions table
CREATE TABLE IF NOT EXISTS email_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  email_id text NOT NULL,
  thread_id text,
  subject text NOT NULL,
  suggested_reply text NOT NULL,
  due_date timestamptz,
  type text NOT NULL CHECK (type IN ('follow_up', 'reply', 'task')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'dismissed')),
  task_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE email_suggestions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own suggestions"
  ON email_suggestions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own suggestions"
  ON email_suggestions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suggestions"
  ON email_suggestions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);