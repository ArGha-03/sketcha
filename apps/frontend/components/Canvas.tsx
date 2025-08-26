import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "@/draw/Game";

export const Canvas = ({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<string>("circle");

  useEffect(() => {
    game?.setTool(selectedTool)
  }, [selectedTool, game])

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const g = new Game(canvas, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      }
    }
  }, [canvasRef]);

  return (
    <div className="overflow-hidden h-screen">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>

      <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
};

const Topbar = ({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
}) => {
  return (
    <div className="top-10 left-1/2 fixed transform -translate-x-1/2">
      <div className="flex space-x-2">
        <IconButton
          icon={<Pencil />}
          onClick={() => {
            setSelectedTool("pencil");
          }}
          activated={selectedTool === "pencil"}
        />
        <IconButton
          icon={<RectangleHorizontalIcon />}
          onClick={() => {
            setSelectedTool("rect");
          }}
          activated={selectedTool === "rect"}
        />
        <IconButton
          icon={<Circle />}
          onClick={() => {
            setSelectedTool("circle");            
          }}
          activated={selectedTool === "circle"}
        />
      </div>
    </div>
  );
};
