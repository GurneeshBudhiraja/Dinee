# Design Document

## Overview

The restaurant call management application is designed as a Next.js web application with a focus on accessibility, clean design, and efficient workflow for restaurant owners. The application follows a progressive disclosure pattern, showing essential information by default with expansion options for detailed views.

## Architecture

### Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS for consistent, utility-first styling
- **State Management**: React Context API for global state
- **Data Storage**: Local constants file for synthetic data (future: API integration)

### Project Structure

```
src/
├── app/
│   ├── onboarding/
│   ├── dashboard/
│   └── layout.tsx
├── components/
│   ├── ui/           # Reusable UI components
│   ├── onboarding/   # Onboarding-specific components
│   ├── dashboard/    # Dashboard-specific components
│   └── common/       # Shared components
├── lib/
│   ├── constants.ts  # Synthetic data
│   └── utils.ts      # Utility functions
├── types/
│   └── global.d.ts   # Global type definitions
└── styles/
    └── globals.css
```

## Components and Interfaces

### Core Components

#### 1. Onboarding Flow Components

- `LoginForm`: Handles user authentication
- `RestaurantSetup`: Multi-step form for restaurant configuration
- `VirtualNumberGenerator`: Generates and displays virtual phone numbers

#### 2. Dashboard Components

- `DashboardLayout`: Main layout with navigation tabs
- `CallsSection`: Container for current and past calls
- `OrdersSection`: Container for current and past orders
- `SettingsSection`: Configuration management

#### 3. UI Components

- `Card`: Expandable card component with consistent styling
- `Button`: Accessible button with multiple variants
- `Modal`: Confirmation dialogs and overlays
- `Input`: Form input with validation states
- `Badge`: Status indicators for orders and calls

### Design System

#### Color Palette

```css
:root {
  /* Primary Colors */
  --primary-50: #f0f9ff;
  --primary-100: #e0f2fe;
  --primary-500: #0ea5e9;
  --primary-600: #0284c7;
  --primary-700: #0369a1;

  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-500: #6b7280;
  --gray-700: #374151;
  --gray-900: #111827;

  /* Status Colors */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --error-50: #fef2f2;
  --error-500: #ef4444;
}
```

#### Typography

- **Primary Font**: Inter (web-safe, highly legible)
- **Font Sizes**:
  - Headings: 24px, 20px, 18px
  - Body: 16px (default), 14px (secondary)
  - Small: 12px
- **Line Height**: 1.5 for body text, 1.2 for headings

#### Spacing System

- Base unit: 4px
- Common spacings: 8px, 12px, 16px, 24px, 32px, 48px

## Data Models

### User & Restaurant

```typescript
interface Restaurant {
  id: string;
  name: string;
  agentName: string;
  menuDetails: string;
  specialInstructions: string;
  languagePreference: string;
  virtualNumber?: string;
}

interface User {
  id: string;
  email: string;
  restaurantId: string;
}
```

### Calls

```typescript
interface Call {
  id: string;
  phoneNumber: string;
  duration: number; // in seconds
  status: "active" | "completed";
  transcript?: string;
  liveTranscript?: string;
  orderId?: string;
  sentiment?: "positive" | "neutral" | "negative";
  reason?: string; // if no order placed
  timestamp: Date;
}
```

### Orders

```typescript
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

interface Order {
  id: string;
  callId?: string;
  phoneNumber: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  specialInstructions?: string;
  status: "active" | "completed" | "cancelled";
  timestamp: Date;
  cancellationReason?: string;
}
```

## User Interface Design

### Layout Principles

1. **Progressive Disclosure**: Show essential information first, details on expansion
2. **Consistent Navigation**: Tab-based navigation for main sections
3. **Visual Hierarchy**: Clear information hierarchy using typography and spacing
4. **Responsive Design**: Mobile-first approach with desktop enhancements

### Screen Designs

#### 1. Onboarding Flow

- **Step-by-step progression** with clear indicators
- **Form validation** with inline error messages
- **Consistent button placement** for navigation
- **Progress indicator** showing completion status

#### 2. Virtual Number Generation

- **Centered layout** with prominent generate button
- **Number display** in large, monospace font
- **Clear call-to-action** for proceeding to dashboard

#### 3. Dashboard Layout

```
┌─────────────────────────────────────┐
│ Header (Restaurant Name, Settings)  │
├─────────────────────────────────────┤
│ Tab Navigation (Calls|Orders|Settings)│
├─────────────────────────────────────┤
│                                     │
│ Content Area                        │
│ ┌─────────────┐ ┌─────────────┐    │
│ │ Current     │ │ Past        │    │
│ │ Items       │ │ Items       │    │
│ └─────────────┘ └─────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

#### 4. Card Design Pattern

- **Compact default view** with essential information
- **Expansion mechanism** using chevron icons
- **Consistent spacing** and typography
- **Action buttons** grouped logically

## Error Handling

### User Input Validation

- **Real-time validation** for form inputs
- **Clear error messages** with specific guidance
- **Minimum character requirements** enforced with counters
- **Required field indicators** using visual cues

### System Error States

- **Network errors**: Retry mechanisms with user feedback
- **Empty states**: Helpful messaging and suggested actions
- **Loading states**: Skeleton screens and progress indicators

### Confirmation Dialogs

- **Destructive actions** require explicit confirmation
- **Clear consequences** explained in dialog text
- **Primary/secondary action** distinction in button styling

## Testing Strategy

### Component Testing

- **Unit tests** for individual components using Jest and React Testing Library
- **Accessibility testing** using jest-axe
- **Visual regression testing** for design consistency

### Integration Testing

- **User flow testing** for complete onboarding process
- **Dashboard interaction testing** for call and order management
- **Form validation testing** for all input scenarios

### Accessibility Testing

- **Keyboard navigation** testing for all interactive elements
- **Screen reader compatibility** using semantic HTML
- **Color contrast validation** meeting WCAG 2.1 AA standards
- **Focus management** for modal dialogs and dynamic content

### Performance Considerations

- **Code splitting** by route for optimal loading
- **Image optimization** using Next.js Image component
- **Bundle analysis** to monitor application size
- **Lazy loading** for non-critical components

## Implementation Notes

### Accessibility Features

- **Semantic HTML** structure throughout
- **ARIA labels** for complex interactions
- **Focus indicators** clearly visible
- **High contrast** color combinations
- **Scalable text** supporting zoom up to 200%

### Responsive Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Animation Guidelines

- **Subtle transitions** for state changes (200-300ms)
- **Respect motion preferences** using prefers-reduced-motion
- **Functional animations** that enhance usability

### Make sure not to use the animations on the dashboard that would hamper the UX of the restaurant owners or staff using the software