# Examples - 5 React Normalization Rules

This folder contains practical examples demonstrating each of the 5 React Normalization Rules.

## 🚀 Running the Examples

### Option 1: Run the Interactive Demo App

```bash
cd examples
npm install
npm run dev
```

This will start a development server with an interactive demo showcasing all 5 rules.

### Option 2: Import Individual Examples

```typescript
import { GoodUserProfile } from './examples/1RNF-AtomicState';
import { GoodUserCard } from './examples/2RNF-SingleResponsibility';
// ... etc
```

## 📁 File Structure

```
examples/
├── 1RNF-AtomicState.tsx           # Rule 1: Break down nested state
├── 2RNF-SingleResponsibility.tsx  # Rule 2: Compute derived state
├── 3RNF-NoTransitiveDependencies.tsx # Rule 3: Eliminate cascading updates
├── 4RNF-NormalizedCollections.tsx # Rule 4: Normalize data by ID
├── 5RNF-ContextSeparation.tsx     # Rule 5: Separate stores/contexts
├── DemoApp.tsx                    # Interactive demo app
├── index.ts                       # Exports
├── package.json                   # Dependencies
└── README.md                      # This file
```

## 📚 Examples Overview

### 1️⃣ 1RNF: Atomic State

**File:** `1RNF-AtomicState.tsx`

**What it demonstrates:**
- ❌ Bad: Deeply nested state that's hard to update
- ✅ Good: Flat, independent state variables

**Key Components:**
- `BadUserProfile` - Shows the pain of nested state
- `GoodUserProfile` - Shows clean atomic state

**Key Takeaway:** Break down complex nested objects into separate, flat state variables.

---

### 2️⃣ 2RNF: Single Responsibility

**File:** `2RNF-SingleResponsibility.tsx`

**What it demonstrates:**
- ❌ Bad: Storing redundant derived values in state
- ✅ Good: Computing derived values with `useMemo`

**Key Components:**
- `BadUserCard` - Manual syncing of fullName and displayName
- `GoodUserCard` - Automatic computed values
- `ProductCard` - Complex calculations (subtotal, tax, total)

**Key Takeaway:** Never store derived data in state - compute it with `useMemo`.

---

### 3️⃣ 3RNF: No Transitive Dependencies

**File:** `3RNF-NoTransitiveDependencies.tsx`

**What it demonstrates:**
- ❌ Bad: State that depends on other state, requiring `useEffect` to sync
- ✅ Good: Computing dependent values instead of storing them

**Key Components:**
- `BadShoppingCart` - Multiple `useEffect` to keep state in sync
- `GoodShoppingCart` - Clean computed values

**Key Takeaway:** If state B depends on state A, compute B instead of storing it.

---

### 4️⃣ 4RNF: Normalized Collections

**File:** `4RNF-NormalizedCollections.tsx`

**What it demonstrates:**
- ❌ Bad: Duplicating entity data across collections
- ✅ Good: Normalizing entities by ID

**Key Components:**
- `BadBlogPosts` - Author data duplicated in every post
- `GoodBlogPosts` - Separate posts and authors objects
- `BlogPostsWithUtility` - Using the `normalize` utility
- `BlogPostsWithHook` - Using the `useNormalizedState` hook

**Key Takeaway:** Store entities in key-value maps indexed by ID, use references instead of embedding.

---

### 5️⃣ 5RNF: Context Separation

**File:** `5RNF-ContextSeparation.tsx`

**What it demonstrates:**
- ❌ Bad: Monolithic store with all app state
- ✅ Good: Separate stores by domain (auth, ui, posts, cart)

**Key Components:**
- `useBadAppStore` - One giant store
- `useAuthStore`, `usePostsStore`, `useUIStore`, `useCartStore` - Separated stores
- `BadComponent` - Re-renders on any state change
- `GoodComponent` - Only subscribes to needed stores

**Key Takeaway:** Split state into separate contexts/stores by domain for better performance and maintainability.

---

## 🎯 Common Patterns Demonstrated

### Pattern 1: Converting API Response to Normalized State

```typescript
// API returns nested data
const apiResponse = [
  { id: 1, title: 'Post 1', author: { id: 10, name: 'John' } },
  { id: 2, title: 'Post 2', author: { id: 10, name: 'John' } }
];

// Normalize it
const { items, entities } = extractEntities(apiResponse, 'author');

// Now you have:
// items: { 1: { id: 1, title: 'Post 1', authorId: 10 }, ... }
// entities: { 10: { id: 10, name: 'John' } }
```

### Pattern 2: Working with Normalized State

```typescript
const { 
  addEntity, 
  updateEntity, 
  removeEntity, 
  getEntity, 
  getAllEntities 
} = useNormalizedState<User>({});

// Add
addEntity({ id: 1, name: 'John' });

// Update
updateEntity(1, { name: 'John Doe' });

// Get
const user = getEntity(1);

// Get all
const users = getAllEntities; // Array of all users
```

### Pattern 3: Computing Derived State

```typescript
// Source state
const [items, setItems] = useState([...]);

// Derived state (always in sync)
const total = useMemo(
  () => items.reduce((sum, item) => sum + item.price, 0),
  [items]
);

const hasDiscount = useMemo(
  () => total > 100,
  [total]
);
```

### Pattern 4: Separated Zustand Stores

```typescript
// Each domain gets its own store
const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user })
}));

const useUIStore = create((set) => ({
  theme: 'light',
  toggleTheme: () => set(state => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  }))
}));

// Use in component - only subscribes to what you need
function MyComponent() {
  const user = useAuthStore(state => state.user);
  const theme = useUIStore(state => state.theme);
  // Component only re-renders when user or theme changes
}
```

## 🎨 Interactive Demo App

The `DemoApp.tsx` provides a fully interactive demonstration of all 5 rules:

- **Tabbed Interface:** Switch between each rule
- **Live Examples:** See working code in action
- **Visual Comparisons:** Bad vs Good patterns side-by-side
- **Benefits Breakdown:** Clear explanation of why each pattern matters

### Running the Demo:

```bash
# In the examples folder
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## 💡 Tips for Learning

1. **Start with 1RNF and 2RNF** - These are the foundation
2. **Practice 4RNF** - This is where most apps struggle
3. **Use 5RNF for larger apps** - Don't over-engineer small apps
4. **Combine the rules** - They work together, not in isolation

## 🤔 When to Use Each Rule

### 1RNF: Atomic State
- ✅ Always! This should be your default
- Especially important for forms and complex UI

### 2RNF: Single Responsibility
- ✅ Always! Never store derived state
- Use `useMemo` for calculations
- Use computed properties for display values

### 3RNF: No Transitive Dependencies
- ✅ When you find yourself using `useEffect` to sync state
- Shopping carts, pricing calculations, filters

### 4RNF: Normalized Collections
- ✅ Lists with relationships (posts + authors, orders + products)
- When you're duplicating data
- When updating one entity should update all references

### 5RNF: Context Separation
- ✅ Medium to large apps
- When you have 5+ pieces of global state
- When different teams own different domains

## 📖 Further Reading

- [Main README](../README.md) - Full documentation
- [Source Code](../src) - Library implementation
- [Anthropic's Docs](https://docs.claude.com) - More React patterns

## 🙋 Questions?

Found a bug or have a question? Open an issue on GitHub!