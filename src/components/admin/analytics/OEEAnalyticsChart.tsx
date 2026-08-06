import { customFetch } from "@/api/fetcher";
import { OeeSummary } from "@/types/equipment";
import { useQuery } from "@tanstack/react-query";
import * as S from "@/components/admin/analytics/OEEAnalyticsChart.styles";
import { Activity, Gauge, ShieldCheck, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function OEEAnalyticsChart() {
    const {data: oeeSummary, isLoading} = useQuery<OeeSummary>({
        queryKey: ['oeeSummary'],
        queryFn: () => customFetch('/Equipment/oee-stats'),
    });

    if(isLoading || !oeeSummary) {
        return <S.LoadingText>OEE 종합 효율 데이터 분석 중...</S.LoadingText>;
    }

    const chartData = oeeSummary.equipments.map(equipment => ({
        name: equipment.equipmentName,
        availability: equipment.availabilityRate,
        performance: equipment.performanceRate,
        quality: equipment.qualityRate,
        oee: equipment.oeePercentage,
    }));


    return (                                                                                                                                                        
        <S.Container>                                                                                                                                                 
            {/* 상단 4대 OEE 핵심 요약 KPI 카드 */}                                                                                                                     
            <S.KpiGrid>                                                                                                                                                 
            <S.KpiCard $color="#00F0FF">                                                                                                                              
                <Gauge size={24} />                                                                                                                                     
                <div>                                                                                                                                                   
                <span>공장 전체 평균 OEE</span>                                                                                                                       
                <h3>{oeeSummary.overallOee}%</h3>                                                                                                                     
                </div>                                                                                                                                                  
            </S.KpiCard>                                                                                                                                              
                                                                                                                                                                        
            <S.KpiCard $color="#10B981">                                                                                                                              
                <Activity size={24} />                                                                                                                                  
                <div>                                                                                                                                                   
                <span>평균 가동률 (Availability)</span>                                                                                                               
                <h3>{oeeSummary.averageAvailability}%</h3>                                                                                                            
                </div>                                                                                                                                                  
            </S.KpiCard>                                                                                                                                              
                                                                                                                                                                        
            <S.KpiCard $color="#3B82F6">                                                                                                                              
                <Zap size={24} />                                                                                                                                       
                <div>                                                                                                                                                   
                <span>평균 성능효율 (Performance)</span>                                                                                                              
                <h3>{oeeSummary.averagePerformance}%</h3>                                                                                                             
                </div>                                                                                                                                                  
            </S.KpiCard>                                                                                                                                              
                                                                                                                                                                        
            <S.KpiCard $color="#8B5CF6">                                                                                                                              
                <ShieldCheck size={24} />                                                                                                                               
                <div>                                                                                                                                                   
                <span>평균 품질률 (Quality)</span>                                                                                                                    
                <h3>{oeeSummary.averageQuality}%</h3>                                                                                                                 
                </div>                                                                                                                                                  
            </S.KpiCard>                                                                                                                                              
            </S.KpiGrid>                                                                                                                                                
                                                                                                                                                                        
            {/* 설비별 OEE 3대 팩터 비교 바 차트 */}                                                                                                                    
            <S.ChartWrapper>                                                                                                                                            
            <h4>설비별 OEE 3대 지표 비교</h4>                                                                                                                         
            <ResponsiveContainer width="100%" height={300}>                                                                                                           
                <BarChart data={chartData}>                                                                                                                             
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />                                                                                
                <XAxis dataKey="name" stroke="#94A3B8" />                                                                                                             
                <YAxis domain={[0, 100]} stroke="#94A3B8" unit="%" />                                                                                                 
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155' }} />                                                                     
                <Legend />                                                                                                                                            
                <Bar dataKey="가동률" fill="#10B981" radius={[4, 4, 0, 0]} />                                                                                         
                <Bar dataKey="성능효율" fill="#3B82F6" radius={[4, 4, 0, 0]} />                                                                                       
                <Bar dataKey="품질률" fill="#8B5CF6" radius={[4, 4, 0, 0]} />                                                                                         
                <Bar dataKey="종합OEE" fill="#00F0FF" radius={[4, 4, 0, 0]} />                                                                                        
                </BarChart>                                                                                                                                             
            </ResponsiveContainer>                                                                                                                                    
            </S.ChartWrapper>                                                                                                                                           
        </S.Container>                                                                                                                                                
    );            
}