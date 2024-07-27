import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { setupScene, scene, camera, renderer, planeMesh } from "./scene.js";
import { setupShapeDrawing, shapesGroup } from "./shapes.js";
import { setupExtrusion, extrudeGroup } from "./extrusion.js";
import { setupDragControls } from "./dragControls.js";
import { setupVertexEdit } from "./vertexEdit.js";
import { setupGUI } from "./gui.js";

const canvas = document.querySelector("canvas.webgl");

setupScene();
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

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
setupGUI(controls, vertexEditControls);

window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
