import * as THREE from "three";
import { updateModeDisplay } from "./utils.js";
import { getLastCreatedShape } from "./shapes.js";

export const extrudeGroup = new THREE.Group();

export function setupExtrusion(scene) {
  scene.add(extrudeGroup);
}

export function performExtrusion() {
  const lastCreatedShape = getLastCreatedShape();
  if (lastCreatedShape) {
    const extrusionSettings = {
      steps: 1,
      depth: 0.5,
      bevelEnabled: false,
    };
    const extrudeGeometry = new THREE.ExtrudeGeometry(
      lastCreatedShape,
      extrusionSettings
    );
    const extrudeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0080ff,
      opacity: 0.75,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const extrudeMesh = new THREE.Mesh(extrudeGeometry, extrudeMaterial);
    extrudeMesh.position.z = 0.4;
    extrudeGroup.add(extrudeMesh);
    updateModeDisplay("Extrude");
  } else {
    alert("Draw a shape first");
  }
}
