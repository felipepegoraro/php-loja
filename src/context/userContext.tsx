import { ReactNode, createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

interface SimplUser {
    id: number;
    nome: string;
    email: string;
    admin: boolean;
    foto: File | Buffer | null;
}

interface UserContextType {
    user: SimplUser | null;
    setUser: (newUser: SimplUser | null) => void;
    isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps { children: ReactNode; }

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUserState] = useState<SimplUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUserState(userData);
      setIsLoggedIn(true);
    } else {
      const checkSession = async () => {
        try {
          const response = await axios.get('http://107.20.8.253/php-loja-back/session.php', {
            withCredentials: true,
          });

          const result = response.data;
          if (result.loggedIn) {
            setUserState(result.user);
            setIsLoggedIn(true);
            localStorage.setItem('user', JSON.stringify(result.user));
          } else {
            setUserState(null);
            setIsLoggedIn(false);
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error("Erro ao verificar a sessão", error);
        }
      };

      checkSession();
    }
  }, []);

  const updateUser = (newUser: SimplUser | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, isLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser deve ser usado num contexto.');
  return context;
};

