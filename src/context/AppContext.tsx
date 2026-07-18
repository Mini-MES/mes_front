import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { customFetch } from '@/api/fetcher';

export interface RawMaterial {
  productID: string;
  name: string;
  stockQty: number;
  unit: string;
  safetyQty: number;
  status: '충분' | '부족';
}

export interface WorkOrder {
  orderID: number;
  productID: string;
  targetQty: number;
  totalGoodQty: number;
  totalBadQty: number;
  status: 'Created' | 'InProgress' | 'Completed';
  orderDate: string;
  startDate: string;
  dueDate: string;
  lotID?: string;
}

export interface LotTracking {
  lotID: string;
  orderID: number;
  currentProcessID: number;
  status: 'RELEASED' | 'WIP' | 'HOLD' | 'COMPLETED';
  totalBadQty: number;
  updatedBy?: string;
  lastUpdated?: string;
}

export interface CurrentUser {
  name: string;
  id: string;
}

export type UserRole = 'admin' | 'worker';

interface AppContextType {
  userRole: UserRole;
  currentUser: CurrentUser;
  isAuthenticated: boolean;
  login: () => Promise<boolean>;
  logout: () => void;
  processStages: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const processStages = ['CNC선삭', 'CNC밀링', '열처리', '연삭', '세척', '최종 검사', '출하'];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [currentUser, setCurrentUser] = useState<CurrentUser>({ name: '미인증', id: '' });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // 1. 비동기 프로필 조회를 통한 로그인 세션 세팅
  const login = async (): Promise<boolean> => {
    try {
      const userData = await customFetch('/Auth/check');
      if (userData) {
        setCurrentUser({ name: userData.name, id: userData.id });
        setUserRole(userData.role.toLowerCase() === 'admin' ? 'admin' : 'worker');
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('인증 상태 확인 중 오류:', error);
      logout();
      return false;
    }
  };

  // 2. 로그아웃 세션 클리어
  const logout = () => {
    setCurrentUser({ name: '미인증', id: '' });
    setUserRole('worker');
    setIsAuthenticated(false);
  };

  // 3. 최초 진입 시 토큰 자동 복구
  useEffect(() => {
    login();
  }, []);

  return (
    <AppContext.Provider value={{
      userRole,
      currentUser,
      isAuthenticated,
      login,
      logout,
      processStages
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
export { processStages };
