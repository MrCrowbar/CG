"use strict"
var canvas;
var engine;
var demoScene;
var theoryScene;
var activeScene;
var camera;
var shapes = [];
var lights = [];
var colors = ["blue","yellow","green","red","white","purple"];
var diamond;
var controls;
var steel;
var glass;
var rubber;
var activeMaterial;
var theoryCube;
var materialList = [];
var swarm;


class Swarm extends THREE.Group{
    constructor(){
        super();
        var particleColor = new THREE.Color(0xffffff);
        var geometry = new THREE.SphereGeometry(0.1,8,6);
        var material = new THREE.MeshStandardMaterial({color: particleColor});
        for (var i = 0; i < 50; i++){
            var randX = Math.floor(Math.random() * 40) - 10;
            var randY = Math.floor(Math.random() * 40) - 10;
            var randZ = Math.floor(Math.random() * 40) - 10;
            var sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(randX, randY, randZ);
            this.add(sphere);
        }
    }

    rotate(){
        this.rotation.x += 0.01;
        this.rotation.y -= 0.01;
        this.rotation.z += 0.005;
    }
}

class Structure extends THREE.Group{
    constructor(atoms,positions,texture,light){
        super();
        var canRotate;
        var textureFile = './images/textures/' + texture;
        var geoTexture = new THREE.TextureLoader().load(textureFile);
        var geoSurface = new THREE.BoxGeometry(2.2,2.2,2.2);
        var geoMaterial = new THREE.MeshStandardMaterial({map: geoTexture});
        var surface = new THREE.Mesh(geoSurface,geoMaterial);
        surface.name = "Surface";
        surface.position.set(0,1,0);
        this.add(surface);
        var atomColor = new THREE.Color(0xffffff); //0x615f5f
        var geometry = new THREE.SphereGeometry(0.1,8,6);
        var material = new THREE.MeshStandardMaterial({color: atomColor});
        for (var i = 0; i < atoms; i++) {
            var sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(positions[i][0], positions[i][1], positions[i][2]);
            sphere.name = "Atom " + i;
            this.add(sphere);
        }
    }

    start(){
        this.canRotate = true;
    }

    stop(){
        this.canRotate = false;
    }

    rotate(){
        if (this.canRotate) {
            this.rotation.x += 0.01;
            this.rotation.y += 0.01;
        }
    }
}

class TheoryCube extends THREE.Group {
    constructor(){
        super();
        var canRotate;

        var texture1 = new THREE.TextureLoader().load('./images/theory/fracture.png');
        var texture2 = new THREE.TextureLoader().load('./images/theory/ductile-vs-brittle.png');
        var texture3 = new THREE.TextureLoader().load('./images/theory/elastic.png');
        var texture4 = new THREE.TextureLoader().load('./images/theory/atoms.png');
        var texture5 = new THREE.TextureLoader().load('./images/theory/plastic.png');
        var texture6 = new THREE.TextureLoader().load('./images/theory/young.png');

        var geometry = new THREE.PlaneGeometry(14,10,1);
        var geometryTop = new THREE.PlaneGeometry(14,14,1);
        var geometryBottom = new THREE.PlaneGeometry(14,14,1);

        var material1 = new THREE.MeshBasicMaterial({map: texture1});
        var material2 = new THREE.MeshBasicMaterial({map: texture2});
        var material3 = new THREE.MeshBasicMaterial({map: texture3});
        var material4 = new THREE.MeshBasicMaterial({map: texture4});
        var material5 = new THREE.MeshBasicMaterial({map: texture5});
        var material6 = new THREE.MeshBasicMaterial({map: texture6});

        var theoryPlane1 = new THREE.Mesh(geometry,material1);
        var theoryPlane2 = new THREE.Mesh(geometry,material2);
        var theoryPlane3 = new THREE.Mesh(geometry,material3);
        var theoryPlane4 = new THREE.Mesh(geometry,material4);
        var theoryPlane5 = new THREE.Mesh(geometryTop,material5);
        var theoryPlane6 = new THREE.Mesh(geometryBottom,material6);

        theoryPlane1.position.set(0,0,-7); //0,0,0
        theoryPlane2.position.set(7,0,0); //7,0,7
        theoryPlane3.position.set(-7,0,0); //-7,0,7
        theoryPlane4.position.set(0,0,7); //0,0,14
        theoryPlane5.position.set(0,5,0); //0,5,7
        theoryPlane6.position.set(0,-5,0); //0,-5,7

        theoryPlane1.rotateY(180 * Math.PI/180);
        theoryPlane2.rotateY(90 * Math.PI/180);
        theoryPlane3.rotateY(-90 * Math.PI/180);
        theoryPlane5.rotateX(-90 * Math.PI/180);
        theoryPlane6.rotateX(90 * Math.PI/180);

        this.add(theoryPlane1);
        this.add(theoryPlane2);
        this.add(theoryPlane3);
        this.add(theoryPlane4);
        this.add(theoryPlane5);
        this.add(theoryPlane6);
    }

    start(){
        this.canRotate = true;
    }

    stop(){
        this.canRotate = false;
    }

    rotate(){
        if (this.canRotate) {
            this.rotation.y += 0.01;
        }
    }
}

class Luz extends THREE.Light{
    constructor(_color = "white", _intensity = 1){
        super();
        this.color = _color;
        this.intensity = _intensity;
        this.pointLight = new THREE.PointLight(this.color, this.intensity);
        this.name = "LUZ";
        this.sphereSize = 0.1;
        this.pointLightHelper = new THREE.PointLightHelper(this.pointLight, this.sphereSize);
    }
}

function addToScene(scene,luz){
    scene.add(luz.pointLight);
    scene.add(luz.pointLightHelper);
}

function addStructure(scene,structure){
    scene.add(structure);
}

function update()
{
    swarm.rotate();
    theoryCube.rotate();
    diamond.rotate();
    steel.rotate();
    glass.rotate();
    rubber.rotate();
}

function renderLoop() 
{
    engine.render(activeScene, camera);
    update();
    requestAnimationFrame(renderLoop);
}


function main()
{ 
    // CANVAS
    canvas = document.getElementById("canvas");

    // SCENE
    var demoBackground = new THREE.TextureLoader().load('./images/stars.jpg');
    demoScene = new THREE.Scene();
    demoScene.background = demoBackground;
    activeScene = demoScene;

    // CAMERA
    camera = new THREE.PerspectiveCamera(60., canvas.width / canvas.height, 0.01, 10000.);  // CAMERA
    camera.position.set(0, 0, 50);
    camera.lookAt(activeScene.position);
    camera.up.set(0,1,0);
    controls = new THREE.OrbitControls(camera, canvas);
    controls.update();

    // RENDERER ENGINE
    engine = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    engine.setSize(window.innerWidth, window.innerHeight);
    engine.setClearColor(new THREE.Color(0.0, 0.0, 0.0), 1.);

    // MODELS
    // AXES HELPER
    var axesHelper = new THREE.AxesHelper(10.);
    axesHelper.position.set(0., 0.1, 0.);

    // FLOOR
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshBasicMaterial({color: "grey",wireframe: true}));          
    floor.rotation.x = -Math.PI / 2.;

    var listener = new THREE.AudioListener();
    camera.add(listener);
    var sound = new THREE.Audio(listener);
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load('./music/Subwoofer_Lullaby.mp3', function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        sound.play();
    });
    
    //ATOMS POSITIONS
    var positions = [
            [0,0,0],
            [1,0,-1],
            [1,0,1],
            [-1,0,1],
            [-1,0,-1],

            [0.5,0.5,-0.5],
            [-0.5,0.5,0.5],

            [1,1,0],
            [0,1,1],
            [-1,0,0],
            [0,1,-1],

            [0.5,1.5,0.5],
            [-0.5,1.5,-0.5],

            [0,2,0],
            [1,2,-1],
            [1,2,1],
            [-1,2,1],
            [-1,2,-1],
        ];

    var luz1 = new Luz();
    luz1.pointLight.position.set(-30,5,0);
    diamond = new Structure(18,positions,'diamond.png',luz1);
    diamond.position.set(-30,0,0);
    diamond.start();
    addStructure(demoScene,diamond);
    materialList.push(diamond);

    positions = [
        [1,0,1],
        [-1,0,1],
        [-1,0,-1],
        [1,0,-1],

        [0,1,0],

        [1,2,1],
        [-1,2,1],
        [-1,2,-1],
        [1,2,-1],
    ];
    var luz2 = new Luz();
    luz2.pointLight.position.set(0,30,0);
    steel = new Structure(9,positions,'iron.png',luz1);
    steel.position.set(0,25,0);
    steel.start();
    addStructure(demoScene,steel);

    //GLASS
    positions = [
        [1,0,1],
        [-1,0,1],
        [0,0,-1],

        [0,0.25,0],

        [0,1,0],
    ];
    var luz3 = new Luz();
    luz3.pointLight.position.set(30,5,0);
    glass = new Structure(5,positions,'glass.png',luz1);
    glass.position.set(30,0,0);
    glass.start();
    addStructure(demoScene,glass);

    //RUBBER
    positions = [
        [0.66,0,0],
        [0.33,0.4,0],
        [0.15,0,0.15],
        [0.15,0,-0.15],

        [0.33,1,0],

        [1,1.2,0],
        [0.66,1.4,0],
        [0.66,2,0],

        [-0.33,1.4,0],
        [-0.33,2,0],

        [-0.66,1,0],
        [-0.66,0.5,0],
        [-1,1.2,0]
    ];

    var luz4 = new Luz();
    luz4.pointLight.position.set(0,-20,0);
    rubber = new Structure(13,positions,'rubber.png',luz1);
    rubber.position.set(0,-25,0);
    rubber.start();
    addStructure(demoScene,rubber);

    swarm = new Swarm();
    addStructure(demoScene,swarm);

    theoryCube = new TheoryCube();
    theoryCube.start();

    // SCENEGRAPH
    demoScene.add(camera);
    demoScene.add(theoryCube);

    demoScene.add(luz1.pointLight);
    demoScene.add(luz1.pointLightHelper);
    demoScene.add(luz2.pointLight);
    demoScene.add(luz2.pointLightHelper);
    demoScene.add(luz3.pointLight);
    demoScene.add(luz3.pointLightHelper);
    demoScene.add(luz4.pointLight);
    demoScene.add(luz4.pointLightHelper);
    
    activeMaterial = diamond;
    //GUI
    var guiControls = {
        rotation: "Start",
        materials: "Diamond",
        modeList: "Solid",
    };

    var datGui = new dat.GUI();
    var rotation = ["Start","Stop"];
    var materials = ["Diamond","Steel","Glass","Rubber","Theory","Initial"];
    var nameList = ["Solid","Wireframe","Invisible","Visible"];

    var rotationGui = datGui.add(guiControls, 'rotation', rotation).name('Rotate object');
    var materialsGui = datGui.add(guiControls, 'materials', materials).name('Material mode');
    var drawModeList = datGui.add(guiControls, 'modeList', nameList).name('Draw Mode');

    datGui.close();

    // EVENT-HANDLERS
    window.addEventListener('resize', resizeWindow, false);
    rotationGui.onChange(rotationChange);
    materialsGui.onChange(materialsGuiOnChange);
    drawModeList.onChange(drawModeListOnChange);

    // ACTION
    requestAnimationFrame(renderLoop);    
}
