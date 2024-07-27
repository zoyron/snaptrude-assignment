// Import Three.js library
import * as THREE from "three";

// Create a new Three.js scene
export const scene = new THREE.Scene();

// Declare variables for camera, renderer, and plane mesh
export let camera, renderer, planeMesh;

// Function to set up the Three.js scene
export function setupScene() {
  // Add ambient light to the scene for basic illumination
  scene.add(new THREE.AmbientLight(0x404040));

  // Define sizes for the renderer, matching the window dimensions
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Create a perspective camera
  camera = new THREE.PerspectiveCamera(
    75, // Field of view
    sizes.width / sizes.height, // Aspect ratio
    0.1, // Near plane
    100 // Far plane
  );
  // Position the camera
  camera.position.set(0, -5, 5);
  // Add the camera to the scene
  scene.add(camera);

  // Get the canvas element from the DOM
  const canvas = document.querySelector("canvas.webgl");

  // Create a WebGL renderer
  renderer = new THREE.WebGLRenderer({ canvas });
  // Set the size of the renderer
  renderer.setSize(sizes.width, sizes.height);
  // Set the pixel ratio for better rendering on high DPI displays
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create a plane mesh to serve as a drawing surface
  planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(7.5, 7.5, 8, 8), // Geometry
    new THREE.MeshBasicMaterial({
      color: 0xfffffff, // White color
      side: THREE.DoubleSide, // Render both sides
    })
  );
  // Add the plane mesh to the scene
  scene.add(planeMesh);
}
