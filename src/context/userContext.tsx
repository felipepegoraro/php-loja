import { ReactNode, createContext, useState, useContext } from 'react';

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
  const [user, setUser] = useState<SimplUser | null>(null);

  const isLoggedIn = user !== null;

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
