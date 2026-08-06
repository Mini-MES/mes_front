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