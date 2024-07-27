import * as THREE from "three";

export const scene = new THREE.Scene();
export let camera, renderer, planeMesh;

export function setupScene() {
  scene.add(new THREE.AmbientLight(0x404040));

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.set(0, -5, 5);
  scene.add(camera);

  const canvas = document.querySelector("canvas.webgl");
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(7.5, 7.5, 8, 8),
    new THREE.MeshBasicMaterial({
      color: 0xfffffff,
      side: THREE.DoubleSide,
    })
  );
  scene.add(planeMesh);
}
