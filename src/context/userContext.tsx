import { ReactNode, createContext, useState, useContext, useEffect } from 'react';

interface SimplUser {
  nome: string;
  email: string;
  admin: boolean;
}

interface UserContextType {
  user: SimplUser | null;
  setUser: React.Dispatch<React.SetStateAction<SimplUser | null>>;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps { children: ReactNode; }

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<SimplUser | null>(JSON.parse(localStorage.getItem('user') || 'null'));

  const isLoggedIn = user !== null;

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser deve ser usado num contexto.');
  return context;
};
