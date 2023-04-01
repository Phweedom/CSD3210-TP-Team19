# CSD3210-TP-Team19
**Group Members:** <br>
1. Zhuo Yijian (2001237)<br>
2. Noel Ho Sing Nam (2000677)<br>
3. Wang Nian Jing, Ryan (2000571)<br>
4. Lim Min Ye (2001477)<br>
5. Quah Joon Hui Conant (2002655)<br>
6. Tan Egi (2002777)
7. Zandra Phua Si-Yu (2002510)
8. Tan Wei Wen (2002514)

## Agenda
- Software Architecture
- Dependencies required
- Instructions to obtain dependencies
- Build project
    - for Development
    - for Release
- Instructions for WebXR
- Credits

## Software Architecture
**Overview:** Creating an arcade sports VR application software for users to enjoy an arcade like experience anywhere and anytime.

**Description:** Our team project consist of replicating an sport arcade environment where players are able to experience throwing a basketball or a bowling ball.

- **Source folder (src)** - contains all the source code needed to run this application.

    - **Component folder** - contains all the different class object that can be created in BabylonJS such as sphere, models and video plane. This is done for easier creation of object using one liner instead of having repeated codes.

- **public/assets** - contains all the textures, videos, sounds and models in this project

<hr>

## Dependencies required
1. babylonjs
2. babylonjs loaders
3. babylonjs-materials
4. babylonjs-gui.

<hr>

## Instructions to obtain dependencies
<mark>To download everything</mark> that is needed, run `npm install` in the terminal (Powershell).

To download the packages individually, type in the command below in the terminal one by one.

1. `npm install --save babylonjs`
2. `npm install --save babylonjs-loaders`
3. `npm install --save babylonjs-materials` (TBC)
4. `npm install --save babylonjs-gui`

<hr>

## Build project for Development
For every changes made to the project, the project will be rebuilt and the changes will be reflected on the website.

1. Make sure that the directory is in WebXR
2. Run this command in the terminal `npm run serve`
2. Open chrome and go to 'localhost:[portNo.]'

<hr>

<div id='release'></div>

## Build project for Release
This is for distributing the project to others.

1. Open a new terminal
2. From the base project path (inside WebXR), run the command on terminal:
    - `cd dist`
    - `python -m http.server`
3. Open chrome and go to 'localhost:[portNo.]'

*[Side Note: Download python here: https://www.python.org/downloads]*
<hr>

## Instructions for WebXR:
Application was tested in -TBC-, **<TBC Device>**.

Follow the instructions in <a href="#release">Build project for Release</a> for setup of project before testing the interactions.

>**For testing <TBC>:**

<br><br>

<hr>

## Credits:
