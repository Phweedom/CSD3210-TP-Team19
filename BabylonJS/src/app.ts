import { ActionManager, AmmoJSPlugin, CannonJSPlugin, Engine, MeshBuilder, PhysicsImpostor, Scene, Sound, StandardMaterial, Tags, Texture, Vector3, WebXRFeatureName } from "babylonjs";
import "babylonjs-loaders";
import { Util } from "./util";
import { MovementMode, Locomotion } from "./locomotion";
import { Controller } from "./controller";
import { Environment } from "./environment";
import * as CANNON from "cannon";
import { Basketball } from "./basketball";

/**
 * App contains members and method that are needed to launch a
 * standalone web app.
 *
 * @class App
 * @author Lim Min Ye
 */
export class App {
  // Engine manages the rendering of 3D scenes to a canvas.
  private engine: Engine;

  // HTMLCanvasElement allows for programmatically created images in the browser.
  private canvas: HTMLCanvasElement;

  // Sound can be used to define a sound (song, bgm, sfx, etc) that can be played in the application.
  sound: Sound;
  
  /**
   * Constructor.
   *
   * @param engine is Babylonjs' 3D graphics engine
   * @param canvas is the interface that provides properties and methods
   *               for manipulating the layout and presentation of canvas
   *               elements.
   */
  constructor(engine: Engine, canvas: HTMLCanvasElement) {
    this.engine = engine;
    this.canvas = canvas;
    // this.world = world;
    console.log("app is running");
  }

  /**
   * This function renders the interactive AR/VR scene when the user clicks the "XR Format" button
   * in the XRAuthor interface.
   *
   * @param canvasID is the string ID of the HTMLCanvasElement target to render the scene into
   * @param authoringData is a dict of dicts that contains various information from other XRAuthor
   *                      components, e.g., dicts of recordingData, editingData, etc.
   */
  async createXRScene(
    canvasID: string,
    authoringData: { [dataType: string]: { [key: string]: any } }
  ) {
    // define a new scene
    const scene = new Scene(this.engine);

    // enable physics in this scene
    scene.enablePhysics(new Vector3(0, -9.82, 0), new CannonJSPlugin(true, 10, CANNON));
    //scene.enablePhysics(new Vector3(0, -9.82, 0), new AmmoJSPlugin());

    // building the environment //////////////////////////////////////////////////////////////////
    // create cameras and lights (either use default or create your own)
    scene.createDefaultCameraOrLight(false, true, true);
    scene.activeCamera.position = new Vector3(0, 2, 0);
    //Util.createCamera(scene, this.canvas);
    //Util.createLights(scene);


    // create ground
    const ground = Util.createGround(50, 50, 0.5, new Vector3(0, 0.4, 0), scene);

    // build the game environment
    //Environment.buildGameEnvironment(scene);
    const environment = new Environment(scene);

    // temporary ball
    var sphere = MeshBuilder.CreateSphere("basketball", {
      segments: 16,
      diameter: 0.3,
    });
    sphere.position = new Vector3(0, 8, 5.8);
    sphere.material = new StandardMaterial("basketball material", scene);
    const texture = new Texture("assets/textures/basketball.png", scene);
    const basketballMaterial = sphere.material as StandardMaterial;
    basketballMaterial.diffuseTexture = texture;
    sphere.material = basketballMaterial;  

    sphere.metadata = {};
    sphere.metadata.value = false;
    Tags.AddTagsTo(sphere, "basketball")

    sphere.physicsImpostor = new PhysicsImpostor(
      sphere,
      PhysicsImpostor.SphereImpostor,
      {
        mass: 2.0,
                friction: 0,
                restitution: 0.8,
      }
    );

    //////////////////////////////////////////////////////////////////////////////////////////////



    // other tools ///////////////////////////////////////////////////////////////////////////////
    // actionManager will manage all events to be triggered in this scene (e.g. by key press)
    scene.actionManager = new ActionManager(scene);

    // allow the inspector to be toggled
    Util.addInspectorKeyboardShortcut(scene);

    // print the name of the clicked mesh (for debugging)
    Util.printMeshName(this.canvas, scene);

    // toggle transform gizmos using Q, W, E, R
    Util.addToggles(scene);
    //////////////////////////////////////////////////////////////////////////////////////////////




    // 'await' keyword is used here because we want to wait for the XR
    // experience to be fully initialized before returning the scene.
    // 'await' will pause createXRScene until createDefaultXRExperienceAsync
    // returns a Promise.
    // If 'await' is not used, the XR scene may not be properly initialized before
    // the of this function, and XR mode may not work as intended.
    const xr = await scene.createDefaultXRExperienceAsync({
      uiOptions: {
        sessionMode: "immersive-vr",
        //sessionMode: 'immersive-ar'
      },
      optionalFeatures: true,
    });

    // only for debugging
    (window as any).xr = xr;

    // snap xr camera to desired height (so that camera doesn't go down to ground level after teleportation)
    xr.baseExperience.sessionManager.onXRFrameObservable.add(() => {
      //xr.baseExperience.camera.position.y = 20;
      //xr.baseExperience.camera.position.y = 1;
    });

    xr.baseExperience.camera.position.y = 2;



    
    // locomotion
    const featureManager = xr.baseExperience.featuresManager;
    const movement = MovementMode.Teleportation;
    //const movement = MovementMode.Controller;
    Locomotion.initLocomotion(movement, xr, featureManager, ground, scene);

    

    // featureManager.enableFeature(WebXRFeatureName.PHYSICS_CONTROLLERS, "latest", {
    //   xrInput: xr.input,
    //   jointMeshes: {
    //     enablePhysics: true,
    //     physicsProps: {
    //       imposterType: PhysicsImpostor.BoxImpostor,
    //       friction: 0.0,
    //       resitution: 0.0
    //     }
    //   }
    // });

    // allow grabbing interaction using VR controllers
    Controller.allowControllerGrab(xr, scene);

    return scene;
  }
}