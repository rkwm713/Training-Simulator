import { PoleComponent } from '../types';
import { 
  imperialHeightToYCoord, 
  imperialToDistance, 
  polarToCartesian 
} from './measurementUtils';

/**
 * Updates the position of a component based on its attachment properties
 */
export const updateAttachedComponentPosition = (
  component: PoleComponent,
  attachedTo: PoleComponent
): [number, number, number] => {
  if (!component.attachmentType) {
    return component.position;
  }

  // If imperial measurements are provided, use them
  if (component.imperialHeight && component.imperialOffset !== undefined && component.imperialDirection !== undefined) {
    // For pole attachments, calculate position based on pole height
    if (component.attachmentType === 'pole') {
      const poleHeight = attachedTo.specifications?.["Height (')"] || 45;
      // Parse the imperial height to get the feet value
      const heightFeet = parseInt(component.imperialHeight.split("'")[0], 10);
      
      // Calculate the y position based on the pole height
      // Map the height from feet to the 3D space coordinates
      // The pole's visual height in the 3D space is 15 units
      const y = (heightFeet / poleHeight) * 15 - 7.5;
      
      const distance = imperialToDistance(component.imperialOffset || "0' 0\"");
      const [x, z] = polarToCartesian(component.imperialDirection, distance);
      
      // Add the pole's position to get the final position
      return [
        attachedTo.position[0] + x,
        y,
        attachedTo.position[2] + z
      ];
    } else if (component.attachmentType === 'crossarm') {
      // For crossarm attachments, use the crossarm's position as reference
      const y = attachedTo.position[1] + imperialToDistance(component.imperialHeight || "0' 0\"");
      const offset = imperialToDistance(component.imperialOffset || "0' 0\"");
      
      // Calculate position along the crossarm based on its length
      const crossarmLength = attachedTo.scale[0] * 5; // Assuming scale[0] represents length
      const position: [number, number, number] = [...attachedTo.position] as [number, number, number];
      
      // Adjust position based on offset along the crossarm
      position[0] += offset - (crossarmLength / 2);
      position[1] = y;
      
      return position;
    }
  }

  // Fall back to the old attachment system if imperial measurements aren't available
  const angle = (component.attachmentAngle || 0) * (Math.PI / 180);
  const offset = component.attachmentOffset || 0;
  
  if (component.attachmentType === 'pole') {
    // For pole attachments, position around the pole at the specified height
    const poleHeight = attachedTo.specifications?.["Height (')"] || 45;
    // Scale the height based on the pole's actual height
    const heightPercentage = (component.attachmentHeight || 0) / 15;
    const y = heightPercentage * poleHeight;
    
    const x = attachedTo.position[0] + Math.sin(angle) * offset;
    const z = attachedTo.position[2] + Math.cos(angle) * offset;
    
    return [x, y, z];
  } else if (component.attachmentType === 'crossarm') {
    // For crossarm attachments, position along the crossarm
    // This is simplified and would need to be adjusted based on crossarm orientation
    const crossarmLength = attachedTo.scale[0] * 5; // Assuming scale[0] represents length
    const position = attachedTo.position.slice() as [number, number, number];
    
    // Adjust position based on attachment angle (0 = left end, 180 = right end)
    if (angle <= 90) {
      // Left side of crossarm
      const ratio = angle / 90;
      position[0] -= (crossarmLength / 2) * (1 - ratio);
    } else if (angle <= 180) {
      // Right side of crossarm
      const ratio = (angle - 90) / 90;
      position[0] += (crossarmLength / 2) * ratio;
    }
    
    // Adjust height based on offset
    position[1] += offset;
    
    return position;
  }
  
  return component.position;
};

/**
 * Updates the rotation of a component based on its attachment properties
 */
export const updateAttachedComponentRotation = (
  component: PoleComponent,
  attachedTo: PoleComponent
): [number, number, number] => {
  if (!component.attachmentType) {
    return component.rotation;
  }

  // If imperial direction is provided, use it for rotation
  if (component.imperialDirection !== undefined) {
    return [0, (component.imperialDirection * Math.PI) / 180, 0];
  }

  const angle = (component.attachmentAngle || 0) * (Math.PI / 180);
  
  if (component.attachmentType === 'pole') {
    // For pole attachments, rotate to face outward from the pole
    return [0, angle, 0];
  } else if (component.attachmentType === 'crossarm') {
    // For crossarm attachments, maintain the crossarm's rotation
    return [...attachedTo.rotation] as [number, number, number];
  }
  
  return component.rotation;
};

/**
 * Finds a pole component in the configuration
 */
export const findPoleComponent = (components: PoleComponent[]): PoleComponent | undefined => {
  return components.find(c => c.type === 'pole');
};

/**
 * Finds a component by ID
 */
export const findComponentById = (components: PoleComponent[], id: string): PoleComponent | undefined => {
  return components.find(c => c.id === id);
};

/**
 * Gets all available attachment points (components that can be attached to)
 */
export const getAvailableAttachmentPoints = (components: PoleComponent[]): { id: string; name: string; type: 'pole' | 'crossarm' }[] => {
  const attachmentPoints: { id: string; name: string; type: 'pole' | 'crossarm' }[] = [];
  
  components.forEach(component => {
    if (component.type === 'pole') {
      attachmentPoints.push({
        id: component.id,
        name: component.name,
        type: 'pole'
      });
    } else if (component.type === 'crossarm') {
      attachmentPoints.push({
        id: component.id,
        name: component.name,
        type: 'crossarm'
      });
    }
  });
  
  return attachmentPoints;
};