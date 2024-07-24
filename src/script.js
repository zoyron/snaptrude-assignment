import * as THREE from "three";
import { SceneManager } from "./SceneManager.js";

const canvas = document.querySelector("canvas.webgl");
const sceneManager = new SceneManager(canvas);

const animate = () => {
  sceneManager.controls.update();
  sceneManager.renderer.render(sceneManager.scene, sceneManager.camera);
  window.requestAnimationFrame(animate);
};

animate();
