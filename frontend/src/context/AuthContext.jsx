
import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem("eduverify_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => sessionStorage.getItem("eduverify_token") || null,
  );

  function login({ token: newToken, user: newUser }) {
    sessionStorage.setItem("eduverify_token", newToken);
    sessionStorage.setItem(
      "eduverify_user",
      JSON.stringify(newUser),
    );

    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    sessionStorage.removeItem("eduverify_token");
    sessionStorage.removeItem("eduverify_user");

    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };
