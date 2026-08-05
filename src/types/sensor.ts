export interface SensorCountData {
    workOrderID: number;
    lotID: string;
    equipmentID: string;
    goodCount: number;
    badCount: number;
    timestamp: string; 
}

export type SensorStatus =                                                                                                                                                                         
      | 'RUNNING'      // 가동 중                                                                                                                                                                      
      | 'STOPPED'      // 정지                                                                                                                                                                         
      | 'MAINTENANCE'  // 유지보수                                                                                                                                                                     
      | 'IDLE'         // 유휴 (대기)                                                                                                                                                                  
      | 'ERROR'        // 오류 (고장)                                                                                                                                                                  
      | 'SETUP';       // 셋업/교체 중

export const SENSOR_STATUS_MAP: Record<SensorStatus, { label: string; color: string; bg: string }> = {                                                                                             
    RUNNING:     { label: '가동 중 (자동 수집)', color: '#00e676', bg: 'rgba(0, 230, 118, 0.15)' },                                                                                                  
    STOPPED:     { label: '정지 (일시 중지)',    color: '#ffab00', bg: 'rgba(255, 171, 0, 0.15)' },                                                                                                  
    MAINTENANCE: { label: '유지보수 중',        color: '#00b0ff', bg: 'rgba(0, 176, 255, 0.15)' },                                                                                                   
    IDLE:        { label: '유휴 (대기중)',      color: '#9e9e9e', bg: 'rgba(158, 158, 158, 0.15)' },                                                                                                 
    ERROR:       { label: '설비 오류/고장',     color: '#ff1744', bg: 'rgba(255, 23, 68, 0.15)' },                                                                                                   
    SETUP:       { label: '셋업/교체 중',       color: '#d500f9', bg: 'rgba(213, 0, 249, 0.15)' },                                                                                                   
};