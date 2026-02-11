---
name: security-review
description: Comprehensive security review covering OWASP Top 10, dependency vulnerabilities, and secure coding practices
---

Perform security analysis of ${selection} or ${file} covering OWASP Top 10 and frontend security.

**Workflow:**

1. **Scan**: Check for XSS, injection, auth issues, vulnerable deps, data exposure
2. **Prioritize**: Rank by severity (Critical → Low)
3. **Fix**: Provide secure code examples
4. **Validate**: Suggest security testing tools

**Security Dimensions**:

- **Input Validation**: XSS prevention, sanitization, CSP
- **Authentication**: Token storage (httpOnly cookies > localStorage), session management
- **Authorization**: Role checks, resource access control
- **Dependencies**: Run `npm audit`, update vulnerable packages
- **Data Protection**: No secrets in client code, encrypt sensitive data
- **Network Security**: HTTPS only, proper CORS configuration

**Critical Issues** (fix immediately):

- XSS vulnerabilities (unescaped user input)
- Exposed API keys/secrets in client code
- Missing authentication on sensitive endpoints
- Critical dependency vulnerabilities

**Tools**: npm audit, ESLint security plugins, Content Security Policy

Provide specific fixes with security rationale.

---

## Step 1: Automated Security Scanning

### Dependency Vulnerability Audit

**Run npm audit:**

```bash
# Check for known vulnerabilities
npm audit

# Show detailed report
npm audit --json > security-audit.json

# Attempt automatic fixes (test thoroughly after!)
npm audit fix

# Fix including breaking changes (use with caution)
npm audit fix --force
```

**Analyze Results:**

```json
{
  "vulnerabilities": {
    "critical": 2, // ⚠️ Fix immediately
    "high": 5, // Fix soon
    "moderate": 12, // Review and plan fix
    "low": 8 // Monitor, fix when convenient
  }
}
```

**Prioritization:**

1. **Critical**: Active exploits, RCE, authentication bypass → **Fix today**
2. **High**: XSS, CSRF, SQL injection → **Fix this week**
3. **Moderate**: DoS, information disclosure → **Fix this sprint**
4. **Low**: Minor issues, theoretical attacks → **Backlog**

### Additional Security Tools

```bash
# Snyk vulnerability scanning (install: npm i -g snyk)
snyk test
snyk monitor  # Continuous monitoring

# npm outdated - identify old dependencies
npm outdated

# Check license compliance
npx license-checker --summary

# Static analysis
npx eslint . --ext .js,.jsx,.ts,.tsx
```

---

## Step 2: OWASP Top 10 Analysis

### 1. Broken Access Control

**Check for:**

```javascript
// ❌ BAD: Client-side only authorization
function AdminPanel() {
  const user = useUser();

  if (user.role !== "admin") {
    return <div>Access denied</div>;
  }

  // Attacker can bypass by modifying user object in DevTools!
  return <AdminControls />;
}

// ✅ GOOD: Server validates on every request
function AdminPanel() {
  const { data, error } = useSWR("/api/admin/data"); // Server checks auth

  if (error?.status === 403) {
    return <div>Access denied</div>;
  }

  return <AdminControls data={data} />;
}
```

**Server-Side Validation Required:**

```javascript
// API route: app/api/admin/data.js
export async function GET(request) {
  const session = await getSession(request);

  // Always validate server-side
  if (!session || session.user.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  const data = await getAdminData();
  return Response.json(data);
}
```

**Check Every Endpoint:**

- [ ] Authentication verified server-side
- [ ] Authorization (role/permission) checked
- [ ] No sensitive operations in client-only code
- [ ] Object-level authorization (user can only access their own data)

### 2. Cryptographic Failures

**Check for:**

```javascript
// ❌ BAD: Storing sensitive data in localStorage
localStorage.setItem("credit-card", cardNumber); // XSS can steal!
localStorage.setItem("password", password); // Never store passwords!

// ✅ GOOD: Don't store sensitive data client-side
// Or use secure, httpOnly cookies (server-set, inaccessible to JS)

// ❌ BAD: Weak encryption
const encrypted = btoa(password); // Base64 is encoding, NOT encryption!

// ✅ GOOD: Use Web Crypto API for client-side encryption (if needed)
async function encryptData(data, key) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: window.crypto.getRandomValues(new Uint8Array(12)) },
    key,
    dataBuffer,
  );

  return encrypted;
}

// ✅ BETTER: Keep encryption server-side
// Client sends data over HTTPS, server handles encryption/storage
```

**HTTPS Enforcement:**

```javascript
// Check all API calls use HTTPS
const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL.startsWith("https://")) {
  console.error("⚠️ API URL must use HTTPS:", API_URL);
}

// Redirect HTTP to HTTPS (if hosting allows)
if (
  location.protocol !== "https:" &&
  !location.hostname.includes("localhost")
) {
  location.replace(
    `https:${location.href.substring(location.protocol.length)}`,
  );
}
```

**Check:**

- [ ] All external requests use HTTPS
- [ ] No sensitive data in localStorage/sessionStorage
- [ ] Passwords never stored client-side
- [ ] API keys not in client code (use environment variables, proxy)

### 3. Injection Attacks

**SQL Injection (Backend, but frontend can help):**

```javascript
// ❌ BAD: Building SQL queries with concatenation (backend)
const query = `SELECT * FROM users WHERE id = ${userId}`; // SQLi vulnerable!

// ✅ GOOD: Use parameterized queries (backend)
const query = "SELECT * FROM users WHERE id = ?";
db.execute(query, [userId]);

// Frontend: Validate input format
function isValidUserId(id) {
  return /^\d+$/.test(id); // Only numeric IDs
}
```

**XSS (Cross-Site Scripting):**

```javascript
// ❌ BAD: Injecting user input as HTML
function UserComment({ comment }) {
  return <div dangerouslySetInnerHTML={{ __html: comment }} />;
  // Attacker comment: "<img src=x onerror='alert(document.cookie)'>"
}

// ✅ GOOD: React escapes by default
function UserComment({ comment }) {
  return <div>{comment}</div>; // Safe, React escapes automatically
}

// ❌ BAD: Using eval or Function constructor
const userCode = getUserInput();
eval(userCode); // Can execute arbitrary JavaScript!

// ✅ GOOD: Never use eval with user input
// If you need dynamic code, use safe alternatives (sandboxed iframe, Web Workers)

// ❌ BAD: Setting innerHTML directly
element.innerHTML = userInput; // XSS vulnerability!

// ✅ GOOD: Use textContent or React
element.textContent = userInput; // Safe, no HTML parsing
```

**Framework Protection:**

React, Vue, Angular automatically escape content, BUT watch out for:

```javascript
// XSS risks in React:
<div dangerouslySetInnerHTML={{ __html: userInput }} />  // ⚠️ Dangerous!
<a href={userInput}>Link</a>  // ⚠️ Can be javascript:alert(1)
<img src={userInput} />       // ⚠️ Can have onerror handler

// Sanitize URLs
function isSafeURL(url) {
  const allowedProtocols = ['http:', 'https:', 'mailto:'];
  try {
    const parsed = new URL(url, window.location.href);
    return allowedProtocols.includes(parsed.protocol);
  } catch {
    return false;
  }
}
```

**Content Security Policy (CSP):**

```html
<!-- Add to index.html or server headers -->
<meta
  http-equiv="Content-Security-Policy"
  content="
        default-src 'self';
        script-src 'self' https://trusted-cdn.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        connect-src 'self' https://api.example.com;
      "
/>
```

**Check:**

- [ ] User input never inserted as HTML without sanitization
- [ ] No eval(), Function(), or setTimeout(string)
- [ ] URLs validated before use in href/src attributes
- [ ] CSP headers configured
- [ ] React/Vue/Angular default escaping not bypassed

### 4. Insecure Design

**Check for:**

```javascript
// ❌ BAD: Security by obscurity
const API_KEY = "sk_live_abc123"; // Hardcoded, visible in source!

// ✅ GOOD: API key on server, or use public key with server verification
// .env.local (not committed)
VITE_PUBLIC_KEY=pk_abc123  # OK to expose
# Server validates with secret key

// ❌ BAD: Predictable patterns
const resetToken = Date.now().toString(); // Guessable!

// ✅ GOOD: Cryptographically secure random
const resetToken = crypto.randomUUID(); // Unguessable

// ❌ BAD: Security questions with guessable answers
"What's your favorite color?" // Easy to guess/research

// ✅ GOOD: Multi-factor authentication
// Password + TOTP/SMS + Hardware key
```

**Check:**

- [ ] No hardcoded secrets, API keys, passwords
- [ ] Secure random for tokens/IDs (crypto.randomUUID(), crypto.getRandomValues())
- [ ] Security controls not bypassable with simple changes
- [ ] Fail securely (deny by default, not allow)

### 5. Security Misconfiguration

**Check for:**

```javascript
// ❌ BAD: Exposing stack traces in production
if (error) {
  console.error(error.stack); // Reveals internal structure!
  return <div>Error: {error.stack}</div>;
}

// ✅ GOOD: Generic errors in production
if (error) {
  if (process.env.NODE_ENV === "development") {
    console.error(error.stack);
  }
  return <div>Something went wrong. Please try again.</div>;
}

// ❌ BAD: Debug features in production
if (window.location.search.includes("debug=true")) {
  window.DEBUG_MODE = true; // Attackers can enable!
}

// ✅ GOOD: Debug only in development
if (process.env.NODE_ENV === "development") {
  window.DEBUG_MODE = true;
}

// Check headers
fetch("/api/data").then((response) => {
  // Should NOT see:
  // X-Powered-By: Express 4.18.2 (reveals tech stack)
  // Server: nginx/1.18.0 (reveals version)
});
```

**Environment Configuration:**

```bash
# .env.production
NODE_ENV=production
REACT_APP_API_URL=https://api.production.com
# No debug flags, no test accounts, no verbose logging

# .env.development
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3000
DEBUG=true
```

**Check:**

- [ ] No verbose error messages in production
- [ ] Debug features disabled in production
- [ ] Default passwords changed
- [ ] Unused features/dependencies removed
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)

### 6. Vulnerable and Outdated Components

**Check for:**

```bash
# Find outdated dependencies
npm outdated

# Example output:
# Package        Current  Wanted  Latest
# react          17.0.2   17.0.2  18.2.0  ← Major update available
# lodash         4.17.20  4.17.21 4.17.21 ← Security fix available!
```

**Update Strategy:**

```bash
# Update to latest patch versions (safe)
npm update

# Update to latest minor versions (test thoroughly)
npm update --depth 1

# Check for known vulnerabilities
npm audit

# Update specific package
npm install react@latest

# Check breaking changes before major updates
# Read CHANGELOG, migration guides
```

**Dependency Security:**

```javascript
// ❌ BAD: Importing entire library
import _ from "lodash"; // Bundles unused functions, larger attack surface

// ✅ GOOD: Import only what you need
import debounce from "lodash/debounce"; // Smaller bundle, less risk

// ❌ BAD: Using unmaintained packages
// Check npm page: "Last publish: 5 years ago" ⚠️

// ✅ GOOD: Choose actively maintained alternatives
// Check: Recent updates, active issues, community health
```

**Check:**

- [ ] No critical/high vulnerabilities (npm audit)
- [ ] Dependencies updated in last 12 months
- [ ] No deprecated packages
- [ ] Regular dependency update schedule
- [ ] Review release notes before updating

### 7. Identification and Authentication Failures

**Check for:**

```javascript
// ❌ BAD: Weak password requirements
function isValidPassword(password) {
  return password.length >= 6; // Too weak!
}

// ✅ GOOD: Strong password requirements
function isValidPassword(password) {
  return (
    password.length >= 12 &&
    /[a-z]/.test(password) && // Lowercase
    /[A-Z]/.test(password) && // Uppercase
    /[0-9]/.test(password) && // Number
    /[^a-zA-Z0-9]/.test(password) // Special char
  );
}

// ❌ BAD: No rate limiting on login
async function login(email, password) {
  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  // Brute force: Try 1000s of passwords
}

// ✅ GOOD: Backend implements rate limiting
// Frontend: Show CAPTCHA after failed attempts
const [failedAttempts, setFailedAttempts] = useState(0);

async function login(email, password) {
  if (failedAttempts >= 3) {
    return { error: "Too many attempts. Please wait 5 minutes." };
  }

  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    setFailedAttempts((prev) => prev + 1);
  }

  return response.json();
}
```

**Token Storage:**

```javascript
// ❌ BAD: JWT in localStorage (XSS can steal!)
localStorage.setItem("token", jwt);

// ✅ BETTER: httpOnly cookie (server sets, JS can't access)
// Server response:
// Set-Cookie: token=abc123; HttpOnly; Secure; SameSite=Strict

// Frontend: Cookie sent automatically with requests
fetch("/api/protected", {
  credentials: "include", // Include cookies
});

// ⚠️ If must use localStorage: Minimize XSS risk
// - Strong CSP
// - Sanitize all user input
// - Short token expiration
// - Refresh token rotation
```

**Session Management:**

```javascript
// ✅ Implement logout
async function logout() {
  // Clear client state
  localStorage.clear();
  sessionStorage.clear();

  // Invalidate server session
  await fetch("/api/logout", { method: "POST" });

  // Redirect to login
  window.location.href = "/login";
}

// ✅ Auto-logout on inactivity
useEffect(() => {
  let timeout;

  function resetTimeout() {
    clearTimeout(timeout);
    timeout = setTimeout(
      () => {
        logout(); // 15 minutes of inactivity
      },
      15 * 60 * 1000,
    );
  }

  window.addEventListener("mousemove", resetTimeout);
  window.addEventListener("keypress", resetTimeout);
  resetTimeout();

  return () => {
    clearTimeout(timeout);
    window.removeEventListener("mousemove", resetTimeout);
    window.removeEventListener("keypress", resetTimeout);
  };
}, []);
```

**Check:**

- [ ] Strong password requirements enforced
- [ ] Rate limiting on authentication endpoints
- [ ] Tokens stored securely (httpOnly cookies preferred)
- [ ] Multi-factor authentication available
- [ ] Session timeout implemented
- [ ] Logout functionality working

### 8. Software and Data Integrity Failures

**Check for:**

```javascript
// ❌ BAD: Loading scripts from untrusted CDN
<script src="http://random-cdn.com/lib.js"></script>

// ✅ GOOD: Use SRI (Subresource Integrity)
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-abc123..."
  crossorigin="anonymous"
></script>

// ❌ BAD: Accepting unverified data
const userData = JSON.parse(untrustedInput); // Could be malicious!

// ✅ GOOD: Validate data structure
function validateUser(data) {
  if (
    typeof data !== 'object' ||
    typeof data.id !== 'number' ||
    typeof data.name !== 'string' ||
    data.name.length > 100
  ) {
    throw new Error('Invalid user data');
  }
  return data;
}

const userData = validateUser(JSON.parse(input));
```

**Package Integrity:**

```bash
# Use package-lock.json to ensure consistent installs
git add package-lock.json
git commit -m "Lock dependency versions"

# Verify package integrity
npm ci  # Clean install using lockfile (CI/CD)

# Check for suspicious post-install scripts
cat node_modules/package-name/package.json | grep postinstall
```

**Check:**

- [ ] SRI hashes for external scripts/styles
- [ ] package-lock.json committed and up-to-date
- [ ] Input validation on untrusted data
- [ ] No auto-deserialization of untrusted data
- [ ] Review post-install scripts in dependencies

### 9. Security Logging and Monitoring Failures

**Check for:**

```javascript
// ❌ BAD: No logging of security events
async function login(email, password) {
  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return response.json();
}

// ✅ GOOD: Log security-relevant events
async function login(email, password) {
  console.log("[Security] Login attempt:", { email, timestamp: Date.now() });

  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    console.log("[Security] Login successful:", { email });
  } else {
    console.warn("[Security] Login failed:", {
      email,
      status: response.status,
      attempt: getFailedAttemptCount(email),
    });
  }

  return response.json();
}

// Frontend error tracking
window.addEventListener("error", (event) => {
  // Send to monitoring service (Sentry, LogRocket, etc.)
  sendErrorToMonitoring({
    message: event.message,
    stack: event.error?.stack,
    url: window.location.href,
    timestamp: Date.now(),
  });
});
```

**What to Log:**

- Authentication attempts (success/failure)
- Authorization failures (403 responses)
- Input validation failures
- Critical errors
- Unusual patterns (rapid requests, unexpected routes)

**What NOT to Log:**

- ❌ Passwords
- ❌ Credit card numbers
- ❌ Session tokens
- ❌ API keys
- ❌ Personal identifiable information (PII)

**Check:**

- [ ] Security events logged (auth, authz, errors)
- [ ] No sensitive data in logs
- [ ] Error tracking service integrated (Sentry, Rollbar)
- [ ] Monitoring alerts configured
- [ ] Logs retained for reasonable period

### 10. Server-Side Request Forgery (SSRF)

**Check for:**

```javascript
// ❌ BAD: User-controlled URL in backend request (backend vulnerability)
// Backend: app.get('/fetch', async (req, res) => {
//   const url = req.query.url;
//   const data = await fetch(url); // User can make server request internal services!
//   res.json(data);
// });

// ✅ GOOD: Whitelist allowed domains (backend)
// Backend:
const ALLOWED_DOMAINS = ["api.example.com", "cdn.example.com"];

function isAllowedURL(url) {
  const parsed = new URL(url);
  return ALLOWED_DOMAINS.includes(parsed.hostname);
}

// Frontend: Validate before sending to backend
async function fetchExternal(url) {
  const allowedDomains = ["api.example.com", "cdn.example.com"];
  const parsed = new URL(url);

  if (!allowedDomains.includes(parsed.hostname)) {
    throw new Error("Domain not allowed");
  }

  const response = await fetch("/api/proxy", {
    method: "POST",
    body: JSON.stringify({ url }),
  });

  return response.json();
}
```

**Check:**

- [ ] User input not directly used in backend URLs
- [ ] URL whitelist enforced server-side
- [ ] No access to internal networks via user input
- [ ] Metadata endpoints blocked (169.254.169.254)

---

## Step 3: Authentication & Authorization Review

### Token Handling

```javascript
// ✅ Check token storage
const tokenLocation = localStorage.getItem("token")
  ? "localStorage"
  : sessionStorage.getItem("token")
    ? "sessionStorage"
    : "cookies";

console.log("[Security] Token storage location:", tokenLocation);

// ⚠️ If localStorage: Recommend migrating to httpOnly cookies

// ✅ Check token expiration
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // Invalid token
  }
}

// ✅ Refresh token before expiration
useEffect(() => {
  const interval = setInterval(async () => {
    const token = getToken();
    if (token && isTokenExpired(token)) {
      await refreshToken();
    }
  }, 60000); // Check every minute

  return () => clearInterval(interval);
}, []);
```

### Authorization Checks

```javascript
// ✅ Check role-based access control
function ProtectedRoute({ children, requiredRole }) {
  const user = useUser();

  // Client-side check (UX)
  if (!user || user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  // Server validates on API calls
  return children;
}

// ✅ Resource-level authorization
async function deletePost(postId) {
  // Server checks if user owns this post
  const response = await fetch(`/api/posts/${postId}`, {
    method: 'DELETE'
  });

  if (response.status === 403) {
    alert('You cannot delete posts you don\\'t own');
    return;
  }

  return response.json();
}
```

---

## Step 4: Input Validation Review

### Validation Strategy

```javascript
// ✅ Validate early and often
function handleInput(value) {
  // 1. Type validation
  if (typeof value !== "string") {
    throw new Error("Expected string");
  }

  // 2. Format validation
  if (!/^[a-zA-Z0-9]+$/.test(value)) {
    throw new Error("Invalid format: alphanumeric only");
  }

  // 3. Length validation
  if (value.length < 3 || value.length > 50) {
    throw new Error("Length must be 3-50 characters");
  }

  // 4. Sanitization
  const sanitized = value.trim().toLowerCase();

  return sanitized;
}

// ✅ Form validation library (Zod, Yup)
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email().max(255),
  age: z.number().int().min(0).max(150),
  username: z.string().regex(/^[a-zA-Z0-9_]{3,20}$/),
});

function validateUser(data) {
  try {
    return userSchema.parse(data); // Throws on invalid
  } catch (error) {
    console.error("Validation error:", error.errors);
    return null;
  }
}
```

### SQL Injection Prevention (Frontend checks)

```javascript
// ⚠️ Backend should use parameterized queries, but frontend can help

// ✅ Detect suspicious input
function containsSQLInjection(input) {
  const sqlPatterns = [
    /(\bOR\b|\bAND\b).+[=<>]/i, // OR 1=1, AND 1=1
    /UNION.+SELECT/i,
    /DROP\s+TABLE/i,
    /--/, // SQL comment
    /;.*SELECT/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

// Alert if suspicious (but still send to backend for validation)
if (containsSQLInjection(userInput)) {
  console.warn(
    "[Security] Potential SQL injection attempt detected:",
    userInput,
  );
  // Log to security monitoring
}
```

---

## Step 5: Secure Coding Practices

### Environment Variables

```javascript
// ❌ BAD: Secrets in code
const API_KEY = "sk_live_abc123";

// ✅ GOOD: Environment variables
const API_KEY = import.meta.env.VITE_API_KEY;  // Vite
const API_KEY = process.env.REACT_APP_API_KEY; // Create React App

// ✅ Validate environment variables on startup
if (!import.meta.env.VITE_API_URL) {
  throw new Error('VITE_API_URL environment variable required');
}

// ❌ DON'T expose secrets in client code
// .env
VITE_API_KEY=sk_live_abc  ← Bundled in client JS, visible to users!

// ✅ DO: Keep secrets server-side
// Frontend uses public key, server uses secret key
```

### Secure Data Transmission

```javascript
// ✅ Always use HTTPS for sensitive data
async function sendPayment(paymentData) {
  // Verify HTTPS
  if (!API_URL.startsWith("https://")) {
    throw new Error("Payment requires HTTPS");
  }

  const response = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });

  return response.json();
}

// ✅ Don't log sensitive data
function logAPICall(url, body) {
  const sanitized = { ...body };

  // Remove sensitive fields
  delete sanitized.password;
  delete sanitized.creditCard;
  delete sanitized.ssn;

  console.log("[API]", url, sanitized);
}
```

### CORS Configuration

```javascript
// ✅ Server should restrict CORS origins
// Backend: Express example
// app.use(cors({
//   origin: 'https://myapp.com',  // Specific domain
//   credentials: true  // Allow cookies
// }));

// ❌ Avoid wildcard in production
// app.use(cors({ origin: '*' })); // Dangerous!

// Frontend: Send credentials if needed
fetch("https://api.example.com/data", {
  credentials: "include", // Send cookies
});
```

---

## Step 6: Generate Security Report

### Create Findings Document

```markdown
# Security Review Report - 2026-02-10

## Executive Summary

- Total issues: 23
- Critical: 2
- High: 5
- Medium: 10
- Low: 6

## Critical Issues (Fix Immediately)

### 1. Authentication Token in localStorage

**Risk:** XSS can steal authentication token  
**Location:** src/auth/AuthProvider.jsx:45  
**Impact:** Account takeover, unauthorized access  
**Effort:** Medium (3-4 hours)

**Recommendation:**
Migrate to httpOnly cookies set by server

**Code Change:**
\`\`\`javascript
// Before
localStorage.setItem('token', jwt);

// After
// Server sets cookie:
// Set-Cookie: token=abc; HttpOnly; Secure; SameSite=Strict
// Frontend: No manual token handling needed
\`\`\`

### 2. Dependency Vulnerability - lodash 4.17.20

**Risk:** Prototype pollution vulnerability  
**CVE:** CVE-2020-8203  
**Impact:** Potential RCE, data manipulation  
**Effort:** Low (10 minutes)

**Recommendation:**
Update lodash to 4.17.21+

**Command:**
\`\`\`bash
npm install lodash@latest
npm audit fix
\`\`\`

## High Priority Issues

[Continue with each issue...]

## Recommended Action Plan

**Sprint 1 (This Week):**

1. Fix 2 critical issues
2. Update vulnerable dependencies
3. Implement CSP headers

**Sprint 2 (Next Week):**

1. Fix 5 high priority issues
2. Add input validation
3. Implement rate limiting

**Sprint 3 (Following Week):**

1. Address medium priority issues
2. Add security logging
3. Penetration testing
```

---

## Variables

- `${workspaceFolder}` - Project root directory
- `${selection}` - Selected code to review (optional)

---

## Success Criteria

After running this prompt:

✅ npm audit run with no critical/high vulnerabilities  
✅ OWASP Top 10 risks assessed  
✅ Authentication/authorization reviewed  
✅ Input validation checked  
✅ Security report generated with prioritized fixes  
✅ Action plan created with timeline

---

## Example Usage

**Full Security Review:**

```
Run security-review prompt
> [AI performs comprehensive security analysis]
> [Generates report with prioritized issues]
```

**Focused Review:**

```
[Select authentication code]
Review this code for security vulnerabilities
```

**Dependency Audit:**

```
Check project for dependency vulnerabilities
```

---

## Security Checklist

Use this checklist for manual verification:

### Authentication

- [ ] Strong password requirements (12+ chars, mixed case, numbers, symbols)
- [ ] Rate limiting on login endpoints
- [ ] Account lockout after failed attempts
- [ ] Multi-factor authentication available
- [ ] Secure password reset flow
- [ ] Session timeout implemented
- [ ] Logout functionality working

### Authorization

- [ ] Server validates permissions on every request
- [ ] Client-side checks for UX only, not security
- [ ] Object-level authorization (users access only their data)
- [ ] Role-based access control implemented

### Data Protection

- [ ] No sensitive data in localStorage/sessionStorage
- [ ] HTTPS enforced for all requests
- [ ] No secrets in client-side code
- [ ] Sensitive data encrypted at rest (server-side)

### Input Validation

- [ ] All user input validated (type, format, length)
- [ ] No eval(), Function(), or similar with user input
- [ ] URLs validated before use in links/requests
- [ ] File uploads restricted by type and size

### XSS Prevention

- [ ] Framework default escaping not bypassed
- [ ] No dangerouslySetInnerHTML with user content
- [ ] CSP headers configured
- [ ] User-generated HTML sanitized (DOMPurify, etc.)

### Dependencies

- [ ] No npm audit critical/high vulnerabilities
- [ ] Dependencies updated in last 12 months
- [ ] No deprecated packages
- [ ] Minimal dependencies (unused packages removed)

### Configuration

- [ ] Debug features disabled in production
- [ ] Verbose errors disabled in production
- [ ] Environment variables used for configuration
- [ ] No default passwords or API keys

### Monitoring

- [ ] Error tracking service integrated
- [ ] Security events logged (auth, authz, errors)
- [ ] No sensitive data in logs
- [ ] Alerts configured for anomalies

---

## Follow-up Actions

After security review:

1. **Fix Critical Issues First** - Address within 24 hours
2. **Update Dependencies** - Run npm audit fix, test thoroughly
3. **Implement Monitoring** - Add error tracking, security logging
4. **Educate Team** - Share findings, document patterns
5. **Schedule Regular Reviews** - Monthly security audits
6. **Update Memory System** - Document vulnerabilities found, preventive patterns

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Web Security Basics (MDN)](https://developer.mozilla.org/en-US/docs/Web/Security)
- [npm Audit Documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [Snyk Vulnerability Database](https://security.snyk.io/)
