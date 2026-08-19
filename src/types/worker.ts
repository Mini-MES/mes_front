import { WorkOrder, LotTracking } from '@/context/AppContext';
import { SensorStatus } from './sensor';
import { DowntimeLogItem, DowntimeReason, EquipmentItem } from './equipment';

export interface DefectReason {
  reasonCode: string | number;
  reasonDescription: string;
}

export interface WorkerControlPanelProps {
  activeOrder?: WorkOrder;
  activeLot?: LotTracking;
  processStages: string[];
  equipments: EquipmentItem[];
  activeEquipment?: EquipmentItem;
  openDowntimeLog?: DowntimeLogItem;
  downtimeReasons: DowntimeReason[];
  defectReasons?: DefectReason[];
  sensorStatus: SensorStatus;
  accumulatedGood: number;
  accumulatedBad: number;
  lastPulseTime?: string | null;
  onStart: (equipmentId: string) => void;
  onTogglePause: () => void;
  onRegisterDefect: (badQty: number, reasonCode: string, toolId?: string) => void;
  onNextStage: (toolId?: string, equipmentId?: string) => void;
  onComplete: () => void;
  onRegisterDowntime: (reasonCode: string, memo?: string) => void;
  isPending: {
    start: boolean;
    defect: boolean;
    next: boolean;
    complete: boolean;
    downtime: boolean;
  };
}
