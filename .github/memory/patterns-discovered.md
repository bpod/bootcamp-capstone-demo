# Patterns Discovered

## Purpose
This file documents recurring code patterns, anti-patterns, and project-specific conventions discovered during development. Each pattern includes context, the problem it solves, the solution, and examples from the codebase.

**This file is committed to git** and grows as patterns emerge during development.

---

## Pattern Template

Copy this template when documenting a new pattern:

```markdown
## Pattern: [Pattern Name]

**Context**: When and where this pattern applies (specific situations, file types, components)

**Problem**: What problem this pattern solves or what issue it prevents

**Solution**: How to implement the pattern (high-level approach)

**Example**: 
\```javascript
// Code snippet demonstrating the pattern
\```

**Anti-Pattern** (if applicable):
\```javascript
// Code snippet showing what NOT to do
\```

**Related Files**: 
- [file-path.js](../path/to/file.js#L10-L20) (lines 10-20)

**Performance Impact** (if applicable): Quantified improvement or overhead

**When to Use**: Specific conditions or triggers for applying this pattern

**When to Avoid**: Cases where this pattern doesn't apply
```

---

## Example Pattern

## Pattern: Service State Initialization

**Context**: Initializing state for data fetched from services/APIs in React components, particularly when using `.map()`, `.filter()`, or other array methods.

**Problem**: Initializing service state with `null` or `undefined` causes runtime errors when array methods are called before data loads. This creates defensive coding burden and inconsistent handling across components.

**Solution**: Initialize service state with an empty array `[]` for collections or empty object `{}` for single entities. This allows array methods to work immediately (returning empty results) and provides consistent behavior during loading states.

**Example**:
```javascript
// ✅ Good: Initialize with empty array
const [users, setUsers] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  fetchUsers().then(data => {
    setUsers(data);
    setIsLoading(false);
  });
}, []);

// No defensive checks needed - .map() works on empty array
return (
  <div>
    {isLoading && <LoadingSpinner />}
    {users.map(user => <UserCard key={user.id} user={user} />)}
  </div>
);
```

**Anti-Pattern**:
```javascript
// ❌ Bad: Initialize with null
const [users, setUsers] = useState(null);

// Requires defensive checks everywhere
return (
  <div>
    {users && users.map(user => <UserCard key={user.id} user={user} />)}
    {/* or */}
    {users?.map(user => <UserCard key={user.id} user={user} />)}
  </div>
);
```

**Related Files**: 
- [src/components/UserDashboard.jsx](../../src/components/UserDashboard.jsx) (example implementation)
- [src/components/ProductList.jsx](../../src/components/ProductList.jsx) (example implementation)

**Performance Impact**: Negligible - empty array allocation is ~8 bytes. Benefit is cleaner code and fewer null checks.

**When to Use**: 
- Any state representing a collection/array from an API
- State used with `.map()`, `.filter()`, `.reduce()`, etc.
- Data that loads asynchronously

**When to Avoid**: 
- Single non-collection values (use null/undefined to distinguish "not loaded" from "loaded but empty")
- When you need to distinguish between "not fetched yet" vs "fetched and empty" (use separate loading state)

---

## [Your Next Pattern]

## Pattern: [Pattern Name]

**Context**: 

**Problem**: 

**Solution**: 

**Example**:
```javascript
// Code snippet
```

**Related Files**: 
- 

**When to Use**: 
-
