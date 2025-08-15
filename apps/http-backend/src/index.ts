import express from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/be-common/config";
import { middleware } from "./middleware";
import {CreateRoomSchema, CreateUserSchema, SigninSchema} from "@repo/common/types"

const app = express()

app.post('/signup', (req, res) => {
    const parsed = CreateUserSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error })
    }

    res.json({ userId: 123})
})

app.post('/signin', (req, res) => {
    const parsed = SigninSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error })
    }

    const userId = 1;
    const token = jwt.sign({ userId }, JWT_SECRET)

    res.json({ token})
})

app.post('/room', middleware, (req, res) => {
    const parsed = CreateRoomSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error })
    }

    res.json({ userId: 123})
})

app.listen(3001)