// Resets the canvas dimensions to match window
function resizeWindow(event)
{   
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    engine.setSize(canvas.width, canvas.height);
    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
}


function drawModeListOnChange(event){
	var children = activeMaterial.children;
    switch(event){
        case "Wireframe":
            children[0].material.wireframe = true;
            break;

        case "Solid":
            children[0].material.wireframe = false;
            break;

        case "Invisible":
            activeMaterial.visible = false;
            break;

        case "Visible":
            activeMaterial.visible = true;
            break;
    }
}

function colorOnChange(event)
{
	diamond.children[0].material.color = new THREE.Color(event);
}

function materialsGuiOnChange(event){
    var pos;
    switch(event){
        case "Diamond":
            activeMaterial = diamond;
            pos = activeMaterial.position;
            controls.target.set(pos.x,pos.y,pos.z);
            break;

        case "Steel":
            activeMaterial = steel;
            pos = activeMaterial.position;
            controls.target.set(pos.x,pos.y,pos.z);
            break;

        case "Glass":
            activeMaterial = glass;
            pos = activeMaterial.position;
            controls.target.set(pos.x,pos.y,pos.z);
            break;

        case "Rubber":
            activeMaterial = rubber;
            pos = activeMaterial.position;
            controls.target.set(pos.x,pos.y,pos.z);
            break;
        default:
            controls.target.set(5,5,5);
    }
    controls.update();
}

function changeScene(event) {
    if (event == 'Demo') activeScene = demoScene;
    else activeScene = theoryScene;
    var scenePos = activeScene.position;

    controls.target.set(scenePos.x,scenePos.y,scenePos.z);
    controls.update();
}