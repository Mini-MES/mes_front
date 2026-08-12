import { useState } from "react";
import { customFetch } from "@/api/fetcher";
import { DailyEquipmentProductionItem, OeeSummary } from "@/types/equipment";
import { useQuery } from "@tanstack/react-query";
import * as S from "@/components/admin/analytics/OEEAnalyticsChart.styles";
import { Activity, Bot, Calendar, Gauge, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AiReportModal } from "./AiReportModal";

export function OEEAnalyticsChart() {
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    const { data: oeeSummary, isLoading, isError, refetch } = useQuery<OeeSummary>({
        queryKey: ['oeeSummary'],
        queryFn: () => customFetch('/Equipment/oee-stats'),
    });

    const { data: dailyProductions = [] } = useQuery<DailyEquipmentProductionItem[]>({
        queryKey: ['dailyProductions'],
        queryFn: () => customFetch('/Equipment/daily-production'),
        refetchInterval: 5000,
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
                        <Bar dataKey="availability" name="시간가동률 (%)" fill="#10B981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="performance" name="성능효율 (%)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="quality" name="양품률 (%)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="oee" name="OEE (%)" fill="#00F0FF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </S.ChartWrapper>

            {/* 📅 일별 설비 생산 및 OEE 이력 (DailyEquipmentProduction 연동) */}
            <S.TableContainer>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <Calendar size={18} color="#00F0FF" />
                    <h4 style={{ margin: 0 }}>일별 설비 생산 및 OEE 집계 현황 (DailyEquipmentProduction)</h4>
                </div>

                <S.Table>
                    <thead>
                        <tr>
                            <th>작업일자</th>
                            <th>설비코드</th>
                            <th>설비명</th>
                            <th>실가동 / 계획 (분)</th>
                            <th>비가동 (분)</th>
                            <th>총생산수량</th>
                            <th>양품 / 불량</th>
                            <th>가동률 (%)</th>
                            <th>성능효율 (%)</th>
                            <th>양품률 (%)</th>
                            <th>OEE (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dailyProductions.length === 0 ? (
                            <tr>
                                <td colSpan={11} style={{ padding: '2rem', color: '#94a3b8' }}>
                                    수집된 일별 설비 생산 데이터가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            dailyProductions.map((item) => (
                                <tr key={`${item.equipmentID}-${item.workDate}`}>
                                    <td>{item.workDate}</td>
                                    <td>
                                        <S.Badge>{item.equipmentID}</S.Badge>
                                    </td>
                                    <td>{item.equipmentName || item.equipmentID}</td>
                                    <td>{item.operatingMinutes} / {item.plannedProductionMinutes}분</td>
                                    <td style={{ color: item.downtimeMinutes > 0 ? '#FF4B5C' : '#94A3B8' }}>
                                        {item.downtimeMinutes}분
                                    </td>
                                    <td>{item.totalProducedQty.toLocaleString()}개</td>
                                    <td>
                                        <span style={{ color: '#10B981' }}>{item.goodQty.toLocaleString()}</span> /{' '}
                                        <span style={{ color: item.defectQty > 0 ? '#FF4B5C' : '#94A3B8' }}>
                                            {item.defectQty.toLocaleString()}
                                        </span>
                                    </td>
                                    <td style={{ color: '#10B981', fontWeight: 600 }}>{item.availabilityRate}%</td>
                                    <td style={{ color: '#3B82F6', fontWeight: 600 }}>{item.performanceRate}%</td>
                                    <td style={{ color: '#8B5CF6', fontWeight: 600 }}>{item.qualityRate}%</td>
                                    <td>
                                        <S.Badge $color="rgba(0, 240, 255, 0.2)">
                                            {item.oeePercentage}%
                                        </S.Badge>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </S.Table>
            </S.TableContainer>

            {/* AI 리포트 모달 */}
            <AiReportModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
            />
        </S.Container>
    );
}