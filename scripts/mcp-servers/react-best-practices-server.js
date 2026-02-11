#!/usr/bin/env node

/**
 * React Best Practices MCP Server
 * 
 * Provides tools for React component analysis, pattern recommendations,
 * and performance optimization guidance.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Pattern references from Vercel Agent Skills (authoritative source)
const VERCEL_PATTERNS_URL = 'https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices';
const VERCEL_PATTERN_CATEGORIES = {
  waterfalls: {
    priority: 'CRITICAL',
    url: `${VERCEL_PATTERNS_URL}#1-eliminating-waterfalls`,
    rules: ['async-defer-await', 'async-parallel', 'async-dependencies', 'async-api-routes', 'async-suspense-boundaries'],
  },
  bundleSize: {
    priority: 'CRITICAL',
    url: `${VERCEL_PATTERNS_URL}#2-bundle-size-optimization`,
    rules: ['bundle-barrel-imports', 'bundle-dynamic-imports', 'bundle-defer-third-party', 'bundle-conditional', 'bundle-preload'],
  },
  serverPerformance: {
    priority: 'HIGH',
    url: `${VERCEL_PATTERNS_URL}#3-server-side-performance`,
    rules: ['server-auth-actions', 'server-cache-react', 'server-cache-lru', 'server-dedup-props', 'server-parallel-fetching'],
  },
  rerender: {
    priority: 'MEDIUM',
    url: `${VERCEL_PATTERNS_URL}#5-re-render-optimization`,
    rules: ['rerender-memo', 'rerender-derived-state', 'rerender-functional-setstate', 'rerender-use-callback', 'rerender-use-memo'],
  },
};

const server = new Server(
  {
    name: 'react-best-practices',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Tool: review_component
 * Analyze React component code for best practices
 */
function reviewComponent(code) {
  const issues = [];
  const suggestions = [];
  const score = { total: 0, passed: 0 };
  
  // Check for functional components vs class components
  if (code.includes('class ') && code.includes('extends React.Component')) {
    issues.push({
      severity: 'medium',
      rule: 'Use functional components',
      description: 'Class components are legacy. Use functional components with hooks.',
      line: code.split('\n').findIndex(line => line.includes('class ')) + 1,
    });
  } else {
    score.passed++;
  }
  score.total++;
  
  // Check for proper prop types or TypeScript
  if (!code.includes('PropTypes') && !code.includes(': React.FC') && !code.includes('interface ')) {
    issues.push({
      severity: 'low',
      rule: 'Define prop types',
      description: 'Add PropTypes or TypeScript interfaces for type safety.',
      suggestion: 'Use TypeScript or PropTypes.shape() to validate props',
    });
  } else {
    score.passed++;
  }
  score.total++;
  
  // Check for useEffect with missing dependencies
  const useEffectMatches = code.match(/useEffect\([^)]*\)/g) || [];
  useEffectMatches.forEach((match, idx) => {
    if (!match.includes(', []') && !match.includes(', [')) {
      issues.push({
        severity: 'high',
        rule: 'useEffect dependencies',
        description: 'useEffect missing dependency array - may cause infinite loops or stale closures',
        suggestion: 'Add dependency array as second argument to useEffect',
      });
    } else {
      score.passed++;
    }
    score.total++;
  });
  
  // Check for inline function definitions in JSX
  const inlineFunctions = code.match(/(?:onClick|onChange|onSubmit)=\{(?:\(\)|function)/g);
  if (inlineFunctions && inlineFunctions.length > 0) {
    issues.push({
      severity: 'medium',
      rule: 'Avoid inline function definitions',
      description: 'Inline functions in JSX create new instances on every render',
      suggestion: 'Extract function definitions outside JSX or use useCallback for event handlers',
    });
  } else {
    score.passed++;
  }
  score.total++;
  
  // Check for key prop in list rendering
  if (code.includes('.map(') && !code.includes('key=')) {
    issues.push({
      severity: 'high',
      rule: 'Missing key prop',
      description: 'Lists rendered with .map() must have unique key props',
      suggestion: 'Add key={item.id} or key={index} (only if no unique id available)',
    });
  } else if (code.includes('.map(')) {
    score.passed++;
    score.total++;
  }
  
  // Check for useState with objects (should consider useReducer)
  const complexState = code.match(/useState\(\{[^\}]*\}/g);
  if (complexState && complexState.length > 0) {
    suggestions.push({
      type: 'optimization',
      title: 'Consider useReducer for complex state',
      description: 'Complex state objects are better managed with useReducer',
      benefit: 'Clearer state updates, easier testing, better separation of concerns',
    });
  }
  
  // Check for proper naming conventions
  const componentNameMatch = code.match(/(?:function|const)\s+([A-Z][a-zA-Z0-9]*)/);
  if (componentNameMatch) {
    const name = componentNameMatch[1];
    if (name[0] !== name[0].toUpperCase()) {
      issues.push({
        severity: 'low',
        rule: 'Component naming',
        description: 'Component names should start with uppercase letter',
      });
    } else {
      score.passed++;
    }
    score.total++;
  }
  
  // Check for React.memo usage (suggest if complex rendering)
  if (code.split('\n').length > 50 && !code.includes('React.memo') && !code.includes('memo(')) {
    suggestions.push({
      type: 'performance',
      title: 'Consider React.memo',
      description: 'Large component may benefit from memoization',
      benefit: 'Prevents unnecessary re-renders when props haven\'t changed',
      when: 'Component is pure and re-renders frequently with same props',
    });
  }
  
  // Best practices suggestions
  const bestPractices = [
    {
      category: 'Component Design',
      practices: [
        'Keep components small and focused (single responsibility)',
        'Extract reusable logic into custom hooks',
        'Use composition over prop drilling',
        'Prefer controlled components for form inputs',
      ],
    },
    {
      category: 'Performance',
      practices: [
        'Use React.memo() for expensive pure components',
        'Implement code splitting with React.lazy() and Suspense',
        'Use useMemo for expensive computations',
        'Use useCallback for functions passed to child components',
      ],
    },
    {
      category: 'State Management',
      practices: [
        'Keep state as local as possible',
        'Use useReducer for complex state logic',
        'Consider Context API for moderate state sharing',
        'Use external libraries (Zustand, Jotai) for complex global state',
      ],
    },
  ];
  
  return {
    score: {
      percentage: score.total > 0 ? Math.round((score.passed / score.total) * 100) : 0,
      passed: score.passed,
      total: score.total,
    },
    issues: issues.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
    suggestions,
    bestPractices,
    overallAssessment: 
      issues.filter(i => i.severity === 'high').length > 0 ? 'Needs Improvement' :
      issues.length === 0 ? 'Excellent' : 'Good',
    reference: {
      source: 'Vercel Agent Skills - React Best Practices',
      url: VERCEL_PATTERNS_URL,
      categories: Object.keys(VERCEL_PATTERN_CATEGORIES).map(key => ({
        name: key,
        priority: VERCEL_PATTERN_CATEGORIES[key].priority,
        url: VERCEL_PATTERN_CATEGORIES[key].url,
      })),
    },
  };
}

/**
 * Tool: suggest_hooks
 * Recommend appropriate React hooks for common patterns
 */
function suggestHooks(useCase) {
  const hookGuide = {
    'state management': {
      hooks: ['useState', 'useReducer'],
      guidance: {
        useState: {
          when: 'Simple state (primitives, simple objects)',
          example: 'const [count, setCount] = useState(0);',
        },
        useReducer: {
          when: 'Complex state logic with multiple sub-values or when next state depends on previous',
          example: 'const [state, dispatch] = useReducer(reducer, initialState);',
        },
      },
    },
    'side effects': {
      hooks: ['useEffect', 'useLayoutEffect'],
      guidance: {
        useEffect: {
          when: 'Data fetching, subscriptions, DOM mutations (after render)',
          example: 'useEffect(() => { fetchData(); }, [dependencies]);',
          important: 'Always specify dependency array to avoid infinite loops',
        },
        useLayoutEffect: {
          when: 'DOM measurements, synchronous DOM updates (before paint)',
          example: 'useLayoutEffect(() => { measureElement(); }, []);',
          caution: 'Blocks visual updates - use sparingly',
        },
      },
    },
    'performance optimization': {
      hooks: ['useMemo', 'useCallback', 'React.memo'],
      guidance: {
        useMemo: {
          when: 'Expensive calculations that should only re-compute when dependencies change',
          example: 'const expensiveValue = useMemo(() => computeExpensive(a, b), [a, b]);',
          important: 'Profile first - premature optimization can add complexity',
        },
        useCallback: {
          when: 'Memoize callback functions passed to child components',
          example: 'const handleClick = useCallback(() => doSomething(id), [id]);',
          important: 'Only useful if child component is memoized with React.memo',
        },
      },
    },
    'context': {
      hooks: ['useContext'],
      guidance: {
        useContext: {
          when: 'Access context values without prop drilling',
          example: 'const theme = useContext(ThemeContext);',
          pattern: 'Create custom hook: const useTheme = () => useContext(ThemeContext);',
        },
      },
    },
    'refs': {
      hooks: ['useRef', 'useImperativeHandle'],
      guidance: {
        useRef: {
          when: 'Access DOM elements or persist values across renders without re-rendering',
          example: 'const inputRef = useRef(null); ... <input ref={inputRef} />',
        },
        useImperativeHandle: {
          when: 'Customize instance value exposed by ref (rare, advanced)',
          example: 'useImperativeHandle(ref, () => ({ focus: () => inputRef.current.focus() }));',
        },
      },
    },
  };
  
  const matchedGuide = Object.entries(hookGuide).find(([key]) => 
    useCase.toLowerCase().includes(key.toLowerCase())
  );
  
  if (matchedGuide) {
    return matchedGuide[1];
  }
  
  return {
    message: 'Use case not matched. Here are all available React hooks:',
    allHooks: hookGuide,
    commonPatterns: [
      {
        pattern: 'Data fetching',
        hooks: 'useState + useEffect',
        example: `
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetch(url)
    .then(res => res.json())
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, [url]);
        `.trim(),
      },
      {
        pattern: 'Form handling',
        hooks: 'useState or useReducer + custom hook',
        example: `
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  
  return { values, handleChange };
}
        `.trim(),
      },
    ],
  };
}

/**
 * Tool: detect_anti_patterns
 * Identify common React anti-patterns in code
 */
function detectAntiPatterns(code) {
  const antiPatterns = [];
  
  // Anti-pattern: Mutating state directly
  if (code.match(/this\.state\.[a-zA-Z]+\s*=/)) {
    antiPatterns.push({
      pattern: 'Direct state mutation',
      severity: 'critical',
      description: 'Never mutate state directly',
      found: 'this.state.x = ...',
      correct: 'this.setState({ x: ... }) or setX(...) with hooks',
    });
  }
  
  // Anti-pattern: Using index as key
  if (code.includes('.map((') && code.match(/key=\{index\}/)) {
    antiPatterns.push({
      pattern: 'Using array index as key',
      severity: 'high',
      description: 'Index as key causes issues when list order changes',
      found: 'key={index}',
      correct: 'key={item.id} - use stable unique identifier',
    });
  }
  
  // Anti-pattern: Spreading props indiscriminately
  if (code.includes('{...props}') && !code.includes('// eslint-disable')) {
    antiPatterns.push({
      pattern: 'Spreading all props',
      severity: 'medium',
      description: 'Spreading all props can pass unwanted props to DOM elements',
      found: '{...props}',
      correct: 'Destructure and spread only needed props: const { specific, ...rest } = props',
    });
  }
  
  // Anti-pattern: Not cleaning up effects
  const useEffectBlocks = code.match(/useEffect\(\(\) => \{[\s\S]*?\}\s*,/g) || [];
  useEffectBlocks.forEach(block => {
    if ((block.includes('setInterval') || block.includes('addEventListener')) && !block.includes('return')) {
      antiPatterns.push({
        pattern: 'Missing cleanup in useEffect',
        severity: 'high',
        description: 'Effects with subscriptions or timers must return cleanup function',
        found: 'useEffect with timer/listener but no return',
        correct: 'return () => { clearInterval(id); or removeEventListener(...); }',
      });
    }
  });
  
  // Anti-pattern: Derived state
  if (code.match(/const \[[a-zA-Z]+, set[A-Z][a-zA-Z]+\] = useState\([^)]*props\.[a-zA-Z]+/)) {
    antiPatterns.push({
      pattern: 'Derived state from props',
      severity: 'medium',
      description: 'Storing props in state creates sync issues',
      found: 'useState(props.value)',
      correct: 'Use props directly or useMemo for expensive computations',
    });
  }
  
  // Anti-pattern: Creating components inside render
  if (code.match(/render.*function [A-Z][a-zA-Z]*\(/)) {
    antiPatterns.push({
      pattern: 'Component defined inside render',
      severity: 'high',
      description: 'Defining components inside render causes remount on every render',
      found: 'function ComponentName() inside render or component body',
      correct: 'Move component definition outside parent component',
    });
  }
  
  return {
    found: antiPatterns.length,
    antiPatterns: antiPatterns.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
    status: antiPatterns.length === 0 ? 'No anti-patterns detected' : 
            antiPatterns.some(p => p.severity === 'critical') ? 'Critical issues found' :
            'Issues found - review and fix',
  };
}

/**
 * Tool: optimize_renders
 * Suggest render optimization strategies
 */
function optimizeRenders(code, description = '') {
  const optimizations = [];
  
  // Check if component could benefit from memoization
  const isPureComponent = !code.includes('useState') && 
                          !code.includes('useReducer') &&
                          !code.includes('useEffect');
  
  if (isPureComponent && !code.includes('React.memo')) {
    optimizations.push({
      type: 'React.memo',
      reason: 'Component appears to be pure (no state or effects)',
      implementation: `
export default React.memo(ComponentName);
// Or with custom comparison:
export default React.memo(ComponentName, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id; // return true if equal
});
      `.trim(),
      benefit: 'Skip re-renders when props haven\'t changed',
      caution: 'Only helps if parent re-renders frequently',
    });
  }
  
  // Check for expensive computations
  if (description.toLowerCase().includes('expensive') || 
      description.toLowerCase().includes('slow') ||
      code.includes('filter(') || code.includes('sort(') || code.includes('reduce(')) {
    optimizations.push({
      type: 'useMemo',
      reason: 'Expensive computation or array operations detected',
      implementation: `
const expensiveValue = useMemo(() => {
  return items.filter(item => item.active).sort((a, b) => a.name.localeCompare(b.name));
}, [items]); // Only recompute when dependencies change
      `.trim(),
      benefit: 'Cache computation result between renders',
      caution: 'Profile first to confirm it\'s actually expensive',
    });
  }
  
  // Check for callback functions passed to children
  if (code.includes('onClick={') || code.includes('onChange={') || code.includes('onSubmit={')) {
    optimizations.push({
      type: 'useCallback',
      reason: 'Event handlers passed to child components',
      implementation: `
const handleClick = useCallback((id) => {
  doSomething(id);
}, [dependencies]); // Only recreate when dependencies change

// Then in JSX:
<ChildComponent onClick={handleClick} />
      `.trim(),
      benefit: 'Prevent child re-renders when used with React.memo',
      caution: 'Only useful if child is wrapped in React.memo',
    });
  }
  
  // Check for list rendering optimization
  if (code.includes('.map(')) {
    optimizations.push({
      type: 'React.lazy + Suspense',
      reason: 'Rendering lists - consider virtualization for large lists',
      implementation: `
// For large lists (100+ items), use virtualization:
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={400}
  itemCount={items.length}
  itemSize={50}
>
  {({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  )}
</FixedSizeList>
      `.trim(),
      benefit: 'Only render visible items',
      when: 'List has 100+ items',
    });
  }
  
  // Code splitting suggestion
  if (code.split('\n').length > 100 || description.toLowerCase().includes('large')) {
    optimizations.push({
      type: 'Code Splitting',
      reason: 'Large component - consider splitting',
      implementation: `
// Split into smaller components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function Parent() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
      `.trim(),
      benefit: 'Reduce initial bundle size, load on demand',
    });
  }
  
  // General optimization guidelines
  const guidelines = [
    {
      category: 'Profiling',
      tips: [
        'Use React DevTools Profiler to identify slow components',
        'Check "Highlight updates" to see unnecessary re-renders',
        'Measure before and after optimization',
      ],
    },
    {
      category: 'Common Causes of Re-renders',
      tips: [
        'Inline object/array creation in props: prop={{}} or prop={[]}',
        'Inline function definitions: onClick={() => ...}',
        'Context value changes unnecessarily',
        'Parent component re-renders',
      ],
    },
    {
      category: 'Optimization Priority',
      tips: [
        '1. Fix unnecessary re-renders first (biggest impact)',
        '2. Add memoization to expensive computations',
        '3. Consider React.memo for pure components',
        '4. Use code splitting for large bundles',
      ],
    },
  ];
  
  return {
    optimizations,
    guidelines,
    workflow: [
      '1. Profile component with React DevTools',
      '2. Identify what causes re-renders',
      '3. Apply targeted optimizations',
      '4. Measure improvement',
      '5. Iterate',
    ],
    reminders: [
      'Premature optimization is the root of all evil',
      'Always measure before optimizing',
      'Readability > Performance (until performance is a problem)',
    ],
  };
}

/**
 * Tool: suggest_state_management
 * Recommend state management approach based on requirements
 */
function suggestStateManagement(requirements) {
  const approaches = [
    {
      name: 'useState + useReducer',
      complexity: 'low',
      when: [
        'Single component or small component tree',
        'State is simple and doesn\'t need sharing',
        'No complex state updates',
      ],
      pros: ['Built-in', 'Simple', 'No dependencies', 'Easy to understand'],
      cons: ['Prop drilling for deep trees', 'Can get messy with complex state'],
      example: `
const [user, setUser] = useState(null);
const [theme, setTheme] = useState('light');
      `.trim(),
    },
    {
      name: 'Context API',
      complexity: 'medium',
      when: [
        'Moderate state sharing across components',
        'Theme, auth, or config data',
        'Want to avoid prop drilling',
        '2-5 different contexts',
      ],
      pros: ['Built-in React', 'No dependencies', 'Good for app-level state'],
      cons: ['Re-renders all consumers on any change', 'Can be verbose', 'No middleware'],
      example: `
const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

const useUser = () => useContext(UserContext);
      `.trim(),
    },
    {
      name: 'Zustand',
      complexity: 'medium',
      when: [
        'Need simple global state without complexity',
        'Want minimal boilerplate',
        'Need good performance',
      ],
      pros: ['Minimal boilerplate', 'Good performance', 'DevTools', 'Flexible'],
      cons: ['External dependency', 'Less structured than Redux'],
      example: `
import create from 'zustand';

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

// In component:
const user = useStore((state) => state.user);
const setUser = useStore((state) => state.setUser);
      `.trim(),
    },
    {
      name: 'Jotai',
      complexity: 'medium',
      when: [
        'Bottom-up atomic state approach',
        'Need derived state',
        'Want minimal re-renders',
      ],
      pros: ['Atomic approach', 'Minimal re-renders', 'TypeScript-first', 'Modern'],
      cons: ['External dependency', 'Different mental model'],
      example: `
import { atom, useAtom } from 'jotai';

const userAtom = atom(null);
const themeAtom = atom('light');

// In component:
const [user, setUser] = useAtom(userAtom);
      `.trim(),
    },
    {
      name: 'Redux Toolkit',
      complexity: 'high',
      when: [
        'Large application with complex state',
        'Need middleware (logging, persistence)',
        'Need time-travel debugging',
        'Team familiar with Redux patterns',
      ],
      pros: ['Most mature', 'Excellent DevTools', 'Middleware ecosystem', 'Structured'],
      cons: ['Boilerplate', 'Learning curve', 'Can be overkill for simple apps'],
      example: `
import { createSlice, configureStore } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

const store = configureStore({
  reducer: { user: userSlice.reducer },
});
      `.trim(),
    },
  ];
  
  // Simple recommendation logic
  const reqLower = requirements.toLowerCase();
  let recommended;
  
  if (reqLower.includes('complex') || reqLower.includes('large') || reqLower.includes('enterprise')) {
    recommended = 'Redux Toolkit';
  } else if (reqLower.includes('simple') || reqLower.includes('small') || reqLower.includes('minimal')) {
    recommended = 'useState + useReducer';
  } else if (reqLower.includes('theme') || reqLower.includes('auth') || reqLower.includes('config')) {
    recommended = 'Context API';
  } else if (reqLower.includes('performance') || reqLower.includes('atomic')) {
    recommended = 'Jotai';
  } else if (reqLower.includes('global') && !reqLower.includes('complex')) {
    recommended = 'Zustand';
  } else {
    recommended = 'Context API'; // Safe default
  }
  
  return {
    recommended: approaches.find(a => a.name === recommended),
    allOptions: approaches,
    decisionTree: {
      question1: 'How many components need this state?',
      answers: {
        '1-3 components': 'useState or props',
        '4-10 components in same tree': 'Context API or props',
        'Many components across app': 'Zustand, Jotai, or Redux',
      },
      question2: 'How complex is the state logic?',
      answers: {
        'Simple values': 'useState',
        'Complex objects with multiple sub-values': 'useReducer or external library',
        'Needs middleware or time-travel': 'Redux Toolkit',
      },
    },
    migration: 'Start simple (useState), migrate to Context when prop drilling becomes painful, consider external library when Context causes performance issues or becomes too complex.',
  };
}

/**
 * Tool: test_strategy
 * Suggest testing approach for React components
 */
function testStrategy(componentType, code = '') {
  const strategies = {
    'presentational': {
      description: 'Component that just renders UI based on props',
      testingFocus: ['Rendering with different props', 'Conditional rendering', 'Styling', 'Accessibility'],
      example: `
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });
  
  it('renders as disabled', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  
  it('applies variant classes', () => {
    const { container } = render(<Button variant="primary">Click me</Button>);
    expect(container.firstChild).toHaveClass('btn-primary');
  });
});
      `.trim(),
    },
    'container': {
      description: 'Component with state and business logic',
      testingFocus: ['User interactions', 'State changes', 'Side effects', 'Error handling'],
      example: `
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from './TodoList';

describe('TodoList', () => {
  it('adds new todo', async () => {
    const user = userEvent.setup();
    render(<TodoList />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'New task');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    
    expect(screen.getByText('New task')).toBeInTheDocument();
  });
  
  it('toggles todo completion', async () => {
    const user = userEvent.setup();
    render(<TodoList />);
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    expect(checkbox).toBeChecked();
  });
});
      `.trim(),
    },
    'form': {
      description: 'Form component with validation',
      testingFocus: ['Input validation', 'Form submission', 'Error messages', 'Field interactions'],
      example: `
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText('Email');
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Blur input
    
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });
  
  it('submits form with valid data', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();
    render(<LoginForm onSubmit={handleSubmit} />);
    
    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));
    
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      });
    });
  });
});
      `.trim(),
    },
    'data-fetching': {
      description: 'Component that fetches and displays data',
      testingFocus: ['Loading states', 'Success states', 'Error handling', 'Empty states'],
      example: `
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import UserProfile from './UserProfile';

const server = setupServer(
  rest.get('/api/user/:id', (req, res, ctx) => {
    return res(ctx.json({ name: 'John Doe', email: 'john@example.com' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('UserProfile', () => {
  it('shows loading state', () => {
    render(<UserProfile userId="123" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  it('displays user data', async () => {
    render(<UserProfile userId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });
  
  it('handles errors', async () => {
    server.use(
      rest.get('/api/user/:id', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    render(<UserProfile userId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
      `.trim(),
    },
  };
  
  const matchedStrategy = strategies[componentType.toLowerCase()] || strategies['presentational'];
  
  return {
    componentType,
    strategy: matchedStrategy,
    generalGuidelines: [
      'Test behavior, not implementation',
      'Use @testing-library/react for user-centric tests',
      'Mock external dependencies (APIs, third-party libraries)',
      'Test accessibility (use toBeAccessible, getByRole)',
      'Aim for 80%+ coverage on critical paths',
    ],
    tooling: {
      recommended: ['Vitest or Jest', '@testing-library/react', '@testing-library/user-event', 'MSW (Mock Service Worker)'],
      accessibility: ['jest-axe', 'Testing Library accessibility queries'],
      visualRegression: ['Chromatic', 'Percy', 'Storybook'],
    },
    testingPyramid: {
      unit: '70% - Individual functions and hooks',
      integration: '20% - Component interactions',
      e2e: '10% - Critical user flows (use Playwright or Cypress)',
    },
  };
}

// Register request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'review_component',
        description: 'Analyze React component code for best practices, anti-patterns, and optimization opportunities. Returns issues, suggestions, and score.',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'React component code to review',
            },
          },
          required: ['code'],
        },
      },
      {
        name: 'suggest_hooks',
        description: 'Get guidance on which React hooks to use for specific use cases (state management, side effects, performance, etc.)',
        inputSchema: {
          type: 'object',
          properties: {
            useCase: {
              type: 'string',
              description: 'Use case description (e.g., "state management", "side effects", "performance optimization")',
            },
          },
          required: ['useCase'],
        },
      },
      {
        name: 'detect_anti_patterns',
        description: 'Identify common React anti-patterns in code (direct state mutation, wrong keys, missing cleanup, etc.)',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'React code to analyze for anti-patterns',
            },
          },
          required: ['code'],
        },
      },
      {
        name: 'optimize_renders',
        description: 'Suggest render optimization strategies (React.memo, useMemo, useCallback, code splitting, virtualization)',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'React component code to optimize',
            },
            description: {
              type: 'string',
              description: 'Optional description of performance issues',
            },
          },
          required: ['code'],
        },
      },
      {
        name: 'suggest_state_management',
        description: 'Recommend appropriate state management approach (useState, Context API, Zustand, Jotai, Redux) based on requirements',
        inputSchema: {
          type: 'object',
          properties: {
            requirements: {
              type: 'string',
              description: 'State management requirements description',
            },
          },
          required: ['requirements'],
        },
      },
      {
        name: 'test_strategy',
        description: 'Get testing strategy and examples for React components (unit, integration, accessibility testing)',
        inputSchema: {
          type: 'object',
          properties: {
            componentType: {
              type: 'string',
              enum: ['presentational', 'container', 'form', 'data-fetching'],
              description: 'Type of component to test',
            },
            code: {
              type: 'string',
              description: 'Optional component code for context',
            },
          },
          required: ['componentType'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    let result;
    
    switch (name) {
      case 'review_component':
        result = reviewComponent(args.code);
        break;
      case 'suggest_hooks':
        result = suggestHooks(args.useCase);
        break;
      case 'detect_anti_patterns':
        result = detectAntiPatterns(args.code);
        break;
      case 'optimize_renders':
        result = optimizeRenders(args.code, args.description);
        break;
      case 'suggest_state_management':
        result = suggestStateManagement(args.requirements);
        break;
      case 'test_strategy':
        result = testStrategy(args.componentType, args.code);
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: error.message,
            tool: name,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error('React Best Practices MCP Server running...');
