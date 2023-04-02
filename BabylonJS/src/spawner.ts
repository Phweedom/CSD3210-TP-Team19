import {
  ActionManager,
  Color3,
  ExecuteCodeAction,
  Mesh,
  MeshBuilder,
  PhysicsImpostor,
  Scene,
  StandardMaterial,
  Tags,
  Texture,
  Vector3,
} from "babylonjs";

export enum BALLTYPE {
  BASKETBALL,
  BOWLINGBALL,
}

/**
 * Spawner is an object that spawns new atoms whenever it is clicked on.
 *
 * @class Spawner
 * @author Lim Min Ye
 */
export class Spawner {
  scene: Scene;
  ballType: BALLTYPE;
  mesh: Mesh;
  name: string;

  /**
   * Constructs a new spawner.
   *
   * @param position is the location of this spawner.
   * @param scene is the scene where this spawner will be in.
   */
  constructor(ballType: BALLTYPE, position: Vector3, scene: Scene) {
    this.scene = scene;

    // assigning the name based on input element
    switch (ballType) {
      case BALLTYPE.BASKETBALL:
        this.name = "basketball";
        break;

      case BALLTYPE.BOWLINGBALL:
        this.name = "bowlingball";
        break;
    }

    // create a cubic mesh that will be used for detecting clicks
    this.mesh = MeshBuilder.CreateBox(
      this.name,
      { size: 1, width: 1, height: 0.25 },
      scene
    );
    this.mesh.material = new StandardMaterial(
      this.name + " spawner material",
      scene
    );
    const spawnerMaterial = this.mesh.material as StandardMaterial;
    spawnerMaterial.alpha = 1.0;
    spawnerMaterial.diffuseColor = Color3.Green();
    this.mesh.position = position;

    this.initActions(ballType);
  }

  /**
   * initActions registers an action (which is to spawn a new atom). It is triggered
   * when pressing down the mouse button or when a VR controller trigger is squeezed down.
   *
   * @param element to spawn
   */
  private initActions(ballType: BALLTYPE) {
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
          if (ballType == BALLTYPE.BASKETBALL) {
            var sphere = MeshBuilder.CreateSphere(this.name, {
              segments: 16,
              diameter: 0.3,
            });
            sphere.position = this.mesh.position.add(Vector3.Up());
            sphere.material = new StandardMaterial(
              "basketball material",
              this.scene
            );
            const texture = new Texture("assets/textures/basketball.png", this.scene);
    const basketballMaterial = sphere.material as StandardMaterial;
    basketballMaterial.diffuseTexture = texture;
    sphere.material = basketballMaterial;  

            sphere.metadata = {};
            sphere.metadata.value = false;
            Tags.AddTagsTo(sphere, "basketball");

            sphere.physicsImpostor = new PhysicsImpostor(
              sphere,
              PhysicsImpostor.SphereImpostor,
              {
                mass: 0.5,
              }
            );
          }
        }
      )
    );
  }
}
