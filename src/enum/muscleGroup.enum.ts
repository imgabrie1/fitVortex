export enum MuscleGroup {

  CHEST_TOTAL = "Peito (Total)",
  CHEST_UPPER = "Peito Superior",
  CHEST_MIDDLE = "Peito Médio",
  CHEST_LOWER = "Peito Inferior",


  BACK_TOTAL = "Costas (Total)",
  BACK_UPPER = "Costas Superior",
  BACK_LOWER = "Costas Inferior",
  BACK_LATS = "Dorsais (Latíssimo do Dorso)",
  BACK_RHOMBOIDS = "Rombóides",


  LEGS_TOTAL = "Pernas (Total)",
  QUADRICEPS = "Quadríceps (Total)",
  QUADRICEPS_RECTUS_FEMORIS = "Reto Femoral",
  QUADRICEPS_VASTUS_LATERALIS = "Vasto Lateral",
  QUADRICEPS_VASTUS_MEDIALIS = "Vasto Medial",
  QUADRICEPS_VASTUS_INTERMEDIUS = "Vasto Intermédio",
  HAMSTRINGS = "Posterior de Coxa (Total)",
  HAMSTRINGS_BICEPS_FEMORIS = "Bíceps Femoral",
  HAMSTRINGS_SEMITENDINOSUS = "Semitendíneo",
  HAMSTRINGS_SEMIMEMBRANOSUS = "Semimembranoso",
  CALVES = "Panturrilhas (Total)",
  CALVES_GASTROCNEMIUS = "Gastrocnêmio",
  CALVES_SOLEUS = "Sóleo",
  GLUTES = "Glúteos",


  SHOULDERS_TOTAL = "Ombros (Total)",
  SHOULDERS_FRONT_DELT = "Deltóide Anterior",
  SHOULDERS_SIDE_DELT = "Deltóide Lateral",
  SHOULDERS_REAR_DELT = "Deltóide Posterior",


  BICEPS_TOTAL = "Bíceps (Total)",
  BICEPS_LONG_HEAD = "Cabeça Longa do Bíceps",
  BICEPS_SHORT_HEAD = "Cabeça Curta do Bíceps",
  BRACHIALIS = "Braquial",

  TRICEPS_TOTAL = "Tríceps (Total)",
  TRICEPS_LONG_HEAD = "Cabeça Longa do Tríceps",
  TRICEPS_MEDIAL_HEAD = "Cabeça Medial do Tríceps",
  TRICEPS_LATERAL_HEAD = "Cabeça Lateral do Tríceps",


  FOREARMS = "Antebraços",
  ABS_TOTAL = "Abdominais (Total)",
  ABS_UPPER = "Abdominais Superiores",
  ABS_LOWER = "Abdominais Inferiores",
  ABS_OBLIQUES = "Oblíquos",
  TRAPS = "Trapézios",
}

export const MuscleGroupHierarchy: Record<string, MuscleGroup[]> = {
  [MuscleGroup.CHEST_TOTAL]: [
    MuscleGroup.CHEST_UPPER,
    MuscleGroup.CHEST_MIDDLE,
    MuscleGroup.CHEST_LOWER,
  ],

  [MuscleGroup.BACK_TOTAL]: [
    MuscleGroup.BACK_UPPER,
    MuscleGroup.BACK_LOWER,
    MuscleGroup.BACK_LATS,
    MuscleGroup.BACK_RHOMBOIDS,
  ],

  [MuscleGroup.LEGS_TOTAL]: [
    MuscleGroup.QUADRICEPS,
    MuscleGroup.HAMSTRINGS,
    MuscleGroup.CALVES,
    MuscleGroup.GLUTES,
  ],

  [MuscleGroup.QUADRICEPS]: [
    MuscleGroup.QUADRICEPS_RECTUS_FEMORIS,
    MuscleGroup.QUADRICEPS_VASTUS_LATERALIS,
    MuscleGroup.QUADRICEPS_VASTUS_MEDIALIS,
    MuscleGroup.QUADRICEPS_VASTUS_INTERMEDIUS,
  ],

  [MuscleGroup.HAMSTRINGS]: [
    MuscleGroup.HAMSTRINGS_BICEPS_FEMORIS,
    MuscleGroup.HAMSTRINGS_SEMITENDINOSUS,
    MuscleGroup.HAMSTRINGS_SEMIMEMBRANOSUS,
  ],

  [MuscleGroup.CALVES]: [
    MuscleGroup.CALVES_GASTROCNEMIUS,
    MuscleGroup.CALVES_SOLEUS,
  ],

  [MuscleGroup.SHOULDERS_TOTAL]: [
    MuscleGroup.SHOULDERS_FRONT_DELT,
    MuscleGroup.SHOULDERS_SIDE_DELT,
    MuscleGroup.SHOULDERS_REAR_DELT,
  ],

  [MuscleGroup.BICEPS_TOTAL]: [
    MuscleGroup.BICEPS_LONG_HEAD,
    MuscleGroup.BICEPS_SHORT_HEAD,
    MuscleGroup.BRACHIALIS,
  ],

  [MuscleGroup.TRICEPS_TOTAL]: [
    MuscleGroup.TRICEPS_LONG_HEAD,
    MuscleGroup.TRICEPS_MEDIAL_HEAD,
    MuscleGroup.TRICEPS_LATERAL_HEAD,
  ],

  [MuscleGroup.ABS_TOTAL]: [
    MuscleGroup.ABS_UPPER,
    MuscleGroup.ABS_LOWER,
    MuscleGroup.ABS_OBLIQUES,
  ],
};

export const getMuscleGroupParents = (
  muscleGroup: MuscleGroup
): MuscleGroup[] => {
  const parents: MuscleGroup[] = [];
  for (const parent in MuscleGroupHierarchy) {
    if (MuscleGroupHierarchy[parent].includes(muscleGroup)) {
      parents.push(parent as MuscleGroup);
      // Recursivamente, encontre os pais dos pais
      parents.push(...getMuscleGroupParents(parent as MuscleGroup));
    }
  }
  // Remove duplicatas
  return [...new Set(parents)];
};