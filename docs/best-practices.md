# Best Practices

- Prefer hooks and context over props when data is already available. For instance, use the `useAuth` hook to get the user ID instead of passing `session` as a prop.
- Don't remove existing comments unless explicitly asked.
- Don't add meaningless try-catch blocks that silently fail.
