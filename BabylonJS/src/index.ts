/**
 * index.ts serves as the starting point of the WebXR application.
 *
 * @summary Starting point of application.
 * @author Lim Min Ye <2001477@sit.singaporetech.edu.sg>
 */

// importing required dependencies
import { Engine } from "babylonjs";
import { App } from "./app";

// init a new BabylonJS scene
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true);
const app = new App(engine, canvas);
const scenePromise = app.createXRScene("renderCanvas", {});

// all instructions here will be called every frame, kind of like update()
scenePromise.then((scene) => {
  engine.runRenderLoop(() => {
    scene.render();
  });
});

// resizes the window (when inspector is opened)
window.addEventListener("resize", () => {
  engine.resize();
});
