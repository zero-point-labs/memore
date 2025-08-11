import { ID, Query, Models } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { BlogPost, BlogDocument, CreateBlogData, UpdateBlogData } from '@/types/blog';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'blogs';

export class BlogService {
  // Get all blogs with optional filters
  async getBlogs(options?: {
    category?: string;
    published?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<BlogDocument[]> {
    try {
      const queries = [];
      
      if (options?.category && options.category !== 'all') {
        queries.push(Query.equal('category', options.category));
      }
      
      if (options?.published !== undefined) {
        queries.push(Query.equal('published', options.published));
      }
      
      // Order by creation date (newest first)
      queries.push(Query.orderDesc('$createdAt'));
      
      if (options?.limit) {
        queries.push(Query.limit(options.limit));
      }
      
      if (options?.offset) {
        queries.push(Query.offset(options.offset));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        queries
      );

      return response.documents.map((doc: Models.Document): BlogDocument => ({
        ...(doc as unknown as BlogDocument),
        author: JSON.parse((doc as unknown as { author: string }).author),
        tags: JSON.parse((doc as unknown as { tags: string }).tags),
      }));
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  }

  // Get a single blog by ID
  async getBlog(id: string): Promise<BlogDocument | null> {
    try {
      const document = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );

      return {
        ...(document as unknown as BlogDocument),
        author: JSON.parse((document as unknown as { author: string }).author),
        tags: JSON.parse((document as unknown as { tags: string }).tags),
      };
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  }

  // Create a new blog
  async createBlog(data: CreateBlogData): Promise<BlogDocument> {
    try {
      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          ...data,
          author: JSON.stringify(data.author),
          tags: JSON.stringify(data.tags),
          likes: 0,
          comments: 0,
          trending: data.trending || false,
          published: data.published || true,
        }
      );

      return {
        ...(document as unknown as BlogDocument),
        author: JSON.parse((document as unknown as { author: string }).author),
        tags: JSON.parse((document as unknown as { tags: string }).tags),
      };
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  }

  // Update a blog
  async updateBlog(id: string, data: UpdateBlogData): Promise<BlogDocument> {
    try {
      const updateData: Record<string, unknown> = { ...data };
      
      if (data.author) {
        updateData.author = JSON.stringify(data.author);
      }
      
      if (data.tags) {
        updateData.tags = JSON.stringify(data.tags);
      }

      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        updateData
      );

      return {
        ...(document as unknown as BlogDocument),
        author: JSON.parse((document as unknown as { author: string }).author),
        tags: JSON.parse((document as unknown as { tags: string }).tags),
      };
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  }

  // Delete a blog
  async deleteBlog(id: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  }

  // Update blog engagement (likes/comments)
  async updateEngagement(id: string, likes?: number, comments?: number): Promise<BlogDocument> {
    try {
      const updateData: Record<string, number> = {};
      
      if (likes !== undefined) {
        updateData.likes = likes;
      }
      
      if (comments !== undefined) {
        updateData.comments = comments;
      }

      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        updateData
      );

      return {
        ...(document as unknown as BlogDocument),
        author: JSON.parse((document as unknown as { author: string }).author),
        tags: JSON.parse((document as unknown as { tags: string }).tags),
      };
    } catch (error) {
      console.error('Error updating engagement:', error);
      throw error;
    }
  }

  // Toggle trending status
  async toggleTrending(id: string, trending: boolean): Promise<BlogDocument> {
    try {
      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        { trending }
      );

      return {
        ...(document as unknown as BlogDocument),
        author: JSON.parse((document as unknown as { author: string }).author),
        tags: JSON.parse((document as unknown as { tags: string }).tags),
      };
    } catch (error) {
      console.error('Error toggling trending:', error);
      throw error;
    }
  }

  // Toggle publish status
  async togglePublished(id: string, published: boolean): Promise<BlogDocument> {
    try {
      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        { published }
      );

      return {
        ...(document as unknown as BlogDocument),
        author: JSON.parse((document as unknown as { author: string }).author),
        tags: JSON.parse((document as unknown as { tags: string }).tags),
      };
    } catch (error) {
      console.error('Error toggling published status:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const blogService = new BlogService();