import  {WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/be-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  userId: string;
  ws: WebSocket;
  rooms: string[];
}
const users: User[] = [];

const checkAuthentication = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {
      return null;
    }
    if (!decoded || !decoded.userId) return null;
    return decoded.userId;
  } catch (error) {
    return null;
  }
  return null;
};

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) return ws.close();

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") ?? "";

  const userId = checkAuthentication(token);
  if (userId == null) return ws.close();

  users.push({ userId, ws, rooms: [] });

  ws.on("message", async (data) => {
    let parsedData;
    if (typeof data !== 'string'){
      parsedData = JSON.parse(data.toString())
    } else{
      parsedData = JSON.parse(data);
    }

    if (parsedData.type === "join_room") {
      const user = users.find((u) => u.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((u) => u.ws === ws);
      if (!user) return;
      user.rooms = user.rooms.filter((roomId) => roomId === parsedData.roomId);
    }
    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId, message = parsedData.message;

      await prismaClient.chat.create({
        data: {
            roomId: Number(roomId), 
            message, userId
        }
      })

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              roomId,
              message
            })
          );
        }
      });
    }
  });
});
