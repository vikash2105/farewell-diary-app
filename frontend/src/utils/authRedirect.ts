const AUTH_RETURN_URL_KEY = 'auth_return_url';

const PROTECTED_PATH_PREFIXES = ['/dashboard', '/create', '/profile', '/notes', '/write'];

export const getCurrentRoute = (): string =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`;

export const isProtectedRoute = (path: string): boolean =>
  PROTECTED_PATH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );

export const isSafeInternalRoute = (route: string | null): route is string => {
  if (!route || !route.startsWith('/') || route.startsWith('//')) {
    return false;
  }

  try {
    const parsed = new URL(route, window.location.origin);
    return parsed.origin === window.location.origin;
  } catch {
    return false;
  }
};

export const rememberAuthReturnUrl = (route = getCurrentRoute()): void => {
  if (isSafeInternalRoute(route) && isProtectedRoute(route)) {
    try {
      sessionStorage.setItem(AUTH_RETURN_URL_KEY, route);
    } catch {
      // OAuth callbackUrl remains the primary redirect mechanism.
    }
  }
};

export const consumeAuthReturnUrl = (): string | null => {
  let route: string | null = null;

  try {
    route = sessionStorage.getItem(AUTH_RETURN_URL_KEY);
    sessionStorage.removeItem(AUTH_RETURN_URL_KEY);
  } catch {
    return null;
  }

  return isSafeInternalRoute(route) && isProtectedRoute(route) ? route : null;
};

export const clearAuthReturnUrl = (route?: string): void => {
  try {
    const storedRoute = sessionStorage.getItem(AUTH_RETURN_URL_KEY);

    if (!route || storedRoute === route) {
      sessionStorage.removeItem(AUTH_RETURN_URL_KEY);
    }
  } catch {
    // Ignore storage failures; auth state still comes from the HTTP-only session.
  }
};

export const toAbsoluteFrontendUrl = (route: string): string =>
  new URL(route, window.location.origin).toString();
