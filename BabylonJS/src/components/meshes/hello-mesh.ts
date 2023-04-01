import {
  AbstractMesh,
  ActionManager,
  Color3,
  ExecuteCodeAction,
  InterpolateValueAction,
  Mesh,
  MeshBuilder,
  Observable,
  PredicateCondition,
  Scene,
  SetValueAction,
  StandardMaterial,
  Tags,
  Vector3,
} from "babylonjs";
import { TextPlane } from "./text-plane";
import { MyObservables } from "../../myObservables";
import { Behaviors } from "../../behaviors";

/**
 * Contains the various elements that will be used in this application.
 * 
 * @enum Element
 */
export enum Element {
  Carbon,
  Oxygen,
  Sodium,
  Chlorine,
}

/**
 * HelloMesh is an interface that can be used with classes that implement it.
 * 
 * @interface HelloMesh
 * @author Lim Min Ye
 */

export interface HelloMesh {
  scene: Scene;
  mesh: Mesh;
  label: TextPlane;
  onDistanceChangeObservable: Observable<[number, number]>;
  onIntersectObservable: Observable<boolean>;
}

/**
 * Creates an Atom. Need to pass in the name of the atom.
 * 
 * @class Atom
 * @author Lim Min Ye
 */
export class Atom extends AbstractMesh implements HelloMesh {
  scene: Scene;
  mesh: Mesh;
  label: TextPlane;
  onDistanceChangeObservable: Observable<[number, number]>;
  onIntersectObservable: Observable<boolean>;
  element: Element;

  constructor(
    name: string,
    options: { diameter: number },
    position: Vector3,
    scene: Scene
  ) {
    super(name, scene);
    this.scene = scene;
    this.element = this.assignElement(name);

    // build mesh (some elements are atoms, some are molecules. molecules will have to be constructed.)
    switch (name) {
      case "carbon":
        // create atom mesh
        this.mesh = MeshBuilder.CreateSphere(name + " mesh", options, scene);

        // set color for atom
        this.mesh.material = new StandardMaterial(name + " material", scene);
        const carbonMaterial = this.mesh.material as StandardMaterial;
        carbonMaterial.diffuseColor = Color3.Black();

        // adding reference to Atom object through the mesh
        this.mesh.metadata = { object: this };

        Tags.AddTagsTo(this.mesh, "carbon");
        break;

      case "oxygen":
        // create atom meshes
        const firstOxygenMesh = MeshBuilder.CreateSphere(
          name + " mesh",
          options,
          scene
        );
        const secondOxygenMesh = MeshBuilder.CreateSphere(
          name + " mesh",
          options,
          scene
        );
        secondOxygenMesh.position.z += 1;

        // set colors for atoms
        firstOxygenMesh.material = new StandardMaterial(
          name + " material",
          scene
        );
        const firstOxygenMaterial =
          firstOxygenMesh.material as StandardMaterial;
        firstOxygenMaterial.diffuseColor = Color3.Red();

        secondOxygenMesh.material = new StandardMaterial(
          name + " material",
          scene
        );
        const secondOxygenMaterial =
          secondOxygenMesh.material as StandardMaterial;
        secondOxygenMaterial.diffuseColor = Color3.Red();

        // path for the tubes (atom bonds)
        let oxygenBondPath: Vector3[] = [
          firstOxygenMesh.position,
          secondOxygenMesh.position,
        ];

        // create bond meshes
        const firstOxygenBond = MeshBuilder.CreateTube(
          "bond",
          { path: oxygenBondPath, radius: 0.03 },
          scene
        );
        const secondOxygenBond = MeshBuilder.CreateTube(
          "bond",
          { path: oxygenBondPath, radius: 0.03 },
          scene
        );
        firstOxygenBond.position.y += 0.1;
        secondOxygenBond.position.y -= 0.1;

        // set colors for bonds
        firstOxygenBond.material = new StandardMaterial(
          name + "bond material",
          scene
        );
        const firstOxygenBondMaterial =
          firstOxygenBond.material as StandardMaterial;
        firstOxygenBondMaterial.diffuseColor = Color3.White();

        secondOxygenBond.material = new StandardMaterial(
          name + "bond material",
          scene
        );
        const secondOxygenBondMaterial =
          secondOxygenBond.material as StandardMaterial;
        secondOxygenBondMaterial.diffuseColor = Color3.White();

        // merge all the above meshes into one
        const mergedMesh = Mesh.MergeMeshes(
          [
            firstOxygenMesh,
            secondOxygenMesh,
            firstOxygenBond,
            secondOxygenBond,
          ],
          true,
          true,
          undefined,
          false,
          true
        );

        this.mesh = mergedMesh;

        // adding reference to Atom object through the mesh
        this.mesh.metadata = { object: this };

        // add tag to this mesh (can use scene.getMeshesByTags('oxygen'))
        Tags.AddTagsTo(this.mesh, "oxygen");
        break;

      case "sodium":
        // create atom mesh
        this.mesh = MeshBuilder.CreateSphere(name + " mesh", options, scene);

        // set color for atom
        this.mesh.material = new StandardMaterial(name + " material", scene);
        const sodiumMaterial = this.mesh.material as StandardMaterial;
        sodiumMaterial.diffuseColor = Color3.Yellow();

        // adding reference to Atom object through the mesh
        this.mesh.metadata = { object: this };

        Tags.AddTagsTo(this.mesh, "sodium");
        break;

      case "chlorine":
        // create atom meshes
        const firstChlorineMesh = MeshBuilder.CreateSphere(
          name + " mesh",
          options,
          scene
        );
        const secondChlorineMesh = MeshBuilder.CreateSphere(
          name + " mesh",
          options,
          scene
        );
        secondChlorineMesh.position.z += 1;

        // set colors for atoms
        firstChlorineMesh.material = new StandardMaterial(
          name + " material",
          scene
        );
        const firstChlorineMaterial =
          firstChlorineMesh.material as StandardMaterial;
        firstChlorineMaterial.diffuseColor = Color3.Green();

        secondChlorineMesh.material = new StandardMaterial(
          name + " material",
          scene
        );
        const secondChlorineMaterial =
          secondChlorineMesh.material as StandardMaterial;
        secondChlorineMaterial.diffuseColor = Color3.Green();

        // path for the tubes (atom bonds)
        let chlorineBondPath: Vector3[] = [
          firstChlorineMesh.position,
          secondChlorineMesh.position,
        ];

        // create bond meshes
        const chlorineBond = MeshBuilder.CreateTube(
          "bond",
          { path: chlorineBondPath, radius: 0.03 },
          scene
        );
        //chlorineBond.position.y += 0.1;

        // set colors for bonds
        chlorineBond.material = new StandardMaterial(
          name + "bond material",
          scene
        );
        const chlorineBondMaterial = chlorineBond.material as StandardMaterial;
        chlorineBondMaterial.diffuseColor = Color3.White();

        // merge all the above meshes into one
        const mergedChlorineMesh = Mesh.MergeMeshes(
          [firstChlorineMesh, secondChlorineMesh, chlorineBond],
          true,
          true,
          undefined,
          false,
          true
        );

        this.mesh = mergedChlorineMesh;

        // adding reference to Atom object through the mesh
        this.mesh.metadata = { object: this };

        // add tag to this mesh (can use scene.getMeshesByTags('oxygen'))
        Tags.AddTagsTo(this.mesh, "chlorine");
        break;

      case "carbon dioxide":
        // create atom mesh
        this.mesh = MeshBuilder.CreateSphere(name + " mesh", options, scene);

        // set color for atom
        this.mesh.material = new StandardMaterial(name + " material", scene);
        const carbonDioxideMaterial = this.mesh.material as StandardMaterial;
        carbonDioxideMaterial.diffuseColor = Color3.Purple();

        // adding reference to Atom object through the mesh
        this.mesh.metadata = { object: this };

        Tags.AddTagsTo(this.mesh, "carbon dioxide");
        break;

      case "sodium chloride":
        // create atom mesh
        this.mesh = MeshBuilder.CreateSphere(name + " mesh", options, scene);

        // set color for atom
        this.mesh.material = new StandardMaterial(name + " material", scene);
        const sodiumChlorideMaterial = this.mesh.material as StandardMaterial;
        sodiumChlorideMaterial.diffuseColor = Color3.Magenta();

        // adding reference to Atom object through the mesh
        this.mesh.metadata = { object: this };

        Tags.AddTagsTo(this.mesh, "sodium chloride");
        break;
    }
    this.addChild(this.mesh); // later on, use this.getChildMeshes() to get this mesh

    this.position = position;
    this.rotate(Vector3.Up(), 90);

    // add observables
    MyObservables.addOnDistanceChangeObservable(this, scene);

    // add behaviors
    Behaviors.addDragBehaviorToAtom(this);
    Behaviors.addMultiPointerScaleBehaviorToAtom(this);
  }

  assignElement(name: string) {
    switch (name) {
      case "carbon":
        return Element.Carbon;

      case "oxygen":
        return Element.Oxygen;

      case "sodium":
        return Element.Sodium;

      case "chlorine":
        return Element.Chlorine;
    }
  }
}

/**
 * Compounds are like atoms, except they cannot react with other elements.
 * 
 * @class Compound
 * @author Lim Min Ye
 */
export class Compound extends AbstractMesh implements HelloMesh {
  scene: Scene;
  mesh: Mesh;
  label: TextPlane;
  onDistanceChangeObservable: Observable<[number, number]>;
  onIntersectObservable: Observable<boolean>;
  element: Element;

  constructor(
    name: string,
    options: { diameter: number },
    position: Vector3,
    scene: Scene
  ) {
    super(name, scene);
    this.scene = scene;
    this.element = this.assignElement(name);

    // build mesh (some elements are atoms, some are molecules. molecules will have to be constructed.)
    switch (name) {
      case "carbon dioxide":
        // create atom meshes
        const firstOxygenMesh = MeshBuilder.CreateSphere(
          name + " mesh",
          options,
          scene
        );
        const secondOxygenMesh = MeshBuilder.CreateSphere(
          name + " mesh",
          options,
          scene
        );
        secondOxygenMesh.position.z += 1;
        const carbonMesh = MeshBuilder.CreateSphere(
          name + " mesh",
          options,
          scene
        );
        carbonMesh.position.z += 0.5;
        carbonMesh.position.y += 0.5;

        // set colors for atoms
        firstOxygenMesh.material = new StandardMaterial(
          name + " material",
          scene
        );
        const firstOxygenMaterial =
          firstOxygenMesh.material as StandardMaterial;
        firstOxygenMaterial.diffuseColor = Color3.Red();

        secondOxygenMesh.material = new StandardMaterial(
          name + " material",
          scene
        );
        const secondOxygenMaterial =
          secondOxygenMesh.material as StandardMaterial;
        secondOxygenMaterial.diffuseColor = Color3.Red();

        carbonMesh.material = new StandardMaterial(name + " material", scene);
        const carbonMaterial = carbonMesh.material as StandardMaterial;
        carbonMaterial.diffuseColor = Color3.Black();

        // path for the tubes (atom bonds)
        let carbonDioxidePath: Vector3[] = [
          firstOxygenMesh.position,
          carbonMesh.position,
          secondOxygenMesh.position,
        ];

        // create bond meshes
        const firstCarbonDioxideBond = MeshBuilder.CreateTube(
          "bond",
          { path: carbonDioxidePath, radius: 0.03 },
          scene
        );
        const secondCarbonDioxideBond = MeshBuilder.CreateTube(
          "bond",
          { path: carbonDioxidePath, radius: 0.03 },
          scene
        );
        firstCarbonDioxideBond.position.y += 0.1;
        secondCarbonDioxideBond.position.y -= 0.1;

        // set colors for bonds
        firstCarbonDioxideBond.material = new StandardMaterial(
          name + "bond material",
          scene
        );
        const firstCarbonDioxideBondMaterial =
          firstCarbonDioxideBond.material as StandardMaterial;
        firstCarbonDioxideBondMaterial.diffuseColor = Color3.White();

        secondCarbonDioxideBond.material = new StandardMaterial(
          name + "bond material",
          scene
        );
        const secondCarbonDioxideBondMaterial =
          secondCarbonDioxideBond.material as StandardMaterial;
        secondCarbonDioxideBondMaterial.diffuseColor = Color3.White();

        // merge all the above meshes into one
        const mergedCarbonDioxideMesh = Mesh.MergeMeshes(
          [
            firstOxygenMesh,
            secondOxygenMesh,
            carbonMesh,
            firstCarbonDioxideBond,
            secondCarbonDioxideBond,
          ],
          true,
          true,
          undefined,
          false,
          true
        );

        this.mesh = mergedCarbonDioxideMesh;

        // adding reference to Atom object through the mesh
        this.mesh.metadata = { object: this };

        // add tag to this mesh (can use scene.getMeshesByTags('oxygen'))
        Tags.AddTagsTo(this.mesh, "CO2");
        break;

      case "sodium chloride":
        // create atom meshes
        const sodiumMesh = MeshBuilder.CreateSphere(
          name + " mesh",
          options,
          scene
        );
        const chlorineMesh = MeshBuilder.CreateSphere(
          name + " mesh",
          options,
          scene
        );
        chlorineMesh.position.z += 1;

        // set colors for atoms
        sodiumMesh.material = new StandardMaterial(name + " material", scene);
        const sodiumMaterial = sodiumMesh.material as StandardMaterial;
        sodiumMaterial.diffuseColor = Color3.Yellow();

        chlorineMesh.material = new StandardMaterial(name + " material", scene);
        const chlorineMaterial = chlorineMesh.material as StandardMaterial;
        chlorineMaterial.diffuseColor = Color3.Green();

        // path for the tubes (atom bonds)
        let sodiumChlorideBondPath: Vector3[] = [
          sodiumMesh.position,
          chlorineMesh.position,
        ];

        // create bond meshes
        const sodiumChlorideBond = MeshBuilder.CreateTube(
          "bond",
          { path: sodiumChlorideBondPath, radius: 0.03 },
          scene
        );
        //chlorineBond.position.y += 0.1;

        // set colors for bonds
        sodiumChlorideBond.material = new StandardMaterial(
          name + "bond material",
          scene
        );
        const sodiumChlorideBondMaterial =
          sodiumChlorideBond.material as StandardMaterial;
        sodiumChlorideBondMaterial.diffuseColor = Color3.White();

        // merge all the above meshes into one
        const mergedSodiumChlorideMesh = Mesh.MergeMeshes(
          [sodiumMesh, chlorineMesh, sodiumChlorideBond],
          true,
          true,
          undefined,
          false,
          true
        );

        this.mesh = mergedSodiumChlorideMesh;

        // adding reference to Atom object through the mesh
        this.mesh.metadata = { object: this };

        // add tag to this mesh (can use scene.getMeshesByTags('oxygen'))
        Tags.AddTagsTo(this.mesh, "NaCl");
        break;
    }
    this.addChild(this.mesh); // later on, use this.getChildMeshes() to get this mesh

    this.position = position;
    this.rotate(Vector3.Up(), 90);

    // add behaviors
    Behaviors.addDragBehaviorToCompound(this);
    Behaviors.addMultiPointerScaleBehaviorToCompound(this);
  }

  assignElement(name: string) {
    switch (name) {
      case "carbon":
        return Element.Carbon;

      case "oxygen":
        return Element.Oxygen;

      case "sodium":
        return Element.Sodium;

      case "chlorine":
        return Element.Chlorine;
    }
  }
}