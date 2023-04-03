import {
  AbstractMesh,
  ActionManager,
  Animation,
  CannonJSPlugin,
  Color3,
  Color4,
  CubeTexture,
  ExecuteCodeAction,
  GizmoManager,
  GroundMesh,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  ParticleSystem,
  PhysicsImpostor,
  PointLight,
  Scene,
  SceneLoader,
  Sound,
  StandardMaterial,
  Texture,
  UniversalCamera,
  Vector3,
  VideoDome,
} from "babylonjs";
import { App } from "./app";
import { TextPlane } from "./components/meshes/text-plane";
import * as CANNON from "cannon";

/**
 * A collection of utility functions.
 *
 * By defining functions using the 'static' keyword, they can be called without having to
 * create an instance of Util.
 */
export class Util {
  /**
   * Creates a camera, which will allow the user to see scene.
   *
   * @param scene is the scene that the camera belongs to.
   */
  static createCamera(scene: Scene, canvas: HTMLCanvasElement) {
    // UniversalCamera is a camera that allows for directional movement.
    const camera = new UniversalCamera("uniCamera", new Vector3(0), scene);

    // allows for the camera to be controlled by user input.
    camera.attachControl(canvas, true);
  }

  /**
   * Creates lights for the scene. Without this function, 3D objects will appear completely black.
   *
   * @param scene is the scene to create lights for.
   */
  static createLights(scene: Scene) {
    // HemisphericLight simluates ambient environment light.
    // the Direction vector is is the light reflection direcion, not the incoming direction.
    // i.e. (0, 1, 0) means the light is reflecting upwards.
    const hemiLight = new HemisphericLight(
      "hemLight",
      new Vector3(0, 1, 0),
      scene
    );
    hemiLight.intensity = 0.5;
    hemiLight.diffuse = new Color3(1, 1, 1);

    // PointLight is a single point that emits light in every direction.
    const pointLight = new PointLight(
      "pointLight",
      new Vector3(0, 1.5, 2),
      scene
    );
    pointLight.intensity = 1;
    pointLight.diffuse = new Color3(1, 0, 0);
  }

  /**
   * Loads 3D models into a scene.
   *
   * @param scene is the scene to load models into.
   */
  static loadModel(
    filepath: string,
    modelname: string,
    position: Vector3,
    scaleFactor: number,
    scene: Scene
  ) {
    //importing a mesh into the scene.
    SceneLoader.ImportMeshAsync("", filepath, modelname, scene).then(
      (result) => {
        const root = result.meshes[0];
        root.id = modelname;
        root.name = modelname;
        root.position = position;
        root.rotate(Vector3.Up(), Math.PI/2);
        root.scaling.scaleInPlace(scaleFactor);

        result.meshes.forEach(mesh => {
          if (mesh.material) {
              mesh.material.backFaceCulling = true;
          }
      });
      }
    );
    // SceneLoader.ImportMesh("", filepath, modelname, scene, function (result) {
    //     const root = result[0];
    //     root.id = modelname;
    //     root.name = modelname;
    //     root.position = position;
    //     root.rotate(Vector3.Up(), Math.PI/2);
    //     root.scaling.setAll(scaleFactor);
    // });


  }

  /**
   * Records and adds an animation to a model.
   *
   * @param scene is the scene where the model belongs.
   * @param model is the model to animate.
   */
  static createAnimation(scene: Scene, model: AbstractMesh) {
    // defining a new animation
    const animation = new Animation(
      "rotationAnima",
      "rotation",
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    // key points in the animation.
    // babylonJS' animation system will automatically interpolate between the these key frames.
    const keyframes = [
      { frame: 0, value: new Vector3(0, 0, 0) },
      { frame: 30, value: new Vector3(0, 2 * Math.PI, 0) },
    ];
    animation.setKeys(keyframes);

    // add the newly defined animation to the model
    model.animations = [];
    model.animations.push(animation);

    // begin the animation
    scene.beginAnimation(model, 0, 30, true);
  }

  /**
   * Adds audio tracks to the scene.
   *
   * @param scene is the scene to add audio tracks to.
   */
  static addSounds(scene: Scene, app: App) {
    // if autoplay is true, then the sound will play once the app starts running.
    app.sound = new Sound(
      "music",
      "assets/sounds/gateron milky yellows.m4a",
      scene,
      null,
      { loop: true, autoplay: false }
    );
  }

  /**
   * Creates particle effects.
   *
   * @param scene is the scene to create the particle effects in.
   */
  static createParticles(scene: Scene) {
    // define a new particle system
    const particleSystem = new ParticleSystem("particles", 5000, scene);
    particleSystem.particleTexture = new Texture(
      "assets/textures/Flare.png",
      scene
    );

    particleSystem.emitter = new Vector3(0, 0, 0);
    particleSystem.minEmitBox = new Vector3(0, 0, 0);
    particleSystem.maxEmitBox = new Vector3(0, 0, 0);

    // color4 because R, G, B, and Alpha
    particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color1 = new Color4(0.3, 0.5, 1.0, 1.0);
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

    particleSystem.minSize = 0.01;
    particleSystem.maxSize = 0.05;

    (particleSystem.minLifeTime = 0.3), (particleSystem.maxLifeTime = 1.5);

    particleSystem.emitRate = 1500;

    particleSystem.direction1 = new Vector3(-1, 8, 1);
    particleSystem.direction2 = new Vector3(1, 8, -1);

    particleSystem.minEmitPower = 0.2;
    particleSystem.maxEmitPower = 0.8;
    particleSystem.updateSpeed = 0.01;

    particleSystem.gravity = new Vector3(0, -9.8, 0);
    particleSystem.start();
  }

  /**
   * Creates a skybox.
   *
   * @param scene is the scene to create the skybox for.
   */
  static createSkybox(scene: Scene) {
    // define a new skybox. scene parameter is optional.
    const skybox = MeshBuilder.CreateBox("skybox", { size: 1000 }, scene);

    // choose skybox material
    const skyboxMaterial = new StandardMaterial("skybox-mat");

    // set backface culling to false because we need to see the inside of the skybox,
    // because we are inside the skybox.
    skyboxMaterial.backFaceCulling = false;

    skyboxMaterial.reflectionTexture = new CubeTexture(
      "assets/textures/skybox",
      scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    const animation = new Animation(
      'rotationAnimation', 'rotation', 0.01,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
    const keyFrames = [
        {frame: 0, value: new Vector3(0, 0, 0)},
        {frame: 30, value: new Vector3(0, 2 * Math.PI, 0)},
    ]
    animation.setKeys(keyFrames);

    skybox.animations = [];
    skybox.animations.push(animation);
    scene.beginAnimation(skybox, 0, 30, true);
  }

  /**
   * Sets a video as a skybox.
   *
   * @param scene is the scene to set the video sky dome for.
   */
  static createVideoSkyDome(scene: Scene) {
    // define a new VideoDome
    const dome = new VideoDome(
      "videoDome",
      "assets/videos/bridge-360.mp4",
      {
        resolution: 32,
        size: 1000,
      },
      scene
    );
  }

  /**
   * Creates a text with background and make it clickable.
   *
   * @param scene is the scene to create the text in.
   */
  static createText(scene: Scene) {
    const helloPlane = new TextPlane(
      "hello plane",
      3,
      1,
      0,
      2,
      5,
      "Hello XR",
      "white",
      "purple",
      60,
      scene
    );

    // if mouse click is released anywhere within helloPlane, show a dialog box
    // containing the coordinates of the point where mouse click was released.
    helloPlane.textBlock.onPointerUpObservable.add((evtData) => {
      alert("Hello Text at:\n x: " + evtData.x + " y:" + evtData.y);
    });
  }

  /**
   * Toggles the inspector. metaKey is Windows key (for Windows OS).
   *
   * @param scene is the scene to add this toggle to.
   */
  static addInspectorKeyboardShortcut(scene: Scene) {
    window.addEventListener("keydown", (e) => {
      if (e.metaKey && e.ctrlKey && e.key === "i") {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        } else {
          scene.debugLayer.show();
        }
      }
    });
  }

  static createGround(
    size: number,
    width: number,
    height: number,
    position: Vector3,
    scene: Scene
  )/*: GroundMesh*/ : Mesh{
    const groundMaterial = new StandardMaterial("ground material", scene);
    groundMaterial.alpha = 1.0;
    groundMaterial.backFaceCulling = true;
    groundMaterial.diffuseTexture = new Texture("assets/textures/grass.png", scene);
    groundMaterial.diffuseColor = new Color3(0.35, 0.5, 0.25);

    const ground = MeshBuilder.CreateBox(
      "ground",
      { size: size, width: width, height: height },
      scene
    );

    ground.material = groundMaterial;
    ground.position = position;

    //scene.enablePhysics(new Vector3(0, -9.82, 0), new CannonJSPlugin(true, 10, CANNON));

    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor, {
        mass: 0,
        friction: 1,
        restitution: 1
      }
    )

    return ground;
  }

  /**
   * Prints the name of the mesh that has been clicked on.
   *
   * @param canvas is the HTMLCanvasElement where the scene is rendered on.
   * @param scene is the scene that is being rendered.
   */
  static printMeshName(canvas: HTMLCanvasElement, scene: Scene) {
    canvas.addEventListener("click", (event) => {
      const pickResult = scene.pick(event.clientX, event.clientY);

      if (pickResult.hit) {
        console.log(pickResult.pickedMesh?.name + " position: " + pickResult.pickedMesh?.position);
      }
    });
  }

  /**
   * Enables toggling of Translation, Rotation, Scaling, and BoundingBox gizmos
   * by pressing Q, W, E, and R respectively.
   *
   * @param scene is the scene to enable this toggling function for.
   */
  static addToggles(scene: Scene) {
    const gizmoManager = new GizmoManager(scene);

    scene.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnKeyUpTrigger,
          parameter: "q",
        },
        () => {
          if (gizmoManager.positionGizmoEnabled)
            gizmoManager.positionGizmoEnabled = false;
          else gizmoManager.positionGizmoEnabled = true;
        }
      )
    );

    scene.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnKeyUpTrigger,
          parameter: "w",
        },
        () => {
          if (gizmoManager.rotationGizmoEnabled)
            gizmoManager.rotationGizmoEnabled = false;
          else gizmoManager.rotationGizmoEnabled = true;
        }
      )
    );

    scene.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnKeyUpTrigger,
          parameter: "e",
        },
        () => {
          if (gizmoManager.scaleGizmoEnabled)
            gizmoManager.scaleGizmoEnabled = false;
          else gizmoManager.scaleGizmoEnabled = true;
        }
      )
    );

    scene.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnKeyUpTrigger,
          parameter: "r",
        },
        () => {
          if (gizmoManager.boundingBoxGizmoEnabled)
            gizmoManager.boundingBoxGizmoEnabled = false;
          else gizmoManager.boundingBoxGizmoEnabled = true;
        }
      )
    );
  }
}
