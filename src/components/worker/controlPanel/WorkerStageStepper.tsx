import React from 'react';
import { LotTracking } from '@/context/AppContext';
import * as S from '@/components/worker/controlPanel/WorkerControlPanel.styles';

interface WorkerStageStepperProps {
  processStages: string[];
  currentStageIndex: number;
  isOrderCompleted: boolean;
  activeLot?: LotTracking;
  getStageName: (id: number) => string;
}

const WorkerStageStepper: React.FC<WorkerStageStepperProps> = ({
  processStages,
  currentStageIndex,
  isOrderCompleted,
  activeLot,
  getStageName
}) => {
  return (
    <div>
      <S.StepperTitle>전체 공정 현황</S.StepperTitle>
      <S.StepperTrack>
        {processStages.map((stage, idx) => {
          const isActive = idx === currentStageIndex;
          const isCompleted = idx < currentStageIndex || isOrderCompleted;
          return (
            <S.StepperBar 
              key={stage} 
              $isActive={isActive} 
              $isCompleted={isCompleted}
              title={stage}
            />
          );
        })}
      </S.StepperTrack>
      <S.StepperLabels>
        <span>{processStages[0]}</span>
        <span>{activeLot ? getStageName(activeLot.currentProcessID) : ''}</span>
        <span>{processStages[processStages.length - 1]}</span>
      </S.StepperLabels>
    </div>
  );
};

export default WorkerStageStepper;
