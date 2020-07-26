"use strict"
var canvas;
var engine;
var scene;
var camera;
var shapes = [];
var lights = [];
var colors = ["blue","yellow","green","red","white","purple"];
var diamond;
var controls;
var steel;
var glass;
var activeMaterial;

class Shape extends THREE.Mesh
{
    constructor(color = "white")
    {
        super();
        this.envMaps = "reflection";
        this.color = color;
        this.geometry = new THREE.DodecahedronGeometry(1, 0);
        this.material = new THREE.MeshBasicMaterial({color: color});
        var wireframe = new THREE.WireframeGeometry(this.geometry);
        wireframe.color = "red";
        var line = new THREE.LineSegments(wireframe);
        line.material.depthTest = true;
        line.material.color = new THREE.Color(0, 0, 0);
        this.add(line);
    }

    setPhongMaterial(color,_shininess = 30.){
        this.material = new THREE.MeshPhongMaterial({color: this.color, shininess: _shininess});
    }
    setLambertMaterial(color){
        this.material = new THREE.MeshLambertMaterial({color: this.color});
    }
    setToonMaterial(color){
        this.material = new THREE.MeshToonMaterial({color:this.color});
    }
    setPhysicalMaterial(color){
        this.material = new THREE.MeshPhysicalMaterial({color:this.color});
    }
    setStandardMaterial(color){
        this.material = new THREE.MeshStandardMaterial({color:this.color});
    }
}


class Structure extends THREE.Group{
    constructor(atoms,positions,color){
        super();
        var geoSurface = new THREE.BoxGeometry(2.2,2.2,2.2);
        var geoMaterial = new THREE.MeshStandardMaterial({color: color});
        var surface = new THREE.Mesh(geoSurface,geoMaterial);
        surface.name = "Surface";
        surface.position.set(0,1,0);
        this.add(surface);

        var geometry = new THREE.SphereGeometry(0.1,8,6);
        var material = new THREE.MeshStandardMaterial({color: "white"});

        //var points = [];
        //var lineMaterial = new THREE.LineBasicMaterial({color: "white", linewidth: 2});

        for (var i = 0; i < atoms; i++) {
            var sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(positions[i][0], positions[i][1], positions[i][2]);
            //points.push(new THREE.Vector3(positions[i][0], positions[i][1], positions[i][2]));
            sphere.name = "Atom " + i;
            this.add(sphere);
        }

        //var lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        //var conections = new THREE.Line(lineGeometry, lineMaterial);

        //this.add(conections);
    }

}

class Luz extends THREE.Light{
    constructor(_color = "white", _intensity = 1){
        super();
        this.color = _color;
        this.intensity = _intensity;
        //this.ambientLight = new THREE.AmbientLight(this.color, 0.0);
        this.pointLight = new THREE.PointLight(this.color, this.intensity);
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
    //controls.update();
    diamond.rotation.y += 0.01;
    steel.rotation.y -= 0.01;
}

function renderLoop() 
{

    camera.updateProjectionMatrix();
    engine.render(scene, camera);
    update();
    requestAnimationFrame(renderLoop);
}

function main()
{ 
    // CANVAS
    canvas = document.getElementById("canvas");

    // RENDERER ENGINE
    engine = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    engine.setSize(window.innerWidth, window.innerHeight);
    engine.setClearColor(new THREE.Color(0.0, 0.0, 0.0), 1.);

    // SCENE
    scene = new THREE.Scene();  

    // CAMERA
    camera = new THREE.PerspectiveCamera(60., canvas.width / canvas.height, 0.01, 10000.);  // CAMERA
    camera.position.set(0., 2., 8.);
    camera.lookAt(scene.position);
    camera.up.set(0,1,0);  
    controls = new THREE.OrbitControls(camera, canvas);
    controls.update();

    // MODELS
    // AXES HELPER
    var axesHelper = new THREE.AxesHelper(10.);
    axesHelper.position.set(0., 0.1, 0.);

    // FLOOR
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshBasicMaterial({color: "grey",wireframe: true}));          
    floor.rotation.x = -Math.PI / 2.;


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

    diamond = new Structure(18,positions,"blue");
    diamond.position.set(-10,0,0);
    addStructure(scene,diamond);

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

    steel = new Structure(9,positions,"grey");
    steel.position.set(-5,0,0);
    addStructure(scene,steel);

    //GLASS
    positions = [
        [1,0,1],
        [-1,0,1],
        [0,0,-1],

        [0,0.25,0],

        [0,1,0],
    ];

    glass = new Structure(5,positions,"yellow");
    glass.position.set(0,0,0);
    addStructure(scene,glass);


    var luz1 = new Luz();
    luz1.pointLight.position.set(4,5,0);

    var luz2 = new Luz();
    luz2.pointLight.position.set(-4,5,0);

    activeMaterial = diamond;

    // SCENEGRAPH
    scene.add(floor);
    scene.add(axesHelper);
    scene.add(camera);

    scene.add(luz1.pointLight);
    scene.add(luz1.pointLightHelper);
    scene.add(luz2.pointLight);
    scene.add(luz2.pointLightHelper);

    //GUI
    var guiControls = {
        materials: "Diamond",
        modeList: "Solid",
        color: "#ffffff"
    };

    var datGui = new dat.GUI();
    var materials = ["Diamond","Steel","Glass","Rubber"];
    var nameList = ["Solid","Wireframe","Invisible","Visible"];
    var materialsGui = datGui.add(guiControls, 'materials', materials).name('Material mode');
    var drawModeList = datGui.add(guiControls, 'modeList', nameList).name('Draw Mode');
    var color = datGui.addColor(guiControls, 'color').name('Color');
    datGui.close();

    // EVENT-HANDLERS
    window.addEventListener('resize', resizeWindow, false);
    materialsGui.onChange(materialsGuiOnChange);
    drawModeList.onChange(drawModeListOnChange);
    color.onChange(colorOnChange);

    // ACTION
    requestAnimationFrame(renderLoop);    
}
