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

### Using the Normalization Utilities

```typescript
import { normalize, denormalize, extractEntities } from '5-react-normalization-rules';

// Normalize an array
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
];
const normalized = normalize(users);
// { 1: { id: 1, name: 'John' }, 2: { id: 2, name: 'Jane' } }

// Extract nested entities
const posts = [
  { id: 1, title: 'Post 1', author: { id: 10, name: 'John' } },
  { id: 2, title: 'Post 2', author: { id: 10, name: 'John' } }
];
const { items, entities } = extractEntities(posts, 'author');
// items: { 1: { id: 1, title: 'Post 1', authorId: 10 }, ... }
// entities: { 10: { id: 10, name: 'John' } }
```

### Using the Normalized State Hook

```typescript
import { useNormalizedState } from '5-react-normalization-rules';

function UsersList() {
  const {
    getAllEntities,
    addEntity,
    updateEntity,
    removeEntity
  } = useNormalizedState<User>({});

  const handleAddUser = () => {
    addEntity({ id: Date.now(), name: 'New User' });
  };

  return (
    <div>
      {getAllEntities.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Using Separated Stores (Zustand)

```typescript
import { useAuthStore, usePostsStore, useUIStore } from '5-react-normalization-rules';

function MyComponent() {
  const user = useAuthStore(state => state.user);
  const posts = usePostsStore(state => state.posts);
  const theme = useUIStore(state => state.theme);
  
  // Each store manages its own domain
}
```

## 🎨 Examples

Check out the `/examples` folder for complete working examples:
- `1RNF-AtomicState.ts` - Breaking down complex state
- `2RNF-SingleResponsibility.ts` - Computing derived state
- `3RNF-NoTransitiveDependencies.ts` - Shopping cart example
- `4RNF-NormalizedCollections.ts` - Posts and authors normalization
- `5RNF-ContextSeparation.ts` - Multiple Zustand stores

## ✨ Benefits

✅ **Better Performance** - Minimize re-renders with atomic updates  
✅ **Easier Debugging** - Clear state structure and data flow  
✅ **Cleaner Code** - Follows proven architectural patterns  
✅ **Team-Friendly** - Easy to understand and maintain  
✅ **Scalable** - Grows with your application needs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © Khaled Salem

## 🙋 Author

**Khaled Salem** - React Architecture Innovator

- 📦 NPM: [@khaledsalem](https://www.npmjs.com/~khaledsalem) *(replace with your NPM username)*
- 🐙 GitHub: [@khaledsalem](https://github.com/khaledsalem) *(replace with your GitHub username)*
- 🐦 Twitter: [@khaledsalem](https://twitter.com/khaledsalem) *(replace with your Twitter username)*

## 🌟 Show Your Support

If you find this project useful, please consider:
- ⭐ Starring the [GitHub repository](https://github.com/YOUR_USERNAME/5-react-normalization-rules)
- 📦 Sharing on [Twitter](https://twitter.com/intent/tweet?text=Check%20out%205%20React%20Normalization%20Rules%20-%20Database%20normalization%20principles%20for%20React%20state!&url=https://www.npmjs.com/package/5-react-normalization-rules)
- 💬 Spreading the word in your team/community

---

⭐ If you find this useful, please consider giving it a star on GitHub!