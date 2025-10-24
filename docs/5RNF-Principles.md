## ⚛️ The 5 React Normalization Rules (5RNF)

The **5RNF Framework**, authored by **Khaled Salem**, adapts the relational database normalization theory (1NF–5NF) into **React state architecture**.

### 1RNF – Atomic State
- Each state variable should store only one logical piece of data.
- Avoid nested or composite objects.
- Encourages **primitive or simple structures** like strings, numbers, and minimal objects.

### 2RNF – Single Responsibility
- Each state should have a **single reason to change**.
- Derived or computed state (e.g., `fullName`) should be memoized via hooks like `useMemo`.

### 3RNF – No Transitive Dependencies
- Prevent **dependent states** that can fall out of sync.
- Instead, compute derived data on the fly from source states.

### 4RNF – Normalized Collections
- Store collections by ID (object maps) instead of nested arrays.
- Keeps entity relationships consistent and eliminates duplication.

### 5RNF – Context Separation
- Divide stores by domain (e.g., `AuthStore`, `UIStore`, `PostsStore`).
- Reduces re-renders and improves modularity.

### 🧩 Benefits
✅ Predictable updates  
✅ Scalable architecture  
✅ Cleaner codebase  
✅ Works seamlessly with Zustand, Redux, React Query, etc.
