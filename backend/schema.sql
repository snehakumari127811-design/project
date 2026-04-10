-- Viral Raja Cloudflare D1 Schema

-- Categories Table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Videos Table
CREATE TABLE videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT DEFAULT '',
  duration INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Comments Table
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  video_id TEXT REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  commenter_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_moderated BOOLEAN DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Likes Table
CREATE TABLE likes (
  id TEXT PRIMARY KEY,
  video_id TEXT REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  ip_address TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(video_id, ip_address)
);

-- Reports Table
CREATE TABLE reports (
  id TEXT PRIMARY KEY,
  video_id TEXT REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  reporter_email TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now')),
  reviewed_at TEXT,
  reviewed_by TEXT
);

-- Admin Roles Table (Optional if using Firebase Claims, but good for local lookups)
CREATE TABLE admins (
  id TEXT PRIMARY KEY, -- Firebase Auth UID
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'moderator',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for performance
CREATE INDEX idx_videos_category ON videos(category_id);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX idx_videos_views ON videos(views DESC);
CREATE INDEX idx_comments_video ON comments(video_id);
CREATE INDEX idx_likes_video ON likes(video_id);
CREATE INDEX idx_reports_status ON reports(status);
