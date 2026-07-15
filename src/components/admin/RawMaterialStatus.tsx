import React from 'react';
import { Database, AlertTriangle } from 'lucide-react';
import { RawMaterial } from '@/context/AppContext';
import { GlassCard, CardTitle } from '@/pages/admin/Dashboard.styles';
import { 
  MaterialGrid, 
  MaterialCard, 
  MaterialName, 
  MaterialStock, 
  StatusBadge 
} from './RawMaterialStatus.styles';

interface RawMaterialStatusProps {
  rawMaterials: RawMaterial[];
}

const RawMaterialStatus: React.FC<RawMaterialStatusProps> = ({ rawMaterials }) => {
  return (
    <GlassCard>
      <CardTitle>
        <Database size={18} />
        실시간 원자재 재고 현황
      </CardTitle>
      <MaterialGrid>
        {rawMaterials
          .filter(item => (item as any).itemType === 'RawMaterial' || (item as any).itemType === 0)
          .map(mat => {
            const isWarning = mat.stockQty < mat.safetyStock;
            return (
              <MaterialCard key={mat.productID} $isWarning={isWarning}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <MaterialName>{mat.name}</MaterialName>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{mat.productID}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginTop: '0.5rem' }}>
                  <MaterialStock $isWarning={isWarning}>{mat.stockQty.toLocaleString()}</MaterialStock>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{mat.unit || '개'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>안전재고: {mat.safetyStock}</span>
                  <StatusBadge className={isWarning ? 'alert' : 'completed'} style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>
                    {isWarning ? (
                      <>
                        <AlertTriangle size={10} /> 부족
                      </>
                    ) : '충분'}
                  </StatusBadge>
                </div>
              </MaterialCard>
            );
          })}
      </MaterialGrid>
    </GlassCard>
  );
};

export default RawMaterialStatus;
