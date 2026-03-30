import { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'guest' | 'operator' | 'manager' | null;

interface UserInfo {
  username: string;
  fullName: string;
  role: UserRole;
  token: string;
}

interface UserContextType {
  userRole: UserRole;
  userInfo: UserInfo | null;
  setUserRole: (role: UserRole) => void;
  loginWithToken: (token: string, username: string, fullName: string, role: string) => void;
  selectedDepartment: string | null;
  setSelectedDepartment: (department: string | null) => void;
  selectedMachine: string | null;
  setSelectedMachine: (machine: string | null) => void;
  selectedCalibrationType: string | null;
  setSelectedCalibrationType: (type: string | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function loadSavedUser(): { role: UserRole; info: UserInfo | null } {
  const saved = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  if (saved && token) {
    try {
      const parsed = JSON.parse(saved);
      return {
        role: parsed.role as UserRole,
        info: { ...parsed, token },
      };
    } catch {
      return { role: null, info: null };
    }
  }
  return { role: null, info: null };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const saved = loadSavedUser();
  const [userRole, setUserRole] = useState<UserRole>(saved.role);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(saved.info);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [selectedCalibrationType, setSelectedCalibrationType] = useState<string | null>(null);

  const loginWithToken = (token: string, username: string, fullName: string, role: string) => {
    const userRole = role as UserRole;
    const info: UserInfo = { token, username, fullName, role: userRole };
    setUserRole(userRole);
    setUserInfo(info);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ username, fullName, role: userRole }));
  };

  const logout = () => {
    setUserRole(null);
    setUserInfo(null);
    setSelectedDepartment(null);
    setSelectedMachine(null);
    setSelectedCalibrationType(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{
      userRole,
      userInfo,
      setUserRole,
      loginWithToken,
      selectedDepartment,
      setSelectedDepartment,
      selectedMachine,
      setSelectedMachine,
      selectedCalibrationType,
      setSelectedCalibrationType,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
