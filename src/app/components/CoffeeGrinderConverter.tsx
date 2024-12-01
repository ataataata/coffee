"use client";

import React, { useState } from 'react';

// ... grinderData and calculation functions stay the same ...

export default function CoffeeGrinderConverter() {
  // ... state and handlers stay the same ...

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