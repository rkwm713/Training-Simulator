import { create } from 'zustand';
import { PoleComponent, PoleConfiguration } from '../types';
import { generateDefaultPole } from '../utils/poleUtils';
import { 
  updateAttachedComponentPosition, 
  updateAttachedComponentRotation,
  findComponentById
} from '../utils/attachmentUtils';

interface PoleState {
  configurations: PoleConfiguration[];
  activeConfigId: string | null;
  selectedComponentId: string | null;
  
  // Actions
  addConfiguration: (name: string) => void;
  removeConfiguration: (id: string) => void;
  setActiveConfig: (id: string) => void;
  addComponent: (component: Omit<PoleComponent, 'id'>) => void;
  updateComponent: (id: string, updates: Partial<PoleComponent>) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  getActiveConfiguration: () => PoleConfiguration | null;
  getSelectedComponent: () => PoleComponent | null;
  getAllComponents: () => PoleComponent[];
}

const defaultPole = generateDefaultPole();

export const usePoleStore = create<PoleState>((set, get) => ({
  configurations: [defaultPole],
  activeConfigId: defaultPole.id,
  selectedComponentId: null,

  addConfiguration: (name) => {
    const newConfig: PoleConfiguration = {
      id: crypto.randomUUID(),
      name,
      components: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      configurations: [...state.configurations, newConfig],
      activeConfigId: newConfig.id,
    }));
  },

  removeConfiguration: (id) => {
    set((state) => {
      const newConfigs = state.configurations.filter(config => config.id !== id);
      
      // If we're removing the active configuration, set a new active one
      let newActiveId = state.activeConfigId;
      if (state.activeConfigId === id) {
        newActiveId = newConfigs.length > 0 ? newConfigs[0].id : null;
      }
      
      return {
        configurations: newConfigs,
        activeConfigId: newActiveId,
      };
    });
  },

  setActiveConfig: (id) => {
    set({ activeConfigId: id, selectedComponentId: null });
  },

  addComponent: (componentData) => {
    set((state) => {
      const activeConfig = state.configurations.find(c => c.id === state.activeConfigId);
      if (!activeConfig) return state;

      const newComponent: PoleComponent = {
        ...componentData,
        id: crypto.randomUUID(),
      };

      const updatedConfig = {
        ...activeConfig,
        components: [...activeConfig.components, newComponent],
        updatedAt: new Date(),
      };

      return {
        configurations: state.configurations.map(c => 
          c.id === state.activeConfigId ? updatedConfig : c
        ),
        selectedComponentId: newComponent.id,
      };
    });
  },

  updateComponent: (id, updates) => {
    set((state) => {
      const activeConfig = state.configurations.find(c => c.id === state.activeConfigId);
      if (!activeConfig) return state;

      // Find the component to update
      const componentToUpdate = activeConfig.components.find(c => c.id === id);
      if (!componentToUpdate) return state;

      // Create a merged component with updates
      const updatedComponent = { ...componentToUpdate, ...updates };
      
      // Skip update if nothing has changed to prevent infinite loops
      if (Object.keys(updates).length === 0 && 
          !updatedComponent.attachedTo) {
        return state;
      }
      
      // Process attachments only if this component is attached to something
      // and we're not explicitly setting position/rotation in the updates
      if (updatedComponent.attachedTo) {
        const attachedTo = findComponentById(activeConfig.components, updatedComponent.attachedTo);
        if (attachedTo) {
          // Only update position if we're not explicitly setting it in the updates
          if (!updates.position) {
            const newPosition = updateAttachedComponentPosition(updatedComponent, attachedTo);
            // Only update if position has actually changed
            if (!arraysEqual(updatedComponent.position, newPosition)) {
              updatedComponent.position = newPosition;
            }
          }
          
          // Only update rotation if we're not explicitly setting it in the updates
          if (!updates.rotation) {
            const newRotation = updateAttachedComponentRotation(updatedComponent, attachedTo);
            // Only update if rotation has actually changed
            if (!arraysEqual(updatedComponent.rotation, newRotation)) {
              updatedComponent.rotation = newRotation;
            }
          }
        }
      }

      const updatedComponents = activeConfig.components.map(component => 
        component.id === id ? updatedComponent : component
      );

      const updatedConfig = {
        ...activeConfig,
        components: updatedComponents,
        updatedAt: new Date(),
      };

      return {
        configurations: state.configurations.map(c => 
          c.id === state.activeConfigId ? updatedConfig : c
        ),
      };
    });
  },

  removeComponent: (id) => {
    set((state) => {
      const activeConfig = state.configurations.find(c => c.id === state.activeConfigId);
      if (!activeConfig) return state;

      // Check if any components are attached to this one
      const attachedComponents = activeConfig.components.filter(c => c.attachedTo === id);
      
      // Detach any components that were attached to this one
      let updatedComponents = activeConfig.components.map(c => {
        if (c.attachedTo === id) {
          return {
            ...c,
            attachedTo: undefined,
            attachmentType: undefined,
            attachmentHeight: undefined,
            attachmentAngle: undefined,
            attachmentOffset: undefined
          };
        }
        return c;
      });
      
      // Remove the component
      updatedComponents = updatedComponents.filter(c => c.id !== id);

      const updatedConfig = {
        ...activeConfig,
        components: updatedComponents,
        updatedAt: new Date(),
      };

      return {
        configurations: state.configurations.map(c => 
          c.id === state.activeConfigId ? updatedConfig : c
        ),
        selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
      };
    });
  },

  selectComponent: (id) => {
    set({ selectedComponentId: id });
  },

  getActiveConfiguration: () => {
    const { configurations, activeConfigId } = get();
    return configurations.find(c => c.id === activeConfigId) || null;
  },

  getSelectedComponent: () => {
    const { selectedComponentId } = get();
    const activeConfig = get().getActiveConfiguration();
    
    if (!activeConfig || !selectedComponentId) return null;
    
    return activeConfig.components.find(c => c.id === selectedComponentId) || null;
  },
  
  getAllComponents: () => {
    const activeConfig = get().getActiveConfiguration();
    return activeConfig ? activeConfig.components : [];
  },
}));

// Helper function to compare arrays (for position and rotation)
function arraysEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}