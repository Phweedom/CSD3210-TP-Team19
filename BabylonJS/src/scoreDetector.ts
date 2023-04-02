import { Color3, Mesh, MeshBuilder, Observable, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { MyObservables } from "./myObservables";
import { TextBlock } from "babylonjs-gui";

export class ScoreDetector {
    name: string;
    scene: Scene;
    mesh: Mesh;
    onIntersectObservable: Observable<[boolean, Mesh]>

    constructor(name: string, position: Vector3, scale: number, score: number, scoreTextblock: TextBlock, scene: Scene) {
        this.name = name;
        this.scene = scene;
        this.mesh = MeshBuilder.CreateSphere(name, {diameter: 0.1}, scene);
        this.mesh.material = new StandardMaterial(name + " material", scene);
        const scoreDetectorMaterial = this.mesh.material as StandardMaterial;
        scoreDetectorMaterial.diffuseColor = Color3.Red();
        scoreDetectorMaterial.alpha = 0.0;
        this.mesh.position = position;
        this.mesh.scaling.setAll(scale);

        MyObservables.addBasketballScoreObservable(this, score, scoreTextblock, scene);
    }
}

// export class ScoreCounter {
//     name: string;
//     scene: Scene;
//     mesh: Mesh;
//     score: number;

//     constructor(name: string, position: Vector3, scene: Scene) {
//         this.name = name;
//         this.scene = scene;
//         this.mesh = MeshBuilder.CreateBox(name, {}, scene);
//         this.mesh.metadata = { score: 0 };
//     }

//     incrementScore() {
//         this.score += 2;
//     }

// }