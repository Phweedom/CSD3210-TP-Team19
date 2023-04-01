# CSD3120-IPA

Name: Lim Min Ye
Student ID: 2001477

This project is a standalone WebXR application, developed using TypeScript, BabylonJS, and several other dependencies. It 
simulates a classroom environment where students can learn about Synthesis Reactions. This application was built to run on 
a web browser on a PC or on Meta Quest 2.

This readme contains information regarding:
1. obtaining dependencies
2. running the application
3. mouse and keyboard controls
4. Meta Quest 2 controls

1. Here is a list of the various dependencies used in this project and how to obtain them:
   1.1 NPM (Node Package Manager). NPM is a command line tool use for installing, updating, or uninstalling Node.js packages.
       It can be installed through the command console, using this line: 
         npm install -g npm

   1.2 Node.js. Node.js allows us to run JavaScript code without using the browser. Node.js will be installed along with NPM.

   1.3 Babylon.js. Babylon.js is a WebGL-based 3D engine that has tools to create, display, and texture meshes in space, and add
       light sources and cameras. It can be installed through the command console, using this line: 
         npm install --save babylonjs babylonjs-materials babylonjs-gui babylongjs-loaders

   1.4 webpack, webpack-cli, webpack-dev-server, html-webpack-plugin. Webpack is a static module bundler used for JavaScript 
       applications. It transforms front-end assets such as HTML, CSS and images into valid modules. They can be installed through 
       the command console, using this line: 
         npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin copy-webpack-plugin

   1.5 Typescript, ts-loader. Typescript is a strict syntactical superset of JavaScript and adds optional static typing to the 
       language. They can be installed throught the command console, using this line: 
         npm install --save-dev typescript ts-loader

2. Instructions on how to run the application:
   2.1 Running the application on PC browser: 
      2.1.1 On a linux console, navigate to the folder containing the project files
      2.1.2 Enter the following line:
                  npm run start
      2.1.3 A new tab on your browser will open, showing the application.

   2.2 Running the application on Meta Quest 2:
      2.2.1 Ensure that adb is installed on your PC.
      2.2.2 Connect the Meta Quest 2 headset to your PC using a cable.
      2.2.3 Open a command prompt and enter the following line, checking that your device is connected:
            adb devices
      2.2.4 Enter the following line to reverse port-forwarding so that you can access localhost on the Meta Quest 2:
            adb reverse tcp:3000 tcp:3000
      2.2.5 On the Meta Quest 2 browser, go to:
            http://localhost:3000
      2.2.6 The app will start running.

3. Mouse and keyboard controls:
   3.1 Look around
      3.1.1 To look around, drag the mouse around while holding down the left mouse button. Note that you must not be
            clicking on any atoms while trying to move the camera.

   3.2 Grabbing interaction
      3.2.1 To grab an object, click on it using the left mouse button and keep holding it down, and move the mouse around. By
            default, you can only move objects around horizontally. 
      3.2.2 To move objects vertically, press 'Q' on the keyboard to toggle the Translate Gizmo. When the Translate Gizmo is 
            active, click on the arrows and drag them using your mouse to move the target object.

   3.3 Attaching atoms:
      3.3.1 While grabbing an atom, you can move it close to another atom to combine them into a compound. Note that this will 
            only work if the atoms are reactive to each other. E.g. trying to combine an oxygen atom to a chlorine atom will not
            work because these elements do not react with each other.

   3.4 Rotating:
      3.4.1 Press 'W' to toggle the Rotation Gizmo. Drag the corresponding axes to rotate the target object.

   3.5 Scaling:
      3.5.1 Press 'E' to toggle the Scaling Gizmo. Drag the white cube at the centre of the target object to scale it.

   3.6 Movement:
      3.6.1 Use arrow keys to move.

4. Meta Quest 2 controls:
   3.1 Look around
      3.1.1 To look around, simply turn your head around while wearing the Meta Quest 2 headset.

   3.2 Grabbing interaction
      3.2.1 To grab an object, move close to the object and reach out to the object with the Meta Quest 2 controller, then 
            hold the trigger to grab the object.
      3.2.2 To let go of the object, simply release the trigger.

   3.3 Attaching atoms:
      3.3.1 While grabbing an atom, you can move it close to another atom to combine them into a compound. Note that this will 
            only work if the atoms are reactive to each other. E.g. trying to combine an oxygen atom to a chlorine atom will not
            work because these elements do not react with each other.

   3.4 Rotating:
      3.4.1 Point the Meta Quest 2 controller at the 'Toggle Rotation Gizmo' button (on the wall beside the whiteboard) and 
            press the trigger to toggle the Rotation Gizmo. Drag the corresponding axes to rotate the target object. 

   3.5 Scaling:
      3.5.1 Point both Meta Quest 2 controllers at the target object and hold the triggers. While holding the triggers, move them
            away from each other to scale the target object.

   3.6 Movement:
      3.6.1 Point the Meta Quest 2 controller at the floor and hold the trigger for 2 seconds. You will then teleport to that 
            location. Note that you will always snap to a certain height above the floor.