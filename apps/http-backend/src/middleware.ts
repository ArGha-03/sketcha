import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@repo/be-common/config'
import { NextFunction, Request, Response } from 'express'

export const middleware = (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.headers['authorization'] ?? ''
    const decoded = jwt.verify(token, JWT_SECRET)

    if(decoded){
        // @ts-ignore
        req.userId = decoded.userId;
        next()
    }
    else {
        res.status(403).json({ message: 'Unauthorized' })
    }
}