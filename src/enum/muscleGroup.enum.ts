export enum MuscleGroup {

  CHEST_TOTAL = "CHEST_TOTAL",
  CHEST_UPPER = "CHEST_UPPER",
  CHEST_MIDDLE = "CHEST_MIDDLE",
  CHEST_LOWER = "CHEST_LOWER",


  BACK_TOTAL = "BACK_TOTAL",
  BACK_UPPER = "BACK_UPPER",
  BACK_LOWER = "BACK_LOWER",
  BACK_LATS = "BACK_LATS",
  BACK_RHOMBOIDS = "BACK_RHOMBOIDS",


  LEGS_TOTAL = "LEGS_TOTAL",
  QUADRICEPS = "QUADRICEPS",
  QUADRICEPS_RECTUS_FEMORIS = "QUADRICEPS_RECTUS_FEMORIS",
  QUADRICEPS_VASTUS_LATERALIS = "QUADRICEPS_VASTUS_LATERALIS",
  QUADRICEPS_VASTUS_MEDIALIS = "QUADRICEPS_VASTUS_MEDIALIS",
  QUADRICEPS_VASTUS_INTERMEDIUS = "QUADRICEPS_VASTUS_INTERMEDIUS",
  HAMSTRINGS = "HAMSTRINGS",
  HAMSTRINGS_BICEPS_FEMORIS = "HAMSTRINGS_BICEPS_FEMORIS",
  HAMSTRINGS_SEMITENDINOSUS = "HAMSTRINGS_SEMITENDINOSUS",
  HAMSTRINGS_SEMIMEMBRANOSUS = "HAMSTRINGS_SEMIMEMBRANOSUS",
  CALVES = "CALVES",
  CALVES_GASTROCNEMIUS = "CALVES_GASTROCNEMIUS",
  CALVES_SOLEUS = "CALVES_SOLEUS",
  GLUTES = "GLUTES",


  SHOULDERS_TOTAL = "SHOULDERS_TOTAL",
  SHOULDERS_FRONT_DELT = "SHOULDERS_FRONT_DELT",
  SHOULDERS_SIDE_DELT = "SHOULDERS_SIDE_DELT",
  SHOULDERS_REAR_DELT = "SHOULDERS_REAR_DELT",


  BICEPS_TOTAL = "BICEPS_TOTAL",
  BICEPS_LONG_HEAD = "BICEPS_LONG_HEAD",
  BICEPS_SHORT_HEAD = "BICEPS_SHORT_HEAD",
  BRACHIALIS = "BRACHIALIS",

  TRICEPS_TOTAL = "TRICEPS_TOTAL",
  TRICEPS_LONG_HEAD = "TRICEPS_LONG_HEAD",
  TRICEPS_MEDIAL_HEAD = "TRICEPS_MEDIAL_HEAD",
  TRICEPS_LATERAL_HEAD = "TRICEPS_LATERAL_HEAD",


  FOREARMS = "FOREARMS",
  ABS_TOTAL = "ABS_TOTAL",
  ABS_UPPER = "ABS_UPPER",
  ABS_LOWER = "ABS_LOWER",
  ABS_OBLIQUES = "ABS_OBLIQUES",
  TRAPS = "TRAPS",
}

export const MuscleGroupNames: Record<MuscleGroup, string> = {
  [MuscleGroup.CHEST_TOTAL]: "Peito (Total)",
  [MuscleGroup.CHEST_UPPER]: "Peito Superior",
  [MuscleGroup.CHEST_MIDDLE]: "Peito Médio",
  [MuscleGroup.CHEST_LOWER]: "Peito Inferior",

  [MuscleGroup.BACK_TOTAL]: "Costas (Total)",
  [MuscleGroup.BACK_UPPER]: "Costas Superior",
  [MuscleGroup.BACK_LOWER]: "Costas Inferior",
  [MuscleGroup.BACK_LATS]: "Dorsais (Latíssimo do Dorso)",
  [MuscleGroup.BACK_RHOMBOIDS]: "Rombóides",

  [MuscleGroup.LEGS_TOTAL]: "Pernas (Total)",
  [MuscleGroup.QUADRICEPS]: "Quadríceps (Total)",
  [MuscleGroup.QUADRICEPS_RECTUS_FEMORIS]: "Reto Femoral",
  [MuscleGroup.QUADRICEPS_VASTUS_LATERALIS]: "Vasto Lateral",
  [MuscleGroup.QUADRICEPS_VASTUS_MEDIALIS]: "Vasto Medial",
  [MuscleGroup.QUADRICEPS_VASTUS_INTERMEDIUS]: "Vasto Intermédio",
  [MuscleGroup.HAMSTRINGS]: "Posterior de Coxa (Total)",
  [MuscleGroup.HAMSTRINGS_BICEPS_FEMORIS]: "Bíceps Femoral",
  [MuscleGroup.HAMSTRINGS_SEMITENDINOSUS]: "Semitendíneo",
  [MuscleGroup.HAMSTRINGS_SEMIMEMBRANOSUS]: "Semimembranoso",
  [MuscleGroup.CALVES]: "Panturrilhas (Total)",
  [MuscleGroup.CALVES_GASTROCNEMIUS]: "Gastrocnêmio",
  [MuscleGroup.CALVES_SOLEUS]: "Sóleo",
  [MuscleGroup.GLUTES]: "Glúteos",

  [MuscleGroup.SHOULDERS_TOTAL]: "Ombros (Total)",
  [MuscleGroup.SHOULDERS_FRONT_DELT]: "Deltóide Anterior",
  [MuscleGroup.SHOULDERS_SIDE_DELT]: "Deltóide Lateral",
  [MuscleGroup.SHOULDERS_REAR_DELT]: "Deltóide Posterior",

  [MuscleGroup.BICEPS_TOTAL]: "Bíceps (Total)",
  [MuscleGroup.BICEPS_LONG_HEAD]: "Cabeça Longa do Bíceps",
  [MuscleGroup.BICEPS_SHORT_HEAD]: "Cabeça Curta do Bíceps",
  [MuscleGroup.BRACHIALIS]: "Braquial",

  [MuscleGroup.TRICEPS_TOTAL]: "Tríceps (Total)",
  [MuscleGroup.TRICEPS_LONG_HEAD]: "Cabeça Longa do Tríceps",
  [MuscleGroup.TRICEPS_MEDIAL_HEAD]: "Cabeça Medial do Tríceps",
  [MuscleGroup.TRICEPS_LATERAL_HEAD]: "Cabeça Lateral do Tríceps",

  [MuscleGroup.FOREARMS]: "Antebraços",
  [MuscleGroup.ABS_TOTAL]: "Abdominais (Total)",
  [MuscleGroup.ABS_UPPER]: "Abdominais Superiores",
  [MuscleGroup.ABS_LOWER]: "Abdominais Inferiores",
  [MuscleGroup.ABS_OBLIQUES]: "Oblíquos",
  [MuscleGroup.TRAPS]: "Trapézios",
};

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