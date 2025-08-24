import { useEffect, useRef } from "react";
import { initDraw } from "@/draw";

export const Canvas = ({roomId, socket}: {roomId: string, socket: WebSocket}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if(canvasRef.current) {
            const canvas = canvasRef.current;
            initDraw(canvas, roomId, socket);
        }
    }, [canvasRef])

    return <div>
        <canvas ref={canvasRef} width={1440} height={750}></canvas>
    </div>
}
