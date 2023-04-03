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

/**
 * Timer is an object that counts down whenever it is clicked on.
 *
 * @class Timer
 * @author Quah Joon Hui Conant
 */
export class Timer {
  scene: Scene;
  totalTime: number;
  buttonPosition: Vector3;
  timerPosition: Vector3;
  textPlane: TextPlane
  mesh: Mesh;
  name: string;
  environment: Environment;

  /**
   * Constructs a new spawner.
   *
   * @param position is the location of this .
   * @param scene is the scene where this spawner will be in.
   */
  constructor(buttonPosition: Vector3,
              timerPosition: Vector3,
              totalTime: number,
              environment: Environment,
              scene: Scene) {
    this.scene = scene;
    this.environment = environment;
    this.totalTime = totalTime;
    this.buttonPosition = buttonPosition;
    this.timerPosition = timerPosition;

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

      this.textPlane = this.buildTimer(this.timerPosition, this.totalTime, this.scene);

      // timer logic
    this.initActions();
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

  startCountdown(){
    this.textPlane.textBlock.text = "Timer: " + this.totalTime + "s";
    let countDownTimer = this.totalTime;

    // Update the timer text block every second
    const intervalId = setInterval(() => {
        countDownTimer--;
        this.textPlane.textBlock.text = "Timer: " + countDownTimer + "s";
        if (countDownTimer === 0) {
            clearInterval(intervalId); // Stop the timer when it reaches 0
        }
    }, 1000);
  }

  /**
   * initActions registers an action (which is to start the tier). It is triggered
   * when pressing down the mouse button or when a VR controller trigger is squeezed down.
   *
   */
  private initActions() {
    const actionManager = (this.mesh.actionManager = new ActionManager(
      this.scene
    ));

    // start timer when clicked
    actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnPickDownTrigger,
        },
        () => {
                // Start the countdown timer
                this.startCountdown();
                console.log("timer spawned");
        }
      )
    );
  }
}   