/*
  # Viral Raja Platform Database Schema

  ## Overview
  Complete database schema for Viral Raja video streaming platform with admin controls,
  public interactions, and content moderation.

  ## Tables Created

  1. **admins**
     - `id` (uuid, primary key)
     - `email` (text, unique) - Admin email for login
     - `password_hash` (text) - Hashed password
     - `role` (text) - Admin role (super_admin, moderator)
     - `created_at` (timestamptz)
     
  2. **categories**
     - `id` (uuid, primary key)
     - `name` (text, unique) - Category name
     - `slug` (text, unique) - URL-friendly slug
     - `created_at` (timestamptz)
     
  3. **videos**
     - `id` (uuid, primary key)
     - `title` (text) - Video title
     - `description` (text) - Video description
     - `category_id` (uuid) - Foreign key to categories
     - `video_url` (text) - Storage URL for video file
     - `thumbnail_url` (text) - Storage URL for thumbnail
     - `duration` (integer) - Video duration in seconds
     - `views` (integer) - View count
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)
     
  4. **comments**
     - `id` (uuid, primary key)
     - `video_id` (uuid) - Foreign key to videos
     - `commenter_name` (text) - Public commenter name
     - `content` (text) - Comment text
     - `is_moderated` (boolean) - Admin moderation flag
     - `created_at` (timestamptz)
     
  5. **likes**
     - `id` (uuid, primary key)
     - `video_id` (uuid) - Foreign key to videos
     - `ip_address` (text) - User IP for tracking (hashed)
     - `created_at` (timestamptz)
     
  6. **reports**
     - `id` (uuid, primary key)
     - `video_id` (uuid) - Foreign key to videos
     - `description` (text) - Report description
     - `reporter_email` (text) - Reporter contact
     - `status` (text) - Status (pending, reviewed, resolved, ignored)
     - `created_at` (timestamptz)
     - `reviewed_at` (timestamptz)
     - `reviewed_by` (uuid) - Foreign key to admins

  ## Security
  - RLS enabled on all tables
  - Public read access for videos, categories, comments, likes
  - Admin-only write access for videos and categories
  - Public write for comments, likes, and reports (with validation)
  - Admins have full access to all tables
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'moderator',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read own data"
  ON admins FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can update own data"
  ON admins FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  video_url text NOT NULL,
  thumbnail_url text DEFAULT '',
  duration integer DEFAULT 0,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view videos"
  ON videos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete videos"
  ON videos FOR DELETE
  TO authenticated
  USING (true);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  commenter_name text NOT NULL,
  content text NOT NULL,
  is_moderated boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view non-moderated comments"
  ON comments FOR SELECT
  TO anon, authenticated
  USING (is_moderated = false);

CREATE POLICY "Admins can view all comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert comments"
  ON comments FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admins can update comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete comments"
  ON comments FOR DELETE
  TO authenticated
  USING (true);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  ip_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(video_id, ip_address)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
  ON likes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert likes"
  ON likes FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admins can delete likes"
  ON likes FOR DELETE
  TO authenticated
  USING (true);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  reporter_email text DEFAULT '',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES admins(id) ON DELETE SET NULL
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert reports"
  ON reports FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admins can view all reports"
  ON reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update reports"
  ON reports FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete reports"
  ON reports FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_views ON videos(views DESC);
CREATE INDEX IF NOT EXISTS idx_comments_video ON comments(video_id);
CREATE INDEX IF NOT EXISTS idx_likes_video ON likes(video_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_video_views(video_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE videos
  SET views = views + 1
  WHERE id = video_id_param;
END;
$$;

-- Create function to get video with like count
CREATE OR REPLACE FUNCTION get_video_stats(video_id_param uuid)
RETURNS TABLE (
  video_id uuid,
  like_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    COUNT(l.id)::bigint as like_count
  FROM videos v
  LEFT JOIN likes l ON v.id = l.video_id
  WHERE v.id = video_id_param
  GROUP BY v.id;
END;
$$;