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

export interface EquipmentOEE {
    equipmentID: string;                                                                                                                                            
      equipmentName: string;                                                                                                                                          
      status: SensorStatus;                                                                                                                                           
      totalRunningMinutes: number;                                                                                                                                    
      totalDowntimeMinutes: number;                                                                                                                                   
      targetQty: number;                                                                                                                                              
      totalProducedQty: number;                                                                                                                                       
      goodQty: number;                                                                                                                                                
      defectQty: number;                                                                                                                                              
      availabilityRate: number;                                                                                                                      
      performanceRate: number;                                                                                                                         
      qualityRate: number;                                                                                                                           
      oeePercentage: number;
}

export interface OeeSummary {                                                                                                                                     
    overallOee: number;                                                                                                                                             
    averageAvailability: number;                                                                                                                                    
    averagePerformance: number;                                                                                                                                     
    averageQuality: number;                                                                                                                                         
    totalEquipments: number;                                                                                                                                        
    runningEquipments: number;                                                                                                                                      
    stoppedEquipments: number;                                                                                                                                      
    equipments: EquipmentOEE[];                                                                                                                                     
}         