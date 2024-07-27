// Import necessary Three.js modules and custom modules
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { setupScene, scene, camera, renderer, planeMesh } from "./scene.js";
import { setupShapeDrawing, shapesGroup } from "./shapes.js";
import { setupExtrusion, extrudeGroup } from "./extrusion.js";
import { setupDragControls } from "./dragControls.js";
import { setupVertexEdit } from "./vertexEdit.js";
import { setupGUI } from "./gui.js";

// Get the canvas element from the DOM
const canvas = document.querySelector("canvas.webgl");

// Set up the Three.js scene, camera, renderer, and plane
setupScene();

// Create OrbitControls for camera manipulation
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Add smooth damping to controls

// Set up various functionalities of the application
setupShapeDrawing(scene, planeMesh, camera, controls);
setupExtrusion(scene);
setupDragControls(canvas, camera, planeMesh, extrudeGroup, controls);
const vertexEditControls = setupVertexEdit(
  scene,
  camera,
  planeMesh,
  extrudeGroup,
  controls
);

// Set up the GUI with necessary controls
setupGUI(controls, vertexEditControls);

// Add event listener for window resize
window.addEventListener("resize", onWindowResize);

// Function to handle window resizing
function onWindowResize() {
  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  // Resize renderer to match new window size
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
  // Request the next frame
  requestAnimationFrame(animate);
  // Update controls in each frame for smooth interaction
  controls.update();
  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
