import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export async function getExistingShapes(roomId: string) {
  // const res = await axios.get(`${HTTP_BACKEND}/room/${slug}`)
  // const roomId = res.data.room.id;
  const response = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
  const messages = response.data.messages;

  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });

  return shapes;
}