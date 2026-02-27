// Pre-loaded workout plan
export type DayType = 'upper-strength' | 'lower-hypertrophy' | 'upper-hypertrophy' | 'lower-strength';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  defaultSets: number;
  defaultReps: string;
}

export interface DayPlan {
  id: DayType;
  name: string;
  day: number; // 1=Mon, 2=Tue, etc.
  exercises: Exercise[];
}

export const workouts: DayPlan[] = [
  {
    id: 'upper-strength',
    name: 'Upper Strength',
    day: 1,
    exercises: [
      { id: 'bench-press', name: 'Bench Press', muscleGroup: 'chest', defaultSets: 4, defaultReps: '5' },
      { id: 'pull-ups', name: 'Pull-Ups', muscleGroup: 'back', defaultSets: 4, defaultReps: '6' },
      { id: 'overhead-press', name: 'Overhead Press', muscleGroup: 'shoulders', defaultSets: 3, defaultReps: '6' },
      { id: 'barbell-rows', name: 'Barbell Rows', muscleGroup: 'back', defaultSets: 3, defaultReps: '8' },
      { id: 'plank', name: 'Plank', muscleGroup: 'core', defaultSets: 3, defaultReps: '45s' },
    ],
  },
  {
    id: 'lower-hypertrophy',
    name: 'Lower Hypertrophy',
    day: 2,
    exercises: [
      { id: 'bulgarian-split-squats', name: 'Bulgarian Split Squats', muscleGroup: 'legs', defaultSets: 3, defaultReps: '10/leg' },
      { id: 'romanian-deadlift', name: 'Romanian Deadlift', muscleGroup: 'legs', defaultSets: 3, defaultReps: '10' },
      { id: 'leg-press', name: 'Leg Press', muscleGroup: 'legs', defaultSets: 3, defaultReps: '12' },
      { id: 'calf-raises', name: 'Calf Raises', muscleGroup: 'legs', defaultSets: 3, defaultReps: '15' },
      { id: 'incline-walk', name: 'Incline Walk', muscleGroup: 'cardio', defaultSets: 1, defaultReps: '20min' },
    ],
  },
  {
    id: 'upper-hypertrophy',
    name: 'Upper Hypertrophy',
    day: 4,
    exercises: [
      { id: 'incline-db-press', name: 'Incline DB Press', muscleGroup: 'chest', defaultSets: 3, defaultReps: '10' },
      { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'back', defaultSets: 3, defaultReps: '10' },
      { id: 'lateral-raises', name: 'Lateral Raises', muscleGroup: 'shoulders', defaultSets: 3, defaultReps: '12' },
      { id: 'seated-rows', name: 'Seated Rows', muscleGroup: 'back', defaultSets: 3, defaultReps: '10' },
      { id: 'curls-triceps', name: 'Curls + Triceps Superset', muscleGroup: 'arms', defaultSets: 3, defaultReps: '12' },
    ],
  },
  {
    id: 'lower-strength',
    name: 'Lower Strength',
    day: 5,
    exercises: [
      { id: 'back-squats', name: 'Back Squats', muscleGroup: 'legs', defaultSets: 4, defaultReps: '5' },
      { id: 'romanian-deadlift-2', name: 'Romanian Deadlift', muscleGroup: 'legs', defaultSets: 3, defaultReps: '6' },
      { id: 'walking-lunges', name: 'Walking Lunges', muscleGroup: 'legs', defaultSets: 3, defaultReps: '10/leg' },
      { id: 'hanging-knee-raises', name: 'Hanging Knee Raises', muscleGroup: 'core', defaultSets: 3, defaultReps: '12' },
    ],
  },
];

export function getTodayWorkout(): DayPlan | null {
  const day = new Date().getDay(); // 0=Sun, 1=Mon, etc.
  const workout = workouts.find(w => w.day === day);
  return workout || null;
}

export function getWorkoutById(id: DayType): DayPlan | undefined {
  return workouts.find(w => w.id === id);
}
