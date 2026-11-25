import { useEffect } from "react";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";

export default function AuthInitializer({ children }) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      try {
        const { data } = await api.post("/auth/refresh");

        const userResponse = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${data.accessToken}`
          }
        });

        if (active) {
          setAuth(userResponse.data.user, data.accessToken);
        }
      } catch {
        if (active) {
          clearAuth();
        }
      }
    };

    initialize();

    return () => {
      active = false;
    };
  }, [setAuth, clearAuth]);

  return children;
}