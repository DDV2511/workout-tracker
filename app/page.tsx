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

  const totalSets = todayWorkout?.exercises.reduce((sum, e) => sum + e.defaultSets, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="animate-fade-in">
        <h1 className="text-3xl font-bold mb-1">
          Hey! <span className="text-gradient">👋</span>
        </h1>
        <p className="text-[#71717a] text-lg">{today}</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in animate-delay-1">
        <div className="card card-gradient">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#22c55e]/20 flex items-center justify-center">
              <span className="text-lg">🔥</span>
            </div>
            <span className="text-xs text-[#71717a] font-medium">STREAK</span>
          </div>
          <p className="text-3xl font-bold text-gradient">{streak}</p>
          <p className="text-xs text-[#71717a] mt-1">days in a row</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/20 flex items-center justify-center">
              <span className="text-lg">💪</span>
            </div>
            <span className="text-xs text-[#71717a] font-medium">THIS WEEK</span>
          </div>
          <p className="text-3xl font-bold">{weekCount}<span className="text-lg text-[#71717a]">/4</span></p>
          <p className="text-xs text-[#71717a] mt-1">workouts done</p>
        </div>
      </div>

      {/* Today's Workout */}
      {todayWorkout ? (
        <Link href={`/workout/${todayWorkout.id}`} className="block animate-fade-in animate-delay-2">
          <div className="card card-gradient glow-green hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-[#22c55e] bg-[#22c55e]/10 px-3 py-1 rounded-full">TODAY'S WORKOUT</span>
              <div className="w-10 h-10 rounded-full bg-[#22c55e] flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">{todayWorkout.name}</h2>
            <div className="flex items-center gap-4 text-sm text-[#71717a]">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {todayWorkout.exercises.length} exercises
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {totalSets} sets
              </span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="card animate-fade-in animate-delay-2">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">🎉</span>
            </div>
            <p className="text-xl font-semibold mb-1">Rest Day</p>
            <p className="text-sm text-[#71717a]">Recovery is part of the process</p>
          </div>
        </div>
      )}

      {/* Week Schedule */}
      <div className="animate-fade-in animate-delay-3">
        <h3 className="text-sm font-semibold text-[#71717a] mb-3 ml-1">THIS WEEK</h3>
        <div className="space-y-2">
          {workouts.map((workout, index) => {
            const isToday = new Date().getDay() === workout.day;
            const dayName = dayNames[workout.day];
            
            return (
              <Link key={workout.id} href={isToday ? `/workout/${workout.id}` : '#'}>
                <div className={`card flex items-center justify-between hover:bg-[#27272a] transition-colors ${isToday ? 'border-[#22c55e]/30 glow-green' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold ${isToday ? 'bg-[#22c55e] text-black' : 'bg-[#27272a] text-[#71717a]'}`}>
                      {dayName.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium">{dayName}</p>
                      <p className="text-sm text-[#71717a]">{workout.name}</p>
                    </div>
                  </div>
                  {isToday && (
                    <span className="text-xs font-medium text-[#22c55e] bg-[#22c55e]/10 px-2 py-1 rounded-full">TODAY</span>
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
