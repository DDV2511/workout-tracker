"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTodayWorkout, workouts } from '@/lib/workouts';
import { getStreak, getWorkoutsThisWeek } from '@/lib/storage';

export default function Home() {
  const [todayWorkout, setTodayWorkout] = useState<ReturnType<typeof getTodayWorkout>>(null);
  const [streak, setStreak] = useState(0);
  const [weekCount, setWeekCount] = useState(0);

  useEffect(() => {
    setTodayWorkout(getTodayWorkout());
    setStreak(getStreak());
    setWeekCount(getWorkoutsThisWeek());
  }, []);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = dayNames[new Date().getDay()];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold mb-1">Hey! 👋</h1>
        <p className="text-[#a1a1aa]">{today}</p>
      </header>

      {/* Stats */}
      <div className="flex gap-3">
        <div className="card flex-1">
          <p className="text-sm text-[#a1a1aa] mb-1">Streak</p>
          <p className="text-2xl font-bold text-primary">{streak} 🔥</p>
        </div>
        <div className="card flex-1">
          <p className="text-sm text-[#a1a1aa] mb-1">This Week</p>
          <p className="text-2xl font-bold text-accent">{weekCount}/4</p>
        </div>
      </div>

      {/* Today's Workout */}
      {todayWorkout ? (
        <Link href={`/workout/${todayWorkout.id}`}>
          <div className="card hover:border-[#22c55e] transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#a1a1aa]">TODAY'S WORKOUT</span>
              <span className="text-xs bg-[#22c55e] text-black px-2 py-1 rounded">START</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">{todayWorkout.name}</h2>
            <p className="text-sm text-[#a1a1aa]">
              {todayWorkout.exercises.length} exercises • {todayWorkout.exercises.reduce((sum, e) => sum + e.defaultSets, 0)} sets
            </p>
          </div>
        </Link>
      ) : (
        <div className="card">
          <div className="text-center py-4">
            <p className="text-lg font-medium mb-1">Rest Day 🎉</p>
            <p className="text-sm text-[#a1a1aa]">Recovery is part of the process</p>
          </div>
        </div>
      )}

      {/* Week Schedule */}
      <div>
        <h3 className="text-sm font-medium text-[#a1a1aa] mb-3">THIS WEEK</h3>
        <div className="space-y-2">
          {workouts.map((workout) => {
            const isToday = new Date().getDay() === workout.day;
            return (
              <Link key={workout.id} href={isToday ? `/workout/${workout.id}` : '#'}>
                <div className={`card flex items-center justify-between ${isToday ? 'border-[#22c55e]' : ''}`}>
                  <div>
                    <p className="font-medium">{dayNames[workout.day]}</p>
                    <p className="text-sm text-[#a1a1aa]">{workout.name}</p>
                  </div>
                  {isToday && (
                    <span className="text-xs text-primary">TODAY</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
