import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Debug
 */
const gui = new GUI();

/**
 * Scene, Renderer, Camera
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Plane
 */
const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5, 8, 8),
  new THREE.MeshBasicMaterial({
    color: "red",
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
camera.position.set(0, -4, 4);
scene.add(camera);

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
 * Animation
 */
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

animate();
