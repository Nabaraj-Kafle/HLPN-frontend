import axios, { AxiosError, type AxiosInstance } from "axios";
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "https://api.himalayanlocalproductnepal.com.np/api/";
// const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://127.0.0.1:8000/api/";
const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar: string | null;
  role?: "admin" | "vendor" | "staff" | "user";
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  confirm_password: string;
  avatar?: string | null;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

interface RefreshResponse {
  access: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const getStoredAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getStoredRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

const storeTokens = (access: string, refresh: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

const storeAccessToken = (access: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
};

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const setAuthHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};

export const getUserAvatar = (user: AuthUser) => {
  if (user.avatar) {
    return user.avatar;
  }

  const name = user.name || user.email || "User";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=16A34A&color=fff&bold=true`;
};

const getErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return "Something went wrong. Please try again.";
  }

  const responseData = error.response?.data;

  if (typeof responseData === "string") {
    return responseData;
  }

  if (responseData && typeof responseData === "object") {
    if ("detail" in responseData && typeof responseData.detail === "string") {
      return responseData.detail;
    }

    const firstValue = Object.values(responseData)[0];
    if (typeof firstValue === "string") {
      return firstValue;
    }

    if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
      return firstValue[0];
    }
  }

  return error.message || "Request failed. Please try again.";
};

let refreshRequest: Promise<string | null> | null = null;

const refreshAccessToken = async () => {
  const refreshToken = getStoredRefreshToken();

  if (!refreshToken) {
    clearTokens();
    setAuthHeader(null);
    return null;
  }

  if (!refreshRequest) {
    refreshRequest = api
      .post<RefreshResponse>("/auth/refresh/", { refresh: refreshToken })
      .then(({ data }) => {
        storeAccessToken(data.access);
        setAuthHeader(data.access);
        return data.access;
      })
      .catch(() => {
        clearTokens();
        setAuthHeader(null);
        return null;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
};

api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (
      typeof originalRequest.url === "string" &&
      ["/auth/login/", "/auth/refresh/", "/auth/logout/"].some((path) => originalRequest.url?.includes(path))
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const newAccessToken = await refreshAccessToken();
    if (!newAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

    return api(originalRequest);
  },
);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyAuth = useCallback((data: AuthResponse) => {
    storeTokens(data.access, data.refresh);
    setAuthHeader(data.access);
    setUser(data.user);
    return data.user;
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      setAuthHeader(null);
      setUser(null);
      return null;
    }

    setAuthHeader(accessToken);

    try {
      const { data } = await api.get<AuthUser>("/auth/me/");
      // Prevent race condition: if token was cleared (e.g., via logout) while fetching, don't set user
      if (!getStoredAccessToken()) {
        return null;
      }
      setUser(data);
      return data;
    } catch {
      clearTokens();
      setAuthHeader(null);
      setUser(null);
      return null;
    }
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      try {
        const { data } = await api.post<AuthResponse>("/auth/login/", payload);
        return applyAuth(data);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    [applyAuth],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      try {
        const { data } = await api.post<AuthResponse>("/auth/register/", payload);
        clearTokens();
        setAuthHeader(null);
        setUser(null);
        return data.user;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    const refreshToken = getStoredRefreshToken();

    try {
      if (refreshToken) {
        await api.post("/auth/logout/", { refresh: refreshToken });
      }
    } catch {
      // Clear local auth state even if token revocation fails.
    } finally {
      clearTokens();
      setAuthHeader(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const bootstrapAuth = async () => {
      await fetchCurrentUser();
      setIsLoading(false);
    };

    void bootstrapAuth();
  }, [fetchCurrentUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      fetchCurrentUser,
    }),
    [fetchCurrentUser, isLoading, login, logout, register, user],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
