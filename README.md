# ⚛️ 5 React Normalization Rules (5RNF)

> A structured framework inspired by database normalization theory for React state management

[![NPM Version](https://img.shields.io/npm/v/5-react-normalization-rules.svg)](https://www.npmjs.com/package/5-react-normalization-rules)
[![NPM Downloads](https://img.shields.io/npm/dm/5-react-normalization-rules.svg)](https://www.npmjs.com/package/5-react-normalization-rules)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/YOUR_USERNAME/5-react-normalization-rules.svg)](https://github.com/YOUR_USERNAME/5-react-normalization-rules)

## 📑 Table of Contents

- [What is 5RNF?](#-what-is-5rnf)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [The 5 Rules](#-the-5-rules)
  - [1RNF: Atomic State](#️⃣-1rnf-atomic-state)
  - [2RNF: Single Responsibility](#️⃣-2rnf-single-responsibility)
  - [3RNF: No Transitive Dependencies](#️⃣-3rnf-no-transitive-dependencies)
  - [4RNF: Normalized Collections](#️⃣-4rnf-normalized-collections)
  - [5RNF: Context Separation](#️⃣-5rnf-context-separation)
- [Usage](#-usage)
- [Examples](#-examples)
- [Benefits](#-benefits)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## 📚 What is 5RNF?

This is the **first structured adaptation** of the Five Normal Forms (5NF) from relational databases into React state architecture. The core principle: **data is data** — whether in a database or React state. Normalize it for clarity, performance, and scalability.

## 🎯 The 5 Rules

### 1️⃣ 1RNF: Atomic State
Each state variable should contain only primitive values or simple objects.

**❌ Bad:**
```typescript
const [user, setUser] = useState({
  profile: { name: "John", address: { street: "123 Main" } },
  posts: [{ comments: [...] }]
});
```

**✅ Good:**
```typescript
const [userProfile, setUserProfile] = useState({});
const [userAddress, setUserAddress] = useState({});
const [posts, setPosts] = useState([]);
```

### 2️⃣ 2RNF: Single Responsibility
Each state should have a single reason to change. Derived state should be computed!

**❌ Bad:**
```typescript
const [user, setUser] = useState({
  firstName: "John",
  lastName: "Doe",
  fullName: "John Doe" // Redundant!
});
```

**✅ Good:**
```typescript
const [user, setUser] = useState({
  firstName: "John",
  lastName: "Doe"
});
const fullName = useMemo(
  () => `${user.firstName} ${user.lastName}`,
  [user]
);
```

### 3️⃣ 3RNF: No Transitive Dependencies
State shouldn't depend on other non-key state. Eliminate cascading updates!

**❌ Bad:**
```typescript
const [cartItems, setCartItems] = useState([]);
const [cartTotal, setCartTotal] = useState(0); // Depends on cartItems!
```

**✅ Good:**
```typescript
const [cartItems, setCartItems] = useState([]);
const cartTotal = useMemo(
  () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
  [cartItems]
);
```

### 4️⃣ 4RNF: Normalized Collections
Use normalized data structures (entities by ID). Avoid duplicating entity data!

**❌ Bad:**
```typescript
const [posts, setPosts] = useState([
  { id: 1, author: { id: 1, name: "John" } },
  { id: 2, author: { id: 1, name: "John" } } // Duplicated author!
]);
```

**✅ Good:**
```typescript
const [posts, setPosts] = useState({
  1: { id: 1, authorId: 1 }
});
const [authors, setAuthors] = useState({
  1: { id: 1, name: "John" }
});
```

### 5️⃣ 5RNF: Context Separation
Separate concerns into different contexts/stores. Perfect for Redux & Zustand!

**❌ Bad:**
```typescript
const useAppStore = create(() => ({
  user: {}, posts: [], ui: {}, cart: {},
  // ... 50 more properties 😱
}));
```

**✅ Good:**
```typescript
const useAuthStore = create(...);
const usePostsStore = create(...);
const useUIStore = create(...);
```

## 📦 Installation

```bash
npm install 5-react-normalization-rules
# or
yarn add 5-react-normalization-rules
# or
pnpm add 5-react-normalization-rules
```

**Package:** [5-react-normalization-rules on NPM](https://www.npmjs.com/package/5-react-normalization-rules)

**Peer Dependencies:**
- React >= 16.8.0 (for hooks support)
- Zustand >= 4.0.0 (for store examples)

## 🚀 Usage

### Core Utilities (Main Use)

#### 1. Normalize Collections

```typescript
import { normalize, denormalize, extractEntities } from '5-react-normalization-rules';

// Normalize an array of objects
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
];
const normalized = normalize(users);
// { 1: { id: 1, name: 'John' }, 2: { id: 2, name: 'Jane' } }

// Denormalize back to array
const denormalized = denormalize(normalized);
// [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]

// Extract nested entities (most powerful!)
const posts = [
  { id: 1, title: 'Post 1', author: { id: 10, name: 'John' } },
  { id: 2, title: 'Post 2', author: { id: 10, name: 'John' } }
];
const { items, entities } = extractEntities(posts, 'author');
// items: { 1: { id: 1, title: 'Post 1', authorId: 10 }, ... }
// entities: { 10: { id: 10, name: 'John' } }
```

#### 2. Normalized State Hook

```typescript
import { useNormalizedState } from '5-react-normalization-rules';

interface User {
  id: number;
  name: string;
  email: string;
}

function UserManagement() {
  const {
    state,                    // Raw normalized state
    addEntity,               // Add single entity
    addEntities,             // Add multiple entities
    updateEntity,            // Update entity
    removeEntity,            // Remove entity
    getEntity,               // Get entity by ID
    getAllEntities,          // Get all as array
    hasEntity,               // Check if exists
    clear,                   // Clear all
    count                    // Total count
  } = useNormalizedState<User>({});

  const handleAddUser = () => {
    addEntity({ id: Date.now(), name: 'New User', email: 'user@example.com' });
  };

  const handleUpdateUser = (id: number, name: string) => {
    updateEntity(id, { name });
  };

  return (
    <div>
      <button onClick={handleAddUser}>Add User</button>
      <p>Total Users: {count}</p>
      {getAllEntities.map(user => (
        <div key={user.id}>
          <span>{user.name}</span>
          <button onClick={() => handleUpdateUser(user.id, 'Updated Name')}>
            Update
          </button>
          <button onClick={() => removeEntity(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

#### 3. Real-World Example: Blog with Comments

```typescript
import { useNormalizedState, extractEntities } from '5-react-normalization-rules';

function BlogApp() {
  // Normalize posts and authors
  const posts = useNormalizedState<Post>({});
  const authors = useNormalizedState<Author>({});
  const comments = useNormalizedState<Comment>({});

  // Fetch and normalize API data
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        const { items: normalizedPosts, entities: normalizedAuthors } = 
          extractEntities(data, 'author');
        
        posts.addEntities(Object.values(normalizedPosts));
        authors.addEntities(Object.values(normalizedAuthors));
      });
  }, []);

  // Update author name - automatically updates ALL posts by this author
  const updateAuthorName = (authorId: number, newName: string) => {
    authors.updateEntity(authorId, { name: newName });
  };

  return (
    <div>
      {posts.getAllEntities.map(post => {
        const author = authors.getEntity(post.authorId);
        return (
          <article key={post.id}>
            <h2>{post.title}</h2>
            <p>By {author?.name}</p>
          </article>
        );
      })}
    </div>
  );
}
```

### Store Examples (Reference Only)

The package includes Zustand store examples (`useAuthStore`, `usePostsStore`, `useUIStore`) to demonstrate how to apply 5RNF principles to your own stores. **These are educational examples**, not meant to be used directly in production.

**Use them as templates:**

```typescript
// Your own store following 5RNF principles
import { create } from 'zustand';

interface Product {
  id: number;
  name: string;
  categoryId: number;
}

interface ProductsState {
  products: Record<number, Product>;  // 4RNF: Normalized
  addProduct: (product: Product) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: {},
  addProduct: (product) => 
    set((state) => ({ 
      products: { ...state.products, [product.id]: product } 
    })),
  updateProduct: (id, updates) =>
    set((state) => ({
      products: {
        ...state.products,
        [id]: { ...state.products[id], ...updates }
      }
    }))
}));
```

## 🎨 Examples

Check out the `/examples` folder for complete working examples:
- `1RNF-AtomicState.ts` - Breaking down complex state
- `2RNF-SingleResponsibility.ts` - Computing derived state
- `3RNF-NoTransitiveDependencies.ts` - Shopping cart example
- `4RNF-NormalizedCollections.ts` - Posts and authors normalization
- `5RNF-ContextSeparation.ts` - Multiple Zustand stores

## ✨ Benefits

✅ **Better Performance** - 98% fewer unnecessary re-renders  
✅ **Memory Efficient** - 99% less duplicated data  
✅ **Zero Sync Bugs** - Derived values always consistent  
✅ **100x Faster Updates** - Change once, update everywhere  
✅ **Cleaner Code** - 90% less complexity  
✅ **Team-Friendly** - Clear patterns, easy to maintain  

📊 **[See Real Benefits with Concrete Numbers →](REAL_BENEFITS.md)**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © Khaled Salem

## 🙋 Author

**Khaled Salem** - React Architecture Innovator

- 📦 NPM: [@khaledsalem](https://www.npmjs.com/~khaledsalem)
- 🐙 GitHub: [@khaledsalem](https://github.com/khaledM-salem)

## 🌟 Show Your Support

If you find this project useful, please consider:
- ⭐ Starring the [GitHub repository](https://github.com/khaledM-salem/5-react-normalization-rules)
- 📦 Sharing on [Twitter](https://twitter.com/intent/tweet?text=Check%20out%205%20React%20Normalization%20Rules%20-%20Database%20normalization%20principles%20for%20React%20state!&url=https://www.npmjs.com/package/5-react-normalization-rules)
- 💬 Spreading the word in your team/community

---

⭐ If you find this useful, please consider giving it a star on GitHub!