# Comprehensive Prompt Testing Plan

**Date Created**: 2026-02-11  
**Branch**: feature/test-implementation  
**Total Prompts**: 22  
**Test Subject**: `/demo-app` - Intentionally flawed web application

---

## Testing Categories

### Category 1: Web Quality & Performance (8 prompts)

1. **lighthouse-audit.prompt.md**
   - **Purpose**: Run comprehensive Lighthouse audit
   - **Test Input**: `#lighthouse-audit` targeting http://localhost:8080
   - **Expected Output**: 
     - Performance score and breakdown
     - Accessibility issues identified
     - Best practices recommendations
     - SEO findings
   - **Success Criteria**: Identifies all major demo-app issues
   - **Status**: ⏳ Not Started

2. **accessibility-review.prompt.md**
   - **Purpose**: Deep WCAG 2.1 Level AA compliance check
   - **Test Input**: `#accessibility-review` on demo-app/index.html
   - **Expected Output**:
     - Missing alt text on images
     - Form labels issues
     - Color contrast problems
     - Semantic HTML recommendations
   - **Success Criteria**: Detects all intentional a11y issues
   - **Status**: ⏳ Not Started

3. **accessibility-quick.prompt.md**
   - **Purpose**: Fast accessibility spot-check
   - **Test Input**: `#accessibility-quick` on current file
   - **Expected Output**: Quick wins and critical issues only
   - **Success Criteria**: Faster than full review, catches high-priority issues
   - **Status**: ⏳ Not Started

4. **performance-optimization.prompt.md**
   - **Purpose**: Guided performance improvement workflow
   - **Test Input**: `#performance-optimization` for demo-app
   - **Expected Output**:
     - Render-blocking resource recommendations
     - Image optimization suggestions
     - JavaScript bundle size analysis
   - **Success Criteria**: Provides actionable, prioritized optimizations
   - **Status**: ⏳ Not Started

5. **core-web-vitals.prompt.md**
   - **Purpose**: Check LCP, INP, CLS metrics
   - **Test Input**: `#core-web-vitals` for http://localhost:8080
   - **Expected Output**:
     - Current LCP, INP, CLS measurements
     - Comparison against thresholds
     - Specific improvement recommendations
   - **Success Criteria**: Accurately measures and explains CWV metrics
   - **Status**: ⏳ Not Started

6. **image-optimization.prompt.md**
   - **Purpose**: Image format and loading strategy recommendations
   - **Test Input**: `#image-optimization` on demo-app images
   - **Expected Output**:
     - WebP/AVIF format suggestions
     - Lazy loading recommendations
     - Responsive sizing guidance
     - Width/height attributes for CLS prevention
   - **Success Criteria**: Identifies placeholder.com images and suggests optimizations
   - **Status**: ⏳ Not Started

7. **bundle-analysis.prompt.md**
   - **Purpose**: JavaScript bundle optimization
   - **Test Input**: `#bundle-analysis` on demo-app/script.js
   - **Expected Output**:
     - Unused JavaScript detection
     - Code splitting recommendations
     - Tree shaking opportunities
   - **Success Criteria**: Identifies unnecessary code in script.js
   - **Status**: ⏳ Not Started

8. **performance-budget.prompt.md**
   - **Purpose**: Set and enforce performance budgets
   - **Test Input**: `#performance-budget` for demo-app
   - **Expected Output**:
     - Recommended budget values
     - Current vs budget comparison
     - Enforcement strategy
   - **Success Criteria**: Provides realistic budgets for simple app
   - **Status**: ⏳ Not Started

---

### Category 2: React-Specific (5 prompts)

**Note**: Demo-app is vanilla JS, so React prompts will be tested with hypothetical scenarios or by creating small React components.

9. **react-component-review.prompt.md**
   - **Purpose**: Review React component for best practices
   - **Test Input**: `#react-component-review` on sample component (create if needed)
   - **Expected Output**:
     - Hook usage validation
     - Performance optimization suggestions
     - Prop types/TypeScript recommendations
   - **Success Criteria**: Provides Vercel-pattern-aligned recommendations
   - **Status**: ⏳ Not Started

10. **react-hook-migration.prompt.md**
    - **Purpose**: Migrate class component to functional with hooks
    - **Test Input**: `#react-hook-migration` on sample class component
    - **Expected Output**:
      - Modern hooks-based refactor
      - Lifecycle method conversions
      - State management improvements
    - **Success Criteria**: Produces idiomatic hooks code
    - **Status**: ⏳ Not Started

11. **react-optimize-renders.prompt.md**
    - **Purpose**: Find and fix unnecessary re-renders
    - **Test Input**: `#react-optimize-renders` on sample component
    - **Expected Output**:
      - Re-render causes identified
      - React.memo, useMemo, useCallback suggestions
      - Profiling guidance
    - **Success Criteria**: Identifies performance anti-patterns
    - **Status**: ⏳ Not Started

12. **react-state-refactor.prompt.md**
    - **Purpose**: Improve state management patterns
    - **Test Input**: `#react-state-refactor` on component with state issues
    - **Expected Output**:
      - State lifting recommendations
      - Context API suggestions
      - External state library guidance if needed
    - **Success Criteria**: Provides scalable state patterns
    - **Status**: ⏳ Not Started

13. **react-accessibility.prompt.md**
    - **Purpose**: React-specific accessibility review
    - **Test Input**: `#react-accessibility` on React component
    - **Expected Output**:
      - JSX semantic HTML recommendations
      - ARIA attribute guidance
      - Focus management suggestions
    - **Success Criteria**: Identifies React-specific a11y issues
    - **Status**: ⏳ Not Started

---

### Category 3: General Development (9 prompts)

14. **code-review.prompt.md**
    - **Purpose**: Comprehensive code quality review
    - **Test Input**: `#code-review` on demo-app/script.js
    - **Expected Output**:
      - Code quality issues
      - Best practices violations
      - Maintainability improvements
    - **Success Criteria**: Catches inline onclick handlers, lack of error handling
    - **Status**: ⏳ Not Started

15. **security-review.prompt.md**
    - **Purpose**: Security vulnerability analysis
    - **Test Input**: `#security-review` on demo-app files
    - **Expected Output**:
      - XSS vulnerabilities
      - Dependency security issues
      - CSP recommendations
    - **Success Criteria**: Identifies potential security risks
    - **Status**: ⏳ Not Started

16. **test-generation.prompt.md**
    - **Purpose**: Generate test cases for code
    - **Test Input**: `#test-generation` for demo-app functions
    - **Expected Output**:
      - Unit test setup
      - Test cases for functions
      - Edge case coverage
    - **Success Criteria**: Produces runnable tests
    - **Status**: ⏳ Not Started

17. **debug-session.prompt.md**
    - **Purpose**: Interactive debugging assistance
    - **Test Input**: `#debug-session` with hypothetical bug scenario
    - **Expected Output**:
      - Debugging strategy
      - Potential root causes
      - Debugging tool recommendations
    - **Success Criteria**: Provides systematic debugging approach
    - **Status**: ⏳ Not Started

18. **document-api.prompt.md**
    - **Purpose**: Generate API documentation
    - **Test Input**: `#document-api` on hypothetical API endpoint
    - **Expected Output**:
      - Request/response schemas
      - Authentication details
      - Error codes
      - Usage examples
    - **Success Criteria**: Produces comprehensive API docs
    - **Status**: ⏳ Not Started

19. **document-component.prompt.md**
    - **Purpose**: Generate component documentation
    - **Test Input**: `#document-component` on demo-app sections
    - **Expected Output**:
      - Component purpose
      - Props/parameters
      - Usage examples
      - Related components
    - **Success Criteria**: Produces clear, helpful documentation
    - **Status**: ⏳ Not Started

20. **refactor-guide.prompt.md**
    - **Purpose**: Systematic refactoring guidance
    - **Test Input**: `#refactor-guide` on demo-app/script.js
    - **Expected Output**:
      - Refactoring strategy
      - Step-by-step plan
      - Risk assessment
    - **Success Criteria**: Provides safe refactoring path
    - **Status**: ⏳ Not Started

21. **readme-generator.prompt.md**
    - **Purpose**: Generate project README
    - **Test Input**: `#readme-generator` for demo-app
    - **Expected Output**:
      - Project description
      - Setup instructions
      - Usage guide
      - Contributing guidelines
    - **Success Criteria**: Produces comprehensive README
    - **Status**: ⏳ Not Started

22. **browser-compatibility.prompt.md**
    - **Purpose**: Check cross-browser support
    - **Test Input**: `#browser-compatibility` on demo-app code
    - **Expected Output**:
      - Browser support matrix
      - Polyfill recommendations
      - Feature detection guidance
    - **Success Criteria**: Identifies compatibility issues
    - **Status**: ⏳ Not Started

---

## Testing Workflow

### Phase 1: Environment Setup (COMPLETE ✅)
- [x] Verify Lighthouse CLI installed
- [x] Verify demo-app has intentional issues
- [x] Create testing documentation structure

### Phase 2: Baseline Audit
- [ ] Start local server (python3 -m http.server 8080)
- [ ] Run baseline Lighthouse audit
- [ ] Document current performance/accessibility scores
- [ ] Establish metrics for comparison

### Phase 3: Systematic Testing
- [ ] Test each prompt in order
- [ ] Document actual vs expected results
- [ ] Note any issues or unexpected behavior
- [ ] Capture before/after examples where applicable

### Phase 4: Result Analysis
- [ ] Calculate success rate (prompts working as expected)
- [ ] Identify patterns in issues or failures
- [ ] Document common user interaction flows
- [ ] Note any MCP integration issues

### Phase 5: Documentation Update
- [ ] Update VALIDATION.md with findings
- [ ] Create example usage guide
- [ ] Document best practices discovered
- [ ] Update implementation roadmap with validation status

---

## Success Metrics

**Target**: 90%+ of prompts work as expected on first try

**Key Measurements**:
- **Prompt Accuracy**: Does output match expected results?
- **MCP Integration**: Do automated tools invoke correctly?
- **Actionability**: Are recommendations implementable?
- **Pattern References**: Do responses cite web-quality-skills/Vercel?

---

## Notes

- Demo-app intentionally has ~15 accessibility and performance issues
- React prompts may need sample components created
- Document any prompts that require user context/clarification
- Note which prompts benefit most from MCP automation

---

## Quick Command Reference

```bash
# Start demo server
cd demo-app && python3 -m http.server 8080

# Run Lighthouse audit
lighthouse http://localhost:8080 --view

# Run Lighthouse and save results
lighthouse http://localhost:8080 --output=json --output-path=./reports/test.json

# Quick accessibility check (if axe-cli installed)
axe http://localhost:8080

# Kill server when done
lsof -ti:8080 | xargs kill
```
