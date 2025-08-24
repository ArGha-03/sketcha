"use client"
import { WS_BACKEND } from "@/config";
import { useEffect, useState } from "react"; 
import {Canvas} from "./Canvas"

export const RoomCanvas = ({roomId}: {roomId: string}) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    
    useEffect(() => {
        const ws = new WebSocket(`${WS_BACKEND}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MjUwYzUwOS02YjdmLTRkZjItODZhNC1mYmFhMzU2OTZkMjIiLCJpYXQiOjE3NTYwNDE2MjF9.6onj-r-nOBrvrLub25m_UDibgKIgA2Pl8g582cy-3Wc`)
        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
        }
    }, [])
    
    if(!socket){
        return <div> Connecting to server... </div>
    }  
    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}