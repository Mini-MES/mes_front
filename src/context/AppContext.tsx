import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  login: (token: string) => void;
  logout: () => void;
  processStages: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const processStages = ['CNC선삭', 'CNC밀링', '열처리', '연삭', '세척', '최종 검사', '출하'];

// JWT 디코더 헬퍼
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [currentUser, setCurrentUser] = useState<CurrentUser>({ name: '미인증', id: '' });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // 1. 토큰 기반 로그인 세션 세팅
  const login = (token: string) => {
    localStorage.setItem('token', token);
    const payload = parseJwt(token);
    if (payload) {
      // JWT Claim 파싱
      const name = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || payload["unique_name"] || "사용자";
      const id = payload["nameid"] || payload["sub"] || "";
      const rawRole = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload["role"] || "Worker";
      
      const mappedRole: UserRole = rawRole.toLowerCase() === 'admin' ? 'admin' : 'worker';

      setCurrentUser({ name, id });
      setUserRole(mappedRole);
      setIsAuthenticated(true);
    }
  };

  // 2. 로그아웃 세션 클리어
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser({ name: '미인증', id: '' });
    setUserRole('worker');
    setIsAuthenticated(false);
  };

  // 3. 최초 진입 시 토큰 자동 복구
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      login(savedToken);
    }
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
