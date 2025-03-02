import { PoleComponent, PoleConfiguration } from '../types';
import { formatFeetOnly } from './measurementUtils';

export const generateDefaultPole = (): PoleConfiguration => {
  const poleId = crypto.randomUUID();
  const crossarmId = crypto.randomUUID();
  const insulator1Id = crypto.randomUUID();
  const insulator2Id = crypto.randomUUID();
  const insulator3Id = crypto.randomUUID();
  
  // The pole height in feet
  const poleHeight = 45;
  // Calculate the height of the crossarm in feet (about 60% up the pole)
  const crossarmHeightFeet = Math.round(poleHeight * 0.6);
  const crossarmHeight = `${crossarmHeightFeet}' 0"`;
  
  // Calculate the height of the top insulator in feet (about 65% up the pole)
  const topInsulatorHeightFeet = Math.round(poleHeight * 0.65);
  const topInsulatorHeight = `${topInsulatorHeightFeet}' 0"`;
  
  const components: PoleComponent[] = [
    {
      id: poleId,
      name: 'Douglas Fir 45\' Class 2',
      type: 'pole',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#8B4513',
      specifications: {
        Species: "Douglas Fir",
        "Height (')": 45,
        Class: "2",
        "Pole Top Circumference (\")" : 24.9999994596,
        "Taper (in. dia. /ft)": 0.1265078038,
        "Poisson's Ratio": 0.3,
        "Modulus of Elasticity (lb/in²)": 2500000.0,
        "Density (lb/ft³)": 40,
        "Wall Thickness (\")": "SOLID",
        "Shape": "ROUND",
        "Material": "WOOD",
        "Maximum Allowable Stress (lb/in²)": 8000.0,
        "Maximum Allowable Groundline Moment (lbf)": null
      }
    },
    {
      id: crossarmId,
      name: 'Wood 8 Ft Crossarm',
      type: 'crossarm',
      position: [0, 8, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#8B4513',
      imperialHeight: crossarmHeight,
      imperialOffset: "0' 0\"",
      imperialDirection: 0,
      attachedTo: poleId,
      attachmentType: 'pole'
    },
    {
      id: insulator1Id,
      name: 'Insulator Left',
      type: 'insulator',
      position: [-2, 8, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#FFFFFF',
      attachedTo: crossarmId,
      attachmentType: 'crossarm',
      imperialHeight: "0' 0\"",
      imperialOffset: "-2' 0\"",
      imperialDirection: 270
    },
    {
      id: insulator2Id,
      name: 'Insulator Center',
      type: 'insulator',
      position: [0, 8.5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#FFFFFF',
      attachedTo: poleId,
      attachmentType: 'pole',
      imperialHeight: topInsulatorHeight,
      imperialOffset: "0' 6\"",
      imperialDirection: 0
    },
    {
      id: insulator3Id,
      name: 'Insulator Right',
      type: 'insulator',
      position: [2, 8, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#FFFFFF',
      attachedTo: crossarmId,
      attachmentType: 'crossarm',
      imperialHeight: "0' 0\"",
      imperialOffset: "2' 0\"",
      imperialDirection: 90
    },
  ];

  return {
    id: crypto.randomUUID(),
    name: 'Default Utility Pole',
    components,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const getComponentDefaults = (type: PoleComponent['type']): Partial<PoleComponent> => {
  // Default pole height
  const poleHeight = 45;
  // Calculate heights as percentages of the pole height
  const crossarmHeightFeet = Math.round(poleHeight * 0.6);
  const insulatorHeightFeet = Math.round(poleHeight * 0.65);
  const transformerHeightFeet = Math.round(poleHeight * 0.45);
  const hardwareHeightFeet = Math.round(poleHeight * 0.5);
  
  switch (type) {
    case 'pole':
      return {
        name: 'Douglas Fir 45\' Class 2',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: '#8B4513',
        specifications: {
          Species: "Douglas Fir",
          "Height (')": 45,
          Class: "2",
          "Pole Top Circumference (\")" : 24.9999994596,
          "Taper (in. dia. /ft)": 0.1265078038,
          "Poisson's Ratio": 0.3,
          "Modulus of Elasticity (lb/in²)": 2500000.0,
          "Density (lb/ft³)": 40,
          "Wall Thickness (\")": "SOLID",
          "Shape": "ROUND",
          "Material": "WOOD",
          "Maximum Allowable Stress (lb/in²)": 8000.0,
          "Maximum Allowable Groundline Moment (lbf)": null
        }
      };
    case 'crossarm':
      return {
        name: 'Crossarm',
        position: [0, 8, 0],
        rotation: [0, 0, 0],
        scale: [1, 0.2, 0.2],
        color: '#8B4513',
        imperialHeight: `${crossarmHeightFeet}' 0\"`,
        imperialOffset: "0' 0\"",
        imperialDirection: 0
      };
    case 'insulator':
      return {
        name: 'Insulator',
        position: [0, 8.5, 0],
        rotation: [0, 0, 0],
        scale: [0.3, 0.3, 0.3],
        color: '#FFFFFF',
        imperialHeight: `${insulatorHeightFeet}' 0\"`,
        imperialOffset: "0' 6\"",
        imperialDirection: 0
      };
    case 'transformer':
      return {
        name: 'Transformer',
        position: [0, 6, 1],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: '#808080',
        imperialHeight: `${transformerHeightFeet}' 0\"`,
        imperialOffset: "3' 0\"",
        imperialDirection: 0
      };
    case 'wire':
      return {
        name: 'Wire',
        position: [0, 8, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: '#000000',
        imperialHeight: `${crossarmHeightFeet}' 0\"`,
        imperialOffset: "0' 0\"",
        imperialDirection: 0
      };
    case 'hardware':
      return {
        name: 'Hardware',
        position: [0, 7, 0],
        rotation: [0, 0, 0],
        scale: [0.5, 0.5, 0.5],
        color: '#C0C0C0',
        imperialHeight: `${hardwareHeightFeet}' 0\"`,
        imperialOffset: "0' 0\"",
        imperialDirection: 0
      };
    case 'anchor':
      return {
        name: 'Anchor',
        position: [3, 0, 3],
        rotation: [0, 0, 0],
        scale: [0.5, 0.5, 0.5],
        color: '#A0A0A0',
        imperialHeight: "0' 0\"",
        imperialOffset: "4' 3\"",
        imperialDirection: 45
      };
    case 'cable':
      return {
        name: 'Cable',
        position: [0, 8, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: '#000000',
        imperialHeight: `${crossarmHeightFeet}' 0\"`,
        imperialOffset: "0' 0\"",
        imperialDirection: 0
      };
    case 'equipment':
      return {
        name: 'Equipment',
        position: [0, 6, 1],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: '#808080',
        imperialHeight: `${transformerHeightFeet}' 0\"`,
        imperialOffset: "3' 0\"",
        imperialDirection: 0
      };
    default:
      return {
        name: 'Component',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: '#CCCCCC',
        imperialHeight: "0' 0\"",
        imperialOffset: "0' 0\"",
        imperialDirection: 0
      };
  }
};

// Helper function to create a component from company data
export const createComponentFromData = (
  type: 'anchor' | 'cable' | 'crossarm' | 'equipment',
  dataId: string
): Partial<PoleComponent> | null => {
  const defaults = getComponentDefaults(type);
  return {
    ...defaults,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${dataId}`,
    dataSource: 'company',
    dataId: dataId
  };
};