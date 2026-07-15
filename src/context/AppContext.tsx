import { createContext, useContext, useState, ReactNode } from 'react';

export interface RawMaterial {
  id: string;
  name: string;
  stock: number;
  unit: string;
  minStock: number;
  status: '충분' | '부족';
}

export interface WorkOrder {
  id: string;
  productName: string;
  planQty: number;
  outputQty: number;
  status: '대기' | '진행중' | '완료';
  worker: string;
  date: string;
  stage: string;
}

export interface LotTracking {
  lotId: string;
  orderId: string;
  productName: string;
  currentStage: string;
  status: '대기' | '진행중' | '완료';
  updatedBy: string;
  lastUpdated: string;
}

export interface CurrentUser {
  name: string;
  id: string;
}

export type UserRole = 'admin' | 'worker';

interface AppContextType {
  rawMaterials: RawMaterial[];
  workOrders: WorkOrder[];
  lotTracking: LotTracking[];
  processStages: string[];
  userRole: UserRole;
  currentUser: CurrentUser;
  switchRole: (role: UserRole) => void;
  addWorkOrder: (order: { productName: string; planQty: number; worker?: string }) => void;
  updateOrderStage: (orderId: string, nextStage: string) => void;
  increaseOutputQty: (orderId: string, increment: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialRawMaterials: RawMaterial[] = [
  { id: 'RM001', name: '알루미늄 프레임 A', stock: 1200, unit: '개', minStock: 300, status: '충분' },
  { id: 'RM002', name: '컨트롤러 칩셋 V3', stock: 150, unit: '개', minStock: 200, status: '부족' },
  { id: 'RM003', name: '연결 케이블 1.5m', stock: 3500, unit: 'm', minStock: 1000, status: '충분' },
  { id: 'RM004', name: '강화유리 커버 10인치', stock: 80, unit: '개', minStock: 100, status: '부족' },
  { id: 'RM005', name: '고정 스크류 M4', stock: 15000, unit: '개', minStock: 5000, status: '충분' }
];

const initialWorkOrders: WorkOrder[] = [
  { id: 'WO260715-01', productName: '스마트 HMI 패널', planQty: 200, outputQty: 120, status: '진행중', worker: '홍길동', date: '2026-07-15', stage: '조립' },
  { id: 'WO260715-02', productName: '임베디드 제어기', planQty: 500, outputQty: 0, status: '대기', worker: '이순신', date: '2026-07-15', stage: '자재투입' },
  { id: 'WO260715-03', productName: '산업용 게이트웨이', planQty: 100, outputQty: 100, status: '완료', worker: '김유신', date: '2026-07-14', stage: '포장' }
];

const initialLotTracking: LotTracking[] = [
  { lotId: 'LOT-SHP-260715-001', orderId: 'WO260715-01', productName: '스마트 HMI 패널', currentStage: '조립', status: '진행중', updatedBy: '홍길동', lastUpdated: '2026-07-15 15:30:00' },
  { lotId: 'LOT-ECU-260715-001', orderId: 'WO260715-02', productName: '임베디드 제어기', currentStage: '자재투입', status: '대기', updatedBy: '시스템', lastUpdated: '2026-07-15 09:00:00' },
  { lotId: 'LOT-IGW-260714-001', orderId: 'WO260715-03', productName: '산업용 게이트웨이', currentStage: '포장', status: '완료', updatedBy: '김유신', lastUpdated: '2026-07-15 11:20:00' }
];

const processStages = ['자재투입', '가공', '조립', '검사', '포장'];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(initialRawMaterials);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [lotTracking, setLotTracking] = useState<LotTracking[]>(initialLotTracking);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [currentUser, setCurrentUser] = useState<CurrentUser>({ name: '관리자', id: 'admin01' });

  // 역할 변경 함수
  const switchRole = (role: UserRole) => {
    setUserRole(role);
    if (role === 'admin') {
      setCurrentUser({ name: '관리자', id: 'admin01' });
    } else {
      setCurrentUser({ name: '홍길동', id: 'worker01' });
    }
  };

  // 제품별 원자재 소모 시뮬레이션
  const deductMaterialsForProduct = (productName: string, qty: number) => {
    setRawMaterials(prev => prev.map(mat => {
      let reduction = 0;
      if (productName.includes('HMI') && mat.id === 'RM001') reduction = qty * 1;
      if (productName.includes('HMI') && mat.id === 'RM004') reduction = qty * 1;
      if (productName.includes('제어기') && mat.id === 'RM002') reduction = qty * 1;
      if (productName.includes('게이트웨이') && mat.id === 'RM003') reduction = qty * 1.5;
      
      const newStock = Math.max(0, mat.stock - reduction);
      const isShort = newStock < mat.minStock;
      return {
        ...mat,
        stock: newStock,
        status: isShort ? '부족' : '충분' as const
      };
    }));
  };

  // 작업 지시 등록 함수
  const addWorkOrder = (order: { productName: string; planQty: number; worker?: string }) => {
    const newOrderId = `WO260715-0${workOrders.length + 1}`;
    const newLotId = `LOT-${order.productName.slice(0, 3).toUpperCase()}-260715-0${workOrders.length + 1}`;
    
    const newOrder: WorkOrder = {
      id: newOrderId,
      productName: order.productName,
      planQty: Number(order.planQty),
      outputQty: 0,
      status: '대기',
      worker: order.worker || '미지정',
      date: new Date().toISOString().split('T')[0],
      stage: '자재투입'
    };

    const newLot: LotTracking = {
      lotId: newLotId,
      orderId: newOrderId,
      productName: order.productName,
      currentStage: '자재투입',
      status: '대기',
      updatedBy: '관리자',
      lastUpdated: new Date().toLocaleString()
    };

    setWorkOrders(prev => [newOrder, ...prev]);
    setLotTracking(prev => [newLot, ...prev]);

    deductMaterialsForProduct(order.productName, Number(order.planQty));
  };

  // 작업 진행/완료 처리 함수
  const updateOrderStage = (orderId: string, nextStage: string) => {
    setWorkOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const isCompleted = nextStage === '포장' && order.outputQty >= order.planQty;
        return {
          ...order,
          stage: nextStage,
          status: isCompleted ? ('완료' as const) : ('진행중' as const),
          outputQty: nextStage === '포장' ? order.planQty : order.outputQty
        };
      }
      return order;
    }));

    setLotTracking(prev => prev.map(lot => {
      if (lot.orderId === orderId) {
        const isCompleted = nextStage === '포장';
        return {
          ...lot,
          currentStage: nextStage,
          status: isCompleted ? ('완료' as const) : ('진행중' as const),
          updatedBy: currentUser.name,
          lastUpdated: new Date().toLocaleString()
        };
      }
      return lot;
    }));
  };

  // 실적 수량 직접 증가
  const increaseOutputQty = (orderId: string, increment: number) => {
    let targetOrder: WorkOrder | undefined;

    setWorkOrders(prev => {
      const updated = prev.map(order => {
        if (order.id === orderId) {
          const newOutput = Math.min(order.planQty, order.outputQty + increment);
          const isDone = newOutput === order.planQty;
          const newOrder: WorkOrder = {
            ...order,
            outputQty: newOutput,
            status: isDone && order.stage === '포장' ? ('완료' as const) : order.status
          };
          targetOrder = newOrder;
          return newOrder;
        }
        return order;
      });
      return updated;
    });

    setLotTracking(prev => prev.map(lot => {
      if (lot.orderId === orderId && targetOrder) {
        const isDone = targetOrder.outputQty === targetOrder.planQty;
        return {
          ...lot,
          status: isDone && lot.currentStage === '포장' ? ('완료' as const) : lot.status,
          updatedBy: currentUser.name,
          lastUpdated: new Date().toLocaleString()
        };
      }
      return lot;
    }));
  };

  return (
    <AppContext.Provider value={{
      rawMaterials,
      workOrders,
      lotTracking,
      processStages,
      userRole,
      currentUser,
      switchRole,
      addWorkOrder,
      updateOrderStage,
      increaseOutputQty
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
