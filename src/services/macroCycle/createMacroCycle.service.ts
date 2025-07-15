import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { MicroCycle } from "../../entities/microCycle.entity";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors";
import { ICreateMacroCycle } from "../../interfaces/macroCycle.interface";

export const createMacroCycleService = async (data: ICreateMacroCycle, userId: string): Promise<MacroCycle> => {
    const macroRepo = AppDataSource.getRepository(MacroCycle)
    const userRepo = AppDataSource.getRepository(User)

    const user = await userRepo.findOneBy({id: userId})
    if(!user) throw new AppError("Usuário não encontrado", 404)

    const newMacro = macroRepo.create({
        microQuantity: data.microQuantity,
        startDate: data.startDate,
        endDate: data.endDate
    })

    await macroRepo.save(newMacro)
    return newMacro
};
