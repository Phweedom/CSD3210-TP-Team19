import {
  MultiPointerScaleBehavior,
  PointerDragBehavior,
  Vector3,
} from "babylonjs";
import { Atom, Compound } from "./components/meshes";

/**
 * Behavior contains functions that can add different behaviors to different objects.
 * The functions are declared static so that they can be used without having to create
 * an instance of Behavior.
 *
 * @class Behaviors
 * @author Lim Min Ye
 */
export class Behaviors {
  /**
   * Adds dragging behavior to an atom.
   *
   * @param atom is to object to add the dragging behavior to.
   */
  static addDragBehaviorToAtom(atom: Atom) {
    // setting dragPlaneNormal as (0, 1, 0) allows move along the X and Z axes
    const pointerDragBehavior = new PointerDragBehavior({
      dragPlaneNormal: Vector3.Up(),
    });

    atom.addBehavior(pointerDragBehavior);
  }

  /**
   * Adds dragging behavior to a compound.
   *
   * @param compound is to object to add the dragging behavior to.
   */
  static addDragBehaviorToCompound(compound: Compound) {
    // setting dragPlaneNormal as (0, 1, 0) allows move along the X and Z axes
    const pointerDragBehavior = new PointerDragBehavior({
      dragPlaneNormal: Vector3.Up(),
    });

    compound.addBehavior(pointerDragBehavior);
  }

  /**
   * Adds Multi-pointer scale behavior to an atom. This allows the atom to be scaled
   * when using VR controllers.
   *
   * @param atom is the atom to be scaled.
   */
  static addMultiPointerScaleBehaviorToAtom(atom: Atom) {
    const multiPointerScaleBehavior = new MultiPointerScaleBehavior();
    atom.addBehavior(multiPointerScaleBehavior);
  }

  /**
   * Adds Multi-pointer scale behavior to a compound. This allows the atom to be scaled
   * when using VR controllers.
   *
   * @param compound is the compound to be scaled.
   */
  static addMultiPointerScaleBehaviorToCompound(compound: Compound) {
    const multiPointerScaleBehavior = new MultiPointerScaleBehavior();
    compound.addBehavior(multiPointerScaleBehavior);
  }
}
