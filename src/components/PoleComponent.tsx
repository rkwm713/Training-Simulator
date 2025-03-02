import React from 'react';
import { useFrame } from '@react-three/fiber';
import { PoleComponent as PoleComponentType } from '../types';
import { Text } from '@react-three/drei';

interface PoleComponentProps {
  component: PoleComponentType;
  isSelected: boolean;
  onClick: () => void;
}

const PoleComponent: React.FC<PoleComponentProps> = ({ component, isSelected, onClick }) => {
  const { position, rotation, scale, color, type, specifications } = component;
  
  // Create a reference to the mesh
  const meshRef = React.useRef<THREE.Mesh>(null);
  
  // Add a subtle animation to selected components
  useFrame((state) => {
    if (isSelected && meshRef.current) {
      meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });
  
  // Render different geometries based on component type
  const renderGeometry = () => {
    switch (type) {
      case 'pole':
        return <cylinderGeometry args={[0.3, 0.4, 15, 16]} />;
      case 'crossarm':
        return <boxGeometry args={[5, 0.4, 0.4]} />;
      case 'insulator':
        return <group>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
            <meshStandardMaterial color="#A0A0A0" />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </group>;
      case 'transformer':
        return <boxGeometry args={[1, 1.5, 1]} />;
      case 'wire':
      case 'cable':
        return <cylinderGeometry args={[0.05, 0.05, 10, 8]} />;
      case 'hardware':
        return <sphereGeometry args={[0.2, 16, 16]} />;
      case 'anchor':
        return <group>
          <mesh position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
            <meshStandardMaterial color="#606060" />
          </mesh>
          <mesh position={[0, -2.5, 0]}>
            <cylinderGeometry args={[0.8, 0.2, 1, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </group>;
      case 'equipment':
        if (specifications?.Type === 'TRANSFORMER') {
          return <boxGeometry args={[1, 1.5, 1]} />;
        } else if (specifications?.Type === 'CAPACITOR') {
          return <boxGeometry args={[1.2, 1.8, 1.2]} />;
        } else if (specifications?.Type === 'STREET_LIGHT') {
          return <group>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
              <meshStandardMaterial color="#909090" />
            </mesh>
            <mesh position={[0.5, 0, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color="#FFFF99" emissive="#FFFF00" emissiveIntensity={0.5} />
            </mesh>
          </group>;
        } else if (specifications?.Type === 'RISER') {
          return <cylinderGeometry args={[0.1, 0.1, 5, 8]} />;
        } else {
          return <boxGeometry args={[1, 1, 1]} />;
        }
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };
  
  // Determine if this component is attached to something
  const isAttached = !!component.attachedTo;
  
  // Add height markers to the pole
  const renderHeightMarkers = () => {
    if (type !== 'pole') return null;
    
    const poleHeight = specifications?.["Height (')"] || 45;
    const markers = [];
    
    // Add markers every 5 feet
    for (let i = 0; i <= poleHeight; i += 5) {
      if (i === 0) continue; // Skip the ground level
      
      // Calculate the y position (convert feet to meters)
      // Scale the marker position based on the pole's visual height (15 units)
      const y = (i / poleHeight) * 15 - 7.5; // 15 is the default pole height in the model
      
      markers.push(
        <group key={`marker-${i}`} position={[0, y, 0]}>
          {/* Marker line */}
          <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.05, 0.5, 0.05]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          
          {/* Text label */}
          <Text
            position={[0.8, 0, 0]}
            rotation={[0, 0, 0]}
            fontSize={0.3}
            color="#FFFFFF"
            anchorX="left"
            anchorY="middle"
          >
            {`${i}'`}
          </Text>
        </group>
      );
    }
    
    return markers;
  };
  
  // Get the component label text
  const getComponentLabel = () => {
    if (!isSelected) return null;
    
    let labelText = component.name;
    
    // For attached components, show the height relative to the pole height
    if (component.attachedTo && component.attachmentType === 'pole' && component.imperialHeight) {
      labelText = `${component.name} - ${component.imperialHeight}`;
    } 
    // For crossarms, show the height relative to the pole
    else if (component.type === 'crossarm' && component.imperialHeight) {
      labelText = `${component.name} - ${component.imperialHeight}`;
    }
    
    return labelText;
  };
  
  return (
    <group
      position={[position[0], position[1], position[2]]}
      rotation={[rotation[0], rotation[1], rotation[2]]}
      scale={[scale[0], scale[1], scale[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <mesh 
        ref={meshRef}
        castShadow 
        receiveShadow
      >
        {renderGeometry()}
        <meshStandardMaterial 
          color={color} 
          emissive={isSelected ? "#555555" : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
          roughness={0.7} 
          metalness={0.2} 
        />
      </mesh>
      
      {/* Height markers for poles */}
      {type === 'pole' && renderHeightMarkers()}
      
      {isSelected && (
        <mesh>
          <boxGeometry args={[
            type === 'pole' ? 1 : scale[0] * 1.05, 
            type === 'pole' ? 15.1 : scale[1] * 1.05, 
            type === 'pole' ? 1 : scale[2] * 1.05
          ]} />
          <meshBasicMaterial color="#FFFF00" wireframe={true} transparent={true} opacity={0.5} />
        </mesh>
      )}
      
      {/* Show attachment visualization if this component is attached */}
      {isAttached && (
        <mesh>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial color="#00FF00" />
        </mesh>
      )}
      
      {/* Show component label when selected */}
      {isSelected && (
        <Text
          position={[0, 1, 0]}
          rotation={[0, 0, 0]}
          fontSize={0.3}
          color="#FFFFFF"
          anchorX="center"
          anchorY="bottom"
          backgroundColor="#00000080"
          padding={0.1}
        >
          {getComponentLabel()}
        </Text>
      )}
    </group>
  );
};

export default PoleComponent;