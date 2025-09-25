import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { AppError } from "../../errors";


export const getAllMacroCycleService = async (userID: string): Promise<MacroCycle[]> => {
    const macroCycleRepository = AppDataSource.getRepository(MacroCycle);

    const macroCycles = await macroCycleRepository.find({
        where: { user: { id: userID } },
        relations: ["user", "volumes", "items"],
    });

    if (!macroCycles.length) {
        throw new AppError("Nenhum macro ciclo encontrado", 404);
    }

    return macroCycles;
};