import { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'guest' | 'operator' | 'manager' | null;

interface UserContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  selectedDepartment: string | null;
  setSelectedDepartment: (department: string | null) => void;
  selectedMachine: string | null;
  setSelectedMachine: (machine: string | null) => void;
  selectedCalibrationType: string | null;
  setSelectedCalibrationType: (type: string | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [selectedCalibrationType, setSelectedCalibrationType] = useState<string | null>(null);

  const logout = () => {
    setUserRole(null);
    setSelectedDepartment(null);
    setSelectedMachine(null);
    setSelectedCalibrationType(null);
  };

  return (
    <UserContext.Provider value={{ 
      userRole, 
      setUserRole, 
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
