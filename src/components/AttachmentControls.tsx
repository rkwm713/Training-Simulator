import React, { useCallback } from 'react';
import { PoleComponent } from '../types';
import { getAvailableAttachmentPoints } from '../utils/attachmentUtils';

interface AttachmentControlsProps {
  component: PoleComponent;
  allComponents: PoleComponent[];
  onUpdate: (updates: Partial<PoleComponent>) => void;
}

const AttachmentControls: React.FC<AttachmentControlsProps> = ({ 
  component, 
  allComponents,
  onUpdate 
}) => {
  const attachmentPoints = getAvailableAttachmentPoints(allComponents);
  
  // Don't show attachment controls for poles (they are attachment points)
  if (component.type === 'pole') {
    return null;
  }
  
  // For crossarms, don't allow detachment from pole
  const isCrossarm = component.type === 'crossarm';
  
  const handleAttachmentChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    if (value === 'none') {
      // Don't allow detaching crossarms
      if (isCrossarm) {
        return;
      }
      
      // Detach the component
      onUpdate({
        attachedTo: undefined,
        attachmentType: undefined,
        attachmentHeight: undefined,
        attachmentAngle: undefined,
        attachmentOffset: undefined
      });
    } else {
      // Find the selected attachment point
      const [id, type] = value.split(':');
      const attachmentType = type as 'pole' | 'crossarm';
      
      // Set default values based on attachment type
      let defaultHeight = 7;
      let defaultAngle = 0;
      let defaultOffset = 0.5;
      
      // If already attached, preserve existing values
      if (component.attachedTo === id) {
        defaultHeight = component.attachmentHeight || defaultHeight;
        defaultAngle = component.attachmentAngle || defaultAngle;
        defaultOffset = component.attachmentOffset || defaultOffset;
      }
      
      onUpdate({
        attachedTo: id,
        attachmentType,
        attachmentHeight: defaultHeight,
        attachmentAngle: defaultAngle,
        attachmentOffset: defaultOffset
      });
    }
  }, [component, onUpdate, isCrossarm]);
  
  const handleHeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ attachmentHeight: parseFloat(e.target.value) });
  }, [onUpdate]);
  
  const handleAngleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ attachmentAngle: parseFloat(e.target.value) });
  }, [onUpdate]);
  
  const handleOffsetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ attachmentOffset: parseFloat(e.target.value) });
  }, [onUpdate]);
  
  return (
    <div className="mb-4 p-3 bg-gray-700 rounded">
      <h4 className="text-sm font-semibold mb-2">Attachment Settings</h4>
      
      <div className="mb-3">
        <label className="block text-xs mb-1">Attach To</label>
        <select
          className="bg-gray-600 text-white p-2 rounded w-full"
          value={component.attachedTo ? `${component.attachedTo}:${component.attachmentType}` : 'none'}
          onChange={handleAttachmentChange}
          disabled={isCrossarm} // Disable for crossarms
        >
          <option value="none">Not Attached</option>
          {attachmentPoints.map(point => (
            <option key={`${point.id}:${point.type}`} value={`${point.id}:${point.type}`}>
              {point.name} ({point.type})
            </option>
          ))}
        </select>
        
        {isCrossarm && (
          <p className="text-xs text-yellow-400 mt-1">
            Crossarms must be attached to a pole
          </p>
        )}
      </div>
      
      {component.attachedTo && component.attachmentType === 'pole' && (
        <>
          <div className="mb-3">
            <label className="block text-xs mb-1">Height on Pole</label>
            <input
              type="range"
              min="0"
              max="15"
              step="0.1"
              className="w-full"
              value={component.attachmentHeight || 7}
              onChange={handleHeightChange}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Bottom</span>
              <span>{component.attachmentHeight?.toFixed(1) || 7}m</span>
              <span>Top</span>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs mb-1">Angle Around Pole</label>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              className="w-full"
              value={component.attachmentAngle || 0}
              onChange={handleAngleChange}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0°</span>
              <span>{component.attachmentAngle || 0}°</span>
              <span>360°</span>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs mb-1">Distance from Pole</label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              className="w-full"
              value={component.attachmentOffset || 0.5}
              onChange={handleOffsetChange}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0m</span>
              <span>{component.attachmentOffset?.toFixed(1) || 0.5}m</span>
              <span>3m</span>
            </div>
          </div>
        </>
      )}
      
      {component.attachedTo && component.attachmentType === 'crossarm' && (
        <>
          <div className="mb-3">
            <label className="block text-xs mb-1">Position on Crossarm</label>
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              className="w-full"
              value={component.attachmentAngle || 90}
              onChange={handleAngleChange}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Left End</span>
              <span>Center</span>
              <span>Right End</span>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs mb-1">Vertical Offset</label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              className="w-full"
              value={component.attachmentOffset || 0}
              onChange={handleOffsetChange}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Below</span>
              <span>{component.attachmentOffset?.toFixed(1) || 0}m</span>
              <span>Above</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AttachmentControls;