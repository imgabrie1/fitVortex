import { AppDataSource } from "../../data-source";
import { MicroCycle } from "../../entities/microCycle.entity";
import { AppError } from "../../errors";

type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export const getAllUserWorkoutsService = async (
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT,
  userID: string
): Promise<PaginatedResponse<MicroCycle>> => {
  const workoutsRepo = AppDataSource.getRepository(MicroCycle);

  const safeLimit = Math.min(limit, MAX_LIMIT);

  const [data, total] = await workoutsRepo.findAndCount({
    where: {
      user: { id: userID },
    },
    relations: {
      cycleItems: {
        workout: {
          workoutExercises: {
            exercise: true,
          },
          volume: {
            entries: true,
          },
        },
        sets: {
          exercise: true,
        },
      },
    },
    skip: (page - 1) * safeLimit,
    take: safeLimit,
  });
  if (!data || data.length === 0) {
    throw new AppError("Nenhum treino encontrado", 404);
  }

  return {
    data,
    total,
    page,
    limit: safeLimit,
    lastPage: Math.ceil(total / safeLimit),
  };
};
