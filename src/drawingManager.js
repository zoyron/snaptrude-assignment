import * as THREE from "three";

export class DrawingManager {
  constructor(scene, camera, planeMesh, controls, canvas) {
    this.scene = scene;
    this.camera = camera;
    this.planeMesh = planeMesh;
    this.controls = controls;
    this.canvas = canvas; // Add this line
    this.shapesGroup = new THREE.Group();
    this.scene.add(this.shapesGroup);
    this.isDrawing = false;
    this.drawingPoints = [];
    this.setupEventListeners();
  }

  /**
   * draw modes - enter and exit
   */

  // Draw mode enter code
  enterDrawMode() {
    this.isDrawing = true;
    this.controls.enabled = false;
  }

  // Draw mode exit code
  exitDrawMode() {
    this.isDrawing = false;
    this.controls.enabled = true;
    this.drawingPoints = [];
  }

  /**
   * Shapes and points
   */

  // adding points function
  addPoint(x, y) {
    const point = new THREE.Vector3(x, y, 0.01); // 0.01 on z-axis to avoid z-fighting
    this.drawingPoints.push(point);
  }

  // completing the shape
  completeShape() {
    if (this.drawingPoints.length > 2) {
      // defining the shape
      const shape = new THREE.Shape();
      shape.moveTo(this.drawingPoints[0].x, this.drawingPoints[0].y);
      for (let i = 1; i < this.drawingPoints.length; i++) {
        shape.lineTo(this.drawingPoints[i].x, this.drawingPoints[i].y);
      }
      shape.closePath();

      // creating the geometry of the newly defined shape
      const shapeGeometry = new THREE.ShapeGeometry(shape);
      const shapeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide,
      });
      const shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
      shapeMesh.position.z = 0.01;
      this.shapesGroup.add(shapeMesh);
    }
  }

  /**
   * setting up event listeners
   */

  setupEventListeners() {
    this.canvas.addEventListener("click", (event) => {
      if (!this.isDrawing) return;

      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);

      const intersects = raycaster.intersectObject(this.planeMesh);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        addPoint(point.x, point.y);
      }
    });

    this.canvas.addEventListener("dblclick", this.completeShape);
    this.canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      if (isDrawing) {
        completeShape();
      }
    });
  }
}
