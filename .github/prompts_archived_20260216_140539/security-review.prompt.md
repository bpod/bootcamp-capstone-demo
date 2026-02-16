---
name: Security Review
description: Review code for security vulnerabilities and risks
agent: agent
tools: ["readonly"]
---

# Security Review

Review code for common security vulnerabilities, following OWASP Top 10 and industry best practices.

## Security Review Scope

1. **Input Validation**: User input sanitization and validation
2. **Authentication & Authorization**: Proper access control
3. **Data Protection**: Sensitive data handling
4. **Third-Party Dependencies**: Known vulnerabilities
5. **API Security**: Secure API design and usage
6. **Client-Side Security**: XSS, CSRF, and injection prevention

## OWASP Top 10 Checks

**1. Injection (SQL, NoSQL, Command):**
```javascript
// ❌ Bad - vulnerable to SQL injection
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ Good - parameterized query
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

**2. Broken Authentication:**
```javascript
// ❌ Bad - weak password requirements
if (password.length >= 6) { /* accept */ }

// ✅ Good - strong requirements
if (password.length >= 12 && /[A-Z]/.test(password) && 
    /[a-z]/.test(password) && /[0-9]/.test(password)) {
  /* accept */
}
```

**3. Sensitive Data Exposure:**
```javascript
// ❌ Bad - logging sensitive data
console.log('User login:', { username, password });

// ✅ Good - never log credentials
console.log('User login:', { username, timestamp: Date.now() });
```

**4. XSS (Cross-Site Scripting):**
```javascript
// ❌ Bad - vulnerable to XSS
element.innerHTML = userInput;

// ✅ Good - sanitize or use textContent
element.textContent = userInput;
// Or use DOMPurify for rich content
element.innerHTML = DOMPurify.sanitize(userInput);
```

**5. Broken Access Control:**
```javascript
// ❌ Bad - client-side only authorization
if (user.role === 'admin') {
  showAdminPanel();
}

// ✅ Good - server-side validation required
// Client checks for UI only; server must validate all requests
```

**6. Security Misconfiguration:**
```javascript
// ❌ Bad - exposing stack traces
app.use((err, req, res, next) => {
  res.json({ error: err.stack });
});

// ✅ Good - generic error messages
app.use((err, req, res, next) => {
  res.json({ error: 'An error occurred' });
  logger.error(err.stack); // Log internally only
});
```

**7. Vulnerable Dependencies:**
```bash
# Check for known vulnerabilities
npm audit
# or
pnpm audit
```

**8. Insufficient Logging:**
```javascript
// ❌ Bad - no audit trail
function deleteUser(userId) {
  db.delete(userId);
}

// ✅ Good - log security-relevant actions
function deleteUser(userId, adminId) {
  logger.audit({ action: 'DELETE_USER', userId, adminId, timestamp });
  db.delete(userId);
}
```

## Frontend-Specific Security

**localStorage Security:**
```javascript
// ❌ Bad - storing sensitive data in localStorage
localStorage.setItem('token', authToken);

// ✅ Good - use httpOnly cookie for tokens
// Server sets: Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict
```

**API Key Protection:**
```javascript
// ❌ Bad - API key in frontend code
const API_KEY = 'sk_live_abc123xyz';

// ✅ Good - proxy through backend
// Frontend calls /api/data, backend adds API key
```

**Content Security Policy:**
```html
<!-- ✅ Good - define CSP headers -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'">
```

## Security Checklist

- [ ] All user input is validated and sanitized
- [ ] Sensitive data (passwords, tokens) never logged
- [ ] No hardcoded secrets or API keys in code
- [ ] XSS prevention (avoid innerHTML with user data)
- [ ] CSRF protection for state-changing requests
- [ ] HTTPS used for all production traffic
- [ ] Dependencies scanned for vulnerabilities
- [ ] Authentication tokens use httpOnly cookies
- [ ] Proper authorization checks on backend
- [ ] Error messages don't leak sensitive information

## Output Format

Provide security assessment:

1. **Critical Vulnerabilities**: Immediate security risks
2. **High Priority**: Significant security concerns
3. **Medium Priority**: Security improvements needed
4. **Best Practices**: Recommendations for hardening
5. **Code Examples**: Secure implementation patterns
6. **Remediation Steps**: How to fix each issue

Prioritize vulnerabilities by exploitability and impact.
