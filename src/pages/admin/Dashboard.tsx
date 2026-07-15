import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/api/fetcher';
import { useApp } from '@/context/AppContext';
import { Activity } from 'lucide-react';
import { RawMaterial, WorkOrder, LotTracking } from '@/context/AppContext';
import { DashboardContent, TitleSection, AdminGrid } from '@/pages/admin/Dashboard.styles';

// 분리된 하위 컴포넌트 임포트
import RawMaterialStatus from '@/components/admin/RawMaterialStatus';
import WorkOrderList from '@/components/admin/WorkOrderList';
import WorkOrderForm from '@/components/admin/WorkOrderForm';
import LotProcessTracker from '@/components/admin/LotProcessTracker';

const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { processStages } = useApp();
  
  // React Query를 활용한 서버 상태 관리 (폴링 5초 주기로 실시간 연동)
  const { data: rawMaterials = [] } = useQuery<RawMaterial[]>({
    queryKey: ['rawMaterials'],
    queryFn: () => customFetch('/MasterData/products'),
    refetchInterval: 5000,
  });

  const { data: workOrders = [] } = useQuery<WorkOrder[]>({
    queryKey: ['workOrders'],
    queryFn: () => customFetch('/Production/orders'),
    refetchInterval: 5000,
  });

  const { data: lotTracking = [] } = useQuery<LotTracking[]>({
    queryKey: ['lots'],
    queryFn: () => customFetch('/Production/lots'),
    refetchInterval: 5000,
  });

  // 신규 지시 등록 Mutation
  const createOrderMutation = useMutation({
    mutationFn: (newOrder: { productID: string; targetQty: number; startDate: string; dueDate: string }) => 
      customFetch('/Production/order', {
        method: 'POST',
        body: JSON.stringify(newOrder),
      }),
    onSuccess: () => {
      // 쿼리 무효화로 데이터 실시간 리패치 유도
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });
      alert('작업 지시가 정상적으로 등록되었으며, 새로운 LOT가 생성되었습니다.');
    },
    onError: (err: any) => {
      alert(`등록 에러: ${err.message}`);
    }
  });

  const handleOrderSubmit = (order: { productID: string; planQty: number }) => {
    createOrderMutation.mutate({
      productID: order.productID,
      targetQty: order.planQty,
      startDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString()
    });
  };

  return (
    <DashboardContent>
      {/* 타이틀 영역 */}
      <TitleSection>
        <div>
          <h1>생산 관리 대시보드</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>실시간 공정 흐름 모니터링 및 자재 현황</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
          <Activity size={18} className="logo-icon" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>LIVE MONITORING ACTIVE</span>
        </div>
      </TitleSection>

      {/* 1. 원자재 현황 컴포넌트 */}
      <RawMaterialStatus rawMaterials={rawMaterials} />

      {/* 2. 작업지시 등록 / 목록 컴포넌트 */}
      <AdminGrid>
        <WorkOrderList workOrders={workOrders} />
        <WorkOrderForm onSubmit={handleOrderSubmit} isPending={createOrderMutation.isPending} />
      </AdminGrid>

      {/* 3. 실시간 LOT 추적 및 공정 흐름도 컴포넌트 */}
      <LotProcessTracker 
        lotTracking={lotTracking} 
        workOrders={workOrders} 
        processStages={processStages} 
      />
    </DashboardContent>
  );
};

export default Dashboard;
