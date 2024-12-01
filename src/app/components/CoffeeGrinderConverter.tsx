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
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">
            Coffee Grinder Size Converter
          </h1>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="sourceGrinder" className="block text-base font-medium text-gray-900 mb-2">
              From Grinder:
            </label>
            <select
              id="sourceGrinder"
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              <p className="mt-2 text-sm text-gray-900">
                {grinderData[sourceGrinder].micronsPerClick} microns per click, max {grinderData[sourceGrinder].maxClicks} clicks
              </p>
            )}
          </div>

          <div>
            <label htmlFor="targetGrinder" className="block text-base font-medium text-gray-900 mb-2">
              To Grinder:
            </label>
            <select
              id="targetGrinder"
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              <p className="mt-2 text-sm text-gray-900">
                {grinderData[targetGrinder].micronsPerClick} microns per click, max {grinderData[targetGrinder].maxClicks} clicks
              </p>
            )}
          </div>

          <div>
            <label htmlFor="clickInput" className="block text-base font-medium text-gray-900 mb-2">
              Grind Setting (clicks):
            </label>
            <input
              id="clickInput"
              type="number"
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              <p className="mt-2 text-sm text-gray-900">
                ≈ {calculateMicrons(sourceGrinder, Number(sourceValue))} microns
              </p>
            )}
          </div>

          {result && (
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-center text-xl font-medium text-gray-900">
                Converted Setting: {result.clicks} clicks
              </p>
              <p className="text-center text-base text-gray-900 mt-1">
                ≈ {result.microns} microns
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}