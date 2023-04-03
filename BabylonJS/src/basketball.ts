import { Mesh, MeshBuilder, Observable, PhysicsImpostor, Scene, Sound, StandardMaterial, Tags, Texture, Vector3 } from "babylonjs";
import * as CANNON from "cannon-es";
import { MyObservables } from "./myObservables";

export class Basketball {
  scene: Scene;
  mesh: Mesh;
  onBounceObservable: Observable<Boolean>;
  bounceSound: Sound;
  timeAfterLastBounce: number;
  bounceCooldown: number;

  timeSpentBelowThreshold: number;
  thresholdHeight: number;

  // constructor(position: Vector3, world: CANNON.World, scene: Scene) {
  //     this.mesh = MeshBuilder.CreateSphere("basketball", { diameter: 3}, scene);
  //     this.mesh.material = new StandardMaterial("basketball material", scene);

  //     const radius = 1 // m
  //     this.rididbody = new CANNON.Body({
  //     mass: 5, // kg
  //     shape: new CANNON.Sphere(radius),
  //     })
  //     this.rididbody.position.set(position.x, position.y, position.z) // m
  //     world.addBody(this.rididbody);

  //     this.mesh.position.x = this.rididbody.position.x;
  //     this.mesh.position.y = this.rididbody.position.y;
  //     this.mesh.position.z = this.rididbody.position.z;

  //     this.mesh.metadata = { object: this };
  //     Tags.AddTagsTo(this.mesh, "basketball");

  //     MyObservables.addOnPositionChangeObservable(this, scene);
  // }

  constructor(mesh: Mesh, scene: Scene) {

    this.scene = scene;
    this.mesh = mesh;
    this.bounceSound = new Sound('bounceSound', 'assets/sounds/Bounce.wav', scene, null); 
    this.timeAfterLastBounce = 0.1;
    this.bounceCooldown = 0.1;

    this.timeSpentBelowThreshold = 0.0;
    this.thresholdHeight = 1.0;

    MyObservables.addBounceObservable(this);
  }
}
