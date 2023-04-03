import {
    ActionManager,
    Color3,
    ExecuteCodeAction,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Vector3,
  } from "babylonjs";
  import { TextBlock } from "babylonjs-gui";
  import { TextPlane } from "./components/meshes";
  import { Environment } from "./environment";

  export enum TIMERTYPE {
    BASKETBALL,
    BOWLING,
  }

/**
 * Spawner is an object that spawns new atoms whenever it is clicked on.
 *
 * @class Spawner
 * @author Quah Joon Hui Conant
 */
export class Timer {
  scene: Scene;
  timerType: TIMERTYPE;
  countDownTimer: Number;
  buttonPosition: Vector3;
  timerPosition: Vector3
  mesh: Mesh;
  name: string;
  environment: Environment;

  /**
   * Constructs a new spawner.
   *
   * @param position is the location of this spawner.
   * @param scene is the scene where this spawner will be in.
   */
  constructor(timerType: TIMERTYPE,
              buttonPosition: Vector3,
              timerPosition: Vector3,
              totalTime: Number,
              environment: Environment,
              scene: Scene) {
    this.scene = scene;
    this.environment = environment;
    this.countDownTimer = 60;
    this.buttonPosition = buttonPosition;
    this.timerPosition = timerPosition;

    // assigning the name based on input element
    switch (timerType) {
      case TIMERTYPE.BASKETBALL:
        this.name = "basketball";
        break;

      case TIMERTYPE.BOWLING:
        this.name = "bowlingball";
        break;
    }

    // create a cubic mesh that will be used for detecting clicks
    this.mesh = MeshBuilder.CreateBox(
        this.name + " timer",
        { size: 0.5, width: 0.1, height: 0.5 },
        scene
      );
      this.mesh.material = new StandardMaterial(
        this.name + " timer material",
        scene
      );
      const timerMaterial = this.mesh.material as StandardMaterial;
      timerMaterial.alpha = 1.0;
      timerMaterial.diffuseColor = Color3.Red();
      this.mesh.position = this.buttonPosition;

      // timer logic
    this.initActions(timerType);
  }

  buildTimer(position: Vector3, totalTime: Number, scene: Scene) : TextPlane{
    const timer = new TextPlane(
        "timer",
        1.5,
        0.75,
        position.x,
        position.y,
        position.z,
        "Timer: " + totalTime + "s",
        "black",
        "red",
        30,
        scene
      );
      return timer;
  }

  /**
   * initActions registers an action (which is to spawn a new atom). It is triggered
   * when pressing down the mouse button or when a VR controller trigger is squeezed down.
   *
   * @param element to spawn
   */
  private initActions(timerType: TIMERTYPE) {
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
            if (timerType == TIMERTYPE.BASKETBALL) {
                const timer = this.buildTimer(this.timerPosition, this.countDownTimer, this.scene);
                // Start the countdown timer
                setInterval(function() {
                    let countdown = 60;
                    countdown--;
                    timer.textBlock.text = "Timer: " + countdown + "s";
                }, 1000);
                console.log("basketball timer spawned");
            } 
            
            else if (timerType == TIMERTYPE.BOWLING) {
                this.buildTimer(this.timerPosition, this.countDownTimer, this.scene);
                console.log("bowling timer spawned");
            } 
        }
      )
    );
  }
}   