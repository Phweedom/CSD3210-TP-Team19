import { Mesh, MeshBuilder, Observable, PhysicsImpostor, Scene, Sound, StandardMaterial, Tags, Texture, Vector3 } from "babylonjs";
import * as CANNON from "cannon-es";
import { MyObservables } from "./myObservables";

export class Bowlingball {
  scene: Scene;
  mesh: Mesh;
  onRollingObservable: Observable<Boolean>;
  rollingSound: Sound;
  inContactWithTrack: Boolean;
  moving: Boolean;
  soundPlaying: Boolean;

  constructor(mesh: Mesh, scene: Scene) {

    this.scene = scene;
    this.mesh = mesh;
    this.rollingSound = new Sound('rollingSound', 'assets/sounds/bowlingRoll.wav', scene, null); 
    this.inContactWithTrack = false;
    this.moving = false;
    this.soundPlaying = false;

    MyObservables.addRollingObservable(this);
  }
}
