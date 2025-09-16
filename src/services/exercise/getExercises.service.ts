import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
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

export const getExercisesService = async (
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): Promise<PaginatedResponse<Exercise>> => {
  const exercisesRepo = AppDataSource.getRepository(Exercise);

  const safeLimit = Math.min(limit, MAX_LIMIT);

  const [data, total] = await exercisesRepo.findAndCount({
    skip: (page - 1) * safeLimit,
    take: safeLimit,
  });

  if (!data || data.length === 0) {
    throw new AppError("Nenhum exercício encontrado", 404);
  }

  return {
    data,
    total,
    page,
    limit: safeLimit,
    lastPage: Math.ceil(total / safeLimit),
  };
};
