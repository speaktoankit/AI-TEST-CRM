/*
  # AI Messages Schema

  1. New Tables
    - `ai_messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `role` (enum: user, assistant)
      - `content` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create AI messages table
CREATE TABLE IF NOT EXISTS ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own messages"
  ON ai_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create messages"
  ON ai_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);