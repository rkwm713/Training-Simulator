import React, { useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import { usePoleStore } from '../store/poleStore';
import PoleComponent from './PoleComponent';
import { findComponentById } from '../utils/attachmentUtils';

const PoleScene: React.FC = () => {
  const { getActiveConfiguration, selectComponent, selectedComponentId, updateComponent } = usePoleStore();
  const activeConfig = getActiveConfiguration();
  const lastUpdateRef = useRef<number>(0);
  
  // Memoize the update function to prevent recreation on each render
  const updateAttachedComponents = useCallback(() => {
    if (!activeConfig) return;
    
    // Prevent too frequent updates (throttle)
    const now = Date.now();
    if (now - lastUpdateRef.current < 100) return;
    lastUpdateRef.current = now;
    
    // Find all attached components
    const attachedComponents = activeConfig.components.filter(c => c.attachedTo);
    
    // Update each attached component
    attachedComponents.forEach(component => {
      if (component.attachedTo) {
        const parentComponent = findComponentById(activeConfig.components, component.attachedTo);
        if (parentComponent) {
          // Trigger an update to recalculate position based on attachment
          // Pass an empty object to avoid unnecessary updates if nothing changed
          updateComponent(component.id, {});
        }
      }
    });
  }, [activeConfig, updateComponent]);
  
  // Only update when the configuration changes
  useEffect(() => {
    if (!activeConfig) return;
    
    // Set up a cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, [activeConfig?.updatedAt, updateAttachedComponents]);
  
  // Handle component selection
  const handleSelectComponent = useCallback((id: string) => {
    selectComponent(id);
  }, [selectComponent]);
  
  if (!activeConfig) {
    return <div className="w-full h-full bg-gray-900 flex items-center justify-center">
      <p className="text-white">No active configuration</p>
    </div>;
  }
  
  return (
    <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048}
        />
        
        <Environment preset="sunset" />
        
        <Grid 
          args={[50, 50]} 
          cellSize={1} 
          cellThickness={0.5} 
          cellColor="#6b7280" 
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#9ca3af"
          fadeDistance={50}
          infiniteGrid
        />
        
        <group position={[0, 0, 0]}>
          {activeConfig.components.map((component) => (
            <PoleComponent
              key={component.id}
              component={component}
              isSelected={component.id === selectedComponentId}
              onClick={() => handleSelectComponent(component.id)}
            />
          ))}
        </group>
        
        <OrbitControls 
          makeDefault 
          minDistance={5} 
          maxDistance={50}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>
    </div>
  );
};

export default PoleScene;