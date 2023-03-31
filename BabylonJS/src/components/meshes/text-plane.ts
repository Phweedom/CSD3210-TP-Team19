import { Mesh, MeshBuilder, Scene } from "babylonjs";
import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";

/**
 * Creates a plane with text on it.
 *
 * @class TextPlane
 * @author Lim Min Ye
 */
export class TextPlane {
  public mesh: Mesh;
  public textBlock: TextBlock;
  constructor(
    name: string,
    width: number,
    height: number,
    x: number,
    y: number,
    z: number,
    text: string,
    backgroundColor: string,
    textColor: string,
    fontSize: number,
    scene: Scene
  ) {
    // create a 2D plane and set its position
    const textPlane = MeshBuilder.CreatePlane(name + " text plane", {
      width: width,
      height: height,
    });

    textPlane.position.set(x, y, z);

    // creating texture for helloPlane
    const planeTexture = AdvancedDynamicTexture.CreateForMesh(
      textPlane,
      width * 100,
      height * 100,
      false
    );
    planeTexture.background = backgroundColor;

    // creating text
    const planeText = new TextBlock(name + " plane text"); //holds text information
    planeText.text = text;
    planeText.color = textColor;
    planeText.fontSize = fontSize;

    // applying text to the texture
    planeTexture.addControl(planeText);

    this.mesh = textPlane;
    this.textBlock = planeText;
  }
}
