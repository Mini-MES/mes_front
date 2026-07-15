export const theme = {
  colors: {
    bgMain: '#0b0f19',
    bgCard: 'rgba(22, 29, 49, 0.7)',
    bgCardHover: 'rgba(30, 40, 66, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderColorGlow: 'rgba(0, 229, 255, 0.2)',
    
    // 브랜드/시그널 컬러
    primary: '#00e5ff',
    primaryGlow: 'rgba(0, 229, 255, 0.4)',
    success: '#00e676',
    warning: '#ffb300',
    danger: '#ff1744',
    info: '#2979ff',
    
    // 텍스트 컬러
    textPrimary: '#f3f4f6',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
  },
  
  fonts: {
    sans: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  
  transitions: {
    smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }
};

export type ThemeType = typeof theme;
