import styled from 'styled-components';

export const ContainerWrapper = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`;
