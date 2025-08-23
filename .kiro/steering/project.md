---
inclusion: always
---

---

## inclusion: always

# Restaurant Call Management Application

## Project Overview

A comprehensive restaurant call management system enabling restaurant owners to manage AI-powered phone calls and orders through a web dashboard. The application bridges automated AI agents handling customer calls with restaurant staff managing orders and operations.

## Core Architecture

### Tech Stack

- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS v4** with CSS-first configuration using `@theme` directive
- **Convex** for real-time database and API endpoints
- **Google Gemini API** for AI-powered menu data extraction
- **React Context API** for state management

### Key Data Models

- **Restaurant**: Basic info, settings, virtual phone numbers
- **Call**: Real-time call data, transcripts, sentiment analysis
- **Order**: Automated order capture, status tracking, customer info
- **MenuItem**: Dynamic pricing, availability, customization options

## Development Standards

### Component Architecture

- **UI Components** (`src/components/ui/`): Reusable design system components
- **Feature Components**: Domain-specific components (dashboard, onboarding)
- **Layout Components**: Use composition patterns with provider wrapping
- Export through index files for clean imports

### Styling Conventions

- Use established utility classes: `btn`, `card`, `input`, `badge` with semantic variants
- Follow color system: primary, accent, success, warning, danger
- Mobile-first responsive design with container queries where appropriate
- Maintain WCAG accessibility compliance

### State Management Patterns

- Wrap app with `AppProvider` containing all contexts
- Use domain-specific contexts: `CallsContext`, `OrdersContext`, `RestaurantContext`
- Access via custom hooks: `useCalls()`, `useOrders()`, `useRestaurant()`
- Implement optimistic updates for better UX

### Code Quality Requirements

- Strict TypeScript with proper interfaces for all data structures
- Avoid `any` types, use proper typing for external APIs
- Implement proper error boundaries and toast notifications
- Use React.memo for expensive components
- Keep functions focused and use descriptive naming

### File Organization

- PascalCase for React components
- camelCase for hooks, utilities, non-component files
- Group related functionality in feature folders
- Use custom hooks for reusable logic (`useRestaurantStorage`, `useShowToast`)

## Business Logic

### Core Features

- **AI-Powered Call Management**: Virtual numbers, real-time monitoring, transcription
- **Order Processing**: Automated capture, menu integration, status tracking
- **Restaurant Dashboard**: Onboarding, real-time views, settings, analytics

### User Workflows

- **Onboarding**: Restaurant setup → Menu extraction → Virtual number generation
- **Call Management**: Real-time monitoring → Order capture → Status updates
- **Order Processing**: Active orders → Completion tracking → Historical views

### Data Flow

- Real-time synchronization via Convex
- Optimistic updates for immediate feedback
- Proper loading and error states throughout
- Toast notifications for user feedback

## API Integration

### External Services

- **Google Gemini**: Menu data extraction from images/text
- **Convex**: Real-time database operations
- Handle rate limiting and API quotas appropriately
- Implement retry logic for critical operations

### Error Handling

- Graceful fallbacks for API failures
- Consistent error messaging across components
- Proper logging for debugging
- User-friendly error states

## Performance & Accessibility

### Performance

- Optimize images and assets
- Use proper key props for list items
- Implement proper loading states
- Mobile-first responsive design

### Accessibility

- WCAG compliance with focus states and ARIA labels
- Semantic HTML structure
- Screen reader support with `sr-only` utility
- Minimum 44px touch targets on mobile
- Support high contrast and reduced motion

## Development Practices

### Problem-Solving Approach

- Analyze thoroughly before implementing solutions
- Make minimal, targeted changes over broad refactoring
- Test across different scenarios and edge cases
- Ask clarifying questions when requirements are unclear

### Code Consistency

- Follow established patterns from existing components
- Use the design system utilities and color variables
- Maintain immutable update patterns
- Ensure data consistency across contexts
