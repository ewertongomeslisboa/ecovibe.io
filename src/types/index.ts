export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  category_id?: string;
  author: string;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  published_at: string;
  created_at: string;
  updated_at: string;
  categories?: Category;
}

export interface Comment {
  id: string;
  article_id: string;
  user_name: string;
  user_email: string;
  content: string;
  is_approved: boolean;
  created_at: string;
}

export interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: string;
  impact_level: string;
  like_count: number;
  created_at: string;
}

export interface EducationalContent {
  id: string;
  title: string;
  content: string;
  type: string;
  target_audience: string;
  file_url?: string;
  thumbnail_url?: string;
  created_at: string;
}

export interface FunFact {
  id: string;
  fact: string;
  category?: string;
  source?: string;
  created_at: string;
}

export interface ForumPost {
  id: string;
  user_name: string;
  user_email: string;
  title: string;
  content: string;
  category: string;
  like_count: number;
  reply_count: number;
  created_at: string;
}

export interface ForumReply {
  id: string;
  post_id: string;
  user_name: string;
  user_email: string;
  content: string;
  created_at: string;
}

export type PageType = 'home' | 'news' | 'tips' | 'education' | 'ai' | 'about';
