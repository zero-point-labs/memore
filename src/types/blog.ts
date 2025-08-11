import { Models } from 'appwrite';

export interface Author {
  name: string;
  avatar: string;
  role: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  category: 'tips' | 'experiences' | 'guides' | 'nightlife';
  author: Author;
  image: string;
  tags: string[];
  likes: number;
  comments: number;
  trending: boolean;
  readTime: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type BlogDocument = Models.Document & BlogPost;

export interface CreateBlogData {
  title: string;
  content: string;
  excerpt: string;
  category: 'tips' | 'experiences' | 'guides' | 'nightlife';
  author: Author;
  image: string;
  tags: string[];
  trending?: boolean;
  readTime: number;
  published?: boolean;
}

export type UpdateBlogData = Partial<CreateBlogData>;

export const BLOG_CATEGORIES = [
  { id: 'tips', label: 'Travel Tips', icon: '💡', color: 'from-blue-600 to-cyan-600' },
  { id: 'experiences', label: 'Experiences', icon: '🌟', color: 'from-yellow-600 to-orange-600' },
  { id: 'guides', label: 'City Guides', icon: '🗺️', color: 'from-green-600 to-emerald-600' },
  { id: 'nightlife', label: 'Nightlife', icon: '🎊', color: 'from-pink-600 to-rose-600' },
] as const;

export const AUTHORS = [
  { name: 'Lora AI', avatar: '🤖', role: 'Trip Planner' },
  { name: 'Alex Chen', avatar: '👨', role: 'Adventure Guide' },
  { name: 'Sofia Kyriakou', avatar: '👩', role: 'Local Expert' },
  { name: 'Marcus Johnson', avatar: '👱', role: 'Party Coordinator' },
] as const;