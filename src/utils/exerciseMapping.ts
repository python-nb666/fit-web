export const EXERCISE_NAME_MAP: Record<string, string> = {
  // Chest
  杠铃卧推: "barbell-bench-press",
  哑铃卧推: "dumbbell-bench-press",
  上斜卧推: "incline-bench-press",
  双杠臂屈伸: "dips",
  绳索夹胸: "cable-fly",
  // Back
  引体向上: "pull-up",
  杠铃划船: "barbell-row",
  高位下拉: "lat-pulldown",
  坐姿划船: "seated-row",
  直臂下压: "straight-arm-pulldown",
  // Shoulders
  坐姿推举: "seated-overhead-press",
  哑铃侧平举: "dumbbell-lateral-raise",
  面拉: "face-pull",
  前平举: "front-raise",
  反向飞鸟: "reverse-fly",
  // Legs
  深蹲: "squat",
  硬拉: "deadlift",
  腿举: "leg-press",
  哈克深蹲: "hack-squat",
  腿屈伸: "leg-extension",
  // Arms
  杠铃弯举: "barbell-curl",
  哑铃弯举: "dumbbell-curl",
  绳索下压: "tricep-pushdown",
  仰卧臂屈伸: "skull-crushers",
  // Core
  卷腹: "crunch",
  平板支撑: "plank",
  悬垂举腿: "hanging-leg-raise",
  俄罗斯转体: "russian-twist",
};

export const getExerciseSlug = (name: string) => {
  return EXERCISE_NAME_MAP[name] || encodeURIComponent(name);
};

export const getExerciseNameFromSlug = (slug: string) => {
  const entry = Object.entries(EXERCISE_NAME_MAP).find(([_, s]) => s === slug);
  return entry ? entry[0] : decodeURIComponent(slug);
};
