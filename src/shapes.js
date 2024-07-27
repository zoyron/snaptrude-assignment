import * as THREE from "three";
import { updateModeDisplay } from "./utils.js";

export const shapesGroup = new THREE.Group();
let isDrawing = false;
let drawingPoints = [];
let currentLine = null;
let lastCreatedShape = null;
let controls;
let scene, planeMesh, camera;

export function setupShapeDrawing(_scene, _planeMesh, _camera, orbitControls) {
  scene = _scene;
  planeMesh = _planeMesh;
  camera = _camera;
  controls = orbitControls;
  scene.add(shapesGroup);

  const canvas = document.querySelector("canvas.webgl");
  canvas.addEventListener("click", onCanvasClick);
  canvas.addEventListener("dblclick", completeShape);
  canvas.addEventListener("contextmenu", onContextMenu);
}

function onCanvasClick(event) {
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
}

function addPoint(x, y) {
  const point = new THREE.Vector3(x, y, 0.01);
  drawingPoints.push(point);
  const pointMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 8, 8),
    new THREE.MeshBasicMaterial({ color: "red" })
  );
  pointMesh.position.set(x, y, 0.01);
  scene.add(pointMesh);
}

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
    shapeMesh.position.z = 0.01;

    shapesGroup.add(shapeMesh);
    lastCreatedShape = shape;
  }
  exitDrawMode();
}

function onContextMenu(event) {
  event.preventDefault();
  if (isDrawing) {
    completeShape();
  }
}

export function enterDrawMode() {
  isDrawing = true;
  if (controls) controls.enabled = false;
  updateModeDisplay("Draw");
}

export function exitDrawMode() {
  isDrawing = false;
  if (controls) controls.enabled = true;
  drawingPoints = [];
  if (currentLine) {
    shapesGroup.remove(currentLine);
    currentLine = null;
  }
  updateModeDisplay("None");
}

export function getLastCreatedShape() {
  return lastCreatedShape;
}
