import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { interleaveAttributes } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Debug
 */
const gui = new GUI();

/**
 * Scene, Renderer, Camera And Lighting
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Lighting Ambient
scene.add(new THREE.AmbientLight(0x404040));

/**
 * Plane
 */
const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(7.5, 7.5, 8, 8),
  new THREE.MeshBasicMaterial({
    color: 0xfffffff,
    side: THREE.DoubleSide,
    // wireframe: true,
  })
);

// adding to the scene
scene.add(planeMesh);

/**
 * Sizes and Camera
 */

// setting the sizes object to be used at various places
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// adding the camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, -5, 5);
scene.add(camera);

// --------------------------------------------------------------
const shapesGroup = new THREE.Group();
const extrudeGroup = new THREE.Group();
scene.add(shapesGroup);
scene.add(extrudeGroup);

// Variables for drawing
let lastCreatedShape = null;
let isDrawing = false;
let drawingPoints = [];
let currentLine = null;

// Function to enter draw mode
function enterDrawMode() {
  isDrawing = true;
  controls.enabled = false; // Disable orbit controls while drawing
  updateModeDisplay("Draw");
}

// Function to exit draw mode
function exitDrawMode() {
  isDrawing = false;
  controls.enabled = true; // Re-enable orbit controls
  drawingPoints = [];
  if (currentLine) {
    shapesGroup.remove(currentLine);
    currentLine = null;
  }
  updateModeDisplay("None");
}

// Function to add a point to the drawing
function addPoint(x, y) {
  const point = new THREE.Vector3(x, y, 0.01); // Slightly above the plane
  drawingPoints.push(point);
  // add red points while clicking
  const pointMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 8, 8),
    new THREE.MeshBasicMaterial({ color: "red" })
  );
  pointMesh.position.set(x, y, 0.01);
  scene.add(pointMesh);
}

// Function to update the drawing
// function updateDrawing() {
//   if (currentLine) {
//     shapesGroup.remove(currentLine);
//   }
//   const geometry = new THREE.BufferGeometry().setFromPoints(drawingPoints);
//   const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
//   currentLine = new THREE.Line(geometry, material);
//   shapesGroup.add(currentLine);
// }

// Function to complete the shape
// function completeShape() {
//   if (drawingPoints.length > 2) {
//     drawingPoints.push(drawingPoints[0]); // Close the shape
//     // updateDrawing();
//     const shapeGeometry = new THREE.BufferGeometry().setFromPoints(
//       drawingPoints
//     );
//     const shapeMaterial = new THREE.MeshBasicMaterial({
//       color: 0x00ff00,
//       side: THREE.DoubleSide,
//     });
//     const shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
//     shapesGroup.add(shapeMesh);
//   }
//   exitDrawMode();
// } *this function only creates triangles*
/**
 * the above implementation of shape function only creates triangles, not complex polygons
 * the below implementation would do the complex implementation
 */
function completeShape() {
  if (drawingPoints.length > 2) {
    const shape = new THREE.Shape();
    shape.moveTo(drawingPoints[0].x, drawingPoints[0].y);
    for (let i = 1; i < drawingPoints.length; i++) {
      shape.lineTo(drawingPoints[i].x, drawingPoints[i].y);
    }
    shape.closePath();

    const shapeGeometry = new THREE.ShapeGeometry(shape);
    const shapeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
    });
    const shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
    shapeMesh.position.z = 0.01; // Slight offset above the plane

    shapesGroup.add(shapeMesh);
    lastCreatedShape = shape;
  }
  exitDrawMode();
}

/**
 * Extrusion function
 */
function performExtrusion() {
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
    lastCreatedShape = null;
    updateModeDisplay("Extrude");
  } else {
    alert("Draw a shape first");
  }
}

// Event listeners for mouse interactions
canvas.addEventListener("click", (event) => {
  if (!isDrawing) return;

  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    const point = intersects[0].point;
    addPoint(point.x, point.y);
  }
});

canvas.addEventListener("dblclick", completeShape);
canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  if (isDrawing) {
    completeShape();
  }
});

/**
 * Mouse movements and object dragging
 */
let isDragging = false;
let selectedObject = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// event listeners for the functions
function enableDragObjects() {
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
}

// mouse movement down function
function onMouseDown(event) {
  event.preventDefault();

  // fetching the current co-ordinates of the mouse
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

// mouse move function
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

// mouse up function
function onMouseUp() {
  isDragging = false;
  selectedObject = null;
  controls.enabled = true;
}

enableDragObjects();

/**
 * Gui controls and buttons
 */
const drawingControls = {
  startDrawing: enterDrawMode,
  startExtrusion: performExtrusion,
  reloadSite: reloadSite,
};

gui.add(drawingControls, "startDrawing").name("Draw");
gui.add(drawingControls, "startExtrusion").name("Extrude");
gui.add(drawingControls, "reloadSite").name("Reset");

// --------------------------------------------------------------

/**
 * Renderer and orbital controls
 */

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// orbital controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Resizing event listener
 */
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * handling button modes and reseting
 */
function updateModeDisplay(mode) {
  const displayMode = document.getElementById("mode-display");
  displayMode.textContent = `Mode: ${mode}`;
}

// reloading/resetting
function reloadSite() {
  window.location.reload();
}

/**
 * Animation
 */
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

animate();
