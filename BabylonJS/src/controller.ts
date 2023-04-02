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
                // const newBall = MeshBuilder.CreateSphere("sphere1", {
                //   segments: 16,
                //   diameter: 0.3,
                // });
                // newBall.material = new StandardMaterial("basketball material", scene);
                // newBall.metadata = {};
                // newBall.metadata.value = false;
                // Tags.AddTagsTo(newBall, "basketball")

                const newBall = new Basketball(Vector3.Zero(), scene);

                newBall.mesh.isVisible = true;
                newBall.mesh.setParent(controller.grip);
                newBall.mesh.position = new Vector3(0, 0, -0.1);
                newBalls.set(controller, newBall.mesh);
              } else {
                const ball = newBalls.get(controller);

                if (ball) {
                  ball.setParent(null);

                  ball.physicsImpostor = new PhysicsImpostor(
                    ball,
                    PhysicsImpostor.SphereImpostor,
                    {
                      mass: 0.1,
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
