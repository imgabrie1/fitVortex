import { AppDataSource } from "../../data-source";
import { MicroCycle } from "../../entities/microCycle.entity";
import { AppError } from "../../errors";


export const getAllMicroCycleService = async (userID: string): Promise<MicroCycle[]> => {
    const microCycleRepository = AppDataSource.getRepository(MicroCycle);

    const microCycles = await microCycleRepository.find({
        where: { user: { id: userID } },
        relations: ["user", "volumes", "cycleItems"],
    });

    if (!microCycles.length) {
        throw new AppError("Nenhum macro ciclo encontrado", 404);
    }

    return microCycles;
};