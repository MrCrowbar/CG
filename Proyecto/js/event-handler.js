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
    var children = activeMaterial;
	//children.material.color = new THREE.Color(event);
    console.log(children);
}

function materialsGuiOnChange(event){
    var pos;
    switch(event){
        case "Diamond":
            activeMaterial = diamond;
            pos = activeMaterial.position;
            controls.target.set(pos.x,pos.y,pos.z);
            camera.position.set(pos.x,pos.y,10);
            break;

        case "Steel":
            activeMaterial = steel;
            pos = activeMaterial.position;
            controls.target.set(pos.x,pos.y,pos.z);
            camera.position.set(pos.x,pos.y,10);
            break;

        case "Glass":
            activeMaterial = glass;
            pos = activeMaterial.position;
            controls.target.set(pos.x,pos.y,pos.z);
            camera.position.set(pos.x,pos.y,10);
            break;

        case "Rubber":
            activeMaterial = rubber;
            pos = activeMaterial.position;
            controls.target.set(pos.x,pos.y,pos.z);
            camera.position.set(pos.x,pos.y,10);
            break;

        case "Theory":
            activeMaterial = theoryCube;
            pos = activeMaterial.position;
            controls.target.set(pos.x,pos.y,pos.z);
            camera.position.set(pos.x,pos.y,10);
            break;

        case "Initial":
            activeMaterial = theoryCube;
            pos = activeMaterial.position;
            controls.target.set(pos.x,pos.y,pos.z);
            camera.position.set(pos.x,pos.y,50);
            break;

        default:
            controls.target.set(5,5,5);
    }
    controls.update();
}

function rotationChange(event) {
    if (event == "Start") {
        activeMaterial.start();
        console.log(event);
    }
    else {
        activeMaterial.stop();
        console.log(event);
    }
    console.log(activeMaterial.canRotate);
}