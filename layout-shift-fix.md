# Search Modal Layout Shift Fix

## Problem

The search modal on mui.com was causing layout shift in the background when opened. This occurred because the modal was not implementing proper body scroll lock, causing the page's scrollbar to disappear/appear without proper compensation.

## Root Cause

The AppSearch component uses `DocSearchModal` from `@docsearch/react` which doesn't include the body scroll lock mechanism that Material-UI's Modal component provides. When the modal opened, the scrollbar would disappear causing the page content to shift horizontally.

## Solution

Implemented a comprehensive body scroll lock system with the following features:

### 1. Scrollbar Width Calculation
- Added `getScrollbarWidth()` utility function to accurately measure the scrollbar width
- Handles cross-browser differences in scrollbar rendering

### 2. Body Scroll Lock with Layout Shift Prevention
- Added `lockBodyScroll()` function that:
  - Prevents body scrolling with `overflow: hidden`
  - Compensates for missing scrollbar by adding equivalent padding
  - Handles elements with `position: fixed` that need padding adjustment
  - Returns a cleanup function to restore original styles

### 3. Integration with Modal Lifecycle
- Lock scroll when modal opens (in useEffect)
- Unlock scroll when modal closes (in onClose callback)
- Cleanup on component unmount to prevent memory leaks

### 4. Enhanced Modal Container Positioning
- Added explicit `position: fixed` with full viewport coverage to the modal container
- Ensures the modal doesn't interfere with document flow

## Technical Details

### Files Modified
- `docs/src/modules/components/AppSearch.js`

### Key Changes
1. Added utility functions for scrollbar width calculation and scroll locking
2. Added ref to track unlock function: `unlockScrollRef`
3. Modified `onClose` callback to unlock scroll
4. Modified `useEffect` to lock scroll when modal opens
5. Added cleanup effect for component unmount
6. Enhanced modal container CSS positioning

### Browser Compatibility
- Works across all modern browsers
- Handles different scrollbar rendering behaviors
- Supports both fixed and non-fixed positioned elements

## Testing

The fix prevents layout shift by:
- Maintaining consistent page width when modal opens/closes
- Preventing background content from jumping horizontally
- Preserving user scroll position
- Working correctly with responsive layouts

This solution follows the same patterns used in Material-UI's Modal component for scroll lock behavior.