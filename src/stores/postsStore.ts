import { create } from 'zustand';

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId?: number;
  createdAt?: string;
}

export interface PostsState {
  posts: Record<number, Post>;
  addPost: (post: Post) => void;
  updatePost: (id: number, updates: Partial<Post>) => void;
  removePost: (id: number) => void;
  getPost: (id: number) => Post | undefined;
  getAllPosts: () => Post[];
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: {},
  
  addPost: (post) => 
    set((state) => ({ 
      posts: { ...state.posts, [post.id]: post } 
    })),
  
  updatePost: (id, updates) =>
    set((state) => {
      const post = state.posts[id];
      if (!post) return state;
      return {
        posts: {
          ...state.posts,
          [id]: { ...post, ...updates },
        },
      };
    }),
  
  removePost: (id) =>
    set((state) => {
      const newPosts = { ...state.posts };
      delete newPosts[id];
      return { posts: newPosts };
    }),
  
  getPost: (id) => get().posts[id],
  
  getAllPosts: () => Object.values(get().posts),
}));