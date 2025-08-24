import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/be-common/config";
import { middleware } from "./middleware";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors())

app.post("/signup", async (req, res) => {
  const parsed = CreateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error });
  }
  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsed.data.username,
        password: parsed.data.password,
        name: parsed.data.name,
      },
    });
    res.json({ userId: user.id });
  } catch (error) {
    res.status(411).json({
      message: "User already exists with this username.",
    });
  }
});

app.post("/signin", async (req, res) => {
  const parsed = SigninSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error });
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: parsed.data.username,
      password: parsed.data.password,
    },
  });
  if (!user) {
    return res.status(403).json({
      message: "Invalid username or password.",
    });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);

  res.json({ token });
});

app.post("/room", middleware, async (req, res) => {
  const parsed = CreateRoomSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error });
  }  

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsed.data.name,
        //@ts-ignore
        adminId: req.userId,
      },
    });

    res.json({ roomId: room.id });
  } catch (error) {
    res.status(401).json({ message: "Room already exists with this name." });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error"
    })
  }
});

app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug
    },
  });
  res.json({room});
});

app.listen(3001);