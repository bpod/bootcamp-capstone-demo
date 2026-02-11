---
name: react-state-refactor
description: "Improve React state management patterns - lift state, context, reducers, and external libraries"
---

# React State Management Refactoring

Comprehensive guide to refactoring state management in React applications. Covers state colocation, lifting state, Context API, useReducer, and when to reach for external libraries.

**Goal**: Right-size state management - use the simplest solution that solves the problem.

***

## State Management Decision Tree

```
┌─────────────────────────────────────┐
│ Does only ONE component need it?    │
│ ✅ Yes → useState in that component │
│ ❌ No → Continue                     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Is state used by parent + children? │
│ ✅ Yes → Lift state to parent       │
│ ❌ No → Continue                     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Prop drilling becomes painful?      │
│ ✅ Yes → Use Context API             │
│ ❌ No → Keep lifting state           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Complex state transitions?          │
│ ✅ Yes → useReducer + Context        │
│ ❌ No → Continue                     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ State shared across many features?  │
│ ✅ Yes → External library (Zustand) │
│ ❌ No → Context is sufficient        │
└─────────────────────────────────────┘
```

***

## 1. State Colocation (Keep State Close)

**Principle**: Keep state as close as possible to where it's used.

### ❌ Anti-Pattern: Hoisting Everything

```jsx
function App() {
  // ❌ All state at top level (unnecessary)
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("home");

  return (
    <div>
      <Header userName={userName} />
      <SearchBar query={searchQuery} setQuery={setSearchQuery} />
      <TabPanel selected={selectedTab} onChange={setSelectedTab} />
      <UserForm
        name={userName}
        email={userEmail}
        setName={setUserName}
        setEmail={setUserEmail}
      />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
```

### ✅ Better: Colocate State

```jsx
function App() {
  // Only state that's truly shared
  const [userName, setUserName] = useState("");

  return (
    <div>
      <Header userName={userName} />
      <SearchBar /> {/* Manages own search state */}
      <TabPanel /> {/* Manages own tab state */}
      <UserForm onSave={setUserName} /> {/* Manages own form state */}
      <ModalTrigger /> {/* Manages own modal state */}
    </div>
  );
}

// Each component manages its own state
function SearchBar() {
  const [query, setQuery] = useState(""); // ✅ Local state
  // ...
}

function TabPanel() {
  const [selected, setSelected] = useState("home"); // ✅ Local state
  // ...
}
```

**Benefits:**

- Easier to understand (state close to usage)
- Better performance (fewer re-renders)
- Easier to delete/move components
- No unnecessary prop drilling

***

## 2. Lifting State Up

**When to Use**: State needs to be shared between sibling components.

### Scenario: Sibling Communication

**❌ Problem: Siblings Can't Share State**

```jsx
function FilterPanel() {
  const [filter, setFilter] = useState("all"); // ❌ ProductList can't access
  return <FilterButtons value={filter} onChange={setFilter} />;
}

function ProductList() {
  // ❌ How do I know which filter is active?
  return <div>Products...</div>;
}

function App() {
  return (
    <>
      <FilterPanel />
      <ProductList />
    </>
  );
}
```

**✅ Solution: Lift State to Common Parent**

```jsx
function App() {
  const [filter, setFilter] = useState("all"); // ✅ Lifted to parent

  return (
    <>
      <FilterPanel filter={filter} onFilterChange={setFilter} />
      <ProductList filter={filter} />
    </>
  );
}

function FilterPanel({ filter, onFilterChange }) {
  return <FilterButtons value={filter} onChange={onFilterChange} />;
}

function ProductList({ filter }) {
  const filteredProducts = products.filter(/* use filter */);
  return <div>{/* render filteredProducts */}</div>;
}
```

### Pattern: Controlled Components

**Lift state for reusable form inputs:**

```jsx
// ✅ Controlled input - parent manages state
function SearchInput({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

// Parent controls the state
function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <SearchInput value={searchQuery} onChange={setSearchQuery} />
      <SearchResults query={searchQuery} />
    </div>
  );
}
```

***

## 3. Context API (Avoid Prop Drilling)

**When to Use**: State shared across many levels of component tree.

### ❌ Problem: Prop Drilling

```jsx
function App() {
  const [user, setUser] = useState(null);

  return <Dashboard user={user} />;
}

function Dashboard({ user }) {
  return <Sidebar user={user} />; // ❌ Just passing through
}

function Sidebar({ user }) {
  return <UserMenu user={user} />; // ❌ Just passing through
}

function UserMenu({ user }) {
  return <div>{user.name}</div>; // ✅ Finally used here
}
```

### ✅ Solution: Context API

**Step 1: Create Context**

```jsx
// contexts/UserContext.jsx
import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
```

**Step 2: Wrap App with Provider**

```jsx
// App.jsx
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
      <Dashboard />
    </UserProvider>
  );
}
```

**Step 3: Consume Context Anywhere**

```jsx
// components/UserMenu.jsx
import { useUser } from "../contexts/UserContext";

function UserMenu() {
  const { user, setUser } = useUser(); // ✅ Direct access, no props

  if (!user) return <LoginButton />;

  return (
    <div>
      <span>{user.name}</span>
      <button onClick={() => setUser(null)}>Logout</button>
    </div>
  );
}
```

### Context Performance Optimization

**❌ Problem: Entire tree re-renders on context change**

```jsx
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null); // ❌ Unrelated state

  return (
    <ThemeContext.Provider value={{ theme, setTheme, user, setUser }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ❌ ThemeButton re-renders when user changes
function ThemeButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <button onClick={() => setTheme("dark")}>{theme}</button>;
}
```

**✅ Solution 1: Split Contexts**

```jsx
// Separate contexts for independent concerns
const ThemeContext = createContext();
const UserContext = createContext();

function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <UserProvider>{children}</UserProvider>
    </ThemeProvider>
  );
}
```

**✅ Solution 2: Memoize Context Value**

```jsx
import { useMemo } from "react";

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
```

**✅ Solution 3: Split into State/Dispatch Contexts**

```jsx
const StateContext = createContext();
const DispatchContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <StateContext.Provider value={user}>
      <DispatchContext.Provider value={setUser}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// Components only subscribe to what they need
function UserDisplay() {
  const user = useContext(StateContext); // ✅ Only re-renders on user change
  return <div>{user?.name}</div>;
}

function LoginButton() {
  const setUser = useContext(DispatchContext); // ✅ Never re-renders
  return <button onClick={() => setUser(/* ... */)}>Login</button>;
}
```

***

## 4. useReducer (Complex State Logic)

**When to Use:**

- Multiple related state variables
- Complex state transitions
- State depends on previous state
- Easier to test state logic separately

### ❌ Problem: Complex useState Logic

```jsx
function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const addItem = (item) => {
    setItems([...items, item]);
  };

  const removeItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const applyDiscount = async () => {
    setLoading(true);
    setError(null);
    try {
      const valid = await validateDiscount(discountCode);
      if (valid) {
        setDiscountApplied(true);
      } else {
        setError("Invalid discount code");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ❌ Hard to track state transitions
  // ❌ Many setState calls scattered around
}
```

### ✅ Solution: useReducer

**Step 1: Define Reducer**

```jsx
// reducers/cartReducer.js
const initialState = {
  items: [],
  loading: false,
  error: null,
  discountCode: "",
  discountApplied: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };

    case "SET_DISCOUNT_CODE":
      return {
        ...state,
        discountCode: action.payload,
      };

    case "APPLY_DISCOUNT_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "APPLY_DISCOUNT_SUCCESS":
      return {
        ...state,
        loading: false,
        discountApplied: true,
      };

    case "APPLY_DISCOUNT_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
}

export { cartReducer, initialState };
```

**Step 2: Use in Component**

```jsx
import { useReducer } from "react";
import { cartReducer, initialState } from "./reducers/cartReducer";

function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const applyDiscount = async () => {
    dispatch({ type: "APPLY_DISCOUNT_START" });
    try {
      const valid = await validateDiscount(state.discountCode);
      if (valid) {
        dispatch({ type: "APPLY_DISCOUNT_SUCCESS" });
      } else {
        dispatch({
          type: "APPLY_DISCOUNT_ERROR",
          payload: "Invalid discount code",
        });
      }
    } catch (err) {
      dispatch({ type: "APPLY_DISCOUNT_ERROR", payload: err.message });
    }
  };

  return (
    <div>
      {state.items.map((item) => (
        <CartItem key={item.id} item={item} onRemove={removeItem} />
      ))}
      <DiscountInput
        value={state.discountCode}
        onChange={(code) =>
          dispatch({ type: "SET_DISCOUNT_CODE", payload: code })
        }
        onApply={applyDiscount}
        loading={state.loading}
        error={state.error}
      />
    </div>
  );
}
```

**Benefits:**

- ✅ All state transitions in one place
- ✅ Easier to test reducer independently
- ✅ Clearer intent with action types
- ✅ TypeScript-friendly (discriminated unions)

***

## 5. useReducer + Context (Global State)

**Best for**: Complex global state without external library.

```jsx
// contexts/CartContext.jsx
import { createContext, useContext, useReducer } from "react";
import { cartReducer, initialState } from "../reducers/cartReducer";

const CartStateContext = createContext();
const CartDispatchContext = createContext();

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

export function useCartState() {
  const context = useContext(CartStateContext);
  if (!context)
    throw new Error("useCartState must be used within CartProvider");
  return context;
}

export function useCartDispatch() {
  const context = useContext(CartDispatchContext);
  if (!context)
    throw new Error("useCartDispatch must be used within CartProvider");
  return context;
}

// Optional: Create action creators
export function useCartActions() {
  const dispatch = useCartDispatch();

  return {
    addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
    removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
  };
}
```

**Usage:**

```jsx
// App.jsx
function App() {
  return (
    <CartProvider>
      <Header />
      <ProductList />
      <CartSidebar />
    </CartProvider>
  );
}

// components/CartSidebar.jsx
function CartSidebar() {
  const { items, loading } = useCartState();
  const { removeItem, clearCart } = useCartActions();

  return (
    <aside>
      {items.map((item) => (
        <CartItem key={item.id} item={item} onRemove={removeItem} />
      ))}
      <button onClick={clearCart}>Clear Cart</button>
    </aside>
  );
}
```

***

## 6. External Libraries (When Context Isn't Enough)

**When to Reach for External Library:**

- State shared across many unrelated features
- Need devtools for debugging state
- Complex async state management
- Performance bottlenecks with Context re-renders

### Option 1: Zustand (Recommended)

**Why Zustand?**

- Minimal API, easy to learn
- No providers needed
- Great performance (no unnecessary re-renders)
- Built-in devtools support
- Small bundle size (~1KB)

**Setup:**

```bash
npm install zustand
```

**Create Store:**

```jsx
// stores/useCartStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useCartStore = create(
  devtools((set, get) => ({
    items: [],
    loading: false,
    error: null,

    addItem: (item) =>
      set((state) => ({
        items: [...state.items, item],
      })),

    removeItem: (id) =>
      set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),

    clearCart: () => set({ items: [] }),

    applyDiscount: async (code) => {
      set({ loading: true, error: null });
      try {
        await validateDiscount(code);
        // Update discount state
      } catch (err) {
        set({ error: err.message });
      } finally {
        set({ loading: false });
      }
    },
  })),
);

export default useCartStore;
```

**Usage (No Provider Needed!):**

```jsx
import useCartStore from "../stores/useCartStore";

function CartSidebar() {
  // ✅ Component only re-renders when items change
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <aside>
      {items.map((item) => (
        <CartItem key={item.id} item={item} onRemove={removeItem} />
      ))}
    </aside>
  );
}

function CartButton() {
  // ✅ Only subscribes to items count
  const itemCount = useCartStore((state) => state.items.length);
  return <button>Cart ({itemCount})</button>;
}
```

### Option 2: Jotai (Atomic State)

**When to Use**: Prefer atomic updates, bottom-up approach.

```bash
npm install jotai
```

```jsx
// atoms/cartAtoms.js
import { atom } from "jotai";

export const cartItemsAtom = atom([]);
export const cartLoadingAtom = atom(false);
export const cartErrorAtom = atom(null);
```

```jsx
// components/CartSidebar.jsx
import { useAtom } from "jotai";
import { cartItemsAtom } from "../atoms/cartAtoms";

function CartSidebar() {
  const [items, setItems] = useAtom(cartItemsAtom);

  const removeItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  return <aside>{/* render items */}</aside>;
}
```

***

## 7. Form State Management

**Simple Forms**: Controlled components with useState

```jsx
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  );
}
```

**Complex Forms**: React Hook Form

```bash
npm install react-hook-form
```

```jsx
import { useForm } from "react-hook-form";

function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email", { required: "Email required" })} />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register("password", { minLength: 8 })} />
      {errors.password && <span>Password too short</span>}

      <button>Register</button>
    </form>
  );
}
```

***

## Refactoring Strategy

### Step 1: Audit Current State

```bash
# Search for useState across codebase
grep -r "useState" src/
```

**Questions to Ask:**

- Is this state used by multiple components?
- Is there prop drilling happening?
- Are there many setState calls in one function?
- Is state synchronized across components?

### Step 2: Identify Patterns

- **Colocation**: Move state closer to usage
- **Lifting**: State shared by siblings
- **Context**: Deep prop drilling
- **Reducer**: Complex state transitions
- **External**: Cross-feature state

### Step 3: Refactor Incrementally

1. Start with one feature/section
2. Write tests before refactoring
3. Refactor state management
4. Verify tests still pass
5. Move to next section

***

## Testing State Management

**Test Contexts:**

```jsx
import { render, screen } from "@testing-library/react";
import { UserProvider, useUser } from "./UserContext";

function TestComponent() {
  const { user, setUser } = useUser();
  return (
    <div>
      <span>{user?.name || "Guest"}</span>
      <button onClick={() => setUser({ name: "John" })}>Login</button>
    </div>
  );
}

test("context provides user state", () => {
  render(
    <UserProvider>
      <TestComponent />
    </UserProvider>,
  );

  expect(screen.getByText("Guest")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Login"));

  expect(screen.getByText("John")).toBeInTheDocument();
});
```

**Test Reducers:**

```jsx
import { cartReducer, initialState } from "./cartReducer";

test("ADD_ITEM adds item to cart", () => {
  const item = { id: 1, name: "Product" };
  const newState = cartReducer(initialState, {
    type: "ADD_ITEM",
    payload: item,
  });

  expect(newState.items).toHaveLength(1);
  expect(newState.items[0]).toEqual(item);
});
```

***

## Summary

**State Management Ladder (Use what you need):**

1. **useState** - Single component state
2. **Lift State** - Parent-child sharing
3. **Context** - Avoid prop drilling
4. **useReducer + Context** - Complex global state
5. **Zustand/Jotai** - Large-scale applications

**Key Principles:**

- ✅ Start simple, add complexity as needed
- ✅ Colocate state close to usage
- ✅ Lift state only when necessary
- ✅ Use Context to avoid prop drilling
- ✅ Use reducers for complex state logic
- ✅ Consider external libraries for large apps

**Avoid:**

- ❌ Premature optimization with complex state
- ❌ Global state for everything
- ❌ Prop drilling more than 2-3 levels

**Remember**: The best state management solution is the simplest one that meets your needs.
