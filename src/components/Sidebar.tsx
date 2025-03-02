import React, { useState, useCallback } from 'react';
import { usePoleStore } from '../store/poleStore';
import { getComponentDefaults } from '../utils/poleUtils';
import { PoleComponent } from '../types';
import { Save, Trash2, Plus, Settings, RotateCcw, Move, Maximize, Edit3, Link, Ruler } from 'lucide-react';
import ComponentDetails from './ComponentDetails';
import AttachmentControls from './AttachmentControls';
import PoleHeightSelector from './PoleHeightSelector';
import ImperialMeasurementInput from './ImperialMeasurementInput';

const Sidebar: React.FC = () => {
  const { 
    getActiveConfiguration, 
    getSelectedComponent,
    getAllComponents,
    addComponent,
    updateComponent,
    removeComponent,
    configurations,
    activeConfigId,
    setActiveConfig,
    addConfiguration,
    removeConfiguration
  } = usePoleStore();
  
  const activeConfig = getActiveConfiguration();
  const selectedComponent = getSelectedComponent();
  const allComponents = getAllComponents();
  
  const [newConfigName, setNewConfigName] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const handleAddComponent = useCallback((type: PoleComponent['type']) => {
    const defaults = getComponentDefaults(type);
    
    // Find the pole component to attach to
    const poleComponent = allComponents.find(c => c.type === 'pole');
    
    // For crossarms, always attach to the pole
    if (type === 'crossarm' && poleComponent) {
      const poleHeight = poleComponent.specifications?.["Height (')"] || 45;
      // Calculate a height about 60% up the pole
      const crossarmHeightFeet = Math.round(poleHeight * 0.6);
      
      addComponent({
        name: defaults.name || 'New Crossarm',
        type,
        position: defaults.position || [0, 0, 0],
        rotation: defaults.rotation || [0, 0, 0],
        scale: defaults.scale || [1, 1, 1],
        color: defaults.color || '#8B4513',
        imperialHeight: `${crossarmHeightFeet}' 0"`,
        imperialOffset: "0' 0\"",
        imperialDirection: 0,
        attachedTo: poleComponent.id,
        attachmentType: 'pole'
      });
    } else {
      addComponent({
        name: defaults.name || 'New Component',
        type,
        position: defaults.position || [0, 0, 0],
        rotation: defaults.rotation || [0, 0, 0],
        scale: defaults.scale || [1, 1, 1],
        color: defaults.color || '#CCCCCC',
        imperialHeight: defaults.imperialHeight,
        imperialOffset: defaults.imperialOffset,
        imperialDirection: defaults.imperialDirection
      });
    }
  }, [addComponent, allComponents]);
  
  const handleUpdatePosition = useCallback((axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedComponent) return;
    
    const newPosition = [...selectedComponent.position] as [number, number, number];
    const index = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
    newPosition[index] = value;
    
    updateComponent(selectedComponent.id, { position: newPosition });
  }, [selectedComponent, updateComponent]);
  
  const handleUpdateRotation = useCallback((axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedComponent) return;
    
    const newRotation = [...selectedComponent.rotation] as [number, number, number];
    const index = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
    newRotation[index] = value;
    
    updateComponent(selectedComponent.id, { rotation: newRotation });
  }, [selectedComponent, updateComponent]);
  
  const handleUpdateScale = useCallback((axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedComponent) return;
    
    const newScale = [...selectedComponent.scale] as [number, number, number];
    const index = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
    newScale[index] = value;
    
    updateComponent(selectedComponent.id, { scale: newScale });
  }, [selectedComponent, updateComponent]);
  
  const handleAddConfiguration = useCallback(() => {
    if (newConfigName.trim()) {
      addConfiguration(newConfigName.trim());
      setNewConfigName('');
    }
  }, [newConfigName, addConfiguration]);
  
  const handleUpdateComponent = useCallback((updates: Partial<PoleComponent>) => {
    if (selectedComponent) {
      updateComponent(selectedComponent.id, updates);
    }
  }, [selectedComponent, updateComponent]);
  
  const handlePoleHeightChange = useCallback((height: number) => {
    // Find the pole component in the current configuration
    const poleComponent = allComponents.find(c => c.type === 'pole');
    
    if (poleComponent) {
      // Update the existing pole
      updateComponent(poleComponent.id, {
        name: `Douglas Fir ${height}' Class 2`,
        scale: [1, height * 0.3048 / 15, 1], // Scale the pole height (15 is the default height in the model)
        specifications: {
          ...poleComponent.specifications,
          "Height (')": height
        }
      });
    }
  }, [allComponents, updateComponent]);
  
  // Get the current pole height
  const currentPoleHeight = React.useMemo(() => {
    const poleComponent = allComponents.find(c => c.type === 'pole');
    return poleComponent?.specifications?.["Height (')"] || 45;
  }, [allComponents]);
  
  return (
    <div className="bg-gray-800 text-white p-4 w-80 overflow-y-auto flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Settings className="mr-2" size={20} />
        Utility Pole Builder
      </h2>
      
      {/* Configuration Selector */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Pole Configurations</h3>
        <div className="flex flex-col space-y-2">
          <select 
            className="bg-gray-700 text-white p-2 rounded"
            value={activeConfigId || ''}
            onChange={(e) => setActiveConfig(e.target.value)}
          >
            {configurations.map(config => (
              <option key={config.id} value={config.id}>
                {config.name}
              </option>
            ))}
          </select>
          
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="New configuration name"
              className="bg-gray-700 text-white p-2 rounded flex-grow"
              value={newConfigName}
              onChange={(e) => setNewConfigName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddConfiguration()}
            />
            <button 
              className="bg-blue-600 p-2 rounded"
              onClick={handleAddConfiguration}
            >
              <Plus size={20} />
            </button>
          </div>
          
          {configurations.length > 1 && (
            <div className="flex justify-end">
              {showConfirmDelete ? (
                <div className="flex space-x-2">
                  <button 
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() => {
                      if (activeConfigId) {
                        removeConfiguration(activeConfigId);
                      }
                      setShowConfirmDelete(false);
                    }}
                  >
                    Confirm
                  </button>
                  <button 
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() => setShowConfirmDelete(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  className="text-red-400 text-sm flex items-center"
                  onClick={() => setShowConfirmDelete(true)}
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete Configuration
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Pole Height Selector */}
      <div className="mb-6 bg-gray-700 p-3 rounded">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <Ruler className="mr-2" size={18} />
          Pole Settings
        </h3>
        <PoleHeightSelector 
          currentHeight={currentPoleHeight} 
          onHeightChange={handlePoleHeightChange} 
        />
      </div>
      
      {/* Standard Component Controls */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Add Components</h3>
        <div className="grid grid-cols-2 gap-2">
          <button 
            className="bg-blue-600 p-2 rounded text-sm"
            onClick={() => handleAddComponent('crossarm')}
          >
            Crossarm
          </button>
          <button 
            className="bg-blue-600 p-2 rounded text-sm"
            onClick={() => handleAddComponent('insulator')}
          >
            Insulator
          </button>
          <button 
            className="bg-blue-600 p-2 rounded text-sm"
            onClick={() => handleAddComponent('transformer')}
          >
            Transformer
          </button>
          <button 
            className="bg-blue-600 p-2 rounded text-sm"
            onClick={() => handleAddComponent('wire')}
          >
            Wire
          </button>
          <button 
            className="bg-blue-600 p-2 rounded text-sm"
            onClick={() => handleAddComponent('hardware')}
          >
            Hardware
          </button>
          <button 
            className="bg-blue-600 p-2 rounded text-sm"
            onClick={() => handleAddComponent('anchor')}
          >
            Anchor
          </button>
        </div>
      </div>
      
      {/* Selected Component Editor */}
      {selectedComponent && (
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold flex items-center">
              <Edit3 size={18} className="mr-2" />
              Edit Component
            </h3>
            <button 
              className="text-red-400 p-1 rounded"
              onClick={() => removeComponent(selectedComponent.id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-xs mb-1">Name</label>
            <input
              type="text"
              className="bg-gray-700 text-white p-2 rounded w-full"
              value={selectedComponent.name}
              onChange={(e) => handleUpdateComponent({ name: e.target.value })}
            />
          </div>
          
          {/* Attachment Controls */}
          {selectedComponent.type !== 'pole' && (
            <AttachmentControls
              component={selectedComponent}
              allComponents={allComponents}
              onUpdate={handleUpdateComponent}
            />
          )}
          
          {/* Position Controls */}
          <div className="mb-4 p-3 bg-gray-700 rounded">
            <h4 className="text-sm font-semibold mb-2 flex items-center">
              <Move size={16} className="mr-1" />
              Position
            </h4>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs mb-1">X</label>
                <input
                  type="number"
                  step="0.1"
                  className="bg-gray-600 text-white p-2 rounded w-full"
                  value={selectedComponent.position[0]}
                  onChange={(e) => handleUpdatePosition('x', parseFloat(e.target.value))}
                  disabled={!!selectedComponent.attachedTo}
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Y</label>
                <input
                  type="number"
                  step="0.1"
                  className="bg-gray-600 text-white p-2 rounded w-full"
                  value={selectedComponent.position[1]}
                  onChange={(e) => handleUpdatePosition('y', parseFloat(e.target.value))}
                  disabled={!!selectedComponent.attachedTo}
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Z</label>
                <input
                  type="number"
                  step="0.1"
                  className="bg-gray-600 text-white p-2 rounded w-full"
                  value={selectedComponent.position[2]}
                  onChange={(e) => handleUpdatePosition('z', parseFloat(e.target.value))}
                  disabled={!!selectedComponent.attachedTo}
                />
              </div>
            </div>
            
            {selectedComponent.attachedTo && (
              <p className="text-xs text-yellow-400 mt-1">
                Position is controlled by attachment settings
              </p>
            )}
          </div>
          
          {/* Rotation Controls */}
          <div className="mb-4 p-3 bg-gray-700 rounded">
            <h4 className="text-sm font-semibold mb-2 flex items-center">
              <RotateCcw size={16} className="mr-1" />
              Rotation (degrees)
            </h4>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs mb-1">X</label>
                <input
                  type="number"
                  step="15"
                  className="bg-gray-600 text-white p-2 rounded w-full"
                  value={Math.round(selectedComponent.rotation[0] * (180 / Math.PI))}
                  onChange={(e) => handleUpdateRotation('x', parseFloat(e.target.value) * (Math.PI / 180))}
                  disabled={!!selectedComponent.attachedTo}
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Y</label>
                <input
                  type="number"
                  step="15"
                  className="bg-gray-600 text-white p-2 rounded w-full"
                  value={Math.round(selectedComponent.rotation[1] * (180 / Math.PI))}
                  onChange={(e) => handleUpdateRotation('y', parseFloat(e.target.value) * (Math.PI / 180))}
                  disabled={!!selectedComponent.attachedTo}
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Z</label>
                <input
                  type="number"
                  step="15"
                  className="bg-gray-600 text-white p-2 rounded w-full"
                  value={Math.round(selectedComponent.rotation[2] * (180 / Math.PI))}
                  onChange={(e) => handleUpdateRotation('z', parseFloat(e.target.value) * (Math.PI / 180))}
                  disabled={!!selectedComponent.attachedTo}
                />
              </div>
            </div>
            
            {selectedComponent.attachedTo && (
              <p className="text-xs text-yellow-400 mt-1">
                Rotation is controlled by attachment settings
              </p>
            )}
          </div>
          
          {/* Scale Controls */}
          <div className="mb-4 p-3 bg-gray-700 rounded">
            <h4 className="text-sm font-semibold mb-2 flex items-center">
              <Maximize size={16} className="mr-1" />
              Scale
            </h4>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs mb-1">X</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="bg-gray-600 text-white p-2 rounded w-full"
                  value={selectedComponent.scale[0]}
                  onChange={(e) => handleUpdateScale('x', parseFloat(e.target.value))}
                  disabled={selectedComponent.type === 'pole'}
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Y</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="bg-gray-600 text-white p-2 rounded w-full"
                  value={selectedComponent.scale[1]}
                  onChange={(e) => handleUpdateScale('y', parseFloat(e.target.value))}
                  disabled={selectedComponent.type === 'pole'}
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Z</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="bg-gray-600 text-white p-2 rounded w-full"
                  value={selectedComponent.scale[2]}
                  onChange={(e) => handleUpdateScale('z', parseFloat(e.target.value))}
                  disabled={selectedComponent.type === 'pole'}
                />
              </div>
            </div>
            {selectedComponent.type === 'pole' && (
              <p className="text-xs text-yellow-400 mt-1">
                Pole scale is controlled by height setting
              </p>
            )}
          </div>
          
          {/* Component Specifications */}
          {selectedComponent.specifications && (
            <ComponentDetails component={selectedComponent} />
          )}
        </div>
      )}
      
      {!selectedComponent && activeConfig && (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-400 text-center">
            Select a component to edit its properties or add a new component from the options above.
          </p>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 mb-2">
          Click and drag to rotate the view. Right-click and drag to pan. Scroll to zoom.
        </p>
        <button 
          className="bg-green-600 text-white p-2 rounded w-full flex items-center justify-center"
          onClick={() => {
            // In a real app, this would save the configuration to a server
            alert('Configuration saved successfully!');
          }}
        >
          <Save size={18} className="mr-2" />
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default Sidebar;