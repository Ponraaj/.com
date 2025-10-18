import { createRouter } from '@tanstack/react-router';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance
export const getRouter = () => {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultViewTransition: (from, to) => {
      // Determine navigation direction based on route depth
      const fromDepth = (from?.pathname || '')
        .split('/')
        .filter(Boolean).length;
      const toDepth = (to?.pathname || '').split('/').filter(Boolean).length;

      if (toDepth > fromDepth) {
        // Forward navigation (deeper route) - slide right
        return { types: ['slide-right'] };
      } else if (toDepth < fromDepth) {
        // Backward navigation (shallower route) - slide left
        return { types: ['slide-left'] };
      } else {
        // Same depth - fade
        return { types: ['fade'] };
      }
    },
  });
};
