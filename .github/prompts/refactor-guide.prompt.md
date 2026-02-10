---
description: "Step-by-step refactoring guide with safety nets, code smell detection, and incremental improvements"
agent: "frontend-developer"
tools: ["codebase", "search", "problems", "usages", "runCommands"]
---

# Refactoring Guide

Safe, incremental code refactoring workflow focused on improving code quality while maintaining functionality. Includes code smell detection, refactoring patterns, and rigorous testing strategies.

**Philosophy**: Small, tested steps beat large, risky changes.

---

## Refactoring Workflow

### The Safe Refactoring Process

**1. IDENTIFY** → **2. TEST** → **3. REFACTOR** → **4. VERIFY** → **5. COMMIT**

```
┌─────────────┐
│  1. IDENTIFY│  Detect code smell or improvement opportunity
└──────┬──────┘
       ↓
┌─────────────┐
│   2. TEST   │  Ensure existing tests pass (or write them)
└──────┬──────┘
       ↓
┌─────────────┐
│ 3. REFACTOR │  Make ONE small change at a time
└──────┬──────┘
       ↓
┌─────────────┐
│  4. VERIFY  │  Run tests, check behavior unchanged
└──────┬──────┘
       ↓
┌─────────────┐
│  5. COMMIT  │  Save progress, repeat for next improvement
└─────────────┘
```

**Key Principles:**

- ✅ **Never refactor without tests** - Write tests first if none exist
- ✅ **One refactoring at a time** - Small, focused changes
- ✅ **Keep tests green** - All tests must pass before and after
- ✅ **Use version control** - Commit after each successful refactoring
- ✅ **Preserve behavior** - Refactoring changes HOW, not WHAT

---

## Code Smells Catalog

### 1. Long Functions/Components

**Smell**: Function or component exceeds 50-100 lines, does multiple things.

**Impact**: Hard to understand, test, and maintain.

**Refactoring**: Extract smaller functions/components.

**Example:**

```javascript
// ❌ BEFORE: Long, complex component
function UserDashboard() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // 20 lines fetching user
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err));

    // 20 lines fetching posts
    fetch(`/api/posts?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setPosts(data));

    // 20 lines fetching analytics
    // 20 lines fetching notifications
  }, [userId]);

  return (
    <div>
      {/* 50+ lines of JSX */}
      <header>...</header>
      <section>...</section>
      <aside>...</aside>
      <footer>...</footer>
    </div>
  );
}

// ✅ AFTER: Extracted components
function UserDashboard() {
  return (
    <div>
      <UserProfile />
      <UserPosts />
      <UserAnalytics />
      <UserNotifications />
    </div>
  );
}

function UserProfile() {
  const { user, isLoading, error } = useUser();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <ProfileCard user={user} />;
}
```

**Steps:**

1. Identify logical sections (profile, posts, analytics, notifications)
2. Extract each section into its own component
3. Extract data fetching into custom hooks
4. Run tests to ensure behavior unchanged

---

### 2. Duplicate Code

**Smell**: Same or very similar code appears in multiple places.

**Impact**: Changes require updating multiple locations, inconsistency risk.

**Refactoring**: Extract to reusable function, component, or hook.

**Example:**

```javascript
// ❌ BEFORE: Duplicated form validation
function LoginForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (value) => {
    if (!value) {
      setEmailError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Email is invalid");
    } else {
      setEmailError("");
    }
  };

  // ...
}

function SignupForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // SAME validation code duplicated!
  const validateEmail = (value) => {
    if (!value) {
      setEmailError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Email is invalid");
    } else {
      setEmailError("");
    }
  };

  // ...
}

// ✅ AFTER: Extracted to custom hook
function useEmailValidation() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const validate = (newValue) => {
    setValue(newValue);

    if (!newValue) {
      setError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(newValue)) {
      setError("Email is invalid");
    } else {
      setError("");
    }
  };

  return { value, error, setValue: validate, isValid: !error };
}

// Use in both forms
function LoginForm() {
  const email = useEmailValidation();
  // ...
}

function SignupForm() {
  const email = useEmailValidation();
  // ...
}
```

**Steps:**

1. Identify duplicated logic
2. Extract to utility function or custom hook
3. Replace all duplicates with the extracted version
4. Test each usage location

---

### 3. Deep Nesting

**Smell**: Code nested 3+ levels deep (if/for/try blocks).

**Impact**: Cognitive load, hard to follow logic, difficult to test.

**Refactoring**: Early returns, guard clauses, extract functions.

**Example:**

```javascript
// ❌ BEFORE: Deeply nested
function processOrder(order) {
  if (order) {
    if (order.items) {
      if (order.items.length > 0) {
        if (order.isPaid) {
          if (order.shippingAddress) {
            // Finally do the work
            return shipOrder(order);
          } else {
            throw new Error("Missing address");
          }
        } else {
          throw new Error("Not paid");
        }
      } else {
        throw new Error("No items");
      }
    } else {
      throw new Error("Invalid order");
    }
  } else {
    throw new Error("Order is null");
  }
}

// ✅ AFTER: Early returns (guard clauses)
function processOrder(order) {
  // Guard clauses at the top
  if (!order) {
    throw new Error("Order is null");
  }

  if (!order.items) {
    throw new Error("Invalid order");
  }

  if (order.items.length === 0) {
    throw new Error("No items");
  }

  if (!order.isPaid) {
    throw new Error("Not paid");
  }

  if (!order.shippingAddress) {
    throw new Error("Missing address");
  }

  // Happy path at the end, no nesting
  return shipOrder(order);
}
```

**Steps:**

1. Identify nested conditionals
2. Convert to guard clauses with early returns
3. Simplify logic flow
4. Test error and success paths

---

### 4. Large Parameter Lists

**Smell**: Function takes 4+ parameters, especially if multiple are optional.

**Impact**: Hard to remember order, easy to make mistakes, poor readability.

**Refactoring**: Use options object or builder pattern.

**Example:**

```javascript
// ❌ BEFORE: Too many parameters
function createUser(
  firstName,
  lastName,
  email,
  phone,
  address,
  city,
  state,
  zip,
  country,
  role,
  isActive,
) {
  // ...
}

// Hard to call correctly
createUser(
  "John",
  "Doe",
  "john@example.com",
  "555-1234",
  "123 Main St",
  "Boston",
  "MA",
  "02101",
  "USA",
  "admin",
  true,
);

// ✅ AFTER: Options object
function createUser(options) {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    state,
    zip,
    country = "USA", // Defaults possible
    role = "user",
    isActive = true,
  } = options;

  // ...
}

// Much clearer to call
createUser({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "555-1234",
  address: "123 Main St",
  city: "Boston",
  state: "MA",
  zip: "02101",
  role: "admin",
});
```

**Steps:**

1. Create options object interface
2. Destructure parameters inside function
3. Update all call sites
4. Run tests to verify

---

### 5. Primitive Obsession

**Smell**: Using primitives (strings, numbers) instead of small objects for domain concepts.

**Impact**: Scattered validation, no type safety, easy to mix up similar values.

**Refactoring**: Create value objects or types.

**Example:**

```javascript
// ❌ BEFORE: Primitives everywhere
function sendEmail(email, subject, body) {
  // Validation scattered
  if (!email.includes("@")) {
    throw new Error("Invalid email");
  }

  if (subject.length === 0) {
    throw new Error("Subject required");
  }

  // Easy to mix up parameters
  emailService.send(email, subject, body);
}

// ✅ AFTER: Value objects
class Email {
  constructor(address) {
    if (!address.includes("@")) {
      throw new Error("Invalid email");
    }
    this.address = address;
  }

  toString() {
    return this.address;
  }
}

class EmailMessage {
  constructor(subject, body) {
    if (!subject || subject.length === 0) {
      throw new Error("Subject required");
    }

    this.subject = subject;
    this.body = body;
  }
}

function sendEmail(to, message) {
  // Validation already done in constructors
  emailService.send(to.address, message.subject, message.body);
}

// Usage
const recipient = new Email("user@example.com");
const message = new EmailMessage("Hello", "Message body");
sendEmail(recipient, message);
```

**Steps:**

1. Identify primitive values representing domain concepts
2. Create classes or TypeScript types
3. Add validation to constructors
4. Update usage throughout codebase

---

### 6. God Object/Component

**Smell**: Class or component knows too much, does too much, has too many dependencies.

**Impact**: Hard to test, understand, maintain. Violates single responsibility.

**Refactoring**: Split into cohesive pieces.

**Example:**

```javascript
// ❌ BEFORE: God component
function ShoppingCart() {
  // Cart state
  const [items, setItems] = useState([]);

  // User state
  const [user, setUser] = useState(null);

  // Shipping state
  const [shippingAddress, setShippingAddress] = useState({});

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState(null);

  // Coupon state
  const [coupon, setCoupon] = useState(null);

  // Analytics
  const trackEvent = (event) => {
    /* ... */
  };

  // All business logic in one place
  const calculateTotal = () => {
    /* ... */
  };
  const applyCoupon = () => {
    /* ... */
  };
  const processPayment = () => {
    /* ... */
  };
  const validateShipping = () => {
    /* ... */
  };

  // 200+ lines of JSX
  return (
    <div>
      {/* Cart items */}
      {/* Shipping form */}
      {/* Payment form */}
      {/* Order summary */}
      {/* Coupon input */}
    </div>
  );
}

// ✅ AFTER: Separated concerns
function ShoppingCartPage() {
  return (
    <CartProvider>
      <div>
        <CartItemsList />
        <ShippingForm />
        <PaymentForm />
        <CouponInput />
        <OrderSummary />
      </div>
    </CartProvider>
  );
}

// Each component handles one concern
function CartItemsList() {
  const { items, removeItem, updateQuantity } = useCart();
  // ...
}

function ShippingForm() {
  const { shippingAddress, setShippingAddress } = useCart();
  const { validate } = useShippingValidation();
  // ...
}
```

**Steps:**

1. Identify distinct responsibilities
2. Extract each to its own component
3. Use context or props for shared state
4. Test each component independently

---

### 7. Callback Hell

**Smell**: Multiple nested callbacks, pyramid of doom.

**Impact**: Hard to read, error handling complex, difficult to debug.

**Refactoring**: Use async/await or Promises.

**Example:**

```javascript
// ❌ BEFORE: Callback hell
function loadUserDashboard(userId, callback) {
  fetchUser(userId, (err, user) => {
    if (err) {
      callback(err);
      return;
    }

    fetchPosts(userId, (err, posts) => {
      if (err) {
        callback(err);
        return;
      }

      fetchAnalytics(userId, (err, analytics) => {
        if (err) {
          callback(err);
          return;
        }

        callback(null, { user, posts, analytics });
      });
    });
  });
}

// ✅ AFTER: Async/await
async function loadUserDashboard(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(userId);
    const analytics = await fetchAnalytics(userId);

    return { user, posts, analytics };
  } catch (error) {
    throw new Error(`Failed to load dashboard: ${error.message}`);
  }
}

// ✅ EVEN BETTER: Parallel fetching
async function loadUserDashboard(userId) {
  try {
    const [user, posts, analytics] = await Promise.all([
      fetchUser(userId),
      fetchPosts(userId),
      fetchAnalytics(userId),
    ]);

    return { user, posts, analytics };
  } catch (error) {
    throw new Error(`Failed to load dashboard: ${error.message}`);
  }
}
```

**Steps:**

1. Convert callbacks to return Promises
2. Use async/await for cleaner code
3. Consider parallel execution with Promise.all()
4. Test error handling

---

### 8. Magic Numbers/Strings

**Smell**: Hardcoded values with no explanation.

**Impact**: Unclear meaning, hard to change, duplication.

**Refactoring**: Extract to named constants.

**Example:**

```javascript
// ❌ BEFORE: Magic numbers
function calculateShipping(weight) {
  if (weight < 5) {
    return 4.99;
  } else if (weight < 20) {
    return 9.99;
  } else {
    return 19.99;
  }
}

function applyDiscount(price) {
  if (price > 100) {
    return price * 0.9; // What is 0.9?
  }
  return price;
}

// ✅ AFTER: Named constants
const SHIPPING = {
  LIGHT_WEIGHT_THRESHOLD: 5,
  MEDIUM_WEIGHT_THRESHOLD: 20,
  LIGHT_RATE: 4.99,
  MEDIUM_RATE: 9.99,
  HEAVY_RATE: 19.99,
};

const DISCOUNT = {
  BULK_ORDER_THRESHOLD: 100,
  BULK_ORDER_RATE: 0.1, // 10% discount
};

function calculateShipping(weight) {
  if (weight < SHIPPING.LIGHT_WEIGHT_THRESHOLD) {
    return SHIPPING.LIGHT_RATE;
  } else if (weight < SHIPPING.MEDIUM_WEIGHT_THRESHOLD) {
    return SHIPPING.MEDIUM_RATE;
  } else {
    return SHIPPING.HEAVY_RATE;
  }
}

function applyDiscount(price) {
  if (price > DISCOUNT.BULK_ORDER_THRESHOLD) {
    return price * (1 - DISCOUNT.BULK_ORDER_RATE);
  }
  return price;
}
```

**Steps:**

1. Identify hardcoded values
2. Extract to constants with descriptive names
3. Group related constants
4. Update all usages

---

### 9. Inconsistent Naming

**Smell**: Similar concepts named differently, unclear abbreviations.

**Impact**: Confusion, hard to search, inconsistent codebase.

**Refactoring**: Standardize naming conventions.

**Example:**

```javascript
// ❌ BEFORE: Inconsistent naming
function getUserData(id) {
  /* ... */
}
function fetchUserProfile(userId) {
  /* ... */
}
function loadUser(user_id) {
  /* ... */
}
function getUsrInfo(uid) {
  /* ... */
}

const usr = await getUserData(1);
const profile = await fetchUserProfile(2);

// ✅ AFTER: Consistent naming
function fetchUser(userId) {
  /* ... */
}
function fetchUserProfile(userId) {
  /* ... */
}
function fetchUserPosts(userId) {
  /* ... */
}
function fetchUserSettings(userId) {
  /* ... */
}

const user = await fetchUser(1);
const profile = await fetchUserProfile(2);
```

**Convention Guide:**

- ✅ **booleans**: `isLoading`, `hasError`, `canEdit`
- ✅ **arrays**: plural `users`, `items`, `posts`
- ✅ **functions**: verb + noun `getUser`, `createPost`, `validateEmail`
- ✅ **event handlers**: `handleClick`, `handleSubmit`, `handleChange`
- ✅ **React components**: PascalCase `UserProfile`, `NavBar`
- ✅ **constants**: SCREAMING_SNAKE_CASE `API_URL`, `MAX_RETRIES`

**Steps:**

1. Define naming conventions for your project
2. Use find-and-replace for consistent renaming
3. Update tests and documentation
4. Run tests to verify

---

### 10. Tight Coupling

**Smell**: Components or modules directly depend on concrete implementations.

**Impact**: Hard to test, swap implementations, or reuse.

**Refactoring**: Dependency injection, interfaces, composition.

**Example:**

```javascript
// ❌ BEFORE: Tightly coupled
class UserService {
  constructor() {
    this.database = new MySQLDatabase(); // Hard-coded dependency
  }

  async getUser(id) {
    return this.database.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// Can't test without real database
// Can't switch to PostgreSQL without changing UserService

// ✅ AFTER: Dependency injection
class UserService {
  constructor(database) {
    this.database = database; // Injected dependency
  }

  async getUser(id) {
    return this.database.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// Now flexible
const productionService = new UserService(new MySQLDatabase());
const testService = new UserService(new MockDatabase());
```

**React Example:**

```javascript
// ❌ BEFORE: Tightly coupled
function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Directly using fetch - hard to test
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  // ...
}

// ✅ AFTER: Dependency injection via props
function UserProfile({ userService = defaultUserService }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService.fetchUser().then((data) => setUser(data));
  }, [userService]);

  // ...
}

// Easy to test
test("displays user data", async () => {
  const mockService = {
    fetchUser: () => Promise.resolve({ name: "John" }),
  };

  render(<UserProfile userService={mockService} />);
  // ...
});
```

**Steps:**

1. Identify hard-coded dependencies
2. Add dependency as constructor/prop parameter
3. Inject dependency at usage sites
4. Create mock for testing

---

## Refactoring Patterns

### Pattern 1: Extract Function

**When**: Function is too long or has complex nested logic.

**Process:**

1. Select code block to extract
2. Identify inputs (parameters) and outputs (return value)
3. Create new function with descriptive name
4. Move code to new function
5. Replace original code with function call
6. Run tests

**Example:**

```javascript
// BEFORE
function processOrder(order) {
  // Validate order
  if (!order.items || order.items.length === 0) {
    throw new Error("Order must have items");
  }

  // Calculate total
  let total = order.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // Apply discount
  if (total > 100) {
    total = total * 0.9;
  }

  // Add tax
  const tax = total * 0.08;
  total = total + tax;

  return total;
}

// AFTER: Extracted functions
function processOrder(order) {
  validateOrder(order);

  const subtotal = calculateSubtotal(order.items);
  const discounted = applyDiscount(subtotal);
  const total = addTax(discounted);

  return total;
}

function validateOrder(order) {
  if (!order.items || order.items.length === 0) {
    throw new Error("Order must have items");
  }
}

function calculateSubtotal(items) {
  return items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}

function applyDiscount(amount) {
  const BULK_ORDER_THRESHOLD = 100;
  const DISCOUNT_RATE = 0.1;

  return amount > BULK_ORDER_THRESHOLD ? amount * (1 - DISCOUNT_RATE) : amount;
}

function addTax(amount) {
  const TAX_RATE = 0.08;
  return amount * (1 + TAX_RATE);
}
```

---

### Pattern 2: Extract Component (React)

**When**: Component is too large, has multiple responsibilities.

**Process:**

1. Identify logical UI section
2. Create new component file
3. Move JSX to new component
4. Pass data via props
5. Replace original JSX with component
6. Run tests

**Example:**

```jsx
// BEFORE: Large component
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // ... lots of logic

  return (
    <div>
      {/* Product info */}
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <span>${product.price}</span>
        <button>Add to Cart</button>
      </div>

      {/* Reviews section */}
      <div>
        <h2>Reviews</h2>
        {reviews.map((review) => (
          <div key={review.id}>
            <strong>{review.author}</strong>
            <span>{review.rating} stars</span>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div>
        <h2>You might also like</h2>
        {recommendations.map((item) => (
          <div key={item.id}>
            <img src={item.image} alt={item.name} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// AFTER: Extracted components
function ProductPage({ productId }) {
  const product = useProduct(productId);
  const reviews = useReviews(productId);
  const recommendations = useRecommendations(productId);

  return (
    <div>
      <ProductInfo product={product} />
      <ReviewsList reviews={reviews} />
      <Recommendations items={recommendations} />
    </div>
  );
}

function ProductInfo({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>${product.price}</span>
      <button>Add to Cart</button>
    </div>
  );
}

function ReviewsList({ reviews }) {
  return (
    <div>
      <h2>Reviews</h2>
      {reviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}
    </div>
  );
}
```

---

### Pattern 3: Replace Conditional with Polymorphism

**When**: Large switch/if-else chains based on type.

**Process:**

1. Create interface or base class
2. Create concrete classes for each type
3. Move type-specific logic to classes
4. Replace conditional with polymorphic call
5. Run tests

**Example:**

```javascript
// BEFORE: Large conditional
function calculateShipping(order) {
  switch (order.shippingMethod) {
    case "standard":
      return order.weight * 0.5;
    case "express":
      return order.weight * 1.5 + 10;
    case "overnight":
      return order.weight * 3.0 + 25;
    default:
      throw new Error("Unknown shipping method");
  }
}

// AFTER: Polymorphism
class ShippingMethod {
  calculate(order) {
    throw new Error("Must implement calculate()");
  }
}

class StandardShipping extends ShippingMethod {
  calculate(order) {
    return order.weight * 0.5;
  }
}

class ExpressShipping extends ShippingMethod {
  calculate(order) {
    return order.weight * 1.5 + 10;
  }
}

class OvernightShipping extends ShippingMethod {
  calculate(order) {
    return order.weight * 3.0 + 25;
  }
}

function calculateShipping(order) {
  return order.shippingMethod.calculate(order);
}

// Or with object lookup (simpler)
const SHIPPING_CALCULATORS = {
  standard: (order) => order.weight * 0.5,
  express: (order) => order.weight * 1.5 + 10,
  overnight: (order) => order.weight * 3.0 + 25,
};

function calculateShipping(order) {
  const calculator = SHIPPING_CALCULATORS[order.shippingMethod];
  if (!calculator) {
    throw new Error("Unknown shipping method");
  }
  return calculator(order);
}
```

---

### Pattern 4: Introduce Parameter Object

**When**: Functions pass around same group of data.

**Process:**

1. Create class or object to hold related data
2. Replace parameters with single object parameter
3. Update all callers
4. Run tests

**Example:**

```javascript
// BEFORE: Repeated parameter groups
function createInvoice(
  customerName,
  customerEmail,
  customerAddress,
  items,
  total,
) {
  // ...
}

function sendInvoice(customerName, customerEmail, customerAddress, invoiceId) {
  // ...
}

function updateCustomer(customerName, customerEmail, customerAddress) {
  // ...
}

// AFTER: Parameter object
class Customer {
  constructor(name, email, address) {
    this.name = name;
    this.email = email;
    this.address = address;
  }
}

function createInvoice(customer, items, total) {
  // ...
}

function sendInvoice(customer, invoiceId) {
  // ...
}

function updateCustomer(customer) {
  // ...
}
```

---

### Pattern 5: Replace Temp with Query

**When**: Temporary variable stores result of expression for reuse.

**Process:**

1. Extract expression into method
2. Replace temp variable with method calls
3. Inline temp variable
4. Run tests

**Example:**

```javascript
// BEFORE: Temporary variable
function calculateTotal(order) {
  const basePrice = order.quantity * order.itemPrice;

  if (basePrice > 1000) {
    return basePrice * 0.95;
  } else {
    return basePrice * 0.98;
  }
}

// AFTER: Query method
function calculateTotal(order) {
  if (basePrice(order) > 1000) {
    return basePrice(order) * 0.95;
  } else {
    return basePrice(order) * 0.98;
  }
}

function basePrice(order) {
  return order.quantity * order.itemPrice;
}
```

---

## Testing Strategy During Refactoring

### Before Refactoring: Write Characterization Tests

If tests don't exist, write them FIRST:

```javascript
// Write tests that describe current behavior
describe("calculateShipping", () => {
  test("standard shipping for light packages", () => {
    const order = { weight: 5, shippingMethod: "standard" };
    expect(calculateShipping(order)).toBe(2.5);
  });

  test("express shipping for heavy packages", () => {
    const order = { weight: 10, shippingMethod: "express" };
    expect(calculateShipping(order)).toBe(25);
  });

  // Test edge cases
  test("overnight shipping with zero weight", () => {
    const order = { weight: 0, shippingMethod: "overnight" };
    expect(calculateShipping(order)).toBe(25);
  });
});
```

### During Refactoring: Keep Tests Green

Run tests after EVERY change:

```bash
# After each refactoring step
npm test

# Or use watch mode
npm test -- --watch
```

### After Refactoring: Validate Behavior

Ensure no regressions:

1. ✅ All existing tests pass
2. ✅ Manual testing of affected features
3. ✅ Check for performance regressions
4. ✅ Review code coverage (should not decrease)

---

## Refactoring Safety Checklist

### Before Starting

- [ ] All existing tests pass
- [ ] Code is committed to version control
- [ ] You understand what the code does
- [ ] You have time to complete the refactoring
- [ ] Tests exist or you're willing to write them

### During Refactoring

- [ ] Make ONE change at a time
- [ ] Run tests after each change
- [ ] Commit after each successful change
- [ ] Keep refactoring separate from feature changes
- [ ] Don't change behavior (unless fixing bugs)

### After Completing

- [ ] All tests still pass
- [ ] Code is more readable
- [ ] Complexity reduced (fewer lines, less nesting)
- [ ] Duplication eliminated
- [ ] Names are clearer
- [ ] Code review completed
- [ ] Changes committed with clear message

---

## Common Refactoring Pitfalls

### ❌ Pitfall 1: Refactoring Without Tests

**Problem**: Can't verify behavior unchanged.

**Solution**: Write tests first (characterization tests).

---

### ❌ Pitfall 2: Changing Multiple Things at Once

**Problem**: If something breaks, hard to identify cause.

**Solution**: One refactoring at a time. Commit between changes.

---

### ❌ Pitfall 3: Mixing Refactoring with Features

**Problem**: Hard to review, easy to introduce bugs.

**Solution**: Separate commits/PRs for refactoring vs features.

```bash
# ✅ GOOD: Separate commits
git commit -m "Refactor: Extract calculateTotal function"
git commit -m "Feature: Add discount code support"

# ❌ BAD: Mixed
git commit -m "Add discount codes and refactor pricing logic"
```

---

### ❌ Pitfall 4: Over-Engineering

**Problem**: Refactoring adds unnecessary complexity.

**Solution**: Follow YAGNI (You Aren't Gonna Need It). Refactor for current needs.

```javascript
// ❌ Over-engineered
class DiscountStrategyFactory {
  createStrategy(type) {
    switch (type) {
      case "percentage":
        return new PercentageDiscountStrategy();
      case "fixed":
        return new FixedDiscountStrategy();
    }
  }
}

// ✅ Simple (for 2 types)
const DISCOUNT_CALCULATORS = {
  percentage: (price, amount) => price * (1 - amount / 100),
  fixed: (price, amount) => price - amount,
};
```

---

### ❌ Pitfall 5: Ignoring Performance

**Problem**: Refactoring degrades performance.

**Solution**: Profile before and after critical sections.

```javascript
// Be careful with this refactoring
// BEFORE: Cached calculation
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);

// AFTER: Function call - might recalculate on every render!
const total = calculateTotal(items);

// BETTER: Keep memoization
const total = useMemo(() => calculateTotal(items), [items]);
```

---

## Refactoring Tools

### IDE Features

**VS Code:**

- **Rename Symbol** (F2): Safely rename across files
- **Extract Function** (Ctrl+Shift+R): Extract selected code
- **Move to New File**: Extract component to separate file
- **Find All References**: See all usages before refactoring

**Use these instead of find-and-replace!**

---

### Linters and Formatters

```bash
# ESLint finds potential issues
npx eslint src/ --fix

# Prettier formats code consistently
npx prettier --write src/

# TypeScript catches type errors
npx tsc --noEmit
```

---

### Code Quality Tools

```bash
# Code complexity analysis
npx complexity-report src/

# Find duplicate code
npx jscpd src/

# Bundle size analysis
npx webpack-bundle-analyzer
```

---

## Incremental Refactoring Strategy

### The Strangler Fig Pattern

When refactoring large legacy code:

1. **Create new implementation** alongside old
2. **Route new calls** to new implementation
3. **Gradually migrate** old calls
4. **Remove old implementation** when done

**Example:**

```javascript
// Step 1: Old code still exists
function calculateShippingOld(order) {
  // Legacy logic
}

// Step 2: New implementation
function calculateShipping(order) {
  // New, refactored logic
}

// Step 3: Feature flag to migrate gradually
function getShippingCost(order) {
  if (useNewShippingCalculation) {
    return calculateShipping(order);
  } else {
    return calculateShippingOld(order);
  }
}

// Step 4: After validation, remove old
function getShippingCost(order) {
  return calculateShipping(order);
}
```

---

## Refactoring Workflow Example

### Complete Example: Refactoring a Complex Component

**Problem**: `OrderCheckout` component is 300+ lines, does too much.

**Step 1: Analyze and Plan**

```
Current structure:
- Fetches user data
- Fetches cart items
- Handles shipping form
- Handles payment form
- Calculates totals
- Submits order

Plan:
1. Extract custom hooks (useUser, useCart, useCheckout)
2. Extract form components (ShippingForm, PaymentForm)
3. Extract display components (CartSummary, OrderTotal)
```

**Step 2: Write Tests (if missing)**

```javascript
describe("OrderCheckout", () => {
  test("displays cart items", () => {
    const items = [{ id: 1, name: "Item 1", price: 10 }];
    render(<OrderCheckout initialItems={items} />);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  // More tests...
});
```

**Step 3: First Refactoring - Extract useCart Hook**

```javascript
// Before: Logic in component
function OrderCheckout() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  // ...
}

// After: Extracted to hook
function useCart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  return { items, loading };
}

function OrderCheckout() {
  const { items, loading } = useCart();
  // ...
}
```

**Step 4: Run Tests**

```bash
npm test -- OrderCheckout.test.js
# ✅ All pass - safe to continue
```

**Step 5: Commit**

```bash
git add .
git commit -m "Refactor: Extract useCart hook from OrderCheckout"
```

**Step 6: Repeat for Other Extractions**

Continue incrementally until component is clean.

---

## Summary

**Refactoring Principles:**

1. ✅ **Small steps** - One change at a time
2. ✅ **Test-driven** - Tests before, during, and after
3. ✅ **Preserve behavior** - Functionality stays the same
4. ✅ **Commit frequently** - Save progress after each success
5. ✅ **Focus on readability** - Code is read more than written

**When to Refactor:**

- ✅ Before adding new features (clean up the area first)
- ✅ During code review (as you understand the code)
- ✅ When you see code smells (fix them early)
- ✅ After fixing bugs (prevent similar bugs)

**When NOT to Refactor:**

- ❌ Without tests
- ❌ On a tight deadline
- ❌ Code you don't understand
- ❌ Just before deployment

**Remember**: Refactoring is about improving code structure without changing behavior. Make it work, make it right, make it fast - in that order.

Need help refactoring specific code? Share it and I'll guide you through the process step-by-step! 🔧
