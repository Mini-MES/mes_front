import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${props => props.theme.colors.bgMain};
    color: ${props => props.theme.colors.textPrimary};
    font-family: ${props => props.theme.fonts.sans};
    min-height: 100vh;
    overflow-x: hidden;
    background-image: 
      radial-gradient(at 0% 0%, rgba(0, 229, 255, 0.05) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(41, 121, 255, 0.05) 0px, transparent 50%);
  }

  /* 스크롤바 디자인 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.bgMain};
  }
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.borderColor};
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primaryGlow};
  }
`;
