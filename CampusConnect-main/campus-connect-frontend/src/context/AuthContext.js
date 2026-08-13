import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('cc_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            email: decoded.sub,
            role: decoded.role,
            userId: decoded.userId,
            fullName: decoded.fullName,
            token,
          });
        } else {
          localStorage.removeItem('cc_token');
        }
      } catch {
        localStorage.removeItem('cc_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('cc_token', token);
    const decoded = jwtDecode(token);
    setUser({
      email: decoded.sub,
      role: decoded.role,
      userId: decoded.userId,
      fullName: decoded.fullName,
      token,
    });
  };

  const logout = () => {
    localStorage.removeItem('cc_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
