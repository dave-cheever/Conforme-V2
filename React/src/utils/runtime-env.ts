// Runtime environment accessor. Reads from window.__ENV injected at deploy time,
// with fallback to Vite's import.meta.env (or process.env when present).

type RuntimeEnv = {
  VITE_API_URL?: string;
  VITE_CLIENT_URL?: string;
  VITE_MARKER_IO_PROJECT_ID?: string;
  [key: string]: string | undefined;
};

declare global {
  interface Window {
    __ENV?: RuntimeEnv;
  }
}

const getEnvVar = (key: string, fallback?: string): string | undefined => {
  // Prefer runtime window vars
  if (typeof window !== 'undefined' && window.__ENV && window.__ENV[key] !== undefined)
    return window.__ENV[key];
  // Fallback to Vite env (import.meta.env)
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - import.meta is provided by Vite in the browser and during build
    const viteEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
    if (viteEnv && viteEnv[key] !== undefined)
      return viteEnv[key] as string;
  } catch {
    // ignore if not available in this runtime
  }
  // Fallback to process.env (for tests/node)
  if (typeof process !== 'undefined' && process.env && process.env[key] !== undefined)
    return process.env[key];
  return fallback;
};

export const runtimeEnv = {
  get: getEnvVar,
  apiUrl(): string {
    return getEnvVar('VITE_API_URL', '') || '';
  },
  clientUrl(): string {
    return getEnvVar('VITE_CLIENT_URL', '') || '';
  },
  markerIoProjectId(): string {
    return getEnvVar('VITE_MARKER_IO_PROJECT_ID', '') || '';
  },
};

export default runtimeEnv;
