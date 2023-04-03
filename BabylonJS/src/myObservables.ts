import {
  Color3,
  Mesh,
  Observable,
  ParticleSystem,
  PointParticleEmitter,
  Scene,
  Sound,
  StandardMaterial,
  Texture,
  Vector3,
} from "babylonjs";
import { Atom, Compound, Element } from "./components/meshes";
import { Basketball } from "./basketball";
import { ScoreDetector } from "./scoreDetector";
//import * as CANNON from "cannon-es";
import { TextBlock } from "babylonjs-gui";
import { BowlingPin } from "./bowlingPin";

/**
 * MyObservables contains functions that can add various observables to virtual objects.
 *
 * @class MyObservables
 * @author Lim Min Ye
 */
export class MyObservables {
  /**
   * Adds on Observable to an Atom which will check the distance between that Atom and
   * all other atoms that it is combinable with. (E.g A Carbon atom will will have to
   * check the distances between itself and all other oxygen atoms.)
   *
   * If the distance is close enough, they will combine to form a new compound at the
   * position where the atoms met. The atoms will then be disposed.
   *
   * @param atom is the object to add the Observable to.
   * @param scene is the scene where the atom belongs.
   */
  static addOnDistanceChangeObservable(atom: Atom, scene: Scene) {
    const onDistanceChangeObservable = new Observable<[Element, number]>();

    // before each frame is rendered, check the distance from all combinable atoms.
    scene.onBeforeRenderObservable.add(() => {
      var combinableAtoms: Mesh[];

      // get an array of atoms of the combinable element
      switch (atom.element) {
        case Element.Carbon:
          combinableAtoms = scene.getMeshesByTags("oxygen");
          break;

        case Element.Oxygen:
          combinableAtoms = scene.getMeshesByTags("carbon");
          break;

        case Element.Sodium:
          combinableAtoms = scene.getMeshesByTags("chlorine");
          break;

        case Element.Chlorine:
          combinableAtoms = scene.getMeshesByTags("sodium");
          break;
      }

      // for each combinable atom, if it is close enough to this atom, then notify observers
      combinableAtoms.forEach(function (combinableAtom) {
        if (combinableAtom != atom.mesh) {
          const oxygenAtomObject = combinableAtom.metadata.object;

          const currentState = Vector3.Distance(
            atom.position,
            oxygenAtomObject.position
          );

          if (currentState < 1.2)
            onDistanceChangeObservable.notifyObservers([
              atom.element,
              combinableAtom.uniqueId,
            ]);
        }
      });
    });

    atom.onDistanceChangeObservable = onDistanceChangeObservable;

    atom.onDistanceChangeObservable.add((collision) => {
      var newElement: string;

      // determining the resultant compound
      switch (collision[0]) {
        case Element.Carbon:
          newElement = "carbon dioxide";
          break;

        case Element.Oxygen:
          newElement = "carbon dioxide";
          break;

        case Element.Sodium:
          newElement = "sodium chloride";
          break;

        case Element.Chlorine:
          newElement = "sodium chloride";
          break;
      }

      //change to new Compound
      new Compound(newElement, { diameter: 0.5 }, atom.position, scene);

      // clear observers from the atoms so they don't keep triggering
      atom.onDistanceChangeObservable.clear();
      scene
        .getMeshByUniqueId(collision[1])
        .metadata.object.onDistanceChangeObservable.clear();

      // destroy the old atoms
      atom.dispose();
      scene.getMeshByUniqueId(collision[1]).metadata.object.dispose();
    });
  }

  static addBasketballScoreObservable(
    scoreDetector: ScoreDetector,
    score: number,
    scoreTextblock: TextBlock,
    scene: Scene
  ) {
    const onIntersectObservable = new Observable<[boolean, Mesh]>();
    const scoreSound = new Sound('scoreSound', 'assets/sounds/score.mp3', scene, null);
    // register a function to run before each frame of the scene is rendered. This function
    // checks whether sphere is intersecting with helloSphere, and notifies onIntersectObservable
    // with the result (true or false).
    scene.registerBeforeRender(function () {
      const basketballs = scene.getMeshesByTags("basketball");
      
      // var i = 0;
      // while (i < basketballs.length) {
      //   if (basketballs[i].position.equals(Vector3.Zero()) ||basketballs[i].metadata.value == true) {
      //     //why they don't have not equal function
      //   } else {
      //     const spheresIntersecting = scoreDetector.mesh.intersectsMesh(
      //       basketballs[i],
      //       true,
      //       true
      //     );

      //     if (spheresIntersecting) {
      //       basketballs[i].metadata.value = true;
      //       //score += 1;
      //       console.log(
      //         "basketball and detector have intersected, basketball position is: " +
      //         basketballs[i].position
      //       );
      //       onIntersectObservable.notifyObservers([
      //         spheresIntersecting,
      //         basketballs[i],
      //       ]);
      //     }
      //   }
      //   i += 1;
      // }


      basketballs.forEach(function (basketball) {
        if (basketball.position.equals(Vector3.Zero()) || basketball.metadata.value == true) {
          //why they don't have not equal function
        } else {
          const spheresIntersecting = scoreDetector.mesh.intersectsMesh(
            basketball,
            true,
            true
          );

          if (spheresIntersecting) {
            basketball.metadata.value = true;
            console.log(
              "basketball and detector have intersected, basketball position is: " +
                basketball.position
            );
            scoreSound.play();
            //score += 1;
    
            var currentScore = parseInt(scoreTextblock.text);
            currentScore += 1;
    
    
            scoreTextblock.text = currentScore.toString();

            //Emit particles at location of scoring
            const particleSystem = new ParticleSystem("particleSystem", 5000, scene);
            particleSystem.particleTexture = new Texture("assets/textures/Flare.png");
            particleSystem.minEmitBox = new Vector3(0, 0, 0)
            particleSystem.maxEmitBox = new Vector3(0, 0, 0)
            particleSystem.worldOffset = basketball.position;
            particleSystem.emitRate = 1000;
            particleSystem.targetStopDuration = 0.05;
            particleSystem.disposeOnStop = true;
            particleSystem.gravity = new Vector3(0, -9.81, 0);
            particleSystem.direction1 = new Vector3(1, 1, 1);
            particleSystem.direction2 = new Vector3(-1, 1, -1);
            particleSystem.minEmitPower = 4;
            particleSystem.maxEmitPower = 6;
            particleSystem.minSize = 0.1;
            particleSystem.maxSize = 0.1;
            particleSystem.start();
    

            // onIntersectObservable.notifyObservers([
            //   spheresIntersecting,
            //   basketball,
            // ]);
          }
        }
      });
    });

    // assign onIntersectObservable as the onIntersectObservable property of helloSphere.
    // whenever onIntersectObservable emits an event, helloSphere will receive it.
    scoreDetector.onIntersectObservable = onIntersectObservable;

    // // storing red and white colors in variables
    // const redColor = Color3.Red();
    // const whiteColor = Color3.White();
    // const blueColor = Color3.Blue();

    // add a listener to the helloSphere.onIntersectObservable. Whenever onIntersectObservable
    // emits an event (aka when the two spheres intersect or stop intersecting), the callback
    // function below will be called with the boolean value indicating whether the two spheres
    // are intersecting.
    // scoreDetector.onIntersectObservable.add((isIntersecting) => {
    //   const material = isIntersecting[1].material as StandardMaterial;
    //   if (isIntersecting[0]) {
    //     //material.diffuseColor = blueColor;
    //     scoreSound.play();
    //     //score += 1;

    //     var currentScore = parseInt(scoreTextblock.text);
    //     currentScore += 1;


    //     scoreTextblock.text = currentScore.toString(); 


    //   }
    // });
  }






  static addBowlingScoreObservable(
    bowlingPin: BowlingPin,
    scoreTextblock: TextBlock,
    scene: Scene
  ) {
    const onFallObservable = new Observable<boolean>();

    // register a function to run before each frame of the scene is rendered. This function
    // checks whether sphere is intersecting with helloSphere, and notifies onIntersectObservable
    // with the result (true or false).
    scene.registerBeforeRender(function () {

      // const firstPin = scene.getMeshesByTags("firstPin")[0];
      // var radToDeg = Vector3.Zero();
      // radToDeg.setAll(180 / Math.PI);
      //const euler = firstPin.rotationQuaternion.toEulerAngles().multiply(radToDeg);
      //console.log(euler);
      //console.log("firstPin rotation: " + firstPin.rotationQuaternion.x + "   " + firstPin.rotationQuaternion.y);
      
      // const originalPosition = bowlingPin.mesh.metadata.value[0];
      // const distanceMoved = Vector3.Distance(originalPosition, bowlingPin.mesh.position);
      // const dirty = bowlingPin.mesh.metadata.value[1];
      // if (distanceMoved > 0.5 && !dirty) {
      //   // bowling pin has toppled, increment score
      //   var currentScore = parseInt(scoreTextblock.text);
      //   ++currentScore;
      //   scoreTextblock.text = currentScore.toString();
      //   bowlingPin.mesh.metadata.value[1] = true;
      // }

      // const absoluteXRotation = Math.abs(bowlingPin.mesh.rotationQuaternion.x);
      // const absoluteZRotation = Math.abs(bowlingPin.mesh.rotationQuaternion.z);
      // const dirty = bowlingPin.mesh.metadata.value;      
      // if (!dirty) {
      //   if (absoluteXRotation > 0.5 || absoluteZRotation > 0.5) {
      //     // bowling pin has toppled, increment score
      //     var currentScore = parseInt(scoreTextblock.text);
      //     ++currentScore;
      //     scoreTextblock.text = currentScore.toString();
  
      //     bowlingPin.mesh.metadata.value = true;
      //   }
      // }

      var radToDeg = Vector3.Zero();
      radToDeg.setAll(180 / Math.PI);
      const euler = bowlingPin.mesh.rotationQuaternion.toEulerAngles().multiply(radToDeg);
      //const dirty = bowlingPin.mesh.metadata.value; 
      const dirty = bowlingPin.dirty; 

      if (!dirty && ( Math.abs(euler.x) > 90 || Math.abs(euler.z) > 90 )) {
        // bowling pin has toppled, increment score
        var currentScore = parseInt(scoreTextblock.text);
        ++currentScore;
        scoreTextblock.text = currentScore.toString();
        if(currentScore == 10) {
          scoreTextblock.text = "STRIKE!";
        }
        bowlingPin.dirty = true;
        //onFallObservable.notifyObservers(bowlingPin.mesh.metadata.value);
      }





      });


// assign onIntersectObservable as the onIntersectObservable property of helloSphere.
    // whenever onIntersectObservable emits an event, helloSphere will receive it.
    bowlingPin.onFallObservable = onFallObservable;

    bowlingPin.onFallObservable.add((dirty) => {
      onFallObservable.clear();
    });

    };

    

   
  

















  static addOnPositionChangeObservable(ball: Basketball, scene: Scene) {
    const onPositionhangeObservable = new Observable<[Vector3]>();

    // before each frame is rendered, check the position of all basketballs
    scene.onBeforeRenderObservable.add(() => {
      var balls: Mesh[];
      balls = scene.getMeshesByTags("basketball");

      // for each basketball, check if current rigidbody position is same as previous
      balls.forEach(function (ball) {
        const previousRBPosition = ball.metadata.object.previousPosition;
        const currentRBPosition = ball.metadata.object.rididbody.position;

        if (previousRBPosition != currentRBPosition) {
          console.log(currentRBPosition);

          //notify observers
          onPositionhangeObservable.notifyObservers([currentRBPosition]);
        }
      });
    });

    ball.onPositionhangeObservable = onPositionhangeObservable;

    ball.onPositionhangeObservable.add((newPosition) => {
      ball.previousPosition = newPosition[0];

      ball.mesh.position.x = newPosition[0].x;
      ball.mesh.position.y = newPosition[0].y;
      ball.mesh.position.z = newPosition[0].z;
    });
  }
}
