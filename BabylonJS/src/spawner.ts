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
  liveBalls: Array<Mesh> = [];
  containerMesh: Mesh;

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
      this.name + " spawner",
      { size: 0.5, width: 0.1, height: 0.5 },
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

    // create a container that catches the balls
    this.createContainer(position.add(new Vector3(0.5, -1, 0)), this.scene);

    this.initActions(ballType);

    scene.onAfterRenderObservable.add(() => {
      this.liveBalls = this.liveBalls.filter((ball, i) => {
        const maxBalls = 9;
        if (this.liveBalls.length - maxBalls > i) {
          // out of bounds
          ball.dispose();
          return false;
        }
        return true;
      });
    });
  }

  private createContainer(position: Vector3, scene: Scene) {
    const flatRamp = MeshBuilder.CreateBox(
      "flatRamp",
      { size: 0.7, width: 0.5, height: 0.05 },
      this.scene
    );
    flatRamp.position = position.add(new Vector3(0, 0, -0.5));

    const slopeRamp = MeshBuilder.CreateBox(
      "flatRamp",
      { size: 2, width: 0.5, height: 0.05 },
      this.scene
    );
    slopeRamp.rotate(Vector3.Left(), -Math.PI / 6);
    slopeRamp.position = position.add(new Vector3(0, 0.496, -1.7));

    const ballStopper = MeshBuilder.CreateBox(
      "ballStopper",
      { size: 0.05, width: 0.5, height: 0.15 },
      this.scene
    );
    ballStopper.position = position.add(new Vector3(0, 0.05, -0.13));

    const flatLeftWall = MeshBuilder.CreateBox(
      "flatLeftWall",
      { size: 0.7, width: 0.05, height: 0.15 },
      this.scene
    );
    flatLeftWall.position = position.add(new Vector3(-0.225, 0.05, -0.5));

    const flatRightWall = MeshBuilder.CreateBox(
      "flatRightWall",
      { size: 0.7, width: 0.05, height: 0.15 },
      this.scene
    );
    flatRightWall.position = position.add(new Vector3(0.225, 0.05, -0.5));

    const slopeLeftWall = MeshBuilder.CreateBox(
      "slopeLeftWall",
      { size: 2.0, width: 0.05, height: 0.15 },
      this.scene
    );
    slopeLeftWall.rotate(Vector3.Left(), -Math.PI / 6);
    slopeLeftWall.position = position.add(new Vector3(-0.225, 0.55, -1.7));

    const slopeRightWall = MeshBuilder.CreateBox(
      "slopeRightWall",
      { size: 2.0, width: 0.05, height: 0.15 },
      this.scene
    );
    slopeRightWall.rotate(Vector3.Left(), -Math.PI / 6);
    slopeRightWall.position = position.add(new Vector3(0.225, 0.55, -1.7));

    const mergedMesh = Mesh.MergeMeshes(
      [flatRamp, slopeRamp, ballStopper, flatLeftWall, flatRightWall, slopeLeftWall, slopeRightWall],
      true,
      true,
      undefined,
      false,
      true
    );

    mergedMesh.physicsImpostor = new PhysicsImpostor(
      mergedMesh,
      PhysicsImpostor.MeshImpostor,
      { mass: 0, friction: 1.0, restitution: 0.5 }
    );

    this.containerMesh = mergedMesh;
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

    // spawn a new ball when clicked
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
            sphere.position = this.mesh.position.add(new Vector3(0.5, 0.2, -2.5));
            sphere.material = new StandardMaterial(
              "basketball material",
              this.scene
            );
            const texture = new Texture(
              "assets/textures/basketball.png",
              this.scene
            );
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
                mass: 1.0,
                friction: 1.0,
                restitution: 0.8,
              }
            );

            this.liveBalls.push(sphere);

            console.log("number of basketballs: " + this.liveBalls.length);
          }
        }
      )
    );
  }
}
