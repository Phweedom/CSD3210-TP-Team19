import {
  Mesh,
  MeshBuilder,
  PhysicsImpostor,
  Scene,
  SceneLoader,
  Tags,
  Vector3,
} from "babylonjs";

export class BowlingPin {
  mesh: Mesh;
  constructor(position: Vector3, scaleFactor: number, scene: Scene) {
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

    this.mesh = MeshBuilder.CreateCylinder(
      "bowling pin",
      { diameter: 0.45, height: 1.25 },
      scene
    );
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

   Tags.AddTagsTo(this.mesh, "bowlingpin");
  }
}
