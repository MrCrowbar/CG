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
	if(event == "Wireframe")
    {
    	children[0].material.wireframe = true;
    }
    else if(event == "Solid")
    {
    	children[0].material.wireframe = false;
    }
    else if(event == "Invisible")
    {
    	diamond.visible = false;
    }
	else if (event == "Visible"){
		diamond.visible = true;
	}
}

function colorOnChange(event)
{
	diamond.children[0].material.color = new THREE.Color(event);
}

function materialsGuiOnChange(event){
    //"Diamond","Steel","Glass","Rubber"
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
            
        default:
            controls.target.set(5,5,5);
    }
    controls.update();
}