// Import Three.js library
import * as THREE from "three";

// State variables for drag controls
let isDragging = false;
let selectedObject = null;

// Create raycaster and mouse vector for intersection detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Variables to store references to necessary objects
let canvas, camera, planeMesh, extrudeGroup, controls;

// Function to set up drag controls
export function setupDragControls(
  _canvas,
  _camera,
  _planeMesh,
  _extrudeGroup,
  _controls
) {
  // Assign passed parameters to module-scoped variables
  canvas = _canvas;
  camera = _camera;
  planeMesh = _planeMesh;
  extrudeGroup = _extrudeGroup;
  controls = _controls;
}

// Function to handle mouse down event
function onMouseDown(event) {
  event.preventDefault();

  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Set up raycaster from camera through mouse position
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections with extruded objects
  const intersects = raycaster.intersectObjects(extrudeGroup.children);
  if (intersects.length > 0) {
    isDragging = true;
    controls.enabled = false; // Disable orbit controls while dragging
    selectedObject = intersects[0].object;
  }
}

// Function to handle mouse move event
function onMouseMove(event) {
  if (isDragging && selectedObject) {
    // Update mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check for intersection with the plane
    const intersects = raycaster.intersectObject(planeMesh);
    if (intersects.length > 0) {
      // Update selected object's position
      selectedObject.position.x = intersects[0].point.x;
      selectedObject.position.y = intersects[0].point.y;
    }
  }
}

// Function to handle mouse up event
function onMouseUp() {
  isDragging = false;
  selectedObject = null;
  controls.enabled = true; // Re-enable orbit controls
}

// Function to enable drag controls
export function enableDragObjects() {
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
}

// Function to disable drag controls
export function disableDragObjects() {
  canvas.removeEventListener("mousedown", onMouseDown);
  canvas.removeEventListener("mousemove", onMouseMove);
  canvas.removeEventListener("mouseup", onMouseUp);
}
