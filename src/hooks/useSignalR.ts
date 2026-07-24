import { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

export type SignalRConnectionState = 'Disconnected' | 'Connecting' | 'Connected' | 'Reconnecting';

interface UseSignalROptions {
  hubUrl?: string;
  autoStart?: boolean;
}

/**
 * ASP.NET Core SignalR Hub 연결 및 상태를 관리하는 커스텀 훅
 */
export const useSignalR = (options: UseSignalROptions = {}) => {
  const {
    hubUrl = import.meta.env.VITE_SIGNALR_HUB_URL,
    autoStart = true,
  } = options;

  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [connectionState, setConnectionState] = useState<SignalRConnectionState>('Disconnected');
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    // SignalR HubConnection 생성
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // 자동 재연결 간격
      .configureLogging(import.meta.env.DEV ? signalR.LogLevel.Information : signalR.LogLevel.Warning)
      .build();

    // 연결 상태 이벤트 리스너 등록
    newConnection.onreconnecting((error) => {
      console.warn('⚠️ SignalR 재연결 시도 중...', error);
      setConnectionState('Reconnecting');
    });

    newConnection.onreconnected((connectionId) => {
      console.log('🟢 SignalR 재연결 성공! ConnectionId:', connectionId);
      setConnectionState('Connected');
    });

    newConnection.onclose((error) => {
      console.error('🔴 SignalR 연결 종료:', error);
      setConnectionState('Disconnected');
    });

    connectionRef.current = newConnection;
    setConnection(newConnection);

    // 자동 시작 옵션
    if (autoStart) {
      setConnectionState('Connecting');
      newConnection
        .start()
        .then(() => {
          console.log('🟢 SignalR Hub 성공적으로 연결됨! URL:', hubUrl);
          setConnectionState('Connected');
        })
        .catch((err) => {
          console.error('🔴 SignalR Hub 연결 실패:', err);
          setConnectionState('Disconnected');
        });
    }

    // 4. 클린업 (컴포넌트 언마운트 시 연결 종료)
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [hubUrl, autoStart]);

  return {
    connection,
    connectionState,
    isConnected: connectionState === 'Connected',
  };
};
