---
name: react-accessibility
description: "React-specific accessibility patterns, testing, and WCAG compliance in JSX"
---

# React Accessibility Patterns

Comprehensive guide to implementing accessible React components. Covers JSX-specific patterns, React hooks for accessibility, testing with jest-axe and React Testing Library, and common React a11y anti-patterns.

**Focus**: React implementation patterns for WCAG 2.1 Level AA compliance

***

## Why React Accessibility Matters

**React-Specific Challenges:**

- JSX syntax can obscure semantic HTML
- Component composition can break document structure
- Client-side routing breaks browser navigation
- Dynamic content updates need ARIA live regions
- Focus management in single-page applications
- Event handlers on non-semantic elements

**Benefits of Accessible React:**

- Larger user base (15-20% of users rely on assistive tech)
- Better SEO (semantic HTML helps crawlers)
- Improved keyboard navigation for power users
- Legal compliance (ADA, Section 508, WCAG)
- Better component design (accessibility forces good patterns)

***

## 1. Semantic HTML in JSX

### ✅ Use Semantic Elements

**Buttons vs Divs:**

```jsx
// ❌ BAD: div with onClick (not keyboard accessible)
function SaveButton() {
  return (
    <div className="button" onClick={handleSave}>
      Save
    </div>
  );
}

// ✅ GOOD: semantic button element
function SaveButton() {
  return (
    <button type="button" onClick={handleSave}>
      Save
    </button>
  );
}
```

**Links vs Buttons:**

```jsx
// ❌ BAD: button for navigation
function NavItem() {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/about")}>About</button>;
}

// ✅ GOOD: link for navigation
import { Link } from "react-router-dom";

function NavItem() {
  return <Link to="/about">About</Link>;
}
```

**Form Labels:**

```jsx
// ❌ BAD: no label association
function EmailInput() {
  return (
    <div>
      <span>Email</span>
      <input type="email" name="email" />
    </div>
  );
}

// ✅ GOOD: proper label association
function EmailInput() {
  const id = useId(); // React 18+

  return (
    <div>
      <label htmlFor={id}>Email</label>
      <input type="email" id={id} name="email" />
    </div>
  );
}
```

**Headings Hierarchy:**

```jsx
// ❌ BAD: skipping heading levels, using divs
function ProductCard() {
  return (
    <div>
      <div className="title">Product Name</div>
      <h4>Details</h4> {/* Skipped h2, h3 */}
    </div>
  );
}

// ✅ GOOD: proper heading hierarchy
function ProductCard({ level = 2 }) {
  const Heading = `h${level}`; // Dynamic heading level

  return (
    <article>
      <Heading>Product Name</Heading>
      <h3>Details</h3>
    </article>
  );
}
```

***

## 2. ARIA in React

### When to Use ARIA

**Rule of thumb**: Use semantic HTML first, ARIA only when necessary.

```jsx
// ❌ BAD: Unnecessary ARIA
<button role="button" aria-label="Close">Close</button>

// ✅ GOOD: Semantic HTML sufficient
<button type="button">Close</button>

// ✅ GOOD: ARIA when semantic HTML insufficient
<button type="button" aria-label="Close">
  <XIcon /> {/* Icon-only button needs aria-label */}
</button>
```

### Common ARIA Patterns in React

**Toggle Button:**

```jsx
function ToggleButton() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <button
      type="button"
      aria-expanded={isExpanded}
      aria-controls="content-panel"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {isExpanded ? "Collapse" : "Expand"}
    </button>
  );
}
```

**Tabs:**

```jsx
function Tabs({ tabs, defaultTab = 0 }) {
  const [selectedTab, setSelectedTab] = useState(defaultTab);

  return (
    <div>
      <div role="tablist" aria-label="Content sections">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selectedTab === index}
            aria-controls={`panel-${tab.id}`}
            tabIndex={selectedTab === index ? 0 : -1}
            onClick={() => setSelectedTab(index)}
            onKeyDown={(e) => handleTabKeyDown(e, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={selectedTab !== index}
          tabIndex={0}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );

  function handleTabKeyDown(e, currentIndex) {
    let newIndex = currentIndex;

    if (e.key === "ArrowRight") {
      newIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      newIndex = 0;
    } else if (e.key === "End") {
      newIndex = tabs.length - 1;
    } else {
      return; // Don't prevent default for other keys
    }

    e.preventDefault();
    setSelectedTab(newIndex);
    document.getElementById(`tab-${tabs[newIndex].id}`).focus();
  }
}
```

**Modal Dialog:**

```jsx
function Modal({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Trap focus in modal
  useEffect(() => {
    if (!isOpen) return;

    // Save previously focused element
    previousFocusRef.current = document.activeElement;

    // Focus first focusable element in modal
    const focusableElements = dialogRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Restore focus when modal closes
    return () => {
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      ref={dialogRef}
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <h2 id="dialog-title">{title}</h2>
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="close-button"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
```

**Live Regions (Dynamic Content):**

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!query) return;

    setIsLoading(true);
    setStatusMessage("Searching...");

    searchAPI(query)
      .then((data) => {
        setResults(data);
        setStatusMessage(`Found ${data.length} results for "${query}"`);
      })
      .catch(() => {
        setStatusMessage("Search failed. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query]);

  return (
    <div>
      {/* Screen reader announcement */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only" // Visually hidden but announced
      >
        {statusMessage}
      </div>

      <ul aria-label="Search results">
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

***

## 3. Focus Management

### Focus After Actions

```jsx
// ✅ Focus management after delete action
function TodoList() {
  const [todos, setTodos] = useState([]);
  const todoRefs = useRef({});

  const deleteTodo = (id, index) => {
    setTodos(todos.filter((t) => t.id !== id));

    // Focus next item, or previous if last item deleted
    const nextIndex = index < todos.length - 1 ? index : index - 1;
    const nextTodoId = todos[nextIndex]?.id;

    if (nextTodoId) {
      setTimeout(() => {
        todoRefs.current[nextTodoId]?.focus();
      }, 0);
    }
  };

  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={todo.id}>
          {todo.text}
          <button
            ref={(el) => (todoRefs.current[todo.id] = el)}
            onClick={() => deleteTodo(todo.id, index)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

### Skip Links (SPA Navigation)

```jsx
function Layout({ children }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <nav>
        <NavigationMenu />
      </nav>

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}

// CSS for skip link (visible on focus)
// .skip-link {
//   position: absolute;
//   top: -40px;
//   left: 0;
//   background: #000;
//   color: #fff;
//   padding: 8px;
//   z-index: 100;
// }
//
// .skip-link:focus {
//   top: 0;
// }
```

### Focus on Route Change

```jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function useFocusOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    // Focus main content on route change for screen readers
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
    }

    // Announce page change to screen readers
    const pageTitle = document.title;
    const announcement = document.createElement("div");
    announcement.setAttribute("role", "status");
    announcement.setAttribute("aria-live", "polite");
    announcement.textContent = `Navigated to ${pageTitle}`;
    announcement.className = "sr-only";

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [location]);
}

// Use in App component
function App() {
  useFocusOnRouteChange();

  return <Routes>{/* routes */}</Routes>;
}
```

***

## 4. Keyboard Navigation

### Custom Interactive Components

```jsx
// ✅ Full keyboard support for custom dropdown
function Dropdown({ label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        setIsOpen(!isOpen);
        break;

      case "Escape":
        setIsOpen(false);
        buttonRef.current?.focus();
        break;

      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
        }
        break;

      case "Home":
        e.preventDefault();
        setFocusedIndex(0);
        break;

      case "End":
        e.preventDefault();
        setFocusedIndex(options.length - 1);
        break;

      default:
        break;
    }
  };

  const selectOption = (option) => {
    onChange(option);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div className="dropdown">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="dropdown-label"
        onKeyDown={handleKeyDown}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span id="dropdown-label">{label}:</span> {value || "Select..."}
      </button>

      {isOpen && (
        <ul ref={listRef} role="listbox" aria-label={label}>
          {options.map((option, index) => (
            <li
              key={option.id}
              role="option"
              aria-selected={option.value === value}
              className={index === focusedIndex ? "focused" : ""}
              onClick={() => selectOption(option)}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

***

## 5. React Hooks for Accessibility

### useId (React 18+)

```jsx
// ✅ Generate unique IDs for form elements
function FormField({ label, type = "text" }) {
  const id = useId();
  const errorId = `${id}-error`;
  const [error, setError] = useState("");

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <span id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
```

### Custom useAnnouncement Hook

```jsx
// Custom hook for screen reader announcements
function useAnnouncement() {
  const [announcement, setAnnouncement] = useState("");

  const announce = useCallback((message, priority = "polite") => {
    setAnnouncement(""); // Clear first to ensure re-announcement

    setTimeout(() => {
      setAnnouncement(message);
    }, 100);
  }, []);

  return {
    announce,
    AnnouncementRegion: () => (
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    ),
  };
}

// Usage
function SaveButton() {
  const { announce, AnnouncementRegion } = useAnnouncement();

  const handleSave = async () => {
    try {
      await saveData();
      announce("Changes saved successfully");
    } catch (err) {
      announce("Failed to save changes");
    }
  };

  return (
    <>
      <button onClick={handleSave}>Save</button>
      <AnnouncementRegion />
    </>
  );
}
```

### Custom useFocusTrap Hook

```jsx
function useFocusTrap(isActive) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);

    // Focus first element
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleTabKey);
    };
  }, [isActive]);

  return containerRef;
}

// Usage
function Modal({ isOpen, onClose, children }) {
  const modalRef = useFocusTrap(isOpen);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
```

***

## 6. Testing Accessibility in React

### Setup: jest-axe

```bash
npm install --save-dev jest-axe @testing-library/jest-dom
```

```javascript
// setupTests.js
import "@testing-library/jest-dom";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);
```

### Basic Accessibility Tests

```jsx
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Button } from "./Button";

describe("Button accessibility", () => {
  test("should not have accessibility violations", async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  test("should be keyboard accessible", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });

    // Focus button
    button.focus();
    expect(button).toHaveFocus();

    // Press Enter key
    fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
    expect(handleClick).toHaveBeenCalled();
  });

  test("should have proper ARIA attributes when disabled", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });
});
```

### Testing Focus Management

```jsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal focus management", () => {
  test("should focus first element when opened", () => {
    const { rerender } = render(
      <Modal isOpen={false}>
        <button>First</button>
        <button>Second</button>
      </Modal>,
    );

    // Open modal
    rerender(
      <Modal isOpen={true}>
        <button>First</button>
        <button>Second</button>
      </Modal>,
    );

    const firstButton = screen.getByRole("button", { name: /first/i });
    expect(firstButton).toHaveFocus();
  });

  test("should trap focus within modal", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button>Outside</button>
        <Modal isOpen={true}>
          <button>First</button>
          <button>Last</button>
        </Modal>
      </div>,
    );

    const firstButton = screen.getByRole("button", { name: /first/i });
    const lastButton = screen.getByRole("button", { name: /last/i });

    // Tab from last should go to first
    lastButton.focus();
    await user.tab();
    expect(firstButton).toHaveFocus();

    // Shift+Tab from first should go to last
    await user.tab({ shift: true });
    expect(lastButton).toHaveFocus();
  });

  test("should restore focus when closed", () => {
    const { rerender } = render(
      <>
        <button>Trigger</button>
        <Modal isOpen={false}>
          <button>Inside</button>
        </Modal>
      </>,
    );

    const trigger = screen.getByRole("button", { name: /trigger/i });
    trigger.focus();

    // Open modal
    rerender(
      <>
        <button>Trigger</button>
        <Modal isOpen={true}>
          <button>Inside</button>
        </Modal>
      </>,
    );

    // Close modal
    rerender(
      <>
        <button>Trigger</button>
        <Modal isOpen={false}>
          <button>Inside</button>
        </Modal>
      </>,
    );

    // Focus should return to trigger
    expect(trigger).toHaveFocus();
  });
});
```

### Testing ARIA Attributes

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "./Accordion";

describe("Accordion ARIA", () => {
  test("should have correct ARIA attributes", async () => {
    const user = userEvent.setup();

    render(
      <Accordion title="Section 1">
        <p>Content</p>
      </Accordion>,
    );

    const button = screen.getByRole("button", { name: /section 1/i });
    const content = screen.getByText(/content/i);

    // Initially collapsed
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", content.id);
    expect(content).toHaveAttribute("aria-hidden", "true");

    // After click
    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(content).toHaveAttribute("aria-hidden", "false");
  });
});
```

### Testing with Screen Readers (Manual)

```jsx
// Annotate components with data-testid for screen reader testing
function AlertMessage({ type, message }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      data-testid="alert-message"
      className={`alert-${type}`}
    >
      {message}
    </div>
  );
}

// Manual testing checklist:
// □ Turn on VoiceOver (Mac): Cmd + F5
// □ Turn on NVDA (Windows): Ctrl + Alt + N
// □ Navigate with Tab key
// □ Verify announcements are clear and helpful
// □ Check focus indicators are visible
// □ Test with screen reader shortcuts (H for headings, etc.)
```

***

## 7. Common React A11y Anti-Patterns

### ❌ Anti-Pattern 1: Div Soup

```jsx
// ❌ BAD: Non-semantic markup
<div className="card">
  <div className="header">Title</div>
  <div className="content">Text...</div>
  <div className="button" onClick={handleClick}>
    Click
  </div>
</div>

// ✅ GOOD: Semantic HTML
<article className="card">
  <h2>Title</h2>
  <p>Text...</p>
  <button type="button" onClick={handleClick}>
    Click
  </button>
</article>
```

### ❌ Anti-Pattern 2: Missing Alt Text

```jsx
// ❌ BAD: No alt text
<img src={user.avatar} />

// ❌ BAD: Redundant alt text
<img src={user.avatar} alt="User avatar image" />

// ✅ GOOD: Descriptive alt text
<img src={user.avatar} alt={user.name} />

// ✅ GOOD: Decorative image
<img src={decoration} alt="" role="presentation" />
```

### ❌ Anti-Pattern 3: Click Handlers on Divs

```jsx
// ❌ BAD: Not keyboard accessible
<div onClick={handleDelete}>Delete</div>

// ✅ GOOD: Use button with proper semantics
<button type="button" onClick={handleDelete}>
  Delete
</button>
```

### ❌ Anti-Pattern 4: Placeholder as Label

```jsx
// ❌ BAD: Placeholder disappears, no label
<input type="text" placeholder="Enter your name" />

// ✅ GOOD: Visible label
<label htmlFor="name">
  Name
  <input type="text" id="name" placeholder="John Doe" />
</label>
```

### ❌ Anti-Pattern 5: Inaccessible Modals

```jsx
// ❌ BAD: No focus trap, no keyboard support
function BadModal({ isOpen, children }) {
  if (!isOpen) return null;
  return <div className="modal">{children}</div>;
}

// ✅ GOOD: Full accessibility support (see Modal example in section 2)
```

***

## 8. Accessibility Checklist for React Components

### Component Review Checklist

- [ ] **Semantic HTML**: Uses proper HTML elements (button, nav, main, etc.)
- [ ] **Keyboard Navigation**: All interactive elements accessible via Tab key
- [ ] **Focus Management**: Focus moves logically, visible focus indicators
- [ ] **ARIA Attributes**: Proper roles, labels, and states when semantic HTML insufficient
- [ ] **Color Contrast**: Text meets 4.5:1 (normal) or 3:1 (large/UI) contrast ratio
- [ ] **Form Labels**: All inputs have associated labels (htmlFor + id)
- [ ] **Alt Text**: Images have descriptive alt text or alt="" if decorative
- [ ] **Heading Structure**: Proper h1-h6 hierarchy, no skipped levels
- [ ] **Error Messages**: Associated with inputs via aria-describedby
- [ ] **Live Regions**: Dynamic content changes announced (aria-live)
- [ ] **Testing**: Passes jest-axe, manual keyboard testing, screen reader testing

***

## 9. Tools and Resources

### Testing Tools

```bash
# Automated accessibility testing
npm install --save-dev jest-axe @axe-core/react

# ESLint plugin for a11y
npm install --save-dev eslint-plugin-jsx-a11y

# React Testing Library (includes accessibility queries)
npm install --save-dev @testing-library/react @testing-library/user-event
```

### Browser Extensions

- **axe DevTools** (Chrome/Firefox): Automated a11y audits
- **WAVE** (Chrome/Firefox): Visual feedback on a11y
- **Lighthouse** (Chrome): Accessibility score and recommendations
- **React DevTools**: Component tree and props inspection

### Screen Readers

- **macOS**: VoiceOver (Cmd + F5)
- **Windows**: NVDA (free), JAWS (paid)
- **Linux**: Orca

### Key Resources

- [React Accessibility Docs](https://react.dev/learn/accessibility)
- [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM WCAG 2 Checklist](https://webaim.org/standards/wcag/checklist)
- [Inclusive Components](https://inclusive-components.design/)
- [A11y Project](https://www.a11yproject.com/)

***

## Summary

**React Accessibility Strategy:**

1. **Start with Semantic HTML**: Use proper elements (button, nav, main, heading hierarchy)
2. **Add ARIA When Needed**: Only when semantic HTML is insufficient
3. **Manage Focus**: Modal traps, route changes, action feedback
4. **Test Thoroughly**: jest-axe, keyboard navigation, screen readers
5. **Use Hooks**: useId, custom hooks for announcements and focus management

**Common Fixes:**

- Replace `<div onClick>` with `<button>`
- Add `htmlFor` to `<label>` elements
- Provide alt text for images
- Ensure 4.5:1 color contrast
- Add keyboard event handlers alongside mouse handlers
- Use aria-live for dynamic content updates
- Implement focus traps for modals

**Remember**: Accessibility is not optional - it's a core requirement for quality React applications.
