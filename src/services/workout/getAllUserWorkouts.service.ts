import { AppDataSource } from "../../data-source";
import { MicroCycleItem } from "../../entities/microCycleItem.entity";
import { AppError } from "../../errors";

type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 100;

export const getAllUserWorkoutsService = async (
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT,
  userID: string
): Promise<PaginatedResponse<MicroCycleItem>> => {
  const cycleItemRepo = AppDataSource.getRepository(MicroCycleItem);

  const safeLimit = Math.min(limit, MAX_LIMIT);

  const [data, total] = await cycleItemRepo.findAndCount({
    where: {
      microCycle: { user: { id: userID } },
    },
    relations: {
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
      microCycle: true,
    },
    order: {
      createdAt: "DESC",
      sets: {
        position: "ASC",
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
