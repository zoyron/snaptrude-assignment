// Import Three.js library and utility function
import * as THREE from "three";
import { updateModeDisplay } from "./utils.js";

// Create a group to hold all shapes
export const shapesGroup = new THREE.Group();

// State variables for drawing
let isDrawing = false;
let drawingPoints = [];
let currentLine = null;
let lastCreatedShape = null;
let controls;
let scene, planeMesh, camera;

// Function to set up shape drawing functionality
export function setupShapeDrawing(_scene, _planeMesh, _camera, orbitControls) {
  // Assign passed parameters to module-scoped variables
  scene = _scene;
  planeMesh = _planeMesh;
  camera = _camera;
  controls = orbitControls;

  // Add shapes group to the scene
  scene.add(shapesGroup);

  // Get canvas element and add event listeners
  const canvas = document.querySelector("canvas.webgl");
  canvas.addEventListener("click", onCanvasClick);
  canvas.addEventListener("dblclick", completeShape);
  canvas.addEventListener("contextmenu", onContextMenu);
}

// Function to handle canvas click event
function onCanvasClick(event) {
  if (!isDrawing) return;

  // Calculate mouse position in normalized device coordinates
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  // Use raycaster to detect intersection with the plane
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planeMesh);

  if (intersects.length > 0) {
    const point = intersects[0].point;
    addPoint(point.x, point.y);
  }
}

// Function to add a point to the drawing
function addPoint(x, y) {
  const point = new THREE.Vector3(x, y, 0.01);
  drawingPoints.push(point);

  // Create a visual representation of the point
  const pointMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 8, 8),
    new THREE.MeshBasicMaterial({ color: "red" })
  );
  pointMesh.position.set(x, y, 0.01);
  scene.add(pointMesh);
}

// Function to complete the shape
function completeShape() {
  if (drawingPoints.length > 2) {
    // Create a Three.js Shape from the drawing points
    const shape = new THREE.Shape();
    shape.moveTo(drawingPoints[0].x, drawingPoints[0].y);
    for (let i = 1; i < drawingPoints.length; i++) {
      shape.lineTo(drawingPoints[i].x, drawingPoints[i].y);
    }
    shape.closePath();

    // Create a mesh from the shape and add it to the scene
    const shapeGeometry = new THREE.ShapeGeometry(shape);
    const shapeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
    });
    const shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
    shapeMesh.position.z = 0.01;
    shapesGroup.add(shapeMesh);

    lastCreatedShape = shape;
  }
  exitDrawMode();
}

// Function to handle right-click (context menu) event
function onContextMenu(event) {
  event.preventDefault();
  if (isDrawing) {
    completeShape();
  }
}

// Function to enter draw mode
export function enterDrawMode() {
  isDrawing = true;
  if (controls) controls.enabled = false; // Disable orbit controls while drawing
  updateModeDisplay("Draw");
}

// Function to exit draw mode
export function exitDrawMode() {
  isDrawing = false;
  if (controls) controls.enabled = true; // Re-enable orbit controls
  drawingPoints = [];
  if (currentLine) {
    shapesGroup.remove(currentLine);
    currentLine = null;
  }
  updateModeDisplay("None");
}

// Function to get the last created shape
export function getLastCreatedShape() {
  return lastCreatedShape;
}
