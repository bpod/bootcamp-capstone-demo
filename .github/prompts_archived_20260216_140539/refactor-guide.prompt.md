---
name: Refactoring Guide
description: Systematic refactoring workflow for improving code quality
agent: frontend-developer
tools: ["readonly"]
---

# Refactoring Guide

Systematic approach to refactoring code to improve quality, maintainability, and performance without changing external behavior.

## When to Refactor

**Good Reasons:**

- Code is difficult to understand or modify
- Duplication exists across codebase
- Adding new features is becoming harder
- Performance issues identified through profiling
- Technical debt is accumulating

**Bad Reasons:**

- "I don't like this style" (subjective preference)
- "This could be more clever" (clever code is hard to maintain)
- No clear benefit or improvement goal

## Refactoring Process

### 1. Ensure Tests Exist

Before refactoring, have tests that verify current behavior:

```javascript
// Write tests first if they don't exist
describe("CurrentFunctionality", () => {
  it("maintains existing behavior", () => {
    expect(currentBehavior()).toBe(expectedResult);
  });
});
```

### 2. Make Small, Incremental Changes

**Don't:** Rewrite everything at once  
**Do:** Make one small improvement at a time

### 3. Test After Each Change

Run tests after every refactoring step to ensure behavior is preserved.

### 4. Commit Frequently

Commit working code after each successful refactoring step.

## Common Refactoring Patterns

**Extract Function:**

```javascript
// ❌ Before: Long function with multiple responsibilities
function processOrder(order) {
  // Validate order
  if (!order.items || order.items.length === 0) {
    throw new Error("Order must have items");
  }
  if (!order.customer || !order.customer.email) {
    throw new Error("Customer email required");
  }

  // Calculate total
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }

  // Apply discount
  if (order.coupon) {
    const discount = getDiscount(order.coupon);
    total = total * (1 - discount);
  }

  // Process payment
  // ... more code
}

// ✅ After: Extracted focused functions
function processOrder(order) {
  validateOrder(order);
  const total = calculateOrderTotal(order);
  const finalTotal = applyDiscount(total, order.coupon);
  return processPayment(order, finalTotal);
}

function validateOrder(order) {
  if (!order.items || order.items.length === 0) {
    throw new Error("Order must have items");
  }
  if (!order.customer || !order.customer.email) {
    throw new Error("Customer email required");
  }
}

function calculateOrderTotal(order) {
  return order.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}

function applyDiscount(total, coupon) {
  if (!coupon) return total;
  const discount = getDiscount(coupon);
  return total * (1 - discount);
}
```

**Remove Duplication:**

```javascript
// ❌ Before: Duplicated logic
function formatUserName(user) {
  return `${user.firstName} ${user.lastName}`;
}

function formatAdminName(admin) {
  return `${admin.firstName} ${admin.lastName}`;
}

// ✅ After: Single function
function formatFullName(person) {
  return `${person.firstName} ${person.lastName}`;
}
```

**Simplify Conditionals:**

```javascript
// ❌ Before: Complex nested conditions
function getShippingCost(order) {
  if (order.total > 100) {
    if (order.isPremium) {
      return 0;
    } else {
      return 5;
    }
  } else {
    if (order.isPremium) {
      return 5;
    } else {
      return 10;
    }
  }
}

// ✅ After: Early returns and clear logic
function getShippingCost(order) {
  if (order.isPremium && order.total > 100) return 0;
  if (order.isPremium) return 5;
  if (order.total > 100) return 5;
  return 10;
}
```

**Replace Magic Numbers with Constants:**

```javascript
// ❌ Before: Magic numbers
function calculateDiscount(price) {
  if (price > 1000) {
    return price * 0.15;
  }
  return price * 0.05;
}

// ✅ After: Named constants
const BULK_ORDER_THRESHOLD = 1000;
const BULK_DISCOUNT_RATE = 0.15;
const REGULAR_DISCOUNT_RATE = 0.05;

function calculateDiscount(price) {
  const rate =
    price > BULK_ORDER_THRESHOLD ? BULK_DISCOUNT_RATE : REGULAR_DISCOUNT_RATE;
  return price * rate;
}
```

## Refactoring Checklist

- [ ] Tests exist and pass before refactoring
- [ ] Each refactoring step is small and focused
- [ ] Tests pass after each change
- [ ] No functional behavior changes
- [ ] Code is more readable after refactoring
- [ ] Performance hasn't degraded
- [ ] Documentation updated if needed
- [ ] Changes committed incrementally

## Red Flags (Stop and Reconsider)

🚩 **Tests are failing**  
→ Revert and try smaller steps

🚩 **Refactoring is taking hours**  
→ Break into smaller changes

🚩 **Not sure if code works**  
→ Add tests first, then refactor

🚩 **Changing behavior "while we're at it"**  
→ Keep refactoring separate from feature changes

## Output Format

Provide refactoring plan:

1. **Current Issues**: What makes the code difficult
2. **Refactoring Goals**: What we want to improve
3. **Step-by-Step Plan**: Incremental changes in order
4. **Code Examples**: Before and after for each step
5. **Testing Strategy**: How to verify correctness
6. **Checkpoint**: When to commit working code

Focus on maintainability and clarity—better code is code that's easier to change.
