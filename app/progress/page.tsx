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

  // Simple volume data from workouts
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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Progress</h1>
      </header>

      {/* Body Stats Input */}
      <div className="card">
        <h3 className="font-medium mb-3">Body Stats</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs text-[#a1a1aa] block mb-1">Weight (lbs)</label>
            <input
              type="number"
              value={bodyWeight}
              onChange={(e) => setBodyWeight(e.target.value)}
              placeholder="0"
              className="input"
            />
          </div>
          <div>
            <label className="text-xs text-[#a1a1aa] block mb-1">Waist (in)</label>
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
          Save
        </button>
      </div>

      {/* Body Stats History */}
      {stats.length > 0 && (
        <div className="card">
          <h3 className="font-medium mb-3">Weight History</h3>
          <div className="space-y-2">
            {stats
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((s) => (
                <div key={s.date} className="flex justify-between text-sm">
                  <span className="text-[#a1a1aa]">{s.date}</span>
                  <span>{s.weight} lbs {s.waist ? `• ${s.waist}"` : ''}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Volume Chart */}
      {volumeData.length > 1 && (
        <div className="card">
          <h3 className="font-medium mb-3">Volume (Last 10 workouts)</h3>
          <div className="flex items-end gap-1 h-32">
            {volumeData.map(([date, volume], i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-[#22c55e] rounded-t"
                  style={{ height: `${(volume / maxVolume) * 100}%` }}
                />
                <span className="text-[8px] text-[#a1a1aa] mt-1 rotate-0">
                  {date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card">
          <p className="text-sm text-[#a1a1aa]">Total Workouts</p>
          <p className="text-2xl font-bold">{getWorkouts().filter(w => w.completed).length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-[#a1a1aa]">Total Volume</p>
          <p className="text-2xl font-bold text-primary">
            {(volumeData.reduce((sum, [, v]) => sum + v, 0) / 1000).toFixed(1)}k
          </p>
        </div>
      </div>
    </div>
  );
}
