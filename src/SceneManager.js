import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.setupCamera();
    this.setupRenderer();
    this.setupPlane();
    this.handleResize();
    this.setupControls();
  }

  /**
   * Sizes and Camera
   */
  setupCamera() {
    // setting the sizes object to be used at various places
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // adding the camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.camera.position.set(0, -4, 4);
    this.scene.add(this.camera);
  }

  /**
   * renderer
   */
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /**
   * Plane
   */
  setupPlane() {
    this.planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 5, 7.5),
      new THREE.MeshBasicMaterial({ color: "#ffffff", side: THREE.DoubleSide })
    );
    this.scene.add(this.planeMesh);
    this.camera.lookAt(this.planeMesh.position);
  }

  /**
   * orbital controls
   */
  setupControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }

  /**
   * handling resizes
   */
  handleResize() {
    window.addEventListener("resize", () => {
      // updating the sizes object
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      // updating the camera settings
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();

      // recaliberating the renderer
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }
}
