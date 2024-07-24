import * as THREE from "three";
import { SceneManager } from "./SceneManager.js";
import { DrawingManager } from "./DrawingManager.js";

const canvas = document.querySelector("canvas.webgl");
const sceneManager = new SceneManager(canvas);
const drawingManager = new DrawingManager(
  sceneManager.scene,
  sceneManager.camera,
  sceneManager.planeMesh,
  sceneManager.controls
);

const animate = () => {
  sceneManager.controls.update();
  sceneManager.renderer.render(sceneManager.scene, sceneManager.camera);
  window.requestAnimationFrame(animate);
};

animate();
