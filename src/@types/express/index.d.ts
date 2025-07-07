import * as express from "express"
import { User } from "../../entities/user.entity"

declare global {
    namespace Express {
        interface Request {
                id: number,
                admin: boolean,
                user: User
        }
    }
}