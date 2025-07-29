import { AppDataSource } from "../../data-source";
import { MacroCycle } from "../../entities/macroCycle.entity";
import { AppError } from "../../errors";

export const getMacroCycleByIDService = async (macroCycleID: string, userID: string): Promise<MacroCycle> => {
    const macroCycleRepository = AppDataSource.getRepository(MacroCycle);

    const macroCycle = await macroCycleRepository.findOne({
        where: { id: macroCycleID },
        relations: [
            "user",
            "volumes",
            "items"
        ]
    });

    if (!macroCycle) {
        throw new AppError("Macro ciclo não encontrado", 404);
    }

    if (macroCycle.user.id !== userID) {
        throw new AppError("Não autorizado", 403);
    }

    return macroCycle;
};
