/*
  # Add email suggestions and tasks tracking

  1. New Tables
    - `email_suggestions`
      - Stores AI-generated email suggestions and follow-ups
      - Links to contacts and email threads
      - Tracks suggestion status and approvals
    
    - `email_threads`
      - Stores email conversation threads
      - Links to contacts and deals
      - Tracks thread status and last activity

  2. Changes
    - Add new columns to tasks table for email linking
    - Add indexes for performance optimization

  3. Security
    - Enable RLS on new tables
    - Add policies for user-based access control
*/

-- Create email threads table
CREATE TABLE IF NOT EXISTS email_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  contact_id uuid REFERENCES contacts(id),
  deal_id uuid REFERENCES deals(id),
  subject text NOT NULL,
  last_message_at timestamptz,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE email_threads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own email threads"
  ON email_threads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own email threads"
  ON email_threads
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Add email thread reference to tasks
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS email_thread_id uuid REFERENCES email_threads(id),
ADD COLUMN IF NOT EXISTS email_suggestion_id uuid REFERENCES email_suggestions(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_threads_user_id ON email_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_email_threads_contact_id ON email_threads(contact_id);
CREATE INDEX IF NOT EXISTS idx_email_threads_last_message_at ON email_threads(last_message_at);
CREATE INDEX IF NOT EXISTS idx_tasks_email_thread_id ON tasks(email_thread_id);
CREATE INDEX IF NOT EXISTS idx_tasks_email_suggestion_id ON tasks(email_suggestion_id);