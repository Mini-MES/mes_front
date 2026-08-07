import { LotTracking, RawMaterial, WorkOrder } from "@/context/AppContext";
import { OeeSummary } from "@/types/equipment";
import * as S from "@/components/admin/analytics/ExportToolbar.styles";
import { CSVLink } from "react-csv";
import { Download, FileSpreadsheet, Gauge, Layers, Package } from "lucide-react";
import { customFetch } from "@/api/fetcher";
import { useQuery } from "@tanstack/react-query";

interface ExportToolbarProps {                                                                                                                                    
    workOrders?: WorkOrder[];                                                                                                                                       
    rawMaterials?: RawMaterial[];                                                                                                                                   
    lotTracking?: LotTracking[];                                                                                                                                    
    processStages?: string[];                                                                                                                                                                                                                                                                     
}          

export function ExportToolbar({ workOrders, rawMaterials, lotTracking, processStages }: ExportToolbarProps) {
    const today = new Date().toISOString().slice(0, 10); // 날짜를 YYYY-MM-DD 형식으로 변환

    const sanitizeCSV = (val: any) => {                                                                                                                               
      if (typeof val === 'string' && /^[=+\-@\t\r]/.test(val)) {                                                                                                      
        return `'${val}`;                                                                                                                                             
      }                                                                                                                                                               
      return val;                                                                                                                                                     
    }; 

    const { data: oeeSummary } = useQuery<OeeSummary>({
        queryKey: ['oeeSummary'],
        queryFn: () => customFetch('/Equipment/oee-stats') 
    });

    const woHeader = [
        { label: '지시 ID', key: 'orderID' },
        { label: '품목 ID', key: 'productID' },
        { label: '목표 수량', key: 'targetQty' },
        { label: '양품 수량', key: 'totalGoodQty' },
        { label: '불량 수량', key: 'totalBadQty' },
        { label: '진행 상태', key: 'status' },
        { label: '지시일', key: 'orderDate' },
        { label: '발행 LOT', key: 'lotID' }
    ];

    const materialHeader = [                                                                                                                                       
        { label: '품목 ID', key: 'productID' },                                                                                                                       
        { label: '품목명', key: 'productName' },                                                                                                                      
        { label: '현재 재고량', key: 'stockQty' },                                                                                                                    
        { label: '단위', key: 'unit' },                                                                                                                               
        { label: '안전 재고량', key: 'safetyStock' },                                                                                                                 
        { label: '재고 상태', key: 'status' }                                                                                                                         
    ];

    const lotHeader = [                                                                                                                                            
        { label: 'LOT ID', key: 'lotID' },                                                                                                                            
        { label: '지시 ID', key: 'orderID' },                                                                                                                         
        { label: '현재 공정 번호', key: 'currentProcessID' },                                                                                                         
        { label: '공정명', key: 'processName' },                                                                                                                      
        { label: '누적 불량 수량', key: 'totalBadQty' },                                                                                                              
        { label: 'LOT 상태', key: 'status' },                                                                                                                         
        { label: '최종 수정자', key: 'updatedBy' }                                                                                                                    
    ];

    const sanitizedWorkOrders = (workOrders || []).map(wo => ({
        ...wo,
        productID: sanitizeCSV(wo.productID),
        lotID: sanitizeCSV(wo.lotID),
        status: sanitizeCSV(wo.status)
    }));

    const sanitizedRawMaterials = (rawMaterials || []).map(mat => ({
        ...mat,
        productID: sanitizeCSV(mat.productID),
        productName: sanitizeCSV(mat.productName),
        unit: sanitizeCSV(mat.unit),
        status: sanitizeCSV(mat.status)
    }));

    const lotData = (lotTracking || []).map(lot => ({
        ...lot,
        lotID: sanitizeCSV(lot.lotID),
        processName: sanitizeCSV(processStages?.[lot.currentProcessID - 1] || `${lot.currentProcessID}공정`),
        status: sanitizeCSV(lot.status),
        updatedBy: sanitizeCSV(lot.updatedBy || '-')
    }));

    const oeeHeader = [
        { label: '설비 ID', key: 'equipmentID' },
        { label: '설비명', key: 'equipmentName' },
        { label: '가동 상태', key: 'status' },
        { label: '가동률(%)', key: 'availabilityRate' },
        { label: '성능효율(%)', key: 'performanceRate' },
        { label: '품질률(%)', key: 'qualityRate' },
        { label: '종합 OEE(%)', key: 'oeePercentage' }
    ]; 

    const oeeData = (oeeSummary?.equipments || []).map(eq => ({
        ...eq,
        equipmentID: sanitizeCSV(eq.equipmentID),
        equipmentName: sanitizeCSV(eq.equipmentName),
        status: sanitizeCSV(eq.status)
    }));

    return(
    <S.Container>
        <S.TitleGroup>
        <FileSpreadsheet size={20} color="#00F0FF" />
        <div>
            <h3>공정 데이터 내보내기</h3>
            <span>실시간 공정/생산/설비 데이터를 CSV로 내보냅니다.</span>
        </div>
        </S.TitleGroup>

        <S.ButtonGroup>
        {/* 작업지시 (WO) CSV */}
        <CSVLink
            data={sanitizedWorkOrders}
            headers={woHeader}
            filename={`MES_작업지시목록_${today}.csv`}
            uFEFF={true}
        >
            <S.ExportButton $variant="cyan" title="작업지시 목록 내보내기">
            <Download size={15} />
            작업지시 (WO)
            </S.ExportButton>
        </CSVLink>

        {/* 자재 재고 CSV */}
        <CSVLink
            data={sanitizedRawMaterials}
            headers={materialHeader}
            filename={`MES_자재재고현황_${today}.csv`}
            uFEFF={true}
        >
            <S.ExportButton $variant="green" title="자재 재고 현황 내보내기">
            <Package size={15} />
            자재 재고
            </S.ExportButton>
        </CSVLink>

        {/* LOT 이력 CSV */}
        <CSVLink
            data={lotData}
            headers={lotHeader}
            filename={`MES_LOT공정추적이력_${today}.csv`}
            uFEFF={true}
        >
            <S.ExportButton $variant="purple" title="LOT 이력 내보내기">
            <Layers size={15} />
            LOT 이력
            </S.ExportButton>
        </CSVLink>

        {/* 설비 OEE CSV */}
        <CSVLink
            data={oeeData}
            headers={oeeHeader}
            filename={`MES_설비종합효율_OEE_${today}.csv`}
            uFEFF={true}
        >
            <S.ExportButton $variant="amber" title="설비 OEE 지표 내보내기">
            <Gauge size={15} />
            설비 OEE
            </S.ExportButton>
        </CSVLink>
        </S.ButtonGroup>
    </S.Container>
    );                
}