import {
  ActionManager,
  Color3,
  Color4,
  ExecuteCodeAction,
  GizmoManager,
  Material,
  MeshBuilder,
  PhysicsImpostor,
  Scene,
  StandardMaterial,
  Tags,
  Vector3,
} from "babylonjs";
import { Atom, Element, TextPlane } from "./components/meshes";
import { Util } from "./util";
import { BALLTYPE, Spawner } from "./spawner";
import { Timer} from "./timer";
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
  bowlingScore: number;
  bowlingScoreTextplane: TextBlock;
  liveBowlingPins: Array<BowlingPin>;

  constructor(scene: Scene) {
    this.scene = scene;
    this.basketballScore = 0;
    this.bowlingScore = 0;
    this.liveBowlingPins = new Array<BowlingPin>();

    // create a skybox
    Util.createSkybox(scene);

    this.buildBasketballCourt(new Vector3(0, 0, 0), 3, scene);
    this.buildBowling(new Vector3(7.815, 0.65, 4.5), 30, scene);
    this.buildSurroundingEnvironment(new Vector3(0, 0, 0), 1, scene);
  }

  buildSurroundingEnvironment(position: Vector3, scale: number, scene: Scene) {
    //Tree generator
    for (let i = 0; i < 50; ++i)
    {
      var x = 0;
      var y = 0;
      while ((x < 10 && x > -10) && (y < 10 && y > -10))
      {
        x = -40 + 80 * Math.random();
        y = -40 + 80 * Math.random();
      }
      Util.loadModel(
        "assets/models/",
        "tree_low-poly.glb",
        new Vector3(x, 0, y),
        0.004 + 0.002 * Math.random(),
        scene
      );
    }

    //Line the edges with rocks
    for (let i = 0; i < 10; ++i)
    {
      Util.loadModel(
        "assets/models/",
        "low_poly_rock_1.glb",
        new Vector3(-40, 0, -40 + 8 * i),
        9 + 2 * Math.random(),
        scene
      );
      Util.loadModel(
        "assets/models/",
        "low_poly_rock_1.glb",
        new Vector3(40, 0, -40 + 8 * i),
        9 + 2 * Math.random(),
        scene
      );
      Util.loadModel(
        "assets/models/",
        "low_poly_rock_1.glb",
        new Vector3(-40 + 8 * i, 0, -40),
        9 + 2 * Math.random(),
        scene
      );
      Util.loadModel(
        "assets/models/",
        "low_poly_rock_1.glb",
        new Vector3(-40 + 8 * i, 0, 40),
        9 + 2 * Math.random(),
        scene
      );
    }
  }


  buildBasketballCourt(position: Vector3, scale: number, scene: Scene) {
  
    // load basketball court model
    Util.loadModel(
      "assets/models/",
      "basketball_court.glb",
      position,
      scale,
      scene
    );

    // add backboards
    this.buildBackboard(new Vector3(0, 3.3, 6.18), scale, scene);
    this.buildBackboard(new Vector3(0, 3.3, -6.18), scale, scene);

    // add scoreboard
    const scoreboard = this.buildScoreboard(new Vector3(0, 4.175, 6), scene);
    this.basketballScoreTextplane = scoreboard.textBlock;

    // create rim mesh
    this.buildRim(new Vector3(0, 3, 5.7), scale, scene);
    this.buildRim(new Vector3(0, 3, -5.7), scale, scene);

    // add colliders to fence
    this.addBasketballEnvironmentColliders(scene);

    // add a basketball spawner
    const basketballSpawner = new Spawner(BALLTYPE.BASKETBALL, new Vector3(-1.2, 3, 0.8), this, scene);

    // add a basketball countdown timer
    const basketballTimer = new Timer(new Vector3(1.2, 3, 0.8), new Vector3(0, 4.8, 6), 30, this, scene);
  }

  addBasketballEnvironmentColliders(scene: Scene) {
    const wall1 = MeshBuilder.CreateBox(
      "wall1",
      { size: 1, width: 12, height: 2.5 },
      scene
    );
    wall1.position = new Vector3(0, 1.5, 8.8);
    Tags.AddTagsTo(wall1, "basketballEnvironmentCollider");

    const wall2 = MeshBuilder.CreateBox(
      "wall2",
      { size: 1, width: 12, height: 2.5 },
      scene
    );
    wall2.position = new Vector3(0, 1.5, -8.8);
    Tags.AddTagsTo(wall2, "basketballEnvironmentCollider");

    const wall3 = MeshBuilder.CreateBox(
      "wall3",
      { size: 8, width: 0.25, height: 2.5 },
      scene
    );
    wall3.position = new Vector3(-5.95, 1.5, 5.1);
    Tags.AddTagsTo(wall3, "basketballEnvironmentCollider");

    const wall4 = MeshBuilder.CreateBox(
      "wall4",
      { size: 8, width: 0.25, height: 2.5 },
      scene
    );
    wall4.position = new Vector3(5.95, 1.5, 5.1);
    Tags.AddTagsTo(wall4, "basketballEnvironmentCollider");

    const wall5 = MeshBuilder.CreateBox(
      "wall5",
      { size: 8, width: 0.25, height: 2.5 },
      scene
    );
    wall5.position = new Vector3(5.95, 1.5, -5.1);
    Tags.AddTagsTo(wall5, "basketballEnvironmentCollider");

    const wall6 = MeshBuilder.CreateBox(
      "wall6",
      { size: 8, width: 0.25, height: 2.5 },
      scene
    );
    wall6.position = new Vector3(-5.95, 1.5, -5.1);
    Tags.AddTagsTo(wall6, "basketballEnvironmentCollider");

    const wallMaterial = new StandardMaterial("wall material", scene);
    wallMaterial.alpha = 0.0;

    const walls = scene.getMeshesByTags("basketballEnvironmentCollider");
    //console.log("number of objects with basketballEnvironmentCollider tag: " + walls.length);
    walls.forEach(function (wall) {
      // add material
      wall.material = wallMaterial;

      // add physics impostor
      wall.physicsImpostor = new PhysicsImpostor(
        wall,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, friction: 1, restitution: 1 }
      );
    });
  }

  buildScoreboard(position: Vector3, scene: Scene) {
    const scoreboard = new TextPlane(
      "basketball scoreboard",
      1.5,
      0.75,
      position.x,
      position.y,
      position.z,
      this.basketballScore.toString(),
      "black",
      "orange",
      30,
      scene
    );

    const scoreboardCollider = MeshBuilder.CreateBox("scoreboardCollider", {
      size: 0.2,
      width: 1.45,
      height: 0.72
    });
    scoreboardCollider.position = position.add(new Vector3(0, 0, 0.1));

    scoreboardCollider.physicsImpostor = new PhysicsImpostor(scoreboard.mesh, PhysicsImpostor.BoxImpostor, {
      mass: 0, friction: 1, restitution: 0.5
    })

    scoreboardCollider.material = new StandardMaterial("scoreboardCollider", scene);
    scoreboardCollider.material.alpha = 0.0;

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
    rimMaterial.alpha = 0.0;
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
        size: 0.1,
        width: 0.59,
        height: 0.34,
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
        restitution: 0.5,
      }
    );
    // make it transparent
    const backboardMaterial = new StandardMaterial("backboard material", scene);
    backboardMaterial.alpha = 0.0;
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

    Util.loadModel(
      "assets/models/",
      "amogus.glb",
      new Vector3(5.5, 0.635, -8),
      9,
      scene
    );

    // add scoreboard
    const scoreboard = this.buildScoreboard(new Vector3(7.814, 3.118, 8.06), scene);
    this.bowlingScoreTextplane = scoreboard.textBlock;

    const scoreDetector = new ScoreDetector(
      "bowling score detector",
      scoreboard.mesh.position,
      1,
      this.bowlingScore,
      this.bowlingScoreTextplane,
      scene
    );

    this.placeBowlingPins(this.bowlingScoreTextplane, scene);

    // add bowling ball spawner
    const bowlingballSpawner = new Spawner(BALLTYPE.BOWLINGBALL, new Vector3(9.408, 1.5, -1.525), this, scene);

    // add bowling countdown timer
    const bowlingTimer = new Timer(new Vector3(9.408, 2.5, -1.525), new Vector3(7.815, 3.8, 8.06), 30, this, scene);

    // add reset switch
    const bowlingPinSpawner = new Spawner(BALLTYPE.BOWLINGPIN, new Vector3(9.215, 3.0, 8.149), this, scene);
    bowlingPinSpawner.mesh.rotate(Vector3.Up(), Math.PI/2);

    this.addBowlingEnvironmentColliders(scene);

    const bowlingTrack = MeshBuilder.CreateBox("bowlingTrack",{size: 8, width: 1.75, height: 0.25}, scene);
    bowlingTrack.position.set(7.8, 0.8, 4.8);
    bowlingTrack.material = new StandardMaterial("bowlingTrackMaterial", scene);
    bowlingTrack.material.alpha = 0;
  }

  addBowlingEnvironmentColliders(scene: Scene) {
    const leftBoundary = MeshBuilder.CreateBox(
      "leftBoundary",
      { size: 8, width: 0.2, height: 0.5 },
      scene
    );
    leftBoundary.position = new Vector3(6.365, 0.7, 4.9);
    Tags.AddTagsTo(leftBoundary, "bowlingEnvironmentCollider");

    const rightBoundary = MeshBuilder.CreateBox(
      "rightBoundary",
      { size: 8, width: 0.2, height: 0.5 },
      scene
    );
    rightBoundary.position = new Vector3(9.26, 0.7, 4.9);
    Tags.AddTagsTo(rightBoundary, "bowlingEnvironmentCollider");

    const Digibowl = MeshBuilder.CreateBox(
      "Digibowl",
      { size: 0.5, width: 3.3, height: 1.2 },
      scene
    );
    Digibowl.position = new Vector3(7.815, 2.168, 8.35);
    Tags.AddTagsTo(Digibowl, "bowlingEnvironmentCollider");

    const DigibowlLeft = MeshBuilder.CreateBox(
      "DigibowlLeft",
      { size: 0.5, width: 0.3, height: 0.6 },
      scene
    );
    DigibowlLeft.position = new Vector3(6.318, 1.28, 8.348);
    Tags.AddTagsTo(DigibowlLeft, "bowlingEnvironmentCollider");

    const DigibowlRight = MeshBuilder.CreateBox(
      "DigibowlRight",
      { size: 0.5, width: 0.3, height: 0.6 },
      scene
    );
    DigibowlRight.position = new Vector3(9.314, 1.28, 8.348);
    Tags.AddTagsTo(DigibowlRight, "bowlingEnvironmentCollider");

    const wallMaterial = new StandardMaterial("wall material", scene);
    wallMaterial.alpha = 0.0;

    const walls = scene.getMeshesByTags("bowlingEnvironmentCollider");
    walls.forEach(function (wall) {
      // add material
      wall.material = wallMaterial;

      // add physics impostor
      wall.physicsImpostor = new PhysicsImpostor(
        wall,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, friction: 0.1, restitution: 0.1 }
      );
    });

    const gutterMaterial = new StandardMaterial("gutter material", scene);
    gutterMaterial.diffuseColor = Color3.Black();
    
    const leftGutter = MeshBuilder.CreateBox(
      "leftGutter",
      { size: 9, width: 0.45, height: 0.5 },
      scene
    );
    leftGutter.position = new Vector3(6.68, 0.4, 5.38);
    leftGutter.material = gutterMaterial;

    const rightGutter = MeshBuilder.CreateBox(
      "rightGutter",
      { size: 9, width: 0.45, height: 0.5 },
      scene
    );
    rightGutter.position = new Vector3(8.946, 0.4, 5.38);
    rightGutter.material = gutterMaterial;

    const alleyEnd = MeshBuilder.CreateBox(
      "alleyEnd",
      { size: 1.5, width: 2.5, height: 0.5 },
      scene
    );
    alleyEnd.position = new Vector3(7.836, 0.41, 9.777);
    alleyEnd.material = gutterMaterial;
  }

  placeBowlingPins(scoreTextblock: TextBlock, scene: Scene) {
    // create pin at the front
    const pinStartPoint = new Vector3(7.83, 0.9, 7.2);
    const firstPin = new BowlingPin(pinStartPoint, 0.3, scoreTextblock, scene)
    Tags.AddTagsTo(firstPin.mesh, "firstPin");
    this.liveBowlingPins.push(firstPin);

    // create pins at second row
    var i = 0;
    var secondRowStartPoint = pinStartPoint.add(new Vector3(-0.15, 0, 0.25));
    while (i < 2) {
      this.liveBowlingPins.push(
        new BowlingPin(secondRowStartPoint, 0.3, scoreTextblock, scene)
      );
      secondRowStartPoint = secondRowStartPoint.add(new Vector3(0.3, 0, 0));
      i += 1;
    }

    // create pins at third row
    i = 0;
    var thirdRowStartPoint = pinStartPoint.add(new Vector3(-0.3, 0, 0.5));
    while (i < 3) {
      this.liveBowlingPins.push(new BowlingPin(thirdRowStartPoint, 0.3, scoreTextblock, scene));
      thirdRowStartPoint = thirdRowStartPoint.add(new Vector3(0.3, 0, 0));
      i += 1;
    }

    i = 0;
    var fourthRowStartPoint = pinStartPoint.add(new Vector3(-0.45, 0, 0.75));
    while (i < 4) {
      this.liveBowlingPins.push(
        new BowlingPin(fourthRowStartPoint, 0.3, scoreTextblock, scene)
      );
      fourthRowStartPoint = fourthRowStartPoint.add(new Vector3(0.3, 0, 0));
      i += 1;
    }

    console.log("live pins created: " + this.liveBowlingPins.length);

    console.log("first pin rotation: " + firstPin.mesh.rotation);
  }
}
