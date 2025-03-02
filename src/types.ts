export interface PoleComponent {
  id: string;
  name: string;
  type: 'pole' | 'crossarm' | 'insulator' | 'transformer' | 'wire' | 'hardware' | 'anchor' | 'cable' | 'equipment';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color?: string;
  model?: string;
  // Additional properties for company-specific components
  specifications?: Record<string, any>;
  dataSource?: string;
  dataId?: string;
  // Attachment properties
  attachedTo?: string; // ID of the component this is attached to
  attachmentType?: 'pole' | 'crossarm'; // Type of attachment
  attachmentHeight?: number; // Height position on the pole
  attachmentAngle?: number; // Angle around the pole (0-360 degrees)
  attachmentOffset?: number; // Distance from the attachment point
  // Imperial measurement properties
  imperialHeight?: string; // Height in feet and inches (e.g., "22' 6\"")
  imperialOffset?: string; // Offset in feet and inches
  imperialDirection?: number; // Direction in degrees (0-359)
}

export interface PoleConfiguration {
  id: string;
  name: string;
  components: PoleComponent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ImperialMeasurement {
  feet: number;
  inches: number;
}