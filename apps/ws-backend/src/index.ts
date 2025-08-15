import { WebSocketServer } from "ws";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "@repo/be-common/config";

const wss = new WebSocketServer({port: 8080})

wss.on('connection', (ws, request) => {
    const url = request.url;
    if(!url) return ws.close();
    
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') ?? '';
    const decoded = jwt.verify(token, JWT_SECRET)

    if(!decoded) return ws.close();

    ws.on('message', (msg) => {
        ws.send(`You said: ${msg}`)
    })
})