// Vercel Web Analytics
// This script loads and initializes Vercel Web Analytics
import { inject } from './vercel-analytics.mjs';

// Initialize Vercel Analytics
inject({
  mode: 'auto', // Automatically detect production/development
  debug: false  // Disable debug logs in production
});
