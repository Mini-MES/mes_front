import styled from 'styled-components';                                                                                                                           
                                                                                                                                                                      
export const Container = styled.div`                                                                                                                              
    display: flex;                                                                                                                                                  
    flex-direction: column;                                                                                                                                         
    gap: 1.5rem;                                                                                                                                                    
    width: 100%;                                                                                                                                                    
    margin-top: 1rem;                                                                                                                                               
`;                                                                                                                                                                
                                                                                                                                                                    
export const LoadingText = styled.div`                                                                                                                            
    display: flex;                                                                                                                                                  
    justify-content: center;                                                                                                                                        
    align-items: center;                                                                                                                                            
    padding: 3rem;                                                                                                                                                  
    color: var(--color-subtext, #94a3b8);                                                                                                                           
    font-size: 0.95rem;                                                                                                                                             
    background: rgba(15, 23, 42, 0.6);                                                                                                                              
    border-radius: 12px;                                                                                                                                            
    border: 1px solid rgba(255, 255, 255, 0.08);                                                                                                                    
`;                                                                                                                                                                
                                                                                                                                                                    
export const KpiGrid = styled.div`                                                                                                                                
    display: grid;                                                                                                                                                  
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));                                                                                                    
    gap: 1rem;                                                                                                                                                      
`;       

export const KpiContent = styled.div`                                                                                                                             
      display: flex;                                                                                                                                                  
      flex-direction: column;                                                                                                                                         
      gap: 0.25rem;                                                                                                                                                   
    `;                                                                                                                                                                
                                                                                                                                                                      
export const KpiLabel = styled.span`                                                                                                                              
    font-size: 0.8rem;                                                                                                                                              
    color: #94a3b8;                                                                                                                                                 
    font-weight: 500;                                                                                                                                               
`;                                                                                                                                                                
                                                                                                                                                                    
export const KpiValue = styled.h3`                                                                                                                                
    font-size: 1.5rem;                                                                                                                                              
    font-weight: 700;                                                                                                                                               
    color: #f8fafc;                                                                                                                                                 
    letter-spacing: -0.5px;                                                                                                                                         
    margin: 0;                                                                                                                                                      
`;
                                                                                                                                                                    
export const KpiCard = styled.div<{ $color?: string }>`                                                                                                           
    display: flex;                                                                                                                                                  
    align-items: center;                                                                                                                                            
    gap: 1rem;                                                                                                                                                      
    padding: 1.25rem 1.5rem;                                                                                                                                        
    background: rgba(15, 23, 42, 0.7);                                                                                                                              
    backdrop-filter: blur(12px);                                                                                                                                    
    border: 1px solid rgba(255, 255, 255, 0.08);                                                                                                                    
    border-left: 4px solid ${(props) => props.$color || '#00F0FF'};                                                                                                 
    border-radius: 12px;                                                                                                                                            
    transition: transform 0.2s ease, box-shadow 0.2s ease;                                                                                                          
                                                                                                                                                                    
    &:hover {                                                                                                                                                       
    transform: translateY(-2px);                                                                                                                                  
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);                                                                                                                    
    }                                                                                                                                                               
                                                                                                                                                                    
    svg {                                                                                                                                                           
    color: ${(props) => props.$color || '#00F0FF'};                                                                                                               
    filter: drop-shadow(0 0 6px ${(props) => props.$color || '#00F0FF'});                                                                                         
    flex-shrink: 0;                                                                                                                                               
    }                                                                                                                                                               
                                                                                                                                                                    
    div {                                                                                                                                                           
    display: flex;                                                                                                                                                
    flex-direction: column;                                                                                                                                       
    gap: 0.25rem;                                                                                                                                                 
                                                                                                                                                                    
    span {                                                                                                                                                        
        font-size: 0.8rem;                                                                                                                                          
        color: #94a3b8;                                                                                                                                             
        font-weight: 500;                                                                                                                                           
    }                                                                                                                                                             
                                                                                                                                                                    
    h3 {                                                                                                                                                          
        font-size: 1.5rem;                                                                                                                                          
        font-weight: 700;                                                                                                                                           
        color: #f8fafc;                                                                                                                                             
        letter-spacing: -0.5px;                                                                                                                                     
    }                                                                                                                                                             
    }                                                                                                                                                               
`;                                                                                                                                                                
                                                                                                                                                                    
export const ChartWrapper = styled.div`                                                                                                                           
    background: rgba(15, 23, 42, 0.7);                                                                                                                              
    backdrop-filter: blur(12px);                                                                                                                                    
    border: 1px solid rgba(255, 255, 255, 0.08);                                                                                                                    
    border-radius: 14px;                                                                                                                                            
    padding: 1.5rem;                                                                                                                                                
                                                                                                                                                                    
    h4 {                                                                                                                                                            
    font-size: 1rem;                                                                                                                                              
    font-weight: 600;                                                                                                                                             
    color: #f8fafc;                                                                                                                                               
    margin-bottom: 1.25rem;                                                                                                                                       
    display: flex;                                                                                                                                                
    align-items: center;                                                                                                                                          
    gap: 0.5rem;                                                                                                                                                  
                                                                                                                                                                    
    &::before {                                                                                                                                                   
        content: '';                                                                                                                                                
        display: inline-block;                                                                                                                                      
        width: 4px;                                                                                                                                                 
        height: 14px;                                                                                                                                               
        background: #00f0ff;                                                                                                                                        
        border-radius: 2px;                                                                                                                                         
    }                                                                                                                                                             
    }                                                                                                                                                               
`;

export const AiBanner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.8) 100%);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 240, 255, 0.15);
  margin-bottom: 0.5rem;
`;

export const AiBannerTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const AiIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(0, 240, 255, 0.15);
  color: #00F0FF;
  border: 1px solid rgba(0, 240, 255, 0.4);
`;

export const AiBannerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  h4 {
    font-size: 1rem;
    font-weight: 700;
    color: #F8FAFC;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    font-size: 0.82rem;
    color: #94A3B8;
    margin: 0;
  }
`;

export const AiButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #00F0FF;
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%);
  border: 1px solid #00F0FF;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(0, 240, 255, 0.45) 0%, rgba(139, 92, 246, 0.45) 100%);
    box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
    transform: translateY(-2px);
  }
`;