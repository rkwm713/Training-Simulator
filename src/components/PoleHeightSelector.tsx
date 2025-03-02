import React, { useState, useEffect, useCallback } from 'react';
import ImperialMeasurementInput from './ImperialMeasurementInput';
import { formatFeetOnly } from '../utils/measurementUtils';

interface PoleHeightSelectorProps {
  currentHeight: number;
  onHeightChange: (height: number) => void;
}

const PoleHeightSelector: React.FC<PoleHeightSelectorProps> = ({ 
  currentHeight, 
  onHeightChange 
}) => {
  const [height, setHeight] = useState<string>(formatFeetOnly(currentHeight));
  
  // Update the height when the current height changes
  useEffect(() => {
    setHeight(formatFeetOnly(currentHeight));
  }, [currentHeight]);
  
  // Handle height change
  const handleHeightChange = useCallback((value: string) => {
    setHeight(value);
    
    // Extract feet from the imperial measurement
    const feetMatch = value.match(/(\d+)'/);
    if (feetMatch) {
      const feet = parseInt(feetMatch[1], 10);
      if (feet !== currentHeight) {
        onHeightChange(feet);
      }
    }
  }, [currentHeight, onHeightChange]);
  
  // Standard pole heights
  const standardHeights = [30, 35, 40, 45, 50, 55, 60];
  
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs mb-1">Pole Height</label>
        <ImperialMeasurementInput
          value={height}
          onChange={handleHeightChange}
        />
        <p className="text-xs text-gray-400 mt-1">
          This is the reference height for all measurements
        </p>
      </div>
      
      <div>
        <label className="block text-xs mb-1">Standard Heights</label>
        <div className="grid grid-cols-3 gap-2">
          {standardHeights.map(h => (
            <button
              key={h}
              className={`p-2 text-xs rounded ${currentHeight === h ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => onHeightChange(h)}
            >
              {h}' ({(h * 0.3048).toFixed(2)} m)
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-400">
        <p>Standard Douglas Fir Class 2 Pole</p>
        <p>Top Circumference: 25"</p>
        <p>Material: Wood</p>
      </div>
    </div>
  );
};

export default PoleHeightSelector;