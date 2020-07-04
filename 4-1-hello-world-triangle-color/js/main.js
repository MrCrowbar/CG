"use strict"
var canvas;					// HTML canvas
var gl;						// WebGL Rendering Context
var vertices;				// Model vertices
var shaderProgram;			// Shader Program
var vbo;					// Vertex Buffer Object for Positions
var vboColors;				// Vertex Buffer Obect for Colors
var ibo;					// Index Buffer Object for Indexes
var modelMatrix;			// Model Matrix
var viewMatrix;				// View Matrix
var pointSize;
var color;
var colors;					// Vertex colors

var vertexIndex;			// Indices de los vertices

// Camera parameters
var eye;					// Camera position
var target;					// Camera target
var up;						// Camera up
// Mouse parameteres
var dragMode;			// ROTATE, ZOOM or PAN
var dragging;			// True or false
var xLast, yLast; 		// Last position		
var rotX, rotY;			// Acumlulation

function init()
{	
	// Vertices de un cubo
	vertices = [-0.5, 0.5, 0.5,		// V0
			    -0.5, -0.5, 0.5,	// V1
			    0.5, -0.5, 0.5,		// V2
			    0.5, 0.5, 0.5,		// V3
			    -0.5, 0.5, -0.5,	// V4
			    -0.5, -0.5, -0.5,	// V5
			    0.5, -0.5, -0.5,	// V6
			    0.5, 0.5, -0.5,		// V7
			    ];

	colors = [1., 0., 0., 1.,
			  0., 1., 0., 1.,
			  0., 0., 1., 1.,
			  1., 1., 0., 1.
			  ];

  	//TOPOLOGIA
	//vertexIndex = [0,1,2, 0,2,3, 3,2,5, 3,5,4, 7,6,5, 7,5,4, 7,0,3, 7,3,4, 0,1,6, 0,6,7, 6,1,2, 6,2,5]; // gl.TRIANGLE triangulos con relleno
	vertexIndex = [0,1, 1,2, 2,3, 3,0,   4,5, 5,6, 6,7, 7,4,  0,4, 1,5, 2,6, 3,7]; // gl.LINES
	//vertexIndex = [0,1,2,3]; // gl.POINTS
	//vertexIndex = [0,1,2,3]; // gl.LINE_LOOP
	//vertexIndex = [0,1,2,3,0]; // gl.LINE_STRIP unir puntos sin soltar un lapiz
	//vertexIndex = [0,1,2, 0,2,3]; // gl.LINE_TRIANGLES traingulos sin relleno

	//vertexIndex = [1,0,2,3]; // gl.TRIANGLE_STRIP este es para conectar vertices juntos, checar el orden de mis vertices
	//vertexIndex = [0,1,2,3]; // gl.TRIANGLE_FAN unes el primer punto con los demas, bueno para circulos

	pointSize = 12.;
	color = [1., 1., 0., 1.];

	// Init Camera
    eye = [0., 0., 1.];
    target = [0., 0., 0.];
    up = [0., 1., 0.];

    // Init Mouse parameters
    dragMode = "ROTATE";
	dragging = false;
	xLast = 0;
	yLast = 0;		
	rotX = 0.;
	rotY = 0.;		
	
	// Init Rendering
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");				// Get the WebGL rendering context (WebGL state machine)
	canvas.width = 0.75 * window.innerWidth;
	canvas.height = 0.75 * window.innerHeight;
	gl.clearColor(0., 0., 0., 1.);					// Set current color to clear buffers to BLACK

	// Init Shaders
	shaderProgram = createShaderProgram("vertexShader", "fragmentShader");
	gl.useProgram(shaderProgram);					// Set the current Shader Program to use

	// Init Buffers
	// VBO for positions
	vbo = gl.createBuffer();
	var bufferType = gl.ARRAY_BUFFER;
	gl.bindBuffer(bufferType, vbo);
	var data = new Float32Array(vertices);
	var usage = gl.STATIC_DRAW;
	gl.bufferData(bufferType, data, usage);

	// VBO for colors
	vboColors = gl.createBuffer();
	var bufferType = gl.ARRAY_BUFFER;
	gl.bindBuffer(bufferType, vboColors);
	var data = new Float32Array(colors);
	var usage = gl.STATIC_DRAW;
	gl.bufferData(bufferType, data, usage);

	// IBO for vertex index
	ibo = gl.createBuffer();
	var bufferType = gl.ELEMENT_ARRAY_BUFFER; // ELEMENT_ARRAY_BUFFER para tipos enteros porque usaremos los indices
	gl.bindBuffer(bufferType, ibo);
	var data = new Int16Array(vertexIndex);
	var usage = gl.STATIC_DRAW;
	gl.bufferData(bufferType, data, usage);

	// Init Uniforms
	// uPointSize
	var uPointSizeLocation = gl.getUniformLocation(shaderProgram, "uPointSize");
	gl.uniform1f(uPointSizeLocation, pointSize);
	// Init Transformations
	// Model Matrix
	modelMatrix = glMatrix.mat4.create();	// Mmodel = I

	// View Matrix
	viewMatrix = glMatrix.mat4.create();	// Mview = I
	glMatrix.mat4.lookAt(viewMatrix, eye, target, up);

	// ModelViewMatrix
	var modelViewMatrix = glMatrix.mat4.create();	// M-model-view = I
	glMatrix.mat4.multiply(modelViewMatrix, modelMatrix, viewMatrix); // Mmodel-view = Mview * Mmodel
	// Load modelViewMatrix to Rendering Context
	var uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
	gl.uniformMatrix4fv(uModelViewMatrixLocation, false, modelViewMatrix);
	
	// Projection Matrix
	// Perspective Projection
	var fov = 60.;					// FOV (Filed-Of-View) angle in degrees
	fov = fov * Math.PI / 180.;	// FOV angle in radians
	var aspect = canvas.width / canvas.height;
	var near = 0.01;
	var far = 10000.;
	var projMatrix = glMatrix.mat4.create();
	glMatrix.mat4.perspective(projMatrix, fov, aspect, near, far);
	// Load projMatrix to Rendering Context
	var uProjMatrixLocation = gl.getUniformLocation(shaderProgram, "uProjMatrix");
	gl.uniformMatrix4fv(uProjMatrixLocation, false, projMatrix);

	// Init Events
	window.addEventListener('resize', windowEventListener, false);
	document.addEventListener("mousedown", mouseDownEventListener, false);
	document.addEventListener("mouseup", mouseUpEventListener, false);
	document.addEventListener("mousemove", mouseMoveEventListener, false);
}

function update()
{

}

function renderLoop()
{
	gl.clear(gl.COLOR_BUFFER_BIT);					// Clear the Color Buffer using the current clear color
	gl.viewport(0, 0, canvas.width, canvas.height);	// Set the Viewport transformation
				
	// Draw scene
	// Layout VBO for positions
	gl.useProgram(shaderProgram);
	var bufferType = gl.ARRAY_BUFFER;
	gl.bindBuffer(bufferType, vbo);
	var aPositionLocation = gl.getAttribLocation(shaderProgram, "aPosition");
	var index = aPositionLocation;
	var size = 3;	// X, Y, Z
	var type = gl.FLOAT;
	var normalized = false;
	var stride = 0;
	var offset = 0;
	gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
	gl.enableVertexAttribArray(aPositionLocation);

	// Layout VBO for colors
	gl.useProgram(shaderProgram);
	var bufferType = gl.ARRAY_BUFFER;
	gl.bindBuffer(bufferType, vboColors);
	var aColorLocation = gl.getAttribLocation(shaderProgram, "aColor");
	var index = aColorLocation;
	var size = 4;	// R, G, B, A
	var type = gl.FLOAT;
	var normalized = false;
	var stride = 0;
	var offset = 0;
	gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
	gl.enableVertexAttribArray(aColorLocation);

	// No hace falta poner el layot ya que la primitiva indica que tomaremos de 3 en 3 datos ya que son TRIANGLES

	// Draw
	gl.useProgram(shaderProgram);
	var bufferType = gl.ELEMENT_ARRAY_BUFFER;
	gl.bindBuffer(bufferType, ibo);

	var primitiveType = gl.LINES;				// Cambiamos la primitiva a la que quyieramnos
	var offset = 0;									// Bytes offset in the buffer
	var count = vertexIndex.length;					// Number of index to be rendered
	var type = gl.UNSIGNED_SHORT;
	gl.drawElements(primitiveType, count, type, offset);	// Draw para vertices no explicitos
	
	update();										// Update something
	requestAnimationFrame(renderLoop);				// Call next frame
}

function main()
{
	init();
	requestAnimationFrame(renderLoop);				// render loop
}
