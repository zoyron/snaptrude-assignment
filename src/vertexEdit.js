import * as THREE from "three";
import { updateModeDisplay } from "./utils.js";

// State variables for vertex editing
let isVertexEditing = false;
let selectedVertex = null;
const vertexHelpers = [];

// Tools for raycasting (detecting mouse interactions with 3D objects)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Variables to hold references to the 3D scene components
let scene, camera, planeMesh, extrudeGroup, controls;

// Function to set up vertex editing functionality
export function setupVertexEdit(
  _scene,
  _camera,
  _planeMesh,
  _extrudeGroup,
  _controls
) {
  // Assign passed parameters to module-scoped variables
  scene = _scene;
  camera = _camera;
  planeMesh = _planeMesh;
  extrudeGroup = _extrudeGroup;
  controls = _controls;

  const canvas = document.querySelector("canvas.webgl");

  // Function to handle mouse down event during vertex editing
  function onVertexEditMouseDown(event) {
    event.preventDefault();
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // Set up raycaster from camera through mouse position
    raycaster.setFromCamera(mouse, camera);
    // Check for intersections with vertex helpers
    const intersects = raycaster.intersectObjects(vertexHelpers);
    if (intersects.length > 0) {
      selectedVertex = intersects[0].object;
    }
  }

  // Function to handle mouse move event during vertex editing
  function onVertexEditMouseMove(event) {
    if (selectedVertex) {
      // Calculate new mouse position
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      // Check for intersection with the plane
      const intersects = raycaster.intersectObject(planeMesh);
      if (intersects.length > 0) {
        // Update selected vertex position
        selectedVertex.position.x = intersects[0].point.x;
        selectedVertex.position.y = intersects[0].point.y;
        // Update the geometry of the extruded object
        updateExtrudedObjectGeometry(selectedVertex);
      }
    }
  }

  // Function to handle mouse up event during vertex editing
  function onVertexEditMouseUp() {
    selectedVertex = null;
  }

  // Function to create visual helpers for each vertex
  function createVertexHelpers() {
    removeVertexHelpers();
    extrudeGroup.children.forEach((object) => {
      const geometry = object.geometry;
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        // Create a small sphere for each vertex
        const vertexGeometry = new THREE.SphereGeometry(0.05, 32, 32);
        const vertexMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const vertexHelper = new THREE.Mesh(vertexGeometry, vertexMaterial);
        // Position the helper at the vertex position
        vertexHelper.position.set(
          positions[i] + object.position.x,
          positions[i + 1] + object.position.y,
          positions[i + 2] + object.position.z
        );
        // Store metadata about the vertex
        vertexHelper.userData.index = i;
        vertexHelper.userData.parent = object;
        scene.add(vertexHelper);
        vertexHelpers.push(vertexHelper);
      }
    });
  }

  // Function to remove all vertex helpers from the scene
  function removeVertexHelpers() {
    vertexHelpers.forEach((helper) => scene.remove(helper));
    vertexHelpers.length = 0;
  }

  // Function to update the geometry of the extruded object when a vertex is moved
  function updateExtrudedObjectGeometry(vertexHelper) {
    const object = vertexHelper.userData.parent;
    const geometry = object.geometry;
    const positions = geometry.attributes.position.array;
    const index = vertexHelper.userData.index;
    // Update the position in the geometry
    positions[index] = vertexHelper.position.x - object.position.x;
    positions[index + 1] = vertexHelper.position.y - object.position.y;
    // Mark the position attribute as needing an update
    geometry.attributes.position.needsUpdate = true;
    // Recompute normals and bounding sphere for correct rendering and interactions
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
  }

  // Return an object with methods to enable and disable vertex editing
  return {
    enableVertexEdit: () => {
      isVertexEditing = true;
      if (controls) controls.enabled = false; // Disable orbit controls
      createVertexHelpers();
      // Add event listeners for vertex editing
      canvas.addEventListener("mousedown", onVertexEditMouseDown);
      canvas.addEventListener("mousemove", onVertexEditMouseMove);
      canvas.addEventListener("mouseup", onVertexEditMouseUp);
      updateModeDisplay("Vertex Edit");
    },
    disableVertexEdit: () => {
      isVertexEditing = false;
      if (controls) controls.enabled = true; // Re-enable orbit controls
      removeVertexHelpers();
      // Remove event listeners for vertex editing
      canvas.removeEventListener("mousedown", onVertexEditMouseDown);
      canvas.removeEventListener("mousemove", onVertexEditMouseMove);
      canvas.removeEventListener("mouseup", onVertexEditMouseUp);
      updateModeDisplay("None");
    },
  };
}
