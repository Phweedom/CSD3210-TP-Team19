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
import { Atom, Element, TextPlane } from "./components/meshes";
import { Util } from "./util";
import { Spawner } from "./spawner";
import { ScoreDetector } from "./scoreDetector";
import { TextBlock } from "babylonjs-gui";
import { BowlingPin } from "./bowlingPin";
import { Basketball } from "./basketball";

/**
 * Environment contains functions that are used for building a classroom environment.
 *
 * @class Environment
 * @author Lim Min Ye
 */
export class Environment {
  scene: Scene;
  basketballScore: number;
  basketballScoreTextplane: TextBlock;
  liveBowlingPins: Array<BowlingPin>;

  constructor(scene: Scene) {
    this.scene = scene;
    this.basketballScore = 0;
    this.liveBowlingPins = new Array<BowlingPin>();

    this.buildBasketballCourt(new Vector3(0, 0, 0), 3, scene);
    this.buildBowling(new Vector3(7.815, 0.65, 4.5), 30, scene);
  }

  buildBasketballCourt(position: Vector3, scale: number, scene: Scene) {
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
    this.buildBackboard(new Vector3(0, 3.3, 6.03), scale, scene);
    this.buildBackboard(new Vector3(0, 3.3, -6.03), scale, scene);

    // add scoreboard
    const scoreboard = this.buildScoreboard(new Vector3(2, 1, 4), scene);
    this.basketballScoreTextplane = scoreboard.textBlock;

    // create rim mesh
    this.buildRim(new Vector3(0, 3, 5.7), scale, scene);
    this.buildRim(new Vector3(0, 3, -5.7), scale, scene);
  }

  buildScoreboard(position: Vector3, scene: Scene) {
    const scoreboard = new TextPlane(
      "basketball scoreboard",
      1,
      1,
      position.x,
      position.y,
      position.z,
      this.basketballScore.toString(),
      "white",
      "black",
      30,
      scene
    );

    return scoreboard;
  }

  buildRim(position: Vector3, scale: number, scene: Scene) {
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
    const scoreDetector = new ScoreDetector(
      "basketball score detector",
      rim.position.add(scoreDetectorOffset),
      1,
      this.basketballScore,
      this.basketballScoreTextplane,
      scene
    );
  }

  buildBackboard(position: Vector3, scale: number, scene: Scene) {
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

  buildBowling(position: Vector3, scale: number, scene: Scene) {
    Util.loadModel(
      "assets/models/",
      "bowlingMachine.glb",
      position,
      scale,
      scene
    );

    this.placeBowlingPins(scene);
  }

  placeBowlingPins(scene: Scene) {
    // create pin at the front
    const pinStartPoint = new Vector3(7.83, 0.9, 7);
    this.liveBowlingPins.push(new BowlingPin(pinStartPoint, 0.3, scene));

    // create pins at second row
    var i = 0;
    var secondRowStartPoint = pinStartPoint.add(new Vector3(-0.15, 0, 0.25));
    while (i < 2) {
      this.liveBowlingPins.push(
        new BowlingPin(secondRowStartPoint, 0.3, scene)
      );
      secondRowStartPoint = secondRowStartPoint.add(new Vector3(0.3, 0, 0));
      i += 1;
    }

    // create pins at third row
    i = 0;
    var thirdRowStartPoint = pinStartPoint.add(new Vector3(-0.30, 0, 0.50));
    while (i < 3) {
      this.liveBowlingPins.push(
        new BowlingPin(thirdRowStartPoint, 0.3, scene)
      );
      thirdRowStartPoint = thirdRowStartPoint.add(new Vector3(0.3, 0, 0));
      i += 1;
    }

    i = 0;
    var fourthRowStartPoint = pinStartPoint.add(new Vector3(-0.45, 0, 0.75));
    while (i < 4) {
      this.liveBowlingPins.push(
        new BowlingPin(fourthRowStartPoint, 0.3, scene)
      );
      fourthRowStartPoint = fourthRowStartPoint.add(new Vector3(0.3, 0, 0));
      i += 1;
    }

    console.log("live pins created: " + this.liveBowlingPins.length);
  }
}
