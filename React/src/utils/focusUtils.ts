/**
 * Utility functions for managing focus behavior in modals
 * Helps prevent unwanted focus restoration that can cause search bars to auto-open
 */

/**
 * Prevents focus from being restored to the previously focused element
 * Useful when closing modals to prevent search bars from auto-opening
 */
export const preventFocusRestore = (): void => {
  setTimeout(() => {
    if (document.activeElement && document.activeElement instanceof HTMLElement) 
      document.activeElement.blur();
    
  }, 0);
};

/**
 * Captures the currently focused element for later restoration
 * @returns The currently focused element
 */
export const captureCurrentFocus = (): HTMLElement | null => document.activeElement as HTMLElement | null;

/**
 * Restores focus to a specific element
 * @param element The element to focus on
 */
export const restoreFocusTo = (element: HTMLElement | null): void => {
  if (element && typeof element.focus === 'function') 
    element.focus();
  
};

/**
 * Clears focus from any currently focused element
 */
export const clearFocus = (): void => {
  if (document.activeElement && document.activeElement instanceof HTMLElement) 
    document.activeElement.blur();
  
};
