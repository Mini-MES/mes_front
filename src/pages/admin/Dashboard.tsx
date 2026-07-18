import { Activity } from 'lucide-react';
import { DashboardContent, TitleSection, AdminGrid } from '@/pages/admin/Dashboard.styles';
import { useDashboard } from './useDashboard';

// 분리된 하위 컴포넌트 임포트
import RawMaterialStatus from '@/components/admin/RawMaterialStatus';
import { WorkOrderList } from '@/components/admin/WorkOrderList';
import { WorkOrderForm } from '@/components/admin/WorkOrderForm';
import LotProcessTracker from '@/components/admin/LotProcessTracker';
import { ShipmentForm } from '@/components/admin/ShipmentForm';

export default function Dashboard() {
  const {
    rawMaterials,
    workOrders,
    lotTracking,
    processStages,
    handleOrderSubmit,
    handleStartOrder,
    handleCompleteOrder,
    handleDeleteOrder,
    handleShipmentSubmit,
    isCreatePending,
    isShipPending
  } = useDashboard();

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

      {/* 2. 작업지시 등록 / 목록 / 출하 등록 컴포넌트 */}
      <AdminGrid>
        <WorkOrderList 
          workOrders={workOrders} 
          products={rawMaterials}
          onStartOrder={handleStartOrder}
          onCompleteOrder={handleCompleteOrder}
          onDeleteOrder={handleDeleteOrder}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <WorkOrderForm 
            onSubmit={handleOrderSubmit} 
            isPending={isCreatePending} 
            products={rawMaterials}
          />
          <ShipmentForm
            onSubmit={handleShipmentSubmit}
            isPending={isShipPending}
            products={rawMaterials}
            workOrders={workOrders}
          />
        </div>
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
