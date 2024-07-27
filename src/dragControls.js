import * as THREE from "three";

let isDragging = false;
let selectedObject = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let canvas, camera, planeMesh, extrudeGroup, controls;

export function setupDragControls(
  _canvas,
  _camera,
  _planeMesh,
  _extrudeGroup,
  _controls
) {
  canvas = _canvas;
  camera = _camera;
  planeMesh = _planeMesh;
  extrudeGroup = _extrudeGroup;
  controls = _controls;
}

function onMouseDown(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(extrudeGroup.children);
  if (intersects.length > 0) {
    isDragging = true;
    controls.enabled = false;
    selectedObject = intersects[0].object;
  }
}

function onMouseMove(event) {
  if (isDragging && selectedObject) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(planeMesh);
    if (intersects.length > 0) {
      selectedObject.position.x = intersects[0].point.x;
      selectedObject.position.y = intersects[0].point.y;
    }
  }
}

function onMouseUp() {
  isDragging = false;
  selectedObject = null;
  controls.enabled = true;
}

export function enableDragObjects() {
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
}

export function disableDragObjects() {
  canvas.removeEventListener("mousedown", onMouseDown);
  canvas.removeEventListener("mousemove", onMouseMove);
  canvas.removeEventListener("mouseup", onMouseUp);
}
