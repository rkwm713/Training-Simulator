import React, { useState, useEffect } from 'react';
import { parseImperialMeasurement, formatImperialMeasurement } from '../utils/measurementUtils';

interface ImperialMeasurementInputProps {
  value: string;
  onChange?: (value: string) => void;
  label?: string;
  min?: string;
  max?: string;
  className?: string;
}

const ImperialMeasurementInput: React.FC<ImperialMeasurementInputProps> = ({
  value,
  onChange,
  label,
  min,
  max,
  className = ''
}) => {
  const [feet, setFeet] = useState<number>(0);
  const [inches, setInches] = useState<number>(0);
  
  // Parse the initial value
  useEffect(() => {
    const measurement = parseImperialMeasurement(value);
    setFeet(measurement.feet);
    setInches(measurement.inches);
  }, [value]);
  
  // Handle feet change
  const handleFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFeet = parseInt(e.target.value, 10) || 0;
    setFeet(newFeet);
    if (onChange) {
      onChange(formatImperialMeasurement({ feet: newFeet, inches }));
    }
  };
  
  // Handle inches change
  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newInches = parseInt(e.target.value, 10) || 0;
    
    // Handle inches overflow
    if (newInches >= 12) {
      const additionalFeet = Math.floor(newInches / 12);
      newInches = newInches % 12;
      const newFeet = feet + additionalFeet;
      setFeet(newFeet);
    }
    
    setInches(newInches);
    if (onChange) {
      onChange(formatImperialMeasurement({ feet, inches: newInches }));
    }
  };
  
  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="block text-xs mb-1">{label}</label>}
      <div className="flex space-x-2">
        <div className="flex-1">
          <input
            type="number"
            min="0"
            className="bg-gray-700 text-white p-2 rounded w-full"
            value={feet}
            onChange={handleFeetChange}
          />
          <span className="text-xs text-gray-400">feet</span>
        </div>
        <div className="flex-1">
          <input
            type="number"
            min="0"
            max="11"
            className="bg-gray-700 text-white p-2 rounded w-full"
            value={inches}
            onChange={handleInchesChange}
          />
          <span className="text-xs text-gray-400">inches</span>
        </div>
      </div>
    </div>
  );
};

export default ImperialMeasurementInput;