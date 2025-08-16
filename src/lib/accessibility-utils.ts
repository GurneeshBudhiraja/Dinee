/**
 * Accessibility utility functions for the restaurant call management app
 */

/**
 * Announces a message to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.textContent = message;
  document.body.appendChild(announcer);

  // Clean up after announcement
  setTimeout(() => {
    if (document.body.contains(announcer)) {
      document.body.removeChild(announcer);
    }
  }, 1000);
};

/**
 * Manages focus for modal dialogs and overlays
 */
export const manageFocus = {
  trap: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }
};

/**
 * Checks if the current device prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Checks if the current device has high contrast preference
 */
export const prefersHighContrast = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

/**
 * Generates a unique ID for form elements
 */
export const generateId = (prefix: string = 'element'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validates color contrast ratio (simplified check)
 */
export const hasGoodContrast = (foreground: string, background: string): boolean => {
  // This is a simplified implementation
  // In a real app, you'd use a proper color contrast calculation library
  const fgLuminance = getLuminance(foreground);
  const bgLuminance = getLuminance(background);
  const contrast = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);
  return contrast >= 4.5; // WCAG AA standard
};

/**
 * Simple luminance calculation (for demonstration)
 */
const getLuminance = (color: string): number => {
  // This is a very simplified implementation
  // In practice, you'd use a proper color parsing library
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const sRGB = [r, g, b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
};

/**
 * Keyboard navigation helpers
 */
export const keyboardNavigation = {
  isNavigationKey: (key: string): boolean => {
    return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(key);
  },

  isActionKey: (key: string): boolean => {
    return ['Enter', ' ', 'Escape'].includes(key);
  },

  handleArrowNavigation: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    orientation: 'horizontal' | 'vertical' = 'vertical'
  ): number => {
    const { key } = event;
    let newIndex = currentIndex;

    if (orientation === 'vertical') {
      if (key === 'ArrowDown') newIndex = Math.min(currentIndex + 1, items.length - 1);
      if (key === 'ArrowUp') newIndex = Math.max(currentIndex - 1, 0);
    } else {
      if (key === 'ArrowRight') newIndex = Math.min(currentIndex + 1, items.length - 1);
      if (key === 'ArrowLeft') newIndex = Math.max(currentIndex - 1, 0);
    }

    if (key === 'Home') newIndex = 0;
    if (key === 'End') newIndex = items.length - 1;

    if (newIndex !== currentIndex) {
      event.preventDefault();
      items[newIndex]?.focus();
    }

    return newIndex;
  }
};