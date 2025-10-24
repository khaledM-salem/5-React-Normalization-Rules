import { useState } from 'react';
import { normalize, extractEntities } from '../src/utils/normalize';
import { useNormalizedState } from '../src/hooks/useNormalizedState';

/**
 * 4RNF: Normalized Collections Example
 * Rule: Use normalized data structures (entities by ID). Avoid duplicating entity data!
 */

// ❌ BAD: Duplicated author data
function BadBlogPosts() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'React Tips',
      author: { id: 10, name: 'John Doe', email: 'john@example.com' }
    },
    {
      id: 2,
      title: 'TypeScript Guide',
      author: { id: 10, name: 'John Doe', email: 'john@example.com' } // ❌ Duplicated!
    },
    {
      id: 3,
      title: 'CSS Tricks',
      author: { id: 11, name: 'Jane Smith', email: 'jane@example.com' }
    }
  ]);

  // Updating author name requires updating ALL posts
  const updateAuthorName = (authorId: number, newName: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.author.id === authorId
          ? { ...post, author: { ...post.author, name: newName } }
          : post
      )
    );
  };

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>By {post.author.name}</p>
        </div>
      ))}
    </div>
  );
}

// ✅ GOOD: Normalized structure
function GoodBlogPosts() {
  interface Post {
    id: number;
    title: string;
    authorId: number;
  }

  interface Author {
    id: number;
    name: string;
    email: string;
  }

  const [posts, setPosts] = useState<Record<number, Post>>({
    1: { id: 1, title: 'React Tips', authorId: 10 },
    2: { id: 2, title: 'TypeScript Guide', authorId: 10 },
    3: { id: 3, title: 'CSS Tricks', authorId: 11 }
  });

  const [authors, setAuthors] = useState<Record<number, Author>>({
    10: { id: 10, name: 'John Doe', email: 'john@example.com' },
    11: { id: 11, name: 'Jane Smith', email: 'jane@example.com' }
  });

  // Updating author name is simple - update once
  const updateAuthorName = (authorId: number, newName: string) => {
    setAuthors(prev => ({
      ...prev,
      [authorId]: { ...prev[authorId], name: newName }
    }));
  };

  return (
    <div>
      {Object.values(posts).map(post => {
        const author = authors[post.authorId];
        return (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>By {author.name}</p>
          </div>
        );
      })}
    </div>
  );
}

// ✅ Using the normalize utility
function BlogPostsWithUtility() {
  // Start with API response format
  const apiResponse = [
    {
      id: 1,
      title: 'React Tips',
      author: { id: 10, name: 'John Doe', email: 'john@example.com' }
    },
    {
      id: 2,
      title: 'TypeScript Guide',
      author: { id: 10, name: 'John Doe', email: 'john@example.com' }
    }
  ];

  // Extract and normalize
  const { items: normalizedPosts, entities: normalizedAuthors } = 
    extractEntities(apiResponse, 'author');

  const [posts, setPosts] = useState(normalizedPosts);
  const [authors, setAuthors] = useState(normalizedAuthors);

  return <div>Normalized!</div>;
}

// ✅ Using the hook
function BlogPostsWithHook() {
  const postsState = useNormalizedState<{ id: number; title: string; authorId: number }>({});
  const authorsState = useNormalizedState<{ id: number; name: string; email: string }>({});

  const addPost = (title: string, authorId: number) => {
    postsState.addEntity({
      id: Date.now(),
      title,
      authorId
    });
  };

  const addAuthor = (name: string, email: string) => {
    authorsState.addEntity({
      id: Date.now(),
      name,
      email
    });
  };

  return (
    <div>
      {postsState.getAllEntities.map(post => {
        const author = authorsState.getEntity(post.authorId);
        return (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>By {author?.name}</p>
          </div>
        );
      })}
    </div>
  );
}

export { BadBlogPosts, GoodBlogPosts, BlogPostsWithUtility, BlogPostsWithHook };
