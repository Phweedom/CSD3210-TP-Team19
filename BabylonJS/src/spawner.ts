import {
  ActionManager,
  ExecuteCodeAction,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
} from "babylonjs";
import { Atom, Element } from "./components/meshes";

/**
 * Spawner is an object that spawns new atoms whenever it is clicked on.
 *
 * @class Spawner
 * @author Lim Min Ye
 */
export class Spawner {
  scene: Scene;
  element: Element;
  mesh: Mesh;
  name: string;

  /**
   * Constructs a new spawner.
   *
   * @param element is the element of the atom that spawns.
   * @param position is the location of this spawner.
   * @param scene is the scene where this spawner will be in.
   */
  constructor(element: Element, position: Vector3, scene: Scene) {
    this.scene = scene;

    // assigning the name based on input element
    switch (element) {
      case Element.Oxygen:
        this.name = "oxygen";
        break;

      case Element.Carbon:
        this.name = "carbon";
        break;

      case Element.Sodium:
        this.name = "sodium";
        break;

      case Element.Chlorine:
        this.name = "chlorine";
        break;
    }

    // create a cubic mesh that will be used for detecting clicks
    this.mesh = MeshBuilder.CreateBox(
      this.name,
      { size: 3.75, width: 3.75, height: 0.25 },
      scene
    );
    this.mesh.material = new StandardMaterial(
      this.name + " spawner material",
      scene
    );
    const spawnerMaterial = this.mesh.material as StandardMaterial;
    spawnerMaterial.alpha = 0;
    //spawnerMaterial.diffuseColor = Color3.Black(); //for easy debugging
    this.mesh.position = position;

    this.initActions(element);
  }

  /**
   * initActions registers an action (which is to spawn a new atom). It is triggered
   * when pressing down the mouse button or when a VR controller trigger is squeezed down.
   *
   * @param element to spawn
   */
  private initActions(element: Element) {
    const actionManager = (this.mesh.actionManager = new ActionManager(
      this.scene
    ));

    // spawn a new atom when clicked
    actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnPickDownTrigger,
        },
        () => {
          const newAtom = new Atom(
            this.name,
            { diameter: 0.5 },
            this.mesh.position.add(Vector3.Up()),
            this.scene
          );
        }
      )
    );
  }
}
