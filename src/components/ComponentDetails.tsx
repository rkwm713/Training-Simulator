import React from 'react';
import { PoleComponent } from '../types';

interface ComponentDetailsProps {
  component: PoleComponent;
}

const ComponentDetails: React.FC<ComponentDetailsProps> = ({ component }) => {
  if (!component.specifications) {
    return null;
  }
  
  const renderSpecifications = () => {
    const specs = component.specifications;
    
    return (
      <div className="mt-4 pt-4 border-t border-gray-700">
        <h4 className="text-sm font-semibold mb-2">Specifications</h4>
        <div className="space-y-1 text-xs">
          {Object.entries(specs).map(([key, value]) => {
            // Skip rendering if value is null or undefined
            if (value === null || value === undefined) return null;
            
            // Format the key for display
            const formattedKey = key
              .replace(/\(.*?\)/g, '') // Remove parentheses and their contents
              .replace(/\"/g, '') // Remove quotes
              .trim();
            
            return (
              <div key={key} className="flex justify-between">
                <span className="text-gray-400">{formattedKey}:</span>
                <span className="text-white">{value.toString()}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return renderSpecifications();
};

export default ComponentDetails;