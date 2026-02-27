"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getWorkoutById, DayPlan, Exercise } from '@/lib/workouts';
import { WorkoutSession, SetLog, getLastWorkoutByType, saveWorkout } from '@/lib/storage';

interface Props {
  params: Promise<{ day: string }>;
}

export default function WorkoutPage({ params }: Props) {
  const { day } = use(params);
  const router = useRouter();
  const [workout, setWorkout] = useState<DayPlan | undefined>();
  const [previousWorkout, setPreviousWorkout] = useState<WorkoutSession | undefined>();
  const [exercises, setExercises] = useState<{ [key: string]: SetLog[] }>({});
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(90);

  useEffect(() => {
    const w = getWorkoutById(day as any);
    setWorkout(w);
    if (w) {
      const prev = getLastWorkoutByType(w.id);
      setPreviousWorkout(prev);
      
      // Initialize exercises with default sets
      const initExercises: { [key: string]: SetLog[] } = {};
      w.exercises.forEach((ex: Exercise) => {
        initExercises[ex.id] = Array(ex.defaultSets).fill(null).map(() => ({
          reps: parseInt(ex.defaultReps) || 0,
          weight: 0,
          completed: false,
        }));
      });
      setExercises(initExercises);
    }
  }, [day]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((s) => s - 1);
      }, 1000);
    } else if (timerActive && timerSeconds === 0) {
      setTimerActive(false);
      // Play notification sound
      if (typeof window !== 'undefined') {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQs3fMHO6b19EzZpluW5mXCMYGqR3LV2eW9jYX+Qt9ibe3J0dJOst9yefH2AiJJ/dHZ0j6W1oH15gIuNfnd4f5CnsZR7d3+Pl6aXhHZ5g5GWoIx5eX+Pl6GQgXZ5g5GWoIx5eX+Pl6GQgXZ5g5GW');
        audio.play().catch(() => {});
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const startTimer = (seconds: number) => {
    setTimerDuration(seconds);
    setTimerSeconds(seconds);
    setTimerActive(true);
  };

  const toggleSetComplete = (exerciseId: string, setIndex: number) => {
    setExercises((prev) => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map((s, i) =>
        i === setIndex ? { ...s, completed: !s.completed } : s
      ),
    }));
  };

  const updateSet = (exerciseId: string, setIndex: number, field: 'reps' | 'weight', value: number) => {
    setExercises((prev) => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map((s, i) =>
        i === setIndex ? { ...s, [field]: value } : s
      ),
    }));
  };

  const getPreviousWeight = (exerciseId: string, setIndex: number): number => {
    if (!previousWorkout) return 0;
    const prevExercise = previousWorkout.exercises.find((e) => e.exerciseId === exerciseId);
    return prevExercise?.sets[setIndex]?.weight || 0;
  };

  const finishWorkout = () => {
    if (!workout) return;
    
    const session: WorkoutSession = {
      id: `${workout.id}-${new Date().toISOString().split('T')[0]}`,
      date: new Date().toISOString().split('T')[0],
      dayType: workout.id,
      exercises: Object.entries(exercises).map(([exerciseId, sets]) => ({
        exerciseId,
        sets,
      })),
      completed: true,
    };
    
    saveWorkout(session);
    router.push('/history');
  };

  if (!workout) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[#a1a1aa]">Workout not found</p>
      </div>
    );
  }

  const completedSets = Object.values(exercises).flat().filter(s => s.completed).length;
  const totalSets = Object.values(exercises).flat().length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="text-[#a1a1aa] hover:text-white">
          ← Back
        </Link>
        <div className="text-right">
          <p className="font-medium">{workout.name}</p>
          <p className="text-sm text-[#a1a1aa]">{completedSets}/{totalSets} sets</p>
        </div>
      </div>

      {/* Exercises */}
      {workout.exercises.map((exercise: Exercise) => (
        <div key={exercise.id} className="card">
          <h3 className="font-medium mb-3">{exercise.name}</h3>
          
          {/* Sets header */}
          <div className="grid grid-cols-4 gap-2 text-xs text-[#a1a1aa] mb-2">
            <span>SET</span>
            <span>PREVIOUS</span>
            <span>WEIGHT</span>
            <span>REPS</span>
          </div>
          
          {/* Sets */}
          {exercises[exercise.id]?.map((set, setIndex) => (
            <div key={setIndex} className="grid grid-cols-4 gap-2 mb-2 items-center">
              <button
                onClick={() => toggleSetComplete(exercise.id, setIndex)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                  set.completed
                    ? 'bg-[#22c55e] text-black'
                    : 'bg-[#27272a] text-[#a1a1aa] hover:bg-[#3f3f46]'
                }`}
              >
                {setIndex + 1}
              </button>
              
              <span className="text-sm text-[#a1a1aa]">
                {getPreviousWeight(exercise.id, setIndex) || '—'}
              </span>
              
              <input
                type="number"
                value={set.weight || ''}
                onChange={(e) => updateSet(exercise.id, setIndex, 'weight', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="input text-center"
              />
              
              <input
                type="number"
                value={set.reps || ''}
                onChange={(e) => updateSet(exercise.id, setIndex, 'reps', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="input text-center"
              />
            </div>
          ))}
        </div>
      ))}

      {/* Timer */}
      <div className="card">
        <p className="text-sm text-[#a1a1aa] mb-3">REST TIMER</p>
        <div className="flex gap-2">
          {[60, 90, 120, 180].map((secs) => (
            <button
              key={secs}
              onClick={() => startTimer(secs)}
              className={`flex-1 py-2 rounded-lg text-sm ${
                timerDuration === secs && timerActive
                  ? 'bg-[#3b82f6] text-white'
                  : 'bg-[#27272a] text-[#a1a1aa] hover:bg-[#3f3f46]'
              }`}
            >
              {secs}s
            </button>
          ))}
        </div>
      </div>

      {/* Finish */}
      <button
        onClick={finishWorkout}
        className="btn btn-primary w-full"
      >
        Finish Workout ✓
      </button>

      {/* Timer Overlay */}
      {timerActive && (
        <div className="timer-overlay" onClick={() => setTimerActive(false)}>
          <div className="text-center">
            <p className="text-[#a1a1aa] mb-4">REST</p>
            <p className="timer-display text-[#22c55e]">
              {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
            </p>
            <p className="text-[#a1a1aa] mt-4">Tap to dismiss</p>
          </div>
        </div>
      )}
    </div>
  );
}
