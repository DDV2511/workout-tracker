"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getWorkouts, WorkoutSession } from '@/lib/storage';
import { workouts, getWorkoutById } from '@/lib/workouts';

export default function HistoryPage() {
  const [history, setHistory] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    const allWorkouts = getWorkouts()
      .filter(w => w.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setHistory(allWorkouts);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTotalVolume = (session: WorkoutSession): number => {
    return session.exercises.reduce((sum, ex) => {
      return sum + ex.sets.reduce((s, set) => s + (set.weight * set.reps), 0);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-[#a1a1aa]">{history.length} workouts completed</p>
      </header>

      {history.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-[#a1a1aa] mb-2">No workouts yet</p>
          <Link href="/" className="text-primary hover:underline">
            Start your first workout →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((session) => {
            const workout = getWorkoutById(session.dayType as any);
            const volume = getTotalVolume(session);
            
            return (
              <div key={session.id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{workout?.name || session.dayType}</p>
                    <p className="text-sm text-[#a1a1aa]">{formatDate(session.date)}</p>
                  </div>
                  <span className="text-sm text-primary">
                    {volume.toLocaleString()} lbs
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {session.exercises.slice(0, 4).map((ex, i) => {
                    const exInfo = workout?.exercises.find(e => e.id === ex.exerciseId);
                    const setsDone = ex.sets.filter(s => s.completed).length;
                    return (
                      <span key={i} className="text-xs bg-[#27272a] px-2 py-1 rounded">
                        {exInfo?.name.split(' ')[0] || ex.exerciseId}: {setsDone}/{ex.sets.length}
                      </span>
                    );
                  })}
                  {session.exercises.length > 4 && (
                    <span className="text-xs text-[#a1a1aa]">
                      +{session.exercises.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
