"use client";

import React, { useState } from 'react';

const grinderData = {
  'Kingrinder K6': {
    micronsPerClick: 16,
    maxClicks: 240,
    baseOffset: 0
  },
  'Kingrinder K1': {
    micronsPerClick: 18,
    maxClicks: 240,
    baseOffset: 0
  },
  'Comandante C40': {
    micronsPerClick: 30,
    maxClicks: 50,
    baseOffset: 0
  },
  'Porlex Mini 2': {
    micronsPerClick: 37,
    maxClicks: 50,
    baseOffset: 0
  },
  'Timemore S3': {
    micronsPerClick: 15,
    maxClicks: 36,
    baseOffset: 0
  },
  '1Zpresso Q2/J': {
    micronsPerClick: 25,
    maxClicks: 30,
    baseOffset: 0
  },
  '1Zpresso JX-Pro/JE-Plus': {
    micronsPerClick: 12.5,
    maxClicks: 40,
    baseOffset: 0
  },
  '1Zpresso X-Pro/X-Ultra': {
    micronsPerClick: 12.5,
    maxClicks: 60,
    baseOffset: 0
  },
  '1Zpresso J-Max': {
    micronsPerClick: 8.8,
    maxClicks: 90,
    baseOffset: 0
  },
  '1Zpresso J-Ultra': {
    micronsPerClick: 8,
    maxClicks: 100,
    baseOffset: 0
  },
  '1Zpresso K-Plus/K-Pro/K-Max': {
    micronsPerClick: 22,
    maxClicks: 90,
    baseOffset: 0
  },
  '1Zpresso K-Ultra': {
    micronsPerClick: 20,
    maxClicks: 100,
    baseOffset: 0
  }
} as const;

const calculateMicrons = (grinder: keyof typeof grinderData, clicks: number) => {
  const { micronsPerClick, baseOffset } = grinderData[grinder];
  return baseOffset + (clicks * micronsPerClick);
};

const calculateClicks = (grinder: keyof typeof grinderData, targetMicrons: number) => {
  const { micronsPerClick, baseOffset, maxClicks } = grinderData[grinder];
  const clicks = Math.round((targetMicrons - baseOffset) / micronsPerClick);
  return Math.min(Math.max(0, clicks), maxClicks);
};

export default function CoffeeGrinderConverter() {
  const [sourceGrinder, setSourceGrinder] = useState<keyof typeof grinderData | ''>('');
  const [targetGrinder, setTargetGrinder] = useState<keyof typeof grinderData | ''>('');
  const [sourceValue, setSourceValue] = useState('');
  const [result, setResult] = useState<{ clicks: number; microns: number } | null>(null);

  const handleConversion = (value: string) => {
    if (!sourceGrinder || !targetGrinder || !value) {
      setResult(null);
      return;
    }

    const clicks = Number(value);
    const sourceMicrons = calculateMicrons(sourceGrinder, clicks);
    const targetClicks = calculateClicks(targetGrinder, sourceMicrons);
    const targetMicrons = calculateMicrons(targetGrinder, targetClicks);
    
    setResult({
      clicks: targetClicks,
      microns: targetMicrons
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center text-gray-900">Coffee Grinder Size Converter</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">From Grinder:</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              value={sourceGrinder}
              onChange={(e) => {
                setSourceGrinder(e.target.value as keyof typeof grinderData);
                setSourceValue('');
                setResult(null);
              }}
            >
              <option value="">Select source grinder</option>
              {Object.keys(grinderData).map(grinder => (
                <option key={grinder} value={grinder}>{grinder}</option>
              ))}
            </select>
            {sourceGrinder && (
              <p className="text-sm text-gray-900 mt-1">
                {grinderData[sourceGrinder].micronsPerClick} microns per click, max {grinderData[sourceGrinder].maxClicks} clicks
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">To Grinder:</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              value={targetGrinder}
              onChange={(e) => {
                setTargetGrinder(e.target.value as keyof typeof grinderData);
                setResult(null);
              }}
            >
              <option value="">Select target grinder</option>
              {Object.keys(grinderData).map(grinder => (
                <option key={grinder} value={grinder}>{grinder}</option>
              ))}
            </select>
            {targetGrinder && (
              <p className="text-sm text-gray-900 mt-1">
                {grinderData[targetGrinder].micronsPerClick} microns per click, max {grinderData[targetGrinder].maxClicks} clicks
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Grind Setting (clicks):</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              value={sourceValue}
              onChange={(e) => {
                setSourceValue(e.target.value);
                handleConversion(e.target.value);
              }}
              placeholder="Enter number of clicks"
              min={0}
              max={sourceGrinder ? grinderData[sourceGrinder].maxClicks : 100}
            />
            {sourceValue && sourceGrinder && (
              <p className="text-sm text-gray-900 mt-1">
                ≈ {calculateMicrons(sourceGrinder, Number(sourceValue))} microns
              </p>
            )}
          </div>

          {result && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg space-y-2">
              <p className="text-center text-lg font-medium text-gray-900">
                Converted Setting: {result.clicks} clicks
              </p>
              <p className="text-center text-sm text-gray-900">
                ≈ {result.microns} microns
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}