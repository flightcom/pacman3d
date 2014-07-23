// Global params
var game, controls, raycaster;
var moveDistance;
var keyboard = new THREEx.KeyboardState();
// // Vecteur Camera
// var vCam = {
// 	x: 0,
// 	y: 0,
// 	z: -1
// };

// Coefficient de déplacement
var MOVECOEF = 100;
// Field Of View;
var lCase = 50;

var info;
var turn90 = Math.PI/2;
var turn180 = Math.PI;
var turn = 0;
var reqTurn90L = reqTurn90R = turning90L = turning90R = turning180 = false;
// vector = new THREE.Vector3( vCam.x, vCam.y, vCam.z );
// axis = new THREE.Vector3( 0, 1, 0 );

jQuery.noConflict();

jQuery(document).ready(function(){

	game = new Game(lCase);
	jQuery('#container').append(game.world.renderer.domElement);
	game.start();

});

jQuery(document).keypress( function(e){

	// console.log(e.which);
	switch(e.which){
		// PAUSE
		case 27:
			game.isPaused = (game.isPaused) ? false : true;
			if(game.isPaused) game.pause();
			else game.resume();
			break;
		case 112:
			game.isPaused = (game.isPaused) ? false : true;
			if(game.isPaused) game.pause();
			else game.resume();
			break;
	}

});