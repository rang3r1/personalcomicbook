# Coding Standards Document (CSD)

## 1. General Guidelines

### 1.1 File Organization
- One component per file
- Files should be named using PascalCase for components (e.g., `ComicPanel.tsx`)
- Utility files should be named using camelCase (e.g., `apiUtils.ts`)
- Test files should end with `.test.ts` or `.test.tsx`

### 1.2 Directory Structure
```
/src
  /components      # Reusable UI components
    /auth         # Authentication related components
    /comic        # Comic creation components
    /shared       # Shared/common components
  /hooks          # Custom React hooks
  /pages          # Page components
  /services       # API and external service integrations
  /store          # State management
  /styles         # Global styles and themes
  /types          # TypeScript type definitions
  /utils          # Utility functions
```

## 2. TypeScript Standards

### 2.1 Types and Interfaces
```typescript
// Use interfaces for objects that will be instantiated
interface User {
  id: string;
  email: string;
  subscription: SubscriptionLevel;
  createdAt: Date;
}

// Use type for unions, intersections, and simple types
type SubscriptionLevel = 'free' | 'basic' | 'pro';
type ComicStyle = 'manga' | 'superhero' | 'cartoon';
```

### 2.2 Naming Conventions
- Interfaces: PascalCase, noun (e.g., `User`, `Project`)
- Types: PascalCase (e.g., `SubscriptionLevel`)
- Variables: camelCase (e.g., `currentUser`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_PANELS_FREE_TIER`)
- Functions: camelCase, verb (e.g., `createProject`, `updatePanel`)

## 3. React Components

### 3.1 Component Structure
```typescript
import React from 'react';
import styles from './ComponentName.module.css';

interface ComponentNameProps {
  // Props definition
}

export const ComponentName: React.FC<ComponentNameProps> = ({ prop1, prop2 }) => {
  // Hooks
  // State management
  // Helper functions
  // Render
  return (
    <div className={styles.container}>
      {/* Component content */}
    </div>
  );
};
```

### 3.2 CSS Modules
- Use CSS Modules for component styling
- Class names should be camelCase
- Avoid inline styles except for dynamic values

## 4. API Integration

### 4.1 Service Functions
```typescript
// Service function naming: verb + noun
async function fetchUserProjects(userId: string): Promise<Project[]> {
  try {
    // API call
  } catch (error) {
    handleApiError(error);
  }
}
```

### 4.2 Error Handling
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

function handleApiError(error: unknown): never {
  // Error handling logic
  throw error;
}
```

## 5. State Management

### 5.1 React Query
- Use React Query for server state management
- Follow naming convention: use[Entity][Action]
```typescript
const useProjects = (userId: string) => {
  return useQuery(['projects', userId], () => fetchUserProjects(userId));
};
```

### 5.2 Zustand
- Use Zustand for client-side state management
- Store slices should be feature-based
```typescript
interface ComicStore {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
}
```

## 6. Constants

### 6.1 Environment Variables
```typescript
// src/config/env.ts
export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY,
} as const;
```

### 6.2 Feature Constants
```typescript
// src/constants/limits.ts
export const LIMITS = {
  FREE_TIER: {
    MAX_PROJECTS: 3,
    MAX_PANELS_PER_PROJECT: 10,
  },
  BASIC_TIER: {
    MAX_PROJECTS: 10,
    MAX_PANELS_PER_PROJECT: 30,
  },
} as const;
```

## 7. Testing Standards

### 7.1 Component Tests
```typescript
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    // Assertions
  });
});
```

### 7.2 Hook Tests
```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useCustomHook } from './useCustomHook';

describe('useCustomHook', () => {
  it('should handle state changes', () => {
    const { result } = renderHook(() => useCustomHook());
    // Assertions
  });
});
```

## 8. Documentation

### 8.1 Component Documentation
```typescript
/**
 * ComicPanel component displays a single panel in the comic creation process
 * @param {string} imageUrl - URL of the generated panel image
 * @param {number} order - Panel's position in the sequence
 * @param {() => void} onEdit - Callback for editing panel
 */
```

### 8.2 Function Documentation
```typescript
/**
 * Generates a new comic panel using Midjourney API
 * @param {string} prompt - Text description for image generation
 * @param {ComicStyle} style - Selected comic style
 * @returns {Promise<string>} Generated image URL
 * @throws {ApiError} When image generation fails
 */
```

## 9. Performance Guidelines

### 9.1 React Performance
- Use React.memo for expensive computations
- Implement virtualization for long lists
- Lazy load components and routes
- Use proper key props for lists

### 9.2 Image Optimization
- Use Next.js Image component
- Implement lazy loading for images
- Use appropriate image formats (WebP with fallbacks)

## 10. Security Guidelines

### 10.1 Authentication
- Implement proper token management
- Use HttpOnly cookies for session management
- Implement CSRF protection

### 10.2 Data Validation
- Validate all user inputs
- Sanitize data before rendering
- Implement rate limiting for API calls

## 11. Accessibility Standards

### 11.1 ARIA Attributes
```typescript
// Example of accessible button
<button
  aria-label="Create new project"
  role="button"
  onClick={handleCreate}
>
  <PlusIcon />
</button>
```

### 11.2 Keyboard Navigation
- Ensure all interactive elements are focusable
- Implement proper tab order
- Provide keyboard shortcuts for common actions
