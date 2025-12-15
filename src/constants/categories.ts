import { Icons } from "../components/Icons";
import type { WorkoutCategory } from "../types/workout";

export const categories: {
  id: WorkoutCategory;
  label: string;
  icon: React.FC<any>;
  color: string;
}[] = [
  { id: "chest", label: "胸部", icon: Icons.Chest, color: "text-rose-400" },
  { id: "back", label: "背部", icon: Icons.Back, color: "text-sky-400" },
  {
    id: "shoulders",
    label: "肩部",
    icon: Icons.Shoulders,
    color: "text-amber-400",
  },
  { id: "legs", label: "腿部", icon: Icons.Legs, color: "text-emerald-400" },
  { id: "arms", label: "手臂", icon: Icons.Arms, color: "text-violet-400" },
  { id: "core", label: "核心", icon: Icons.Core, color: "text-indigo-400" },
];
