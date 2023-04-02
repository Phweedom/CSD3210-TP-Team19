import { Mesh, MeshBuilder, Observable, PhysicsImpostor, Scene, StandardMaterial, Tags, Texture, Vector3 } from "babylonjs";
import * as CANNON from "cannon-es";
import { MyObservables } from "./myObservables";


export class Basketball {
    scene: Scene;
    mesh: Mesh;
    rididbody: CANNON.Body;
    previousPosition: Vector3;
    onPositionhangeObservable: Observable<[Vector3]>;

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

    constructor(position: Vector3, scene: Scene) {
        const sphere = MeshBuilder.CreateSphere("basketball", { diameter: 1}, scene);

        const material = new StandardMaterial ("basketball material", scene);
        const texture = new Texture("assets/textures/basketball.png", this.scene);
        material.diffuseTexture = texture;
        sphere.material = material;        

        sphere.position = position;
        sphere.scaling.setAll(0.3);
        sphere.physicsImpostor = new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor, {
            mass: 1,
            friction: 1,
            restitution: 1,
            //disableBidirectionalTransformation: true
        });
    }


}