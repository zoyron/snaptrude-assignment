import * as THREE from "three";
import { updateModeDisplay } from "./utils.js";

let isVertexEditing = false;
let selectedVertex = null;
const vertexHelpers = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let scene, camera, planeMesh, extrudeGroup, controls;

export function setupVertexEdit(
  _scene,
  _camera,
  _planeMesh,
  _extrudeGroup,
  _controls
) {
  scene = _scene;
  camera = _camera;
  planeMesh = _planeMesh;
  extrudeGroup = _extrudeGroup;
  controls = _controls;

  const canvas = document.querySelector("canvas.webgl");

  function onVertexEditMouseDown(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(vertexHelpers);

    if (intersects.length > 0) {
      selectedVertex = intersects[0].object;
    }
  }

  function onVertexEditMouseMove(event) {
    if (selectedVertex) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(planeMesh);

      if (intersects.length > 0) {
        selectedVertex.position.x = intersects[0].point.x;
        selectedVertex.position.y = intersects[0].point.y;
        updateExtrudedObjectGeometry(selectedVertex);
      }
    }
  }

  function onVertexEditMouseUp() {
    selectedVertex = null;
  }

  function createVertexHelpers() {
    removeVertexHelpers();
    extrudeGroup.children.forEach((object) => {
      const geometry = object.geometry;
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const vertexGeometry = new THREE.SphereGeometry(0.05, 32, 32);
        const vertexMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const vertexHelper = new THREE.Mesh(vertexGeometry, vertexMaterial);
        vertexHelper.position.set(
          positions[i] + object.position.x,
          positions[i + 1] + object.position.y,
          positions[i + 2] + object.position.z
        );
        vertexHelper.userData.index = i;
        vertexHelper.userData.parent = object;
        scene.add(vertexHelper);
        vertexHelpers.push(vertexHelper);
      }
    });
  }

  function removeVertexHelpers() {
    vertexHelpers.forEach((helper) => scene.remove(helper));
    vertexHelpers.length = 0;
  }

  function updateExtrudedObjectGeometry(vertexHelper) {
    const object = vertexHelper.userData.parent;
    const geometry = object.geometry;
    const positions = geometry.attributes.position.array;
    const index = vertexHelper.userData.index;

    positions[index] = vertexHelper.position.x - object.position.x;
    positions[index + 1] = vertexHelper.position.y - object.position.y;

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
  }

  return {
    enableVertexEdit: () => {
      isVertexEditing = true;
      if (controls) controls.enabled = false;
      createVertexHelpers();
      canvas.addEventListener("mousedown", onVertexEditMouseDown);
      canvas.addEventListener("mousemove", onVertexEditMouseMove);
      canvas.addEventListener("mouseup", onVertexEditMouseUp);
      updateModeDisplay("Vertex Edit");
    },
    disableVertexEdit: () => {
      isVertexEditing = false;
      if (controls) controls.enabled = true;
      removeVertexHelpers();
      canvas.removeEventListener("mousedown", onVertexEditMouseDown);
      canvas.removeEventListener("mousemove", onVertexEditMouseMove);
      canvas.removeEventListener("mouseup", onVertexEditMouseUp);
      updateModeDisplay("None");
    },
  };
}
