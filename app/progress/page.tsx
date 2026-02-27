"use client";

import { useState, useEffect } from 'react';
import { getWorkouts, BodyStats, getBodyStats, saveBodyStats } from '@/lib/storage';

export default function ProgressPage() {
  const [bodyWeight, setBodyWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [stats, setStats] = useState<BodyStats[]>([]);

  useEffect(() => {
    setStats(getBodyStats());
  }, []);

  const handleSaveStats = () => {
    if (!bodyWeight) return;
    
    const newStats: BodyStats = {
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(bodyWeight),
      waist: parseFloat(waist) || 0,
    };
    
    saveBodyStats(newStats);
    setStats(getBodyStats());
    setBodyWeight('');
    setWaist('');
  };

  const volumeData = (() => {
    const workouts = getWorkouts().filter(w => w.completed);
    const byDate: { [key: string]: number } = {};
    
    workouts.forEach(w => {
      const volume = w.exercises.reduce((sum, ex) => 
        sum + ex.sets.reduce((s, set) => s + (set.weight * set.reps), 0), 0
      );
      byDate[w.date] = (byDate[w.date] || 0) + volume;
    });
    
    return Object.entries(byDate)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-10);
  })();

  const maxVolume = Math.max(...volumeData.map(([, v]) => v), 1);
  const totalWorkouts = getWorkouts().filter(w => w.completed).length;
  const totalVolume = volumeData.reduce((sum, [, v]) => sum + v, 0);

  return (
    <div className="space-y-5">
      <header className="animate-fade-in">
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-[#71717a]">Track your gains</p>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in animate-delay-1">
        <div className="card card-gradient">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#22c55e]/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xs text-[#71717a] font-medium">WORKOUTS</span>
          </div>
          <p className="text-3xl font-bold">{totalWorkouts}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xs text-[#71717a] font-medium">VOLUME</span>
          </div>
          <p className="text-3xl font-bold text-gradient">{(totalVolume / 1000).toFixed(1)}k</p>
        </div>
      </div>

      {/* Body Stats Input */}
      <div className="card animate-fade-in animate-delay-2">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#22c55e]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          Body Stats
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-[#71717a] block mb-2">Weight (lbs)</label>
            <input
              type="number"
              value={bodyWeight}
              onChange={(e) => setBodyWeight(e.target.value)}
              placeholder="0"
              className="input"
            />
          </div>
          <div>
            <label className="text-xs text-[#71717a] block mb-2">Waist (in)</label>
            <input
              type="number"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              placeholder="0"
              className="input"
            />
          </div>
        </div>
        <button onClick={handleSaveStats} className="btn btn-primary w-full">
          Save Stats
        </button>
      </div>

      {/* Body Stats History */}
      {stats.length > 0 && (
        <div className="card animate-fade-in animate-delay-3">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            Weight History
          </h3>
          <div className="space-y-2">
            {stats
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((s) => (
                <div key={s.date} className="flex justify-between items-center py-2 border-b border-[#27272a] last:border-0">
                  <span className="text-sm text-[#71717a]">{s.date}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{s.weight} lbs</span>
                    {s.waist > 0 && <span className="text-sm text-[#71717a]">{s.waist}"</span>}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Volume Chart */}
      {volumeData.length > 1 && (
        <div className="card animate-fade-in">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#22c55e]/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            Volume (Last 10 workouts)
          </h3>
          <div className="flex items-end gap-1 h-40">
            {volumeData.map(([date, volume], i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div
                  className="w-full bg-gradient-to-t from-[#22c55e] to-[#4ade80] rounded-t transition-all hover:opacity-80"
                  style={{ height: `${Math.max((volume / maxVolume) * 100, 4)}%` }}
                />
                <span className="text-[10px] text-[#71717a] mt-2 rotate-0">
                  {date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
