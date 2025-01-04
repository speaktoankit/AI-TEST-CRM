/*
  # Initial CRM Schema Setup

  1. New Tables
    - contacts: Store contact information and lead scores
    - deals: Track sales pipeline and opportunities
    - tasks: Manage to-dos and follow-ups
    - activities: Log all CRM activities
    - ai_insights: Store AI-generated suggestions
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  company text,
  lead_score integer DEFAULT 0,
  google_contact_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own contacts"
  ON contacts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Deals Table
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  contact_id uuid REFERENCES contacts(id),
  title text NOT NULL,
  amount decimal(10,2),
  stage text NOT NULL,
  close_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own deals"
  ON deals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  contact_id uuid REFERENCES contacts(id),
  title text NOT NULL,
  description text,
  due_date timestamptz,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Activities Table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  contact_id uuid REFERENCES contacts(id),
  type text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activities"
  ON activities
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- AI Insights Table
CREATE TABLE IF NOT EXISTS ai_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  contact_id uuid REFERENCES contacts(id),
  type text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own insights"
  ON ai_insights
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);