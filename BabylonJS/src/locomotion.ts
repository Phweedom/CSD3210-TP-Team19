import {
  WebXRDefaultExperience,
  WebXRFeaturesManager,
  Mesh,
  Scene,
  WebXRFeatureName,
  WebXRMotionControllerTeleportation,
  TransformNode,
} from "babylonjs";

/**
 * MovementMode is used to represent the different modes of movement in the application.
 *
 * @enum MovementMode
 * @author Lim Min Ye
 */
export enum MovementMode {
  Teleportation,
  Controller,
  Walk,
}

/**
 * Locomotion contains functions to enable different forms of movement in the application.
 *
 * @class Locomotion
 * @author Lim Min Ye
 */
export class Locomotion {
  /**
   * initLocomotion() initializes featureManager's enableFeature() function to allow for different
   * forms of movement, depending on the movement parameter.
   *
   * @param movement is the mode of movement (e.g. Teleportation, walking on the spot, controller movement).
   * @param xr is the XR session.
   * @param featureManager is responsible for enabling or disabling features for an XR session.
   * @param ground acts as the floor to move around on.
   * @param scene is the scene to allow movement for.
   */
  static initLocomotion(
    movement: MovementMode,
    xr: WebXRDefaultExperience,
    featureManager: WebXRFeaturesManager,
    ground: Mesh,
    scene: Scene
  ) {
    switch (movement) {
      case MovementMode.Teleportation:
        console.log("movement mode: teleportation");
        const teleportation = featureManager.enableFeature(
          WebXRFeatureName.TELEPORTATION,
          "stable", //stable version
          {
            xrInput: xr.input, //source of input
            floorMeshes: [ground], // use ground as the floor
            timeToTeleport: 2000, // wait 2 seconds before teleportation
            useMainComponentOnly: true, // use controller trigger
            defaultTargetMeshOptions: {
              // customize the target marker
              teleportationFillColor: "#55FF99",
              teleportationBorderColor: "blue",
              torusArrowMaterial: ground.material,
            },
          },
          true,
          true
        ) as WebXRMotionControllerTeleportation;
        teleportation.parabolicRayEnabled = true;
        teleportation.parabolicCheckRadius = 2;
        break;

      case MovementMode.Controller:
        console.log("movement mode: controller");
        featureManager.disableFeature(WebXRFeatureName.TELEPORTATION);
        featureManager.enableFeature(WebXRFeatureName.MOVEMENT, "latest", {
          xrInput: xr.input,
        });
        break;

      case MovementMode.Walk:
        console.log("movement mode: walk");
        featureManager.disableFeature(WebXRFeatureName.TELEPORTATION);
        const xrRoot = new TransformNode("xr root", scene);
        xr.baseExperience.camera.parent = xrRoot;
        featureManager.enableFeature(
          WebXRFeatureName.WALKING_LOCOMOTION,
          "latest",
          {
            locomotionTarget: xrRoot,
          }
        );
        break;
    }
  }
}
