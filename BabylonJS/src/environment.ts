import {
  ActionManager,
  Color3,
  Color4,
  ExecuteCodeAction,
  GizmoManager,
  MeshBuilder,
  PhysicsImpostor,
  Scene,
  StandardMaterial,
  Vector3,
} from "babylonjs";
import { TextPlane, Atom } from "./components/meshes";
import { Util } from "./util";
import { Spawner } from "./spawner";
import { Element } from "./components/meshes";
import {ScoreDetector} from "./scoreDetector"

/**
 * Environment contains functions that are used for building a classroom environment.
 *
 * @class Environment
 * @author Lim Min Ye
 */
export class Environment {
  static buildGameEnvironment(scene: Scene) {
    Environment.buildBasketballCourt(new Vector3(0, 0, 0), 3, scene);
    Environment.buildBowling(new Vector3(10, 0, 0), 1, scene);
  }

  static buildBasketballCourt(position: Vector3, scale: number, scene: Scene) {
    // create a skybox
    Util.createSkybox(scene);

    // load basketball court model
    Util.loadModel(
      "assets/models/",
      "basketball_court.glb",
      position,
      scale,
      scene
    );

    // add backboards
    Environment.buildBackboard(new Vector3(0, 3.3, 6.03), scale, scene);
    Environment.buildBackboard(new Vector3(0, 3.3, -6.03), scale, scene);

    // create rim mesh
    Environment.buildRim(new Vector3(0, 3, 5.7), scale, scene);
    Environment.buildRim(new Vector3(0, 3, -5.7), scale, scene);

    Environment.buildRim(new Vector3(1, 1, 1), scale, scene);
    

  }

  static buildRim(position: Vector3, scale: number, scene: Scene) {
    // create rim mesh
    const rim = MeshBuilder.CreateTorus(
      "rim",
      { diameter: 0.25, thickness: 0.02 },
      scene
    );
    rim.position = position;
    rim.scaling.setAll(scale);

    // add collider to rim
    rim.physicsImpostor = new PhysicsImpostor(
      rim,
      PhysicsImpostor.MeshImpostor,
      {
        mass: 0,
        friction: 1,
        restitution: 1,
      }
    );
    // make it transparent
    const rimMaterial = new StandardMaterial("rim material", scene);
    rimMaterial.alpha = 1.0;
    rim.material = rimMaterial;

    
    const scoreDetectorOffset = new Vector3(0, -0.2, 0);
    const scoreDetector = new ScoreDetector("basketball score detector", rim.position.add(scoreDetectorOffset), 1, scene);
  }

  static buildBackboard(position: Vector3, scale: number, scene: Scene) {
    // create backboard mesh
    const backboard = MeshBuilder.CreateBox(
      "backboard",
      {
        size: 0.01,
        width: 0.5,
        height: 0.33,
      },
      scene
    );
    backboard.position = position;
    backboard.scaling.setAll(scale);
    // add collider to backboard
    backboard.physicsImpostor = new PhysicsImpostor(
      backboard,
      PhysicsImpostor.BoxImpostor,
      {
        mass: 0,
        friction: 1,
        restitution: 1,
      }
    );
    // make it transparent
    const backboardMaterial = new StandardMaterial("backboard material", scene);
    backboardMaterial.alpha = 1.0;
    backboard.material = backboardMaterial;
  }

  static buildBowling(position: Vector3, scale: number, scene: Scene) {
    //TODO
  }

  static buildClassroom(scene: Scene) {
    // create a skybox
    Util.createSkybox(scene);

    // chalkboard prompt
    const promptText =
      "Try performing Synthesis Reactions!\n\nCheck out the whiteboard on your right for instructions!";
    const chalkboardPrompt = new TextPlane(
      "prompt",
      26,
      18,
      15,
      17,
      50,
      promptText,
      "transparent",
      "white",
      100,
      scene
    );

    // whiteboard instructions
    const generalInstruction =
      "Combine atoms and molecules to form compounds!\nThey are on the teacher's desk!";
    const generalInstructionTextPlane = new TextPlane(
      "generalInstructionTextPlane",
      26,
      18,
      56,
      25,
      -3,
      generalInstruction,
      "transparent",
      "black",
      100,
      scene
    );
    generalInstructionTextPlane.mesh.rotate(Vector3.Up(), Math.PI / 2);

    // horizontal separator line
    const horizontalLineOptions = {
      points: [new Vector3(56, 22, 15), new Vector3(56, 22, -20)],
      updatable: true,
      colors: [new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1)],
    };
    const horizontalLine = MeshBuilder.CreateLines(
      "horizontal line",
      horizontalLineOptions,
      scene
    );

    // vertical separator lines
    const leftVerticalLineOptions = {
      points: [new Vector3(56, 21, 5), new Vector3(56, 14, 5)],
      updatable: true,
      colors: [new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1)],
    };
    const leftVerticalLine = MeshBuilder.CreateLines(
      "left vertical line",
      leftVerticalLineOptions,
      scene
    );

    const rightVerticalLineOptions = {
      points: [new Vector3(56, 21, -12), new Vector3(56, 14, -12)],
      updatable: true,
      colors: [new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1)],
    };
    const rightVerticalLine = MeshBuilder.CreateLines(
      "right vertical line",
      rightVerticalLineOptions,
      scene
    );

    // vr controller instructions
    const controllerInstructionHeader = "VR Controller Instructions:\n";
    const controllerGrabInstruction =
      "Reach out for the atom and \nhold the trigger to grab it!";
    const controllerInstructionTextPlane = new TextPlane(
      "controllerInstructionTextPlane",
      26,
      18,
      56,
      18,
      -20,
      controllerInstructionHeader + controllerGrabInstruction,
      "transparent",
      "black",
      100,
      scene
    );
    controllerInstructionTextPlane.mesh.rotate(Vector3.Up(), Math.PI / 2);

    // webXR instructions (using keyboard and mouse)
    const webXRInstructionHeader = "PC Control Instructions:\n";
    const webXRGrabInstruction =
      "Position a controller close\n to the atom and squeeze\n the trigger to grab it!";
    const webXRGrabInstructionTextPlane = new TextPlane(
      "webXRGrabInstructionTextPlane",
      26,
      18,
      56,
      18,
      13,
      webXRInstructionHeader + webXRGrabInstruction,
      "transparent",
      "black",
      100,
      scene
    );
    webXRGrabInstructionTextPlane.mesh.rotate(Vector3.Up(), Math.PI / 2);

    // movement instructions
    const movementInstructionHeader = "Movement Instructions:\n";
    const movementInstruction =
      "Point the Controller at the target\n location and hold the trigger for\n 2 seconds to teleport!";
    const movementInstructionTextPlane = new TextPlane(
      "movementInstructionTextPlane",
      26,
      18,
      56,
      18,
      -3.5,
      movementInstructionHeader + movementInstruction,
      "transparent",
      "black",
      100,
      scene
    );
    movementInstructionTextPlane.mesh.rotate(Vector3.Up(), Math.PI / 2);

    // chemistry poster
    const posterHeader = "Chemistry Formulae\n\n";
    const carbonDioxideHint = "O2 + C ---> CO2\n";
    const sodiumChlorideHint = "Na + Cl ---> NaCl";
    const carbonDioxideHintTextPlane = new TextPlane(
      "carbonDioxideHintTextPlane",
      15,
      10,
      56,
      20,
      35,
      posterHeader + carbonDioxideHint + sodiumChlorideHint,
      "black",
      "white",
      100,
      scene
    );
    carbonDioxideHintTextPlane.mesh.rotate(Vector3.Up(), Math.PI / 2);

    // load basketball court model
    Util.loadModel(
      "assets/models/",
      "Classroom.glb",
      new Vector3(0, -1, 0),
      3,
      scene
    );

    // load atom / molecule "containers"
    Util.loadModel(
      "assets/models/",
      "container.glb",
      new Vector3(27.5, 10, 10),
      1,
      scene
    );
    Util.loadModel(
      "assets/models/",
      "container.glb",
      new Vector3(27.5, 10, 3),
      1,
      scene
    );
    Util.loadModel(
      "assets/models/",
      "container.glb",
      new Vector3(27.5, 10, -4),
      1,
      scene
    );
    Util.loadModel(
      "assets/models/",
      "container.glb",
      new Vector3(27.5, 10, -11),
      1,
      scene
    );

    // add spawners to the containers
    const oxygenSpawner = new Spawner(
      Element.Oxygen,
      new Vector3(27.5, 9.5, 10),
      scene
    );
    const carbonSpawner = new Spawner(
      Element.Carbon,
      new Vector3(27.5, 9.5, 3),
      scene
    );
    const sodiumSpawner = new Spawner(
      Element.Sodium,
      new Vector3(27.5, 9.5, -4),
      scene
    );
    const chlorineSpawner = new Spawner(
      Element.Chlorine,
      new Vector3(27.5, 9.5, -11),
      scene
    );

    // add labels to containers
    const oxygenContainerLabel = new TextPlane(
      "oxygenContainerLabel",
      3.7,
      1.1,
      25.5,
      9.75,
      10,
      "Oxygen",
      "transparent",
      "black",
      100,
      scene
    );
    oxygenContainerLabel.mesh.rotate(Vector3.Up(), Math.PI / 2);
    const carbonContainerLabel = new TextPlane(
      "carbonContainerLabel",
      3.7,
      1.1,
      25.5,
      9.75,
      3,
      "Carbon",
      "transparent",
      "black",
      100,
      scene
    );
    carbonContainerLabel.mesh.rotate(Vector3.Up(), Math.PI / 2);
    const sodiumContainerLabel = new TextPlane(
      "sodiumContainerLabel",
      3.7,
      1.1,
      25.5,
      9.75,
      -4,
      "Sodium",
      "transparent",
      "black",
      100,
      scene
    );
    sodiumContainerLabel.mesh.rotate(Vector3.Up(), Math.PI / 2);
    const chlorineContainerLabel = new TextPlane(
      "chlorineContainerLabel",
      3.7,
      1.1,
      25.5,
      9.75,
      -11,
      "Chlorine",
      "transparent",
      "black",
      100,
      scene
    );
    chlorineContainerLabel.mesh.rotate(Vector3.Up(), Math.PI / 2);

    // populate the containers with atoms / molecules
    const oxygen1 = new Atom(
      "oxygen",
      { diameter: 0.5 },
      new Vector3(27.5, 10, 11.0),
      scene
    );
    const oxygen2 = new Atom(
      "oxygen",
      { diameter: 0.5 },
      new Vector3(27.0, 10, 10.3),
      scene
    );
    const oxygen3 = new Atom(
      "oxygen",
      { diameter: 0.5 },
      new Vector3(26.5, 10, 9.6),
      scene
    );

    const carbon1 = new Atom(
      "carbon",
      { diameter: 0.5 },
      new Vector3(28.5, 10, 4.0),
      scene
    );
    const carbon2 = new Atom(
      "carbon",
      { diameter: 0.5 },
      new Vector3(27.5, 10, 3.0),
      scene
    );
    const carbon3 = new Atom(
      "carbon",
      { diameter: 0.5 },
      new Vector3(26.5, 10, 2.0),
      scene
    );

    const sodium1 = new Atom(
      "sodium",
      { diameter: 0.5 },
      new Vector3(28.5, 10, -3.0),
      scene
    );
    const sodium2 = new Atom(
      "sodium",
      { diameter: 0.5 },
      new Vector3(27.5, 10, -4.0),
      scene
    );
    const sodium3 = new Atom(
      "sodium",
      { diameter: 0.5 },
      new Vector3(26.5, 10, -5.0),
      scene
    );

    const chlorine1 = new Atom(
      "chlorine",
      { diameter: 0.5 },
      new Vector3(27.5, 10, -10.0),
      scene
    );
    const chlorine2 = new Atom(
      "chlorine",
      { diameter: 0.5 },
      new Vector3(27.0, 10, -10.7),
      scene
    );
    const chlorine3 = new Atom(
      "chlorine",
      { diameter: 0.5 },
      new Vector3(26.5, 10, -11.4),
      scene
    );

    // add gizmo toggle buttons
    const gizmoManager = new GizmoManager(scene);

    const translationButton = MeshBuilder.CreateBox(
      "translationButton",
      {
        size: 7,
        width: 3.75,
        height: 0.75,
      },
      scene
    );
    translationButton.material = new StandardMaterial(
      "translationButtonMaterial",
      scene
    );
    const translationButtonMaterial =
      translationButton.material as StandardMaterial;
    translationButtonMaterial.diffuseColor = Color3.Black();
    translationButton.position = new Vector3(56, 27, -35);
    translationButton.rotate(Vector3.Forward(), Math.PI / 2);
    const translationButtonLabel = new TextPlane(
      "translationButtonLabel",
      7,
      3.75,
      55.5,
      27,
      -35,
      "Toggle\nTranslation Gizmo",
      "transparent",
      "white",
      75,
      scene
    );
    translationButtonLabel.mesh.rotate(Vector3.Up(), Math.PI / 2);
    var actionManager = (translationButtonLabel.mesh.actionManager =
      new ActionManager(scene));
    actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnPickDownTrigger,
        },
        () => {
          if (gizmoManager.positionGizmoEnabled)
            gizmoManager.positionGizmoEnabled = false;
          else gizmoManager.positionGizmoEnabled = true;
        }
      )
    );

    const rotationButton = MeshBuilder.CreateBox(
      "rotationButton",
      {
        size: 7,
        width: 3.75,
        height: 0.75,
      },
      scene
    );
    rotationButton.material = new StandardMaterial(
      "rotationButtonMaterial",
      scene
    );
    const rotationButtonMaterial = rotationButton.material as StandardMaterial;
    rotationButtonMaterial.diffuseColor = Color3.Black();
    rotationButton.position = new Vector3(56, 23, -35);
    rotationButton.rotate(Vector3.Forward(), Math.PI / 2);
    const rotationButtonLabel = new TextPlane(
      "rotationButtonLabel",
      7,
      3.75,
      55.5,
      23,
      -35,
      "Toggle\nRotation Gizmo",
      "transparent",
      "white",
      75,
      scene
    );
    rotationButtonLabel.mesh.rotate(Vector3.Up(), Math.PI / 2);
    var actionManager = (rotationButtonLabel.mesh.actionManager =
      new ActionManager(scene));
    actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnPickDownTrigger,
        },
        () => {
          if (gizmoManager.rotationGizmoEnabled)
            gizmoManager.rotationGizmoEnabled = false;
          else gizmoManager.rotationGizmoEnabled = true;
        }
      )
    );

    const scalingButton = MeshBuilder.CreateBox(
      "scalingButton",
      {
        size: 7,
        width: 3.75,
        height: 0.75,
      },
      scene
    );
    scalingButton.material = new StandardMaterial(
      "scalingButtonMaterial",
      scene
    );
    const scalingButtonMaterial = scalingButton.material as StandardMaterial;
    scalingButtonMaterial.diffuseColor = Color3.Black();
    scalingButton.position = new Vector3(56, 19, -35);
    scalingButton.rotate(Vector3.Forward(), Math.PI / 2);
    const scalingButtonLabel = new TextPlane(
      "scalingButton",
      7,
      3.75,
      55.5,
      19,
      -35,
      "Toggle\nScaling Gizmo",
      "transparent",
      "white",
      75,
      scene
    );
    scalingButtonLabel.mesh.rotate(Vector3.Up(), Math.PI / 2);
    var actionManager = (scalingButtonLabel.mesh.actionManager =
      new ActionManager(scene));
    actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnPickDownTrigger,
        },
        () => {
          if (gizmoManager.scaleGizmoEnabled)
            gizmoManager.scaleGizmoEnabled = false;
          else gizmoManager.scaleGizmoEnabled = true;
        }
      )
    );
  }
}
