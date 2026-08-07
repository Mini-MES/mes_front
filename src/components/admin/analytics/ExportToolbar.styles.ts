import styled from 'styled-components';                                                                                                                           
                                                                                                                                                                    
export const Container = styled.div`                                                                                                                              
  display: flex;                                                                                                                                                  
  align-items: center;                                                                                                                                            
  justify-content: space-between;                                                                                                                                 
  background: rgba(15, 23, 42, 0.6);                                                                                                                              
  backdrop-filter: blur(12px);                                                                                                                                    
  border: 1px solid rgba(255, 255, 255, 0.08);                                                                                                                    
  border-radius: 12px;                                                                                                                                            
  padding: 1rem 1.25rem;                                                                                                                                          
  margin-bottom: 1.5rem;                                                                                                                                          
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);                                                                                                                   
                                                                                                                                                                  
  @media (max-width: 768px) {                                                                                                                                     
    flex-direction: column;                                                                                                                                       
    align-items: flex-start;                                                                                                                                      
    gap: 1rem;                                                                                                                                                    
  }                                                                                                                                                               
`;                                                                                                                                                                
                                                                                                                                                                
export const TitleGroup = styled.div`                                                                                                                             
  display: flex;                                                                                                                                                  
  align-items: center;                                                                                                                                            
  gap: 0.75rem;                                                                                                                                                   
                                                                                                                                                                  
  h3 {                                                                                                                                                            
    font-size: 1rem;                                                                                                                                              
    font-weight: 600;                                                                                                                                             
    color: #f8fafc;                                                                                                                                               
    margin: 0;                                                                                                                                                    
  }                                                                                                                                                               
                                                                                                                                                                  
  span {                                                                                                                                                          
    font-size: 0.8rem;                                                                                                                                            
    color: #94a3b8;                                                                                                                                               
  }                                                                                                                                                               
`;                                                                                                                                                                
                                                                                                                                                                
export const ButtonGroup = styled.div`                                                                                                                            
  display: flex;                                                                                                                                                  
  align-items: center;                                                                                                                                            
  gap: 0.75rem;                                                                                                                                                   
  flex-wrap: wrap;                                                                                                                                                
                                                                                                                                                                  
  a {                                                                                                                                                             
    text-decoration: none;                                                                                                                                        
  }                                                                                                                                                               
`;                                                                                                                                                                
                                                                                                                                                                
export const ExportButton = styled.div<{ $variant?: 'cyan' | 'green' | 'purple' | 'amber' }>`                                                                     
  display: flex;                                                                                                                                                  
  align-items: center;                                                                                                                                            
  gap: 0.5rem;                                                                                                                                                    
  padding: 0.55rem 1rem;                                                                                                                                          
  border-radius: 8px;                                                                                                                                             
  font-size: 0.85rem;                                                                                                                                             
  font-weight: 600;                                                                                                                                               
  cursor: pointer;                                                                                                                                                
  transition: all 0.2s ease-in-out;                                                                                                                               
                                                                                                                                                                  
  ${({ $variant }) => {                                                                                                                                           
    switch ($variant) {                                                                                                                                           
      case 'green':                                                                                                                                               
        return `                                                                                                                                                  
          background: rgba(16, 185, 129, 0.15);                                                                                                                   
          color: #34d399;                                                                                                                                         
          border: 1px solid rgba(16, 185, 129, 0.3);                                                                                                              
          &:hover {                                                                                                                                               
            background: rgba(16, 185, 129, 0.25);                                                                                                                 
            box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);                                                                                                         
          }                                                                                                                                                       
        `;                                                                                                                                                        
      case 'purple':                                                                                                                                              
        return `                                                                                                                                                  
          background: rgba(168, 85, 247, 0.15);                                                                                                                   
          color: #c084fc;                                                                                                                                         
          border: 1px solid rgba(168, 85, 247, 0.3);                                                                                                              
          &:hover {                                                                                                                                               
            background: rgba(168, 85, 247, 0.25);                                                                                                                 
            box-shadow: 0 0 12px rgba(168, 85, 247, 0.3);                                                                                                         
          }                                                                                                                                                       
        `;                                                                                                                                                        
      case 'amber':                                                                                                                                               
        return `                                                                                                                                                  
          background: rgba(245, 158, 11, 0.15);                                                                                                                   
          color: #fbbf24;                                                                                                                                         
          border: 1px solid rgba(245, 158, 11, 0.3);                                                                                                              
          &:hover {                                                                                                                                               
            background: rgba(245, 158, 11, 0.25);                                                                                                                 
            box-shadow: 0 0 12px rgba(245, 158, 11, 0.3);                                                                                                         
          }                                                                                                                                                       
        `;                                                                                                                                                        
      case 'cyan':                                                                                                                                                
      default:                                                                                                                                                    
        return `                                                                                                                                                  
          background: rgba(0, 240, 255, 0.12);                                                                                                                    
          color: #00f0ff;                                                                                                                                         
          border: 1px solid rgba(0, 240, 255, 0.3);                                                                                                               
          &:hover {                                                                                                                                               
            background: rgba(0, 240, 255, 0.22);                                                                                                                  
            box-shadow: 0 0 12px rgba(0, 240, 255, 0.3);                                                                                                          
          }                                                                                                                                                       
        `;                                                                                                                                                        
    }                                                                                                                                                             
  }}                                                                                                                                                              
                                                                                                                                                                  
  &:active {                                                                                                                                                      
    transform: scale(0.97);                                                                                                                                       
  }                                                                                                                                                               
`;