import { AppDataSource } from "../../data-source";
import { Exercise } from "../../entities/exercise.entity";
import { AppError } from "../../errors";
import { ILike, FindOptionsWhere } from "typeorm";
import { iExerciseFilters } from "../../interfaces/exercise.interface";

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
  limit: number = DEFAULT_LIMIT,
  filters?: iExerciseFilters
): Promise<PaginatedResponse<Exercise>> => {
  const exercisesRepo = AppDataSource.getRepository(Exercise);

  const safeLimit = Math.min(limit, MAX_LIMIT);
  const skip = (page - 1) * safeLimit;

  const where: FindOptionsWhere<Exercise> = {};

  if (filters) {
    if (filters.name) {
      where.name = ILike(`%${filters.name}%`);
    }
    if (filters.resistanceType) {
      where.resistanceType = filters.resistanceType;
    }
    if (filters.primaryMuscle) {
      where.primaryMuscle = filters.primaryMuscle;
    }
    if (filters.secondaryMuscle) {
      where.secondaryMuscle = filters.secondaryMuscle;
    }
    if (filters.default_unilateral) {
      where.default_unilateral = filters.default_unilateral;
    }
  }

  const [data, total] = await exercisesRepo.findAndCount({
    where,
    skip,
    take: safeLimit,
    order: {
      name: 'ASC'
    }
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