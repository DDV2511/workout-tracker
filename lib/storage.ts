// localStorage helpers for workout data

export interface SetLog {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
}

export interface WorkoutSession {
  id: string;
  date: string; // YYYY-MM-DD
  dayType: string;
  exercises: ExerciseLog[];
  completed: boolean;
}

export interface BodyStats {
  date: string;
  weight: number;
  waist: number;
}

const STORAGE_KEYS = {
  WORKOUTS: 'workout-tracker-workouts',
  BODY_STATS: 'workout-tracker-body-stats',
  REST_TIMER: 'workout-tracker-rest-timer',
};

export function getWorkouts(): WorkoutSession[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
  return data ? JSON.parse(data) : [];
}

export function saveWorkout(workout: WorkoutSession): void {
  const workouts = getWorkouts();
  const existingIndex = workouts.findIndex(w => w.id === workout.id);
  
  if (existingIndex >= 0) {
    workouts[existingIndex] = workout;
  } else {
    workouts.push(workout);
  }
  
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
}

export function getWorkoutsByDate(date: string): WorkoutSession | undefined {
  const workouts = getWorkouts();
  return workouts.find(w => w.date === date);
}

export function getWorkoutsByType(dayType: string): WorkoutSession[] {
  const workouts = getWorkouts();
  return workouts
    .filter(w => w.dayType === dayType && w.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getLastWorkoutByType(dayType: string): WorkoutSession | undefined {
  const workouts = getWorkoutsByType(dayType);
  return workouts[0];
}

export function getBodyStats(): BodyStats[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.BODY_STATS);
  return data ? JSON.parse(data) : [];
}

export function saveBodyStats(stats: BodyStats): void {
  const allStats = getBodyStats();
  const existingIndex = allStats.findIndex(s => s.date === stats.date);
  
  if (existingIndex >= 0) {
    allStats[existingIndex] = stats;
  } else {
    allStats.push(stats);
  }
  
  localStorage.setItem(STORAGE_KEYS.BODY_STATS, JSON.stringify(allStats));
}

export function getStreak(): number {
  const workouts = getWorkouts().filter(w => w.completed).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  if (workouts.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const hasWorkout = workouts.some(w => w.date === dateStr);
    
    if (i === 0 && !hasWorkout) continue; // Today doesn't count against streak
    if (hasWorkout) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  
  return streak;
}

export function getWorkoutsThisWeek(): number {
  const workouts = getWorkouts().filter(w => w.completed);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  return workouts.filter(w => new Date(w.date) >= startOfWeek).length;
}
