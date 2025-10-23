import { MuscleGroup } from "../enum/muscleGroup.enum";

export const getMuscleGroupsList = () =>
  Object.entries(MuscleGroup).map(([key, value]) => ({
    id: key,
    label: value,
  }));
