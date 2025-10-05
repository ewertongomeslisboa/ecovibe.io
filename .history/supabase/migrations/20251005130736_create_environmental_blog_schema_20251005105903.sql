/*
  # Environmental Blog Database Schema

  ## Overview
  This migration creates the complete database schema for an interactive environmental blog with news, education, tips, AI features, and community engagement.

  ## New Tables

  ### 1. categories
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Category name (e.g., "Climate Change", "Recycling")
  - `slug` (text) - URL-friendly version
  - `description` (text) - Category description
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. articles
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Article title
  - `slug` (text) - URL-friendly version
  - `content` (text) - Full article content
  - `excerpt` (text) - Short summary
  - `image_url` (text) - Featured image URL
  - `category_id` (uuid) - Foreign key to categories
  - `author` (text) - Author name
  - `is_featured` (boolean) - Whether article is featured on homepage
  - `view_count` (integer) - Number of views
  - `like_count` (integer) - Number of likes
  - `published_at` (timestamptz) - Publication date
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. comments
  - `id` (uuid, primary key) - Unique identifier
  - `article_id` (uuid) - Foreign key to articles
  - `user_name` (text) - Commenter name
  - `user_email` (text) - Commenter email
  - `content` (text) - Comment text
  - `is_approved` (boolean) - Moderation status
  - `created_at` (timestamptz) - Creation timestamp

  ### 4. tips
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Tip title
  - `content` (text) - Tip description
  - `category` (text) - Tip category (water, energy, recycling, etc.)
  - `difficulty` (text) - Easy, Medium, Hard
  - `impact_level` (text) - Low, Medium, High environmental impact
  - `like_count` (integer) - Number of likes
  - `created_at` (timestamptz) - Creation timestamp

  ### 5. educational_content
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Content title
  - `content` (text) - Educational content
  - `type` (text) - Type: article, quiz, video, download
  - `target_audience` (text) - children, youth, adults
  - `file_url` (text) - URL for downloadable content
  - `thumbnail_url` (text) - Thumbnail image
  - `created_at` (timestamptz) - Creation timestamp

  ### 6. quiz_questions
  - `id` (uuid, primary key) - Unique identifier
  - `educational_content_id` (uuid) - Foreign key to educational_content
  - `question` (text) - Question text
  - `options` (jsonb) - Array of answer options
  - `correct_answer` (integer) - Index of correct answer
  - `explanation` (text) - Explanation of answer
  - `created_at` (timestamptz) - Creation timestamp

  ### 7. forum_posts
  - `id` (uuid, primary key) - Unique identifier
  - `user_name` (text) - Poster name
  - `user_email` (text) - Poster email
  - `title` (text) - Post title
  - `content` (text) - Post content
  - `category` (text) - Discussion category
  - `like_count` (integer) - Number of likes
  - `reply_count` (integer) - Number of replies
  - `created_at` (timestamptz) - Creation timestamp

  ### 8. forum_replies
  - `id` (uuid, primary key) - Unique identifier
  - `post_id` (uuid) - Foreign key to forum_posts
  - `user_name` (text) - Replier name
  - `user_email` (text) - Replier email
  - `content` (text) - Reply content
  - `created_at` (timestamptz) - Creation timestamp

  ### 9. newsletter_subscribers
  - `id` (uuid, primary key) - Unique identifier
  - `email` (text) - Subscriber email
  - `name` (text) - Subscriber name (optional)
  - `is_active` (boolean) - Subscription status
  - `subscribed_at` (timestamptz) - Subscription date

  ### 10. fun_facts
  - `id` (uuid, primary key) - Unique identifier
  - `fact` (text) - Interesting environmental fact
  - `category` (text) - Fact category
  - `source` (text) - Fact source (optional)
  - `created_at` (timestamptz) - Creation timestamp

  ### 11. ai_chat_logs
  - `id` (uuid, primary key) - Unique identifier
  - `session_id` (text) - Chat session identifier
  - `user_message` (text) - User's question
  - `ai_response` (text) - AI's response
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for published content
  - Restricted write access (future: add authentication for admin users)

  ## Indexes
  - Index on article slugs for fast lookups
  - Index on category relationships
  - Index on timestamps for sorting
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  image_url text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  author text DEFAULT 'Equipe EcoVibe',
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
  user_name text NOT NULL,
  user_email text NOT NULL,
  content text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Tips table
CREATE TABLE IF NOT EXISTS tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  difficulty text DEFAULT 'Easy',
  impact_level text DEFAULT 'Medium',
  like_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Educational content table
CREATE TABLE IF NOT EXISTS educational_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL,
  target_audience text NOT NULL,
  file_url text,
  thumbnail_url text,
  created_at timestamptz DEFAULT now()
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  educational_content_id uuid REFERENCES educational_content(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  explanation text,
  created_at timestamptz DEFAULT now()
);

-- Forum posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  user_email text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  like_count integer DEFAULT 0,
  reply_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Forum replies table
CREATE TABLE IF NOT EXISTS forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_name text NOT NULL,
  user_email text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  is_active boolean DEFAULT true,
  subscribed_at timestamptz DEFAULT now()
);

-- Fun facts table
CREATE TABLE IF NOT EXISTS fun_facts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fact text NOT NULL,
  category text,
  source text,
  created_at timestamptz DEFAULT now()
);

-- AI chat logs table
CREATE TABLE IF NOT EXISTS ai_chat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_message text NOT NULL,
  ai_response text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post ON forum_replies(post_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE fun_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public read access for published content

-- Categories: Everyone can read
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Articles: Everyone can read published articles
CREATE POLICY "Anyone can view published articles"
  ON articles FOR SELECT
  TO anon, authenticated
  USING (published_at <= now());

-- Comments: Everyone can read approved comments
CREATE POLICY "Anyone can view approved comments"
  ON comments FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

-- Comments: Anyone can insert comments (will need approval)
CREATE POLICY "Anyone can submit comments"
  ON comments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Tips: Everyone can read
CREATE POLICY "Anyone can view tips"
  ON tips FOR SELECT
  TO anon, authenticated
  USING (true);

-- Educational content: Everyone can read
CREATE POLICY "Anyone can view educational content"
  ON educational_content FOR SELECT
  TO anon, authenticated
  USING (true);

-- Quiz questions: Everyone can read
CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions FOR SELECT
  TO anon, authenticated
  USING (true);

-- Forum posts: Everyone can read and create
CREATE POLICY "Anyone can view forum posts"
  ON forum_posts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create forum posts"
  ON forum_posts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Forum replies: Everyone can read and create
CREATE POLICY "Anyone can view forum replies"
  ON forum_replies FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create forum replies"
  ON forum_replies FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Newsletter: Anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Fun facts: Everyone can read
CREATE POLICY "Anyone can view fun facts"
  ON fun_facts FOR SELECT
  TO anon, authenticated
  USING (true);

-- AI chat logs: Anyone can insert
CREATE POLICY "Anyone can log AI chats"
  ON ai_chat_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Insert sample data

-- Categories
INSERT INTO categories (name, slug, description) VALUES
  ('Mudanças Climáticas', 'mudancas-climaticas', 'Notícias e informações sobre o aquecimento global e mudanças climáticas'),
  ('Reciclagem', 'reciclagem', 'Dicas e práticas de reciclagem e economia circular'),
  ('Preservação', 'preservacao', 'Conservação da biodiversidade e áreas naturais'),
  ('Energia Sustentável', 'energia-sustentavel', 'Energias renováveis e eficiência energética')
ON CONFLICT (slug) DO NOTHING;

-- Fun Facts
INSERT INTO fun_facts (fact, category) VALUES
  ('Uma única árvore pode absorver até 22 kg de CO2 por ano, ajudando a combater as mudanças climáticas.', 'clima'),
  ('O plástico leva cerca de 450 anos para se degradar completamente no meio ambiente.', 'reciclagem'),
  ('A Amazôniaaaa produz 20% do oxigênio do planeta e abriga 10% de todas as espécies conhecidas.', 'biodiversidade'),
  ('Fechar a torneira enquanto escova os dentes pode economizar até 12 litros de água por escovação.', 'água'),
  ('Painéis solares podem gerar energia por mais de 25 anos com manutenção mínima.', 'energia'),
  ('Reciclar uma lata de alumínio economiza energia suficiente para alimentar uma TV por 3 horas.', 'reciclagem')
ON CONFLICT DO NOTHING;