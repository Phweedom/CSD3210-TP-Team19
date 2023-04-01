import { Color3, Mesh, MeshBuilder, Observable, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { MyObservables } from "./myObservables";

export class ScoreDetector {
    name: string;
    scene: Scene;
    mesh: Mesh;
    onIntersectObservable: Observable<boolean>

    constructor(name: string, position: Vector3, scale: number, scene: Scene) {
        this.name = name;
        this.scene = scene;
        this.mesh = MeshBuilder.CreateSphere(name, {diameter: 0.1}, scene);
        this.mesh.material = new StandardMaterial(name + " material", scene);
        const scoreDetectorMaterial = this.mesh.material as StandardMaterial;
        scoreDetectorMaterial.diffuseColor = Color3.Red();
        this.mesh.position = position;
        this.mesh.scaling.setAll(scale);

        MyObservables.addBasketballScoreObservable(this, scene);
    }

}