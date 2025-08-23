---
inclusion: always
---

# Restaurant Call Management App - Development Guidelines

## Architecture & Tech Stack

This is a Next.js 15 restaurant call management application using:

- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Backend**: Convex for real-time data and API endpoints
- **AI Integration**: Google Gemini API for menu data extraction
- **Styling**: Custom design system with CSS-first Tailwind configuration
- **State Management**: React Context API with custom providers

## Code Organization Principles

### Modular Structure

- Keep components focused on single responsibilities
- Use custom hooks for reusable logic (`useRestaurantStorage`, `useShowToast`)
- Organize contexts by domain (`CallsContext`, `OrdersContext`, `RestaurantContext`)
- Maintain clear separation between UI components and business logic

### Component Architecture

- **UI Components** (`src/components/ui/`): Reusable, design system components
- **Feature Components** (`src/components/dashboard/`, `src/components/onboarding/`): Domain-specific components
- **Layout Components**: Use composition patterns with proper provider wrapping

### File Naming & Structure

- Use PascalCase for React components
- Use camelCase for hooks, utilities, and non-component files
- Group related functionality in feature folders
- Export components through index files for clean imports

## Styling Guidelines

### Tailwind CSS v4 Usage

- Use CSS-first configuration with `@theme` directive
- Leverage custom utilities defined in `globals.css` (btn, card, input, badge variants)
- Follow the established color system (primary, accent, success, warning, danger)
- Use semantic color variables for consistency

### Design System

- **Buttons**: Use `btn` utility with variants (primary, secondary, outline, ghost, destructive)
- **Cards**: Use `card` utility with header, content, footer sections
- **Forms**: Use `input` utility with error states
- **Badges**: Use semantic badge variants for status indicators
- **Spacing**: Follow consistent spacing scale, use custom spacing variables when needed

### Accessibility

- Maintain WCAG compliance with proper focus states, ARIA labels, and semantic HTML
- Use `sr-only` utility for screen reader content
- Ensure minimum touch target sizes (44px) on mobile
- Support high contrast and reduced motion preferences

## State Management

### Context Providers

- Wrap the app with `AppProvider` which includes all necessary contexts
- Use custom hooks (`useCalls`, `useOrders`) for accessing context state
- Keep context state minimal and focused on specific domains

### Data Flow

- Use Convex for real-time data synchronization
- Implement optimistic updates where appropriate
- Handle loading and error states consistently across components

## Code Quality Standards

### TypeScript

- Use strict TypeScript configuration
- Define proper interfaces for all data structures
- Avoid `any` types, use proper typing for external APIs
- Use generic types for reusable components and utilities

### Error Handling

- Implement proper error boundaries
- Use toast notifications for user feedback
- Handle API errors gracefully with fallback states
- Log errors appropriately for debugging

### Performance

- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets
- Use proper key props for list items

## Development Practices

### Code Style

- Keep functions and components concise and focused
- Use descriptive variable and function names
- Avoid unnecessary comments - let code be self-documenting
- Use consistent formatting and follow ESLint rules

### Testing Approach

- Write tests for critical business logic
- Test user interactions and edge cases
- Use proper test data and mocking strategies
- Maintain test coverage for core functionality

### API Integration

- Use proper error handling for external API calls
- Implement retry logic where appropriate
- Use TypeScript interfaces for API responses
- Handle rate limiting and API quotas

## Feature Development

### New Components

- Follow established patterns from existing components
- Use the design system utilities and color variables
- Implement proper accessibility features
- Include loading and error states

### State Updates

- Use immutable update patterns
- Implement proper validation before state changes
- Handle concurrent updates appropriately
- Maintain data consistency across contexts

### Responsive Design

- Mobile-first approach with progressive enhancement
- Use container queries where appropriate
- Test across different screen sizes and devices
- Ensure touch-friendly interactions on mobile

## Debugging & Maintenance

### Problem-Solving Approach

- Analyze the problem thoroughly before implementing solutions
- Ask clarifying questions when requirements are unclear
- Make minimal, targeted changes rather than broad refactoring
- Test changes across different scenarios and edge cases

### Code Reviews

- Focus on maintainability and readability
- Ensure consistency with established patterns
- Verify accessibility and responsive design
- Check for proper error handling and edge cases
