import { Loader2 } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
`;

const StyledLoader = styled(Loader2)`
  animation: ${spin} 1s linear infinite;
`;

const SpinnerContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

export function LoadingSpinner() {
  return (
    <SpinnerContainer>
      <StyledLoader />
    </SpinnerContainer>
  );
}