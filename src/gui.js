// Import the GUI library and necessary functions from other modules
import GUI from "lil-gui";
import { enterDrawMode } from "./shapes.js";
import { performExtrusion } from "./extrusion.js";
import { enableDragObjects, disableDragObjects } from "./dragControls.js";

// Function to set up the Graphical User Interface
export function setupGUI(controls, vertexEditControls) {
  // Create a new GUI instance
  const gui = new GUI();

  // Object containing all the drawing and editing controls
  const drawingControls = {
    startDrawing: enterDrawMode,
    startExtrusion: performExtrusion,
    reloadSite: () => window.location.reload(), // Reload the page to reset
    startVertexEdit: vertexEditControls.enableVertexEdit,
    stopVertexEdit: vertexEditControls.disableVertexEdit,
  };

  // Object for drag controls
  const dragControls = {
    enableDrag: false,
  };

  // Add drag control to GUI
  gui
    .add(dragControls, "enableDrag")
    .name("Move Object")
    .onChange((value) => {
      // Enable or disable drag controls based on the checkbox value
      if (value) {
        enableDragObjects();
      } else {
        disableDragObjects();
      }
    });

  // Add drawing controls to GUI
  gui.add(drawingControls, "startDrawing").name("Draw");
  gui.add(drawingControls, "startExtrusion").name("Extrude");
  gui.add(drawingControls, "reloadSite").name("Reset");
  gui.add(drawingControls, "startVertexEdit").name("Start Vertex Edit");
  gui.add(drawingControls, "stopVertexEdit").name("Stop Vertex Edit");

  // Return the GUI instance
  return gui;
}
