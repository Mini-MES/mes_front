import { useSignalRContext } from "@/context/SignalRContext";
import { SensorCountData } from "@/types/sensor";
import { Subject } from "@microsoft/signalr";
import { sampleTime } from "rxjs";
import { useEffect, useRef, useState } from "react";

export function useSensorStream(tartgetLotId: string | null) {
    const {connection, isConnected } = useSignalRContext();
    const [accumulatedGood, setAccumulatedGood] = useState(0);
    const [accumulatedBad, setAccumulatedBad] = useState(0);
    const [lastPulseTime, setLastPulseTime] = useState<string | null>(null);

    const lastUpdateRef = useRef<number>(0);

    useEffect(() => {
        setAccumulatedGood(0);
        setAccumulatedBad(0);
    }, [tartgetLotId]);

    useEffect(() => {
        if (!connection || !isConnected) return;

        const handleReceiveSensor = (data: any) => {
            console.log("Received sensor data:", data);

            if(!data) return;

            const incomingLotId = data.LotID;
            const goodInc = data.GoodIncrement;
            const badInc = data.BadIncrement;

            if (incomingLotId === tartgetLotId) {
                const now = Date.now();

                if(now - lastUpdateRef.current > 10) {
                    lastUpdateRef.current = now;
                    if(goodInc > 0) setAccumulatedGood(prev => prev + goodInc);
                    if(badInc > 0) setAccumulatedBad(prev => prev + badInc);
                    setLastPulseTime(new Date().toISOString());
                }
            }
        }

        connection.on("ReceiveSensorCountUpdated", handleReceiveSensor);

        return () => {
            connection.off("ReceiveSensorCountUpdated", handleReceiveSensor);
        };
    }, [connection, isConnected, tartgetLotId]);

    return {
        accumulatedGood,
        accumulatedBad,
        lastPulseTime,
        isConnected
    }
}