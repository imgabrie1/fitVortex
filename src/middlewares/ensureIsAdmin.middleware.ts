import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors";

const ensureIsAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const authenticatedUser = req

    if(authenticatedUser.admin !== true){
        throw new AppError("Insufficient permission", 403)
    }
    console.log("user:", authenticatedUser.id)
    return next()
}

export default ensureIsAdminMiddleware