
## 💡 Why Normalize React State?

React components often suffer from:
- **Deeply nested state objects** that trigger unnecessary re-renders.
- **Redundant derived values** (duplicating `cartTotal`, `fullName`, etc.).
- **Monolithic context providers** that slow performance.

### 🔍 Normalization Solves:
- Prevents **data duplication**.
- Simplifies **state updates** and **memoization**.
- Encourages a **relational data model** — like database tables.

### 💪 Example
```tsx
// ❌ Bad
const [posts, setPosts] = useState([
  { id: 1, author: { id: 1, name: 'John' } },
  { id: 2, author: { id: 1, name: 'John' } }
]);

// ✅ Good
const [posts, setPosts] = useState({ 1: { id: 1, authorId: 1 } });
const [authors, setAuthors] = useSt