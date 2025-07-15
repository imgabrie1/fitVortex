import { Request, Response } from "express"
import { macroCycleSchema } from "../schemas/macroCycle.schema"
import { createMacroCycleService } from "../services/macroCycle/createMacroCycle.service"

export const createMacroCycleController = async (req: Request, res: Response): Promise<Response> => {
    const body = req.body
    const userId = req.user!.id

    const macro = await createMacroCycleService(body, userId)

    const output = macroCycleSchema.parse(macro)
    return res.status(201).json(output)
}