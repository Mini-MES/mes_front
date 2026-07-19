import React from 'react';
import { Activity } from 'lucide-react';
import * as S from '@/pages/admin/Dashboard.styles';
import { useDashboard } from './useDashboard';

// 분리된 하위 컴포넌트 임포트
import { RawMaterialStatus } from '@/components/admin/RawMaterialStatus';
import { WorkOrderList } from '@/components/admin/WorkOrderList';
import { WorkOrderForm } from '@/components/admin/WorkOrderForm';
import LotProcessTracker from '@/components/admin/LotProcessTracker';
import { ShipmentForm } from '@/components/admin/ShipmentForm';
import { ShipmentList } from '@/components/admin/ShipmentList';

const Dashboard: React.FC = () => {
  const {
    rawMaterials,
    workOrders,
    lotTracking,
    processStages,
    shipments,
    isShipmentsLoading,
    handleOrderSubmit,
    handleStartOrder,
    handleCompleteOrder,
    handleDeleteOrder,
    handleShipmentSubmit,
    handleCreateMaterial,
    handleUpdateStock,
    isCreatePending,
    isShipPending,
    isMaterialPending
  } = useDashboard();

  return (
    <S.DashboardContent>
      {/* 타이틀 영역 */}
      <S.TitleSection>
        <div>
          <h1>생산 관리 대시보드</h1>
          <S.HeaderSubText>실시간 공정 흐름 모니터링 및 자재 현황</S.HeaderSubText>
        </div>
        <S.LiveMonitoringBadge>
          <Activity size={18} className="logo-icon" />
          <S.LiveMonitoringText>LIVE MONITORING ACTIVE</S.LiveMonitoringText>
        </S.LiveMonitoringBadge>
      </S.TitleSection>

      {/* 1. 원자재 현황 컴포넌트 */}
      <RawMaterialStatus 
        rawMaterials={rawMaterials} 
        onCreateMaterial={handleCreateMaterial}
        onUpdateStock={handleUpdateStock}
        isPending={isMaterialPending}
      />

      {/* 2. 작업지시 등록 / 목록 / 출하 등록 컴포넌트 */}
      <S.AdminGrid>
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
      </S.AdminGrid>

      {/* 3. 실시간 LOT 추적 및 공정 흐름도 컴포넌트 */}
      <LotProcessTracker 
        lotTracking={lotTracking} 
        workOrders={workOrders} 
        processStages={processStages} 
      />

      {/* 4. 완제품 출하 이력 현황판 컴포넌트 */}
      <ShipmentList 
        shipments={shipments} 
        isLoading={isShipmentsLoading} 
      />
    </S.DashboardContent>
  );
};

export default Dashboard;
