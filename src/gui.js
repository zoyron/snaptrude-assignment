import GUI from "lil-gui";
import { enterDrawMode } from "./shapes.js";
import { performExtrusion } from "./extrusion.js";
import { enableDragObjects, disableDragObjects } from "./dragControls.js";

export function setupGUI(controls, vertexEditControls) {
  const gui = new GUI();

  const drawingControls = {
    startDrawing: enterDrawMode,
    startExtrusion: performExtrusion,
    reloadSite: () => window.location.reload(),
    startVertexEdit: vertexEditControls.enableVertexEdit,
    stopVertexEdit: vertexEditControls.disableVertexEdit,
  };

  const dragControls = {
    enableDrag: false,
  };

  gui
    .add(dragControls, "enableDrag")
    .name("Move Object")
    .onChange((value) => {
      if (value) {
        enableDragObjects();
      } else {
        disableDragObjects();
      }
    });

  gui.add(drawingControls, "startDrawing").name("Draw");
  gui.add(drawingControls, "startExtrusion").name("Extrude");
  gui.add(drawingControls, "reloadSite").name("Reset");
  gui.add(drawingControls, "startVertexEdit").name("Start Vertex Edit");
  gui.add(drawingControls, "stopVertexEdit").name("Stop Vertex Edit");

  return gui;
}
