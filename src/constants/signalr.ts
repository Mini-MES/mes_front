export const SIGNALR_EVENTS = {
  RECEIVE_SENSOR_COUNT: 'ReceiveSensorCountUpdated',
  RECEIVE_SENSOR_COUNT_LOWER: 'receiveSensorCountUpdated',
  LOT_UPDATED: 'LotUpdated',
  STOCK_UPDATED: 'StockUpdated',
  WORK_ORDER_UPDATED: 'WorkOrderUpdated',
  DEFECT_REPORTED: 'DefectReported',
} as const;

export const SENSOR_CONFIG = {
  THROTTLE_MS: 100,
} as const;
