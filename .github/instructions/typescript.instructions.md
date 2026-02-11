---
description: TypeScript type safety patterns, interfaces, generics, and best practices
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript Instructions

These guidelines apply when writing TypeScript code (.ts/.tsx files). Follow these patterns for type-safe, maintainable, and idiomatic TypeScript.

## Type Safety Fundamentals

### Avoid `any` Type

```typescript
// ❌ Loses all type safety
function processData(data: any) {
  return data.someProperty; // No autocomplete, no safety
}

// ✅ Use specific types
interface UserData {
  id: number;
  name: string;
  email: string;
}

function processData(data: UserData) {
  return data.name; // Type-safe with autocomplete
}

// ✅ Use `unknown` when you truly don't know the type
function processJSON(json: unknown) {
  if (typeof json === "object" && json !== null && "id" in json) {
    // Type guard narrows unknown to object with 'id'
    return json;
  }
  throw new Error("Invalid JSON structure");
}
```

### Strict Null Checks

```typescript
// ❌ Potential runtime error
function getUserName(user: User) {
  return user.name.toUpperCase(); // Error if user.name is null/undefined
}

// ✅ Handle null/undefined explicitly
function getUserName(user: User) {
  return user.name?.toUpperCase() ?? "Unknown";
}

// ✅ Or use type guards
function getUserName(user: User) {
  if (!user.name) {
    return "Unknown";
  }
  return user.name.toUpperCase();
}
```

---

## Interfaces vs Types

### When to Use Each

**Use `interface` for:**

- Object shapes
- Public API contracts
- When you need declaration merging
- Class implementations

**Use `type` for:**

- Unions and intersections
- Mapped types
- Conditional types
- Tuple types
- Function signatures

### Examples

```typescript
// ✅ Interface for object shapes
interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ Type for unions
type Status = "idle" | "loading" | "success" | "error";

// ✅ Type for complex combinations
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string };

// ✅ Interface for class contracts
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: number): Promise<boolean>;
}

// ✅ Type for function signatures
type EventHandler = (event: Event) => void;
type AsyncEventHandler = (event: Event) => Promise<void>;

// ✅ Interface for extensibility
interface BaseUser {
  id: number;
  name: string;
}

interface AdminUser extends BaseUser {
  permissions: string[];
}
```

### Declaration Merging

```typescript
// Interfaces can be merged (useful for extending third-party types)
interface Window {
  myCustomProperty: string;
}

interface Window {
  anotherProperty: number;
}

// Both properties now available on Window
window.myCustomProperty = "value";
window.anotherProperty = 42;
```

---

## Generics

### Basic Generic Functions

```typescript
// ❌ Not type-safe
function getFirstElement(arr: any[]) {
  return arr[0];
}

// ✅ Generic preserves type information
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNumber = getFirstElement([1, 2, 3]); // Type: number | undefined
const firstString = getFirstElement(["a", "b"]); // Type: string | undefined
```

### Generic Constraints

```typescript
// Constrain generic to types with 'length' property
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length);
}

logLength("hello"); // ✅ Strings have length
logLength([1, 2, 3]); // ✅ Arrays have length
logLength({ length: 10 }); // ✅ Objects with length property
// logLength(123); // ❌ Error: number doesn't have length

// Multiple constraints
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}
```

### Generic React Components

```typescript
// Generic component for lists
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// Usage with full type inference
<List
  items={users}
  renderItem={(user) => <span>{user.name}</span>} // user is typed!
  keyExtractor={(user) => user.id}
/>
```

---

## Type Guards and Narrowing

### Built-in Type Guards

```typescript
// typeof guard
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + value; // padding is number here
  }
  return padding + value; // padding is string here
}

// instanceof guard
function handleError(error: Error | string) {
  if (error instanceof Error) {
    console.error(error.message); // error is Error here
  } else {
    console.error(error); // error is string here
  }
}

// in operator guard
interface Cat {
  meow: () => void;
}

interface Dog {
  bark: () => void;
}

function makeSound(animal: Cat | Dog) {
  if ("meow" in animal) {
    animal.meow(); // animal is Cat here
  } else {
    animal.bark(); // animal is Dog here
  }
}
```

### Custom Type Guards

```typescript
// User-defined type guard
interface User {
  id: number;
  name: string;
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    typeof (obj as User).id === "number" &&
    typeof (obj as User).name === "string"
  );
}

// Usage
function processData(data: unknown) {
  if (isUser(data)) {
    console.log(data.name); // data is User here
  }
}
```

### Discriminated Unions

```typescript
// Use discriminated unions for state management
type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function renderState<T>(state: FetchState<T>) {
  // TypeScript narrows based on 'status' field
  switch (state.status) {
    case 'idle':
      return <div>Not started</div>;
    case 'loading':
      return <div>Loading...</div>;
    case 'success':
      return <div>{state.data}</div>; // state.data available here
    case 'error':
      return <div>Error: {state.error}</div>; // state.error available here
  }
}
```

---

## Utility Types

### Common Built-in Utilities

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial - Make all properties optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; password?: string }

// Pick - Select specific properties
type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string }

// Omit - Exclude specific properties
type PublicUser = Omit<User, "password">;
// { id: number; name: string; email: string }

// Required - Make all properties required
type RequiredUser = Required<Partial<User>>;
// All properties become required again

// Readonly - Make all properties read-only
type ImmutableUser = Readonly<User>;
// { readonly id: number; readonly name: string; ... }

// Record - Create object type with specific keys
type UserRoles = Record<"admin" | "user" | "guest", string[]>;
// { admin: string[]; user: string[]; guest: string[] }
```

### Advanced Utility Types

```typescript
// ReturnType - Extract return type of function
function getUser() {
  return { id: 1, name: "Alice" };
}
type User = ReturnType<typeof getUser>;
// { id: number; name: string }

// Parameters - Extract parameter types
function createUser(name: string, age: number) {
  return { name, age };
}
type CreateUserParams = Parameters<typeof createUser>;
// [name: string, age: number]

// Awaited - Extract resolved type of Promise
type AsyncUser = Promise<User>;
type SyncUser = Awaited<AsyncUser>;
// User (not Promise<User>)

// NonNullable - Remove null and undefined
type NullableString = string | null | undefined;
type DefiniteString = NonNullable<NullableString>;
// string
```

---

## React with TypeScript

### Component Props

```typescript
// ✅ Define props interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className={variant}>
      {label}
    </button>
  );
}

// ✅ Props with children
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

### Event Handlers

```typescript
// ✅ Type event handlers correctly
function SearchInput() {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle submit
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event.currentTarget);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
      <button onClick={handleClick}>Search</button>
    </form>
  );
}
```

### Hooks with TypeScript

```typescript
// useState with explicit type
const [user, setUser] = useState<User | null>(null);

// useState with type inference
const [count, setCount] = useState(0); // Type: number (inferred)

// useRef with DOM elements
const inputRef = useRef<HTMLInputElement>(null);

// useRef for mutable values
const intervalRef = useRef<number | null>(null);

// Custom hook with generics
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data: T) => setData(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Usage with type inference
const { data } = useFetch<User[]>("/api/users");
// data is User[] | null
```

---

## Async/Await with TypeScript

### Proper Error Handling

```typescript
// ❌ Unsafe - assumes response is User
async function fetchUser(id: number) {
  const response = await fetch(`/api/users/${id}`);
  return response.json(); // Type: any
}

// ✅ Type-safe with validation
interface User {
  id: number;
  name: string;
  email: string;
}

function isUser(data: unknown): data is User {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "name" in data &&
    "email" in data
  );
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: unknown = await response.json();

  if (!isUser(data)) {
    throw new Error("Invalid user data from API");
  }

  return data; // Type: User (validated)
}

// ✅ With error handling
async function getUserSafely(id: number): Promise<User | null> {
  try {
    return await fetchUser(id);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}
```

---

## Best Practices

### 1. Enable Strict Mode

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### 2. Use Const Assertions

```typescript
// Without const assertion
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};
// Type: { apiUrl: string; timeout: number }

// With const assertion
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
} as const;
// Type: { readonly apiUrl: "https://api.example.com"; readonly timeout: 5000 }

// Useful for literal types
const ROLES = ["admin", "user", "guest"] as const;
type Role = (typeof ROLES)[number]; // 'admin' | 'user' | 'guest'
```

### 3. Avoid Type Assertions Unless Necessary

```typescript
// ❌ Unnecessary type assertion
const name = "Alice" as string;

// ❌ Dangerous type assertion
const user = data as User; // Assumes data is User without validation

// ✅ Use type guards instead
if (isUser(data)) {
  const user = data; // Type narrowed to User
}

// ✅ Type assertion when you know better than TypeScript
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
```

### 4. Prefer Union Types Over Enums

```typescript
// ❌ Enum generates runtime code
enum Status {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
  Error = "error",
}

// ✅ Union type is compile-time only
type Status = "idle" | "loading" | "success" | "error";

// ✅ Or const object with type extraction
const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];
// 'idle' | 'loading' | 'success' | 'error'
```

### 5. Use Discriminated Unions for Complex State

```typescript
// ✅ Discriminated union prevents impossible states
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

// ❌ Avoid separate booleans (allows impossible states)
interface BadRequestState<T> {
  loading: boolean;
  success: boolean;
  error: Error | null;
  data: T | null;
}
// Can be: loading=true, success=true, error=Error (impossible!)
```

### 6. Type Function Return Values

```typescript
// ❌ Implicit return type (can drift)
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Explicit return type (documents intent)
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Especially important for public APIs
export function fetchUsers(): Promise<User[]> {
  return fetch("/api/users").then((res) => res.json());
}
```

---

## Common Patterns

### API Response Types

```typescript
// Generic API response wrapper
interface ApiResponse<T> {
  data: T;
  message: string;
  timestamp: number;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Usage
async function fetchUsers(): Promise<PaginatedResponse<User>> {
  const response = await fetch("/api/users?page=1");
  return response.json();
}
```

### Form Handling

```typescript
// Form data type
interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Form errors type (partial with string values)
type FormErrors<T> = Partial<Record<keyof T, string>>;

// Example usage
const [errors, setErrors] = useState<FormErrors<LoginForm>>({});

function validateForm(values: LoginForm): FormErrors<LoginForm> {
  const errors: FormErrors<LoginForm> = {};

  if (!values.email) {
    errors.email = "Email is required";
  }

  if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
}
```

### Conditional Rendering

```typescript
// Type-safe conditional props
type ButtonProps =
  | { variant: 'link'; href: string; onClick?: never }
  | { variant: 'button'; onClick: () => void; href?: never };

function Button(props: ButtonProps) {
  if (props.variant === 'link') {
    return <a href={props.href}>Link</a>; // href is available
  }
  return <button onClick={props.onClick}>Button</button>; // onClick is available
}

// Usage
<Button variant="link" href="/home" /> // ✅
<Button variant="button" onClick={handleClick} /> // ✅
// <Button variant="link" onClick={handleClick} /> // ❌ Error: onClick not allowed
```

---

## Resources

**Official Documentation:**

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

**Type Safety:**

- Enable `strict: true` in tsconfig.json
- Avoid `any` - use `unknown` when type is truly unknown
- Use type guards instead of type assertions

**Code Organization:**

- Define interfaces in same file or dedicated `types.ts`
- Export public types from barrel files
- Keep generic types focused and reusable

---

## Quick Reference

**Type vs Interface:**

- Interface: Object shapes, classes, declaration merging
- Type: Unions, intersections, mapped types, tuples

**Common Utility Types:**

- `Partial<T>` - Make all properties optional
- `Required<T>` - Make all properties required
- `Pick<T, K>` - Select specific properties
- `Omit<T, K>` - Exclude specific properties
- `Readonly<T>` - Make all properties read-only
- `Record<K, V>` - Create object type with specific keys

**Best Practices:**

- Enable strict mode
- Avoid `any` and type assertions
- Type function return values
- Use discriminated unions for complex state
- Prefer union types over enums
- Write custom type guards for runtime validation
