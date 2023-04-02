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
import {BowlingPin} from "./bowlingPin"
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
  
  constructor(scene: Scene) {
    this.scene = scene;
    this.basketballScore = 0;
    
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
    const scoreboard = this.buildScoreboard(new Vector3(0, 3.6, 6), scene);
    this.basketballScoreTextplane = scoreboard.textBlock;

    // create rim mesh
    this.buildRim(new Vector3(0, 3, 5.7), scale, scene);
    this.buildRim(new Vector3(0, 3, -5.7), scale, scene);

    // rim for testing
    this.buildRim(new Vector3(1, 1, 1), scale, scene);
    
    
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
      "black",
      "orange",
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

    var i = 0;
    while (i < 4) {
      new BowlingPin(new Vector3(-1 + (i * 0.3), 0.9, 5), 0.3, scene);
      i += 1;
    }
    i = 0;
    while (i < 3) {
      new BowlingPin(new Vector3(-0.8 + (i * 0.3), 0.9, 4.5), 0.3, scene);
      i += 1;
    }
    i = 0;
    while (i < 2) {
      new BowlingPin(new Vector3(-0.6 + (i * 0.3), 0.9, 4), 0.3, scene);
      i += 1;
    }
    new BowlingPin(new Vector3(-0.4, 0.9, 3.5), 0.3, scene);


    const basketball = new Basketball(new Vector3(1, 0.65, 3), scene);
  }

  
}
