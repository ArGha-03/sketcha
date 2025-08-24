import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { json } from "stream/consumers";

type shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      x: number;
      y: number;
      radius: number;
    };

export const initDraw = async (canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) => {
  const ctx = canvas.getContext("2d");
  let existingShapes: shape[] = await getExistingShapes(roomId);

  if (!ctx) return;

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)

    if(message.type === "chat"){
      const parsedShape = JSON.parse(message.message)
      existingShapes.push(parsedShape.shape)
      clearCanvas(existingShapes, ctx, canvas);
    }
  }

  clearCanvas(existingShapes, ctx, canvas);

  let clicked = false;
  let startX = 0,
    startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    ((startX = e.clientX), (startY = e.clientY));
  });
  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const shape: shape = {
      type: "rect",
      x: startX,
      y: startY,
      width: e.clientX - startX,
      height: e.clientY - startY,
    }
    existingShapes.push(shape);

    socket.send(JSON.stringify({
      type: "chat",
      message: JSON.stringify({
        shape
      }),
      roomId
    }))
  });
  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX,
        height = e.clientY - startY;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      clearCanvas(existingShapes, ctx, canvas);
      ctx.strokeStyle = "white";
      ctx.strokeRect(startX, startY, width, height);
    }
  });
};

const clearCanvas = (
  existingShapes: shape[],
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  existingShapes.forEach((shape) => {
    ctx.strokeStyle = "white";
    if (shape.type === "rect") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
};

async function getExistingShapes(roomId: string) {
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
