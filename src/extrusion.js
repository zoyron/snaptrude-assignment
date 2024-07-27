// Import Three.js library and necessary functions from other modules
import * as THREE from "three";
import { updateModeDisplay } from "./utils.js";
import { getLastCreatedShape } from "./shapes.js";

// Create a group to hold all extruded shapes
export const extrudeGroup = new THREE.Group();

// Function to set up extrusion in the scene
export function setupExtrusion(scene) {
  // Add the extrude group to the scene
  scene.add(extrudeGroup);
}

// Function to perform extrusion on the last created shape
export function performExtrusion() {
  // Get the last created 2D shape
  const lastCreatedShape = getLastCreatedShape();

  if (lastCreatedShape) {
    // Define extrusion settings
    const extrusionSettings = {
      steps: 1, // Number of points used for subdividing segments
      depth: 0.5, // Depth of the extrusion
      bevelEnabled: false, // No bevel for simplicity
    };

    // Create extruded geometry from the 2D shape
    const extrudeGeometry = new THREE.ExtrudeGeometry(
      lastCreatedShape,
      extrusionSettings
    );

    // Create material for the extruded shape
    const extrudeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0080ff, // Blue color
      opacity: 0.75, // Slight transparency
      side: THREE.DoubleSide, // Render both sides of the geometry
      transparent: true, // Enable transparency
    });

    // Create mesh from geometry and material
    const extrudeMesh = new THREE.Mesh(extrudeGeometry, extrudeMaterial);

    // Raise the extruded shape slightly above the plane
    extrudeMesh.position.z = 0.4;

    // Add the extruded mesh to the extrude group
    extrudeGroup.add(extrudeMesh);

    // Update the display mode
    updateModeDisplay("Extrude");
  } else {
    // Alert the user if no shape has been drawn
    alert("Draw a shape first");
  }
}
