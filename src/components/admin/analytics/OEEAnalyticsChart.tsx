import { useState } from "react";
import { customFetch } from "@/api/fetcher";
import { OeeSummary } from "@/types/equipment";
import { useQuery } from "@tanstack/react-query";
import * as S from "@/components/admin/analytics/OEEAnalyticsChart.styles";
import { Activity, Bot, Gauge, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AiReportModal } from "./AiReportModal";

export function OEEAnalyticsChart() {
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    const { data: oeeSummary, isLoading, isError, refetch } = useQuery<OeeSummary>({
        queryKey: ['oeeSummary'],
        queryFn: () => customFetch('/Equipment/oee-stats'),
    });

    if (isLoading) {
        return <S.LoadingText>OEE 종합 효율 데이터 분석 중...</S.LoadingText>;
    }

    if (isError || !oeeSummary) {
        return (
            <S.LoadingText style={{ color: '#ff4b5c', cursor: 'pointer' }} onClick={() => refetch()}>
                ⚠️ OEE 데이터를 불러오지 못했습니다. (클릭하여 다시 시도)
            </S.LoadingText>
        );
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
            {/* AI 스마트 진단 리포트 배너 */}
            <S.AiBanner>
                <S.AiBannerTitleGroup>
                    <S.AiIconWrapper>
                        <Bot size={24} />
                    </S.AiIconWrapper>
                    <S.AiBannerText>
                        <h4>
                            <Sparkles size={16} color="#00F0FF" />
                            Google Gemini AI 스마트 생산 진단
                        </h4>
                        <p>실시간 OEE 수치 및 비가동 이력을 기반으로 최저 OEE 병목 설비 진단 및 엔지니어링 개선안을 생성합니다.</p>
                    </S.AiBannerText>
                </S.AiBannerTitleGroup>

                <S.AiButton type="button" onClick={() => setIsAiModalOpen(true)}>
                    <Sparkles size={16} />
                    AI 진단 리포트 보기
                </S.AiButton>
            </S.AiBanner>

            {/* 상단 4대 OEE 핵심 요약 KPI 카드 */}                                                                                                                     
            <S.KpiGrid>                                                                                                                                                 
                <S.KpiCard $color="#00F0FF">                                                                                                                              
                    <Gauge size={24} />                                                                                                                                     
                    <S.KpiContent>                                                                                                                                          
                        <S.KpiLabel>공장 전체 평균 OEE</S.KpiLabel>                                                                                                           
                        <S.KpiValue>{oeeSummary.overallOee}%</S.KpiValue>                                                                                                     
                    </S.KpiContent>                                                                                                                                             
                </S.KpiCard>                                                                                                                                              
                                                                                                                                                                            
                <S.KpiCard $color="#10B981">                                                                                                                              
                    <Activity size={24} />                                                                                                                                  
                    <S.KpiContent>                                                                                                                                          
                        <S.KpiLabel>평균 가동률 (Availability)</S.KpiLabel>                                                                                                   
                        <S.KpiValue>{oeeSummary.averageAvailability}%</S.KpiValue>                                                                                            
                    </S.KpiContent>                                                                                                                                                  
                </S.KpiCard>                                                                                                                                              
                                                                                                                                                                            
                <S.KpiCard $color="#3B82F6">                                                                                                                              
                    <Zap size={24} />                                                                                                                                       
                    <S.KpiContent>                                                                                                                                          
                        <S.KpiLabel>평균 성능효율 (Performance)</S.KpiLabel>                                                                                                  
                        <S.KpiValue>{oeeSummary.averagePerformance}%</S.KpiValue>                                                                                             
                    </S.KpiContent>                                                                                                                                                  
                </S.KpiCard>                                                                                                                                              
                                                                                                                                                                            
                <S.KpiCard $color="#8B5CF6">                                                                                                                              
                    <ShieldCheck size={24} />                                                                                                                               
                    <S.KpiContent>                                                                                                                                          
                        <S.KpiLabel>평균 품질률 (Quality)</S.KpiLabel>                                                                                                        
                        <S.KpiValue>{oeeSummary.averageQuality}%</S.KpiValue>                                                                                                 
                    </S.KpiContent>                                                                                                                                                
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
                    <Bar dataKey="availability" fill="#10B981" radius={[4, 4, 0, 0]} />                                                                                         
                    <Bar dataKey="performance" fill="#3B82F6" radius={[4, 4, 0, 0]} />                                                                                       
                    <Bar dataKey="quality" fill="#8B5CF6" radius={[4, 4, 0, 0]} />                                                                                         
                    <Bar dataKey="oee" fill="#00F0FF" radius={[4, 4, 0, 0]} />                                                                                        
                </BarChart>                                                                                                                                             
            </ResponsiveContainer>                                                                                                                                    
            </S.ChartWrapper>                                                                                                                                           

            {/* AI 리포트 모달 */}
            <AiReportModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
            />
        </S.Container>                                                                                                                                                
    );            
}