import { Mesh, Observable, Scene, Vector3 } from "babylonjs";
import { Atom, Compound, Element } from "./components/meshes";
import { Basketball } from "./basketball";
import * as CANNON from "cannon-es";

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
            onPositionhangeObservable.notifyObservers([
              currentRBPosition
          ])

        
        }

      });
    });

    ball.onPositionhangeObservable = onPositionhangeObservable;

    ball.onPositionhangeObservable.add((newPosition) => {
        ball.previousPosition = newPosition[0];

        ball.mesh.position.x = newPosition[0].x;
        ball.mesh.position.y = newPosition[0].y;
        ball.mesh.position.z = newPosition[0].z;
    })
  }
}
