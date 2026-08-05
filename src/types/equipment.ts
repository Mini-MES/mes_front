import {SensorStatus} from './sensor';

export interface EquipmentItem {
    equipmentID: string;
    equipmentName: string;
    status: SensorStatus;
    currentLotID: string | null;
    totalRunningSeconds: number;
    totalDowntimeSeconds: number;
    lastStatusChangedAt: string;
}

export interface DowntimeReason {
    reasonCode: string;
    reasonName: string;
    category: string;
}

export interface ChangeEquipmentRequest {
    equipmentID: string;
    newStatus: SensorStatus;
    currentLotID?: string | null;
}

export interface RegisterDowntimeRequest {
    downtimeLogID: number;
    equipmentID: string;
    reasonCode: string;
    operatorMemo?: string;
    userID: string;
}
