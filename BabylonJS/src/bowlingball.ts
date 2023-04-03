import { Mesh, MeshBuilder, Observable, PhysicsImpostor, Scene, Sound, StandardMaterial, Tags, Texture, Vector3 } from "babylonjs";
import * as CANNON from "cannon-es";
import { MyObservables } from "./myObservables";

export class Bowlingball {
  scene: Scene;
  mesh: Mesh;
  onRollingObservable: Observable<Boolean>;
  rollingSound: Sound;

  constructor(mesh: Mesh, scene: Scene) {

    this.scene = scene;
    this.mesh = mesh;
    this.rollingSound = new Sound('rollingSound', 'assets/sounds/bowlingRoll.wav', scene, null); 

    MyObservables.addRollingObservable(this);
  }
}
