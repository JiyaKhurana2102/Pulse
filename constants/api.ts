// Base API configuration
// NOTE: For testing on a real device, create api.local.ts with your IP:
// export const API_BASE = 'http://YOUR_IP:8080';

let baseUrl = 'http://localhost:8080';

// Try to import local config (git-ignored, each developer sets their own IP)
try {
  const local = require('./api.local');
  if (local.API_BASE) baseUrl = local.API_BASE;
} catch (e) {
  // No local config, use localhost
}

export const API_BASE = baseUrl;
