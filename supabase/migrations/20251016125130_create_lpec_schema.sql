/*
  # LPEC Website Database Schema

  1. New Tables
    - `news`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `content` (text)
      - `image_url` (text, optional)
      - `published_date` (timestamptz)
      - `created_at` (timestamptz)
    
    - `research`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text, optional)
      - `category` (text)
      - `created_at` (timestamptz)
    
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `status` (text)
      - `start_date` (date, optional)
      - `end_date` (date, optional)
      - `created_at` (timestamptz)
    
    - `publications`
      - `id` (uuid, primary key)
      - `title` (text)
      - `authors` (text)
      - `journal` (text, optional)
      - `year` (integer)
      - `doi` (text, optional)
      - `url` (text, optional)
      - `created_at` (timestamptz)
    
    - `team_members`
      - `id` (uuid, primary key)
      - `name` (text)
      - `role` (text)
      - `bio` (text, optional)
      - `image_url` (text, optional)
      - `email` (text, optional)
      - `order_position` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
*/

-- News table
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  image_url text,
  published_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view news"
  ON news FOR SELECT
  TO anon
  USING (true);

-- Research table
CREATE TABLE IF NOT EXISTS research (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  category text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE research ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view research"
  ON research FOR SELECT
  TO anon
  USING (true);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'active',
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO anon
  USING (true);

-- Publications table
CREATE TABLE IF NOT EXISTS publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  authors text NOT NULL,
  journal text,
  year integer NOT NULL,
  doi text,
  url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view publications"
  ON publications FOR SELECT
  TO anon
  USING (true);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  image_url text,
  email text,
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view team members"
  ON team_members FOR SELECT
  TO anon
  USING (true);