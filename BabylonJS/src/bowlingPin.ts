import {
  Mesh,
  MeshBuilder,
  Observable,
  PhysicsImpostor,
  Scene,
  SceneLoader,
  StandardMaterial,
  Tags,
  Texture,
  Vector3,
} from "babylonjs";
import { TextBlock } from "babylonjs-gui";
import { MyObservables } from "./myObservables";

export class BowlingPin {
  mesh: Mesh;
  dirty: Boolean;
  onFallObservable: Observable<boolean>
  constructor(position: Vector3, scaleFactor: number, scoreTextblock: TextBlock, scene: Scene) {
    // SceneLoader.ImportMeshAsync("", "assets/models/", "bowling_pin.glb", scene).then(
    //     (result) => {
    //       const root = result.meshes[0];
    //       root.id = "bowling_pin.glb";
    //       root.name = "bowling_pin.glb";
    //       root.position = position;
    //       root.scaling.scaleInPlace(scaleFactor);

    //       root.physicsImpostor = new PhysicsImpostor(root, PhysicsImpostor.CylinderImpostor, {
    //         mass: 0.1,
    //         friction: 1,
    //         restitution: 1
    //       })

    //       console.log("bowling pin loaded at " + root.position);
    //     }
    //   );

    // const data = SceneLoader.ImportMeshAsync("", "assets/models/", "bowling_pin.glb", scene).then(
    //     (result) => {
    //       const root = result.meshes[0];
    //       root.id = "bowling_pin.glb";
    //       root.name = "bowling_pin.glb";
    //       root.position = position;
    //       root.scaling.scaleInPlace(scaleFactor);

    //       root.physicsImpostor = new PhysicsImpostor(root, PhysicsImpostor.CylinderImpostor, {
    //         mass: 0.1,
    //         friction: 1,
    //         restitution: 1
    //       })

    //       console.log("bowling pin loaded at " + root.position);
    //     }
    //   );

    const faceUV = [];
    faceUV[0] =	new BABYLON.Vector4(0, 0, 0, 0);
    faceUV[1] =	new BABYLON.Vector4(1, 0, 0.25, 1); // x, z swapped to flip image
    faceUV[2] = new BABYLON.Vector4(0, 0, 0.24, 1);

    this.mesh = MeshBuilder.CreateCylinder(
      "bowling pin",
      { diameter: 0.45, height: 1.25, faceUV: faceUV },
      scene
    );
    const pinMaterial = new StandardMaterial("material", scene);
	  pinMaterial.diffuseTexture = new Texture("assets/textures/bowling_can.jpg", scene);
    this.mesh.material = pinMaterial;
	
    this.mesh.position = position;
    this.mesh.scaling.setAll(scaleFactor);
    this.mesh.physicsImpostor = new PhysicsImpostor(
      this.mesh,
      PhysicsImpostor.CylinderImpostor,
      {
        mass: 0.1,
        friction: 0.1,
        restitution: 0,
        //disableBidirectionalTransformation: true
      }
    );

    this.mesh.metadata = {};
    this.mesh.metadata.value = false;

    this.dirty = false;

    MyObservables.addBowlingScoreObservable(this, scoreTextblock, scene);

   Tags.AddTagsTo(this.mesh, "bowlingpin");
  }
}
