import { ImperialMeasurement } from '../types';

/**
 * Converts a string in the format "X' Y\"" to an ImperialMeasurement object
 */
export const parseImperialMeasurement = (value: string): ImperialMeasurement => {
  // Handle empty or invalid values
  if (!value) {
    return { feet: 0, inches: 0 };
  }
  
  // Parse feet and inches from the string
  const feetMatch = value.match(/(\d+)'/);
  const inchesMatch = value.match(/(\d+)"/);
  
  const feet = feetMatch ? parseInt(feetMatch[1], 10) : 0;
  const inches = inchesMatch ? parseInt(inchesMatch[1], 10) : 0;
  
  return { feet, inches };
};

/**
 * Converts an ImperialMeasurement object to a string in the format "X' Y\""
 */
export const formatImperialMeasurement = (measurement: ImperialMeasurement): string => {
  if (!measurement) {
    return "0' 0\"";
  }
  
  return `${measurement.feet}' ${measurement.inches}"`;
};

/**
 * Converts an ImperialMeasurement to meters
 */
export const imperialToMeters = (measurement: ImperialMeasurement): number => {
  if (!measurement) {
    return 0;
  }
  
  // Convert feet to meters (1 foot = 0.3048 meters)
  // Convert inches to meters (1 inch = 0.0254 meters)
  return (measurement.feet * 0.3048) + (measurement.inches * 0.0254);
};

/**
 * Converts meters to an ImperialMeasurement
 */
export const metersToImperial = (meters: number): ImperialMeasurement => {
  if (meters === undefined || meters === null) {
    return { feet: 0, inches: 0 };
  }
  
  // Convert meters to feet (1 meter = 3.28084 feet)
  const totalFeet = meters * 3.28084;
  
  // Extract whole feet
  const feet = Math.floor(totalFeet);
  
  // Convert remaining fraction to inches (1 foot = 12 inches)
  const inches = Math.round((totalFeet - feet) * 12);
  
  // Handle case where inches rounds up to 12
  if (inches === 12) {
    return { feet: feet + 1, inches: 0 };
  }
  
  return { feet, inches };
};

/**
 * Converts a Y-coordinate in the 3D scene to an imperial height measurement
 */
export const yCoordToImperialHeight = (y: number): string => {
  const imperial = metersToImperial(y);
  return formatImperialMeasurement(imperial);
};

/**
 * Converts an imperial height measurement to a Y-coordinate in the 3D scene
 */
export const imperialHeightToYCoord = (height: string): number => {
  const imperial = parseImperialMeasurement(height);
  return imperialToMeters(imperial);
};

/**
 * Converts a distance in the 3D scene to an imperial measurement
 */
export const distanceToImperial = (distance: number): string => {
  const imperial = metersToImperial(distance);
  return formatImperialMeasurement(imperial);
};

/**
 * Converts an imperial measurement to a distance in the 3D scene
 */
export const imperialToDistance = (measurement: string): number => {
  const imperial = parseImperialMeasurement(measurement);
  return imperialToMeters(imperial);
};

/**
 * Calculates the X and Z coordinates based on angle and distance from center
 */
export const polarToCartesian = (angle: number, distance: number): [number, number] => {
  // Convert angle from degrees to radians
  const radians = (angle * Math.PI) / 180;
  
  // Calculate X and Z coordinates
  const x = Math.sin(radians) * distance;
  const z = Math.cos(radians) * distance;
  
  return [x, z];
};

/**
 * Calculates the angle and distance from center based on X and Z coordinates
 */
export const cartesianToPolar = (x: number, z: number): [number, number] => {
  // Calculate distance using Pythagorean theorem
  const distance = Math.sqrt(x * x + z * z);
  
  // Calculate angle in radians and convert to degrees
  let angle = Math.atan2(x, z) * (180 / Math.PI);
  
  // Ensure angle is between 0 and 359 degrees
  if (angle < 0) {
    angle += 360;
  }
  
  return [angle, distance];
};

/**
 * Formats a feet-only value to an imperial measurement string
 */
export const formatFeetOnly = (feet: number): string => {
  return `${feet}' 0"`;
};

/**
 * Formats an inches-only value to an imperial measurement string
 */
export const formatInchesOnly = (inches: number): string => {
  if (inches >= 12) {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}' ${remainingInches}"`;
  }
  return `0' ${inches}"`;
};