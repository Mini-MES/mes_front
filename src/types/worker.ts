import { WorkOrder, LotTracking } from '@/context/AppContext';
import { SensorStatus } from './sensor';

export interface DefectReason {
  reasonCode: string | number;
  reasonDescription: string;
}

export interface WorkerControlPanelProps {
  activeOrder?: WorkOrder;
  activeLot?: LotTracking;
  processStages: string[];
  defectReasons?: DefectReason[];
  sensorStatus: SensorStatus;
  accumulatedGood: number;
  accumulatedBad: number;
  lastPulseTime?: string | null;
  onStart: () => void;
  onTogglePause: () => void;
  onConfirmPerformance: (toolId?: string) => void;
  onRegisterDefect: (badQty: number, reasonCode: string, toolId?: string) => void;
  onNextStage: (toolId?: string) => void;
  onComplete: () => void;
  isPending: {
    start: boolean;
    confirm: boolean;
    next: boolean;
    complete: boolean;
  };
}
