import {
  AbstractMesh,
  Mesh,
  MeshBuilder,
  PhysicsImpostor,
  Scene,
  StandardMaterial,
  Tags,
  Vector3,
  WebXRControllerPhysics,
  WebXRDefaultExperience,
  WebXRInputSource,
  float,
} from "babylonjs";
import { Basketball } from "./basketball";
/**
 * Controller contains functions that can enable interactions that make use of VR controllers.
 *
 * @class Controller
 * @author Lim Min Ye
 */
export class Controller {
  /**
   * allowControllerGrab() allows the user to grab a virtual object using the VR controllers. The user must be
   * close enough to the virtual object in order to grab it.
   *
   * @param xr is the XR scene in which to enable to the grabbing interaction.
   */
  static allowControllerGrab(xr: WebXRDefaultExperience, scene: Scene) {
    let mesh: AbstractMesh;

    let liveBalls: Array<Mesh> = [];

    scene.onAfterRenderObservable.add(() => {
      liveBalls = liveBalls.filter((ball, i) => {
          const maxBalls = 10;
          if (liveBalls.length - maxBalls > i) {
              // out of bounds
              ball.dispose();
              return false;
          }
          return true;
      });
  });


    const newBalls = new Map<WebXRInputSource, Mesh>();

    // var sphere = MeshBuilder.CreateSphere("sphere1", {
    //   segments: 16,
    //   diameter: 0.3,
    // });
    // sphere.material = new StandardMaterial("basketball material", scene);
    // sphere.metadata = {};
    // sphere.metadata.value = false;
    // Tags.AddTagsTo(sphere, "basketball")

    //whenever controller is available, run the callback function
    xr.input.onControllerAddedObservable.add((controller) => {
      const linearVelocity = Vector3.Zero();
      const angularVelocity = Vector3.Zero();

      xr.baseExperience.sessionManager.onXRFrameObservable.add((xrFrame) => {
        const pose = xrFrame.getPose(
          controller.inputSource.targetRaySpace,
          xr.baseExperience.sessionManager.referenceSpace
        );

        const poseLV = pose.linearVelocity;
        if (poseLV) {
          const newLinearVelocity = new Vector3(poseLV.x, poseLV.y, -poseLV.z);

          // Exponential smoothing
          linearVelocity.addInPlace(
            newLinearVelocity.subtract(linearVelocity).scale(0.8)
          );
        }

        const poseAV = pose.angularVelocity;
        if (poseAV) {
          const newAngularVelocity = new Vector3(
            -poseAV.x,
            poseAV.y,
            -poseAV.z
          );
          angularVelocity.addInPlace(
            newAngularVelocity.subtract(angularVelocity).scale(0.8)
          );
        }
      });

      // when motion control is available, get the trigger
      controller.onMotionControllerInitObservable.add((motionController) => {
        // getting VR controller trigger
        const squeezeButton = motionController.getComponentOfType("squeeze");

        if (squeezeButton) {
          // whenever the state of the trigger changes, run callback function
          squeezeButton.onButtonStateChangedObservable.add(() => {
            if (squeezeButton.changes.pressed) {
              if (squeezeButton.pressed) {
                
                // SPAWN NEW BALL IN HAND
                // const newBall = MeshBuilder.CreateSphere("sphere1", {
                //   segments: 16,
                //   diameter: 0.3,
                // });
                // newBall.material = new StandardMaterial("basketball material", scene);
                // newBall.metadata = {};
                // newBall.metadata.value = false;
                // Tags.AddTagsTo(newBall, "basketball")

                // newBall.isVisible = true;
                // newBall.setParent(controller.grip);
                // newBall.position = new Vector3(0, 0, -0.1);
                // newBalls.set(controller, newBall);

                //GRAB OBJECT
                if (
                  (mesh = xr.pointerSelection.getMeshUnderPointer( //if there's anything on the pointer, assign to mesh
                    controller.uniqueId
                  ))
                ) {
                  console.log("mesh under controller pointer: " + mesh.name); // print to check the mesh we are pointing to
                  if (mesh.name !== "ground") { //exclude ground because we don't want to move the ground around
                    
                    if (mesh.name === "basketball") {
                      if (mesh.physicsImpostor) {
                        mesh.physicsImpostor.mass = 0;
                      }
                    }
                    
                    const distance = Vector3.Distance( //distance between motion controller and mesh (of the movable object)
                      motionController.rootMesh.getAbsolutePosition(),
                      mesh.getAbsolutePosition()
                    );
                    console.log("distance: " + distance);
                    if (distance < 1.0) { // if controller is close enough to the mesh, then "pick it up"
                      mesh.setParent(motionController.rootMesh);
                      console.log("grab mesh: " + mesh.name);
                    }
                  }
                }


              } else {
                const ball = newBalls.get(controller);

                if (ball) {
                  ball.setParent(null);

                  ball.physicsImpostor = new PhysicsImpostor(
                    ball,
                    PhysicsImpostor.SphereImpostor,
                    {
                      mass: 0.5,
                    }
                  );

                  const w = angularVelocity;
                  const v = linearVelocity.scale(7);

                  const r = new Vector3(0, 0, -0.1);
                  r.rotateByQuaternionToRef(
                    controller.grip.rotationQuaternion,
                    r
                  );

                  ball.physicsImpostor.setLinearVelocity(v.add(w.cross(r)));
                  ball.physicsImpostor.setAngularVelocity(w);

                  liveBalls.push(ball);
                }
              }
            }
          });
        }
      });
    });
  }

  // static getControllerVelocity(xr: WebXRDefaultExperience): float {
  //   xr.input.onControllerAddedObservable.add((controller) => {
  //     controller.onMotionControllerInitObservable.add((motionController) => {

  //       const controllerPhysics = new WebXRControllerPhysics(xr.baseExperience.sessionManager, {
  //         xrInput: xr.input
  //       })

  //       return controllerPhysics.getImpostorForController()
  //       //return motionController.rootMesh.physicsImpostor;
  //     });
  //   });
  // }
}
