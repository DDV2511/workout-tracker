"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getWorkoutById, DayPlan, Exercise } from '@/lib/workouts';
import { WorkoutSession, SetLog, getLastWorkoutByType, saveWorkout } from '@/lib/storage';

interface Props {
  params: Promise<{ day: string }>;
}

export default function WorkoutPage({ params }: Props) {
  // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Timer countdown effect
  useEffect(() => {
    if (!timerActive || timerSeconds <= 0) return;
    
    const interval = setInterval(() => {
      setTimerSeconds((s) => {
        if (s <= 1) {
          // Timer finished - play sound outside effect
          setTimeout(() => {
            setTimerActive(false);
            if (typeof window !== 'undefined') {
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQs3fMHO6b19EzZpluW5mXCMYGqR3LV2eW9jYX+Qt9ibe3J0dJOst9yefH2AiJJ/dHZ0j6W1oH15gIuNfnd4f5CnsZR7d3+Pl6aXhHZ5g5GWoIx5eX+Pl6GQgXZ5g5GWoIx5eX+Pl6GQgXZ5g5GW');
              audio.play().catch(() => {});
            }
          }, 0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timerActive]);

  const startTimer = (seconds: number) => {
    setTimerDuration(seconds);
    setTimerSeconds(seconds);
    setTimerActive(true);
  };

  const toggleSetComplete = (exerciseId: string, setIndex: number) => {
    // Haptic feedback on mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
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
        <p className="text-[#71717a]">Workout not found</p>
      </div>
    );
  }

  const completedSets = Object.values(exercises).flat().filter(s => s.completed).length;
  const totalSets = Object.values(exercises).flat().length;
  const progress = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <Link href="/" className="w-10 h-10 rounded-lg bg-[#27272a] flex items-center justify-center text-[#71717a] hover:text-white hover:bg-[#3f3f46] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="text-right">
          <p className="font-semibold">{workout.name}</p>
          <p className="text-sm text-[#71717a]">{completedSets}/{totalSets} sets</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card card-gradient animate-fade-in animate-delay-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-[#22c55e] font-semibold">{progress}%</span>
        </div>
        <div className="h-2 bg-[#27272a] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#22c55e] to-[#4ade80] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Exercises */}
      {workout.exercises.map((exercise: Exercise, exIndex: number) => (
        <div key={exercise.id} className={`card animate-fade-in`} style={{ animationDelay: `${0.1 * exIndex + 0.1}s` }}>
          <h3 className="font-semibold mb-4">{exercise.name}</h3>
          
          {/* Sets header */}
          <div className="grid grid-cols-6 gap-1 text-xs text-[#71717a] mb-3 px-1">
            <span>SET</span>
            <span className="col-span-2 text-center">WEIGHT</span>
            <span className="col-span-2 text-center">REPS</span>
            <span className="text-right text-[10px]">PREV</span>
          </div>
          
          {/* Sets */}
          {exercises[exercise.id]?.map((set, setIndex) => {
            const prevWeight = getPreviousWeight(exercise.id, setIndex);
            const prevExercise = previousWorkout?.exercises.find(e => e.exerciseId === exercise.id);
            const prevReps = prevExercise?.sets[setIndex]?.reps || 0;
            
            return (
            <div key={setIndex} className="grid grid-cols-6 gap-1 mb-2 items-center">
              <button
                onClick={() => toggleSetComplete(exercise.id, setIndex)}
                className={`set-btn ${set.completed ? 'set-btn-completed' : 'set-btn-incomplete'}`}
              >
                {setIndex + 1}
              </button>
              
              <div className="col-span-2">
                <input
                  type="number"
                  value={set.weight || ''}
                  onChange={(e) => updateSet(exercise.id, setIndex, 'weight', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="input text-center w-full"
                />
              </div>
              
              <input
                type="number"
                value={set.reps || ''}
                onChange={(e) => updateSet(exercise.id, setIndex, 'reps', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="input text-center col-span-2 w-full"
              />
              
              {prevWeight > 0 && (
                <span className="text-xs text-[#71717a] text-right pr-1">
                  {prevWeight}×{prevReps}
                </span>
              )}
              {!prevWeight && <span></span>}
            </div>
          )})}
        </div>
      ))}

      {/* Timer */}
      <div className="card animate-fade-in animate-delay-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium">REST TIMER</span>
        </div>
        <div className="flex gap-2">
          {[60, 90, 120, 180].map((secs) => (
            <button
              key={secs}
              onClick={() => startTimer(secs)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                timerDuration === secs && timerActive
                  ? 'bg-[#8b5cf6] text-white glow-purple'
                  : 'bg-[#27272a] text-[#71717a] hover:bg-[#3f3f46] hover:text-white'
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
        className="btn btn-primary w-full text-lg py-4 animate-fade-in"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Finish Workout
      </button>

      {/* Timer Overlay */}
      {timerActive && (
        <div className="timer-overlay" onClick={() => setTimerActive(false)}>
          <div className="text-center">
            <p className="text-[#71717a] text-lg mb-4 font-medium">REST</p>
            <p className="timer-display animate-pulse-green">
              {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
            </p>
            <p className="text-[#71717a] mt-8">Tap anywhere to dismiss</p>
          </div>
        </div>
      )}
    </div>
  );
}
