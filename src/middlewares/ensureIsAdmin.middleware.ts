import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors";

const ensureIsAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const authenticatedUser = req

    if(authenticatedUser.admin !== true){
        console.log("user:", authenticatedUser.user.email)
        throw new AppError("Insufficient permission", 403)
    }

    return next()
}

export default ensureIsAdminMiddleware