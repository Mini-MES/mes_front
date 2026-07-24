import React, { createContext, useContext } from 'react';
import * as signalR from '@microsoft/signalr';
import { useSignalR, SignalRConnectionState } from '@/hooks/useSignalR';

interface SignalRContextType {
  connection: signalR.HubConnection | null;
  connectionState: SignalRConnectionState;
  isConnected: boolean;
}

const SignalRContext = createContext<SignalRContextType>({
  connection: null,
  connectionState: 'Disconnected',
  isConnected: false,
});

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const signalr = useSignalR();

  return (
    <SignalRContext.Provider value={signalr}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalRContext = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error('useSignalRContext must be used within a SignalRProvider');
  }
  return context;
};
