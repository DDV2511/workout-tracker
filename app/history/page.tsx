"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getWorkouts, WorkoutSession } from '@/lib/storage';
import { getWorkoutById } from '@/lib/workouts';

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

  const getCompletedSets = (session: WorkoutSession): number => {
    return session.exercises.reduce((sum, ex) => {
      return sum + ex.sets.filter(s => s.completed).length;
    }, 0);
  };

  return (
    <div className="space-y-4">
      <header className="mb-4 animate-fade-in">
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-[#71717a]">{history.length} workouts completed</p>
      </header>

      {history.length === 0 ? (
        <div className="card text-center py-10 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#27272a] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-[#71717a] mb-4">No workouts yet</p>
          <Link href="/" className="text-[#22c55e] font-medium hover:underline">
            Start your first workout →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((session, index) => {
            const workout = getWorkoutById(session.dayType as any);
            const volume = getTotalVolume(session);
            const setsDone = getCompletedSets(session);
            
            return (
              <div key={session.id} className={`card animate-fade-in`} style={{ animationDelay: `${0.05 * index}s` }}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold">{workout?.name || session.dayType}</p>
                    <p className="text-sm text-[#71717a]">{formatDate(session.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gradient">{volume.toLocaleString()}</p>
                    <p className="text-xs text-[#71717a]">lbs total</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {session.exercises.slice(0, 4).map((ex, i) => {
                    const exInfo = workout?.exercises.find(e => e.id === ex.exerciseId);
                    const setsCompleted = ex.sets.filter(s => s.completed).length;
                    const totalSets = ex.sets.length;
                    
                    return (
                      <div key={i} className="flex items-center gap-2 bg-[#27272a] px-3 py-2 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${setsCompleted === totalSets ? 'bg-[#22c55e]' : 'bg-[#71717a]'}`} />
                        <span className="text-sm">{exInfo?.name.split(' ')[0] || ex.exerciseId}</span>
                        <span className="text-xs text-[#71717a]">{setsCompleted}/{totalSets}</span>
                      </div>
                    );
                  })}
                  {session.exercises.length > 4 && (
                    <div className="flex items-center gap-2 bg-[#27272a] px-3 py-2 rounded-lg">
                      <span className="text-sm text-[#71717a]">+{session.exercises.length - 4} more</span>
                    </div>
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
