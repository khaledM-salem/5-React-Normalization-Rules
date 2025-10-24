
## ⚖️ 5RNF vs Redux

| Concept | Redux | 5RNF |
|----------|--------|------|
| **State Shape** | Single global store | Multiple small stores / hooks |
| **Normalization** | Developer-defined | Inherent principle (Rule 4RNF) |
| **Boilerplate** | High (actions, reducers) | Minimal (hooks & Zustand) |
| **Reactivity** | Requires selectors | Direct reactive hooks |
| **Learning Curve** | Steeper | Easier for modern React devs |

### 🔍 Integration
The 5RNF approach can **coexist** with Redux. Use 5RNF logic inside slices to enforce better data shape discipline.

### Example: Redux Slice (4RNF Applied)
```ts
const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: {},
    authors: {},
  },
  reducers: {
    addPost(state, action) {
      const post = action.payload;
      state.posts[post.id] = post;
      if (post.author) state.authors[post.author.id] = post.author;
    }
  }
});
```