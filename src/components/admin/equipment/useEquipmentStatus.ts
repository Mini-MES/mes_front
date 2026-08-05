import { customFetch } from "@/api/fetcher";
import { useNotification } from "@/context/NotificationContext";
import { ChangeEquipmentRequest, EquipmentItem, RegisterDowntimeRequest } from "@/types/equipment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useEquipmentStatus() {
    const queryClient = useQueryClient();
    const { addNotification } = useNotification();
    
    const [isDowntimeModalOpen, setIsDowntimeModalOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null);

    const { data: equipments = [], isLoading} = useQuery<EquipmentItem[]>({
        queryKey: ['equipments'],
        queryFn: () => customFetch('/Equipment'),
    });

    const {data: downtimeReasons = []} = useQuery({
        queryKey: ['downtimeReasons'],
        queryFn: () => customFetch('/Equipment/downtime-reasons'),
        staleTime: 1000 * 60 * 10, // 10분
    });

    const changeStatusMutation = useMutation({                                                                                                                                                       
        mutationFn: (req: ChangeEquipmentRequest) =>                                                                                                                                                   
          customFetch('/Equipment/status', {                                                                                                                                                           
            method: 'POST',                                                                                                                                                                            
            body: JSON.stringify(req),                                                                                                                                                                 
          }),                                                                                                                                                                                          
        onSuccess: (_, variables) => {                                                                                                                                                                 
          queryClient.invalidateQueries({ queryKey: ['equipments'] });                                                                                                                                 
                                                                                                                                                                                                       
          // 정지(STOPPED)로 변경 시 비가동 사유 입력 모달 팝업 생성                                                                                                                                   
          if (variables.newStatus === 'STOPPED') {                                                                                                                                                     
            const target = equipments.find((e) => e.equipmentID === variables.equipmentID);                                                                                                            
            if (target) {                                                                                                                                                                              
              setSelectedEquipment(target);                                                                                                                                                            
              setIsDowntimeModalOpen(true);                                                                                                                                                            
            }                                                                                                                                                                                          
          }                                                                                                                                                                                            
                                                                                                                                                                                                       
          addNotification({                                                                                                                                                                            
            type: 'SUCCESS',                                                                                                                                                                           
            title: '⚙️ [설비 상태 변경 성공]',                                                                                                                                                         
            message: `설비 [${variables.equipmentID}] 상태가 '${variables.newStatus}'(으)로 변경되었습니다.`,                                                                                          
          });                                                                                                                                                                                          
        },                                                                                                                                                                                             
        onError: (err: any) => {                                                                                                                                                                       
          addNotification({                                                                                                                                                                            
            type: 'WARN',                                                                                                                                                                              
            title: '⚠️ [상태 변경 실패]',                                                                                                                                                              
            message: err?.message || '설비 상태 변경 실패',                                                                                                                                            
          });                                                                                                                                                                                          
        },                                                                                                                                                                                             
      });  
    const registerDowntimeMutation = useMutation({                                                                                                                                                   
        mutationFn: (req: RegisterDowntimeRequest) =>                                                                                                                                                  
          customFetch('/Equipment/downtime/reason', {                                                                                                                                                  
            method: 'POST',                                                                                                                                                                            
            body: JSON.stringify(req),                                                                                                                                                                 
          }),                                                                                                                                                                                          
        onSuccess: () => {                                                                                                                                                                             
          queryClient.invalidateQueries({ queryKey: ['equipments'] });                                                                                                                                 
          setIsDowntimeModalOpen(false);                                                                                                                                                               
          setSelectedEquipment(null);                                                                                                                                                                  
          addNotification({                                                                                                                                                                            
            type: 'SUCCESS',                                                                                                                                                                           
            title: '📝 [비가동 사유 등록 완료]',                                                                                                                                                       
            message: '비가동 원인 및 메모가 등록되었습니다.',                                                                                                                                          
          });                                                                                                                                                                                          
        },                                                                                                                                                                                             
        onError: (err: any) => {                                                                                                                                                                       
          addNotification({                                                                                                                                                                            
            type: 'WARN',                                                                                                                                                                              
            title: '⚠️ [사유 등록 실패]',                                                                                                                                                              
            message: err?.message || '비가동 사유 등록 실패',                                                                                                                                          
          });                                                                                                                                                                                          
        },                                                                                                                                                                                             
      });


    const handleChangeStatus = (equipmentID: string, newStatus: string, currentLotID?: string | null) => {
    changeStatusMutation.mutate({ equipmentID, newStatus: newStatus as any, currentLotID });
    }

    const handleOpenDowntimeModal = (equipment: EquipmentItem) => {
    setSelectedEquipment(equipment);
    setIsDowntimeModalOpen(true);
    }

    const handleCloseDowntimeModal = () => {
    setIsDowntimeModalOpen(false);
    setSelectedEquipment(null);
    }

    const handleSubmitDowntimeReason = async (reasonCode: string, operatorMemo?: string, userID?: string) => {                                                                                       
    if (!selectedEquipment) return;                                                                                                                                                                
                                                                                                                                                                                                    
    try {                                                                                                                                                                                          
        // 해당 설비의 비가동 이력 중 가장 최근 LogID 가져오기                                                                                                                                       
        const history = await customFetch(`/Equipment/${selectedEquipment.equipmentID}/downtime-history`);                                                                                           
        const latestLog = history && history.length > 0 ? history[0] : null;                                                                                                                         
                                                                                                                                                                                                    
        if (!latestLog || !latestLog.downtimeLogID) {                                                                                                                                                
        addNotification({                                                                                                                                                                          
            type: 'WARN',                                                                                                                                                                            
            title: '⚠️ [이력 미존재]',                                                                                                                                                               
            message: '등록할 비가동 이력을 찾을 수 없습니다.',                                                                                                                                       
        });                                                                                                                                                                                        
        return;                                                                                                                                                                                    
        }                                                                                                                                                                                            
                                                                                                                                                                                                    
        registerDowntimeMutation.mutate({                                                                                                                                                            
        downtimeLogID: latestLog.downtimeLogID,                                                                                                                                                    
        equipmentID: selectedEquipment.equipmentID,                                                                                                                                                
        reasonCode,                                                                                                                                                                                
        operatorMemo,                                                                                                                                                                              
        userID: userID || 'ADMIN-01',                                                                                                                                                              
        });                                                                                                                                                                                          
    } catch (err: any) {                                                                                                                                                                           
        addNotification({                                                                                                                                                                            
        type: 'WARN',                                                                                                                                                                              
        title: '⚠️ [이력 조회 실패]',                                                                                                                                                              
        message: err?.message || '비가동 이력을 가져오지 못했습니다.',                                                                                                                             
        });                                                                                                                                                                                          
    }                                                                                                                                                                                                                                                                                                                                                                                
    };                                                                                                                                                                                               
                                                                                                                                                                                                    
    return {                                                                                                                                                                                         
    equipments,                                                                                                                                                                                    
    downtimeReasons,                                                                                                                                                                               
    isLoading,                                                                                                                                                                                     
    isDowntimeModalOpen,                                                                                                                                                                           
    selectedEquipment,                                                                                                                                                                             
    handleChangeStatus,                                                                                                                                                                            
    handleOpenDowntimeModal,                                                                                                                                                                       
    handleCloseDowntimeModal,                                                                                                                                                                      
    handleSubmitDowntimeReason,                                                                                                                                                                    
    isPending: {                                                                                                                                                                                   
        status: changeStatusMutation.isPending,                                                                                                                                                      
        downtime: registerDowntimeMutation.isPending,                                                                                                                                                
    },                                                                                                                                                                                             
    };             
}
