/*
  # Seed Initial Categories

  1. Purpose
    - Populate the categories table with common video categories
    - Provides initial data for the platform to function

  2. Categories Added
    - Popular (popular)
    - Trending (trending)
    - Featured (featured)
    - Latest (latest)
    - Most Viewed (most-viewed)
    - Recommended (recommended)
*/

INSERT INTO categories (name, slug) VALUES
  ('Popular', 'popular'),
  ('Trending', 'trending'),
  ('Featured', 'featured'),
  ('Latest', 'latest'),
  ('Most Viewed', 'most-viewed'),
  ('Recommended', 'recommended')
ON CONFLICT (slug) DO NOTHING;
