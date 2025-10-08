// This file is replaced per environment at deploy time.
// Default empty values allow local dev to use Vite envs.
window.__ENV = Object.assign({}, window.__ENV, {
  VITE_API_URL: undefined,
  VITE_CLIENT_URL: undefined,
  VITE_MARKER_IO_PROJECT_ID: undefined,
});

// For local development, we need to set the API URL to the local server
// Simply uncomment the following and comment the above

// window.__ENV = Object.assign({}, window.__ENV, {
//   VITE_API_URL: 'http://localhost:9000',
//   VITE_CLIENT_URL: 'http://localhost:3303',
//   VITE_MARKER_IO_PROJECT_ID: undefined,
// });


