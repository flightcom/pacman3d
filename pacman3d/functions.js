function update(){

	var angle;
	var delta = clock.getDelta(); // seconds.
	moveDistance = MOVECOEF * delta; // 200 pixels per second
	var rotateAngleQuart = Math.PI * 2 * delta;   // pi/2 radians (90 degrees) per second
	var rotateAngleDemi = Math.PI * 4 * delta;   // pi/2 radians (90 degrees) per second

	// console.log('collision='+detectCollision(sphere)+', reqturn90L='+reqTurn90L+', reqTurn90R='+reqTurn90R+', turning90L='+turning90L+', turning90R='+turning90R);


	// console.log(camera.position.z);

	if(turn != 0) {
		// var dist = (reqTurn90R || reqTurn90L) ? Math.min(moveDistance, getDistFromCaseCenter(sphere)) : moveDistance;
		// console.log(moveDistance);
		moveDistance = 0;
	}
	// if ( keyboard.pressed("Z") ) {// clavier haut
	// 	moveDistance = moveDistance;
	// }
	if ( keyboard.pressed("space") ) {// espace (demi-tour)
		turn = (turn == 0) ? turn180 : turn;
		turning180 = true;
	}
	if ( keyboard.pressed("Q") ) {
		reqTurn90L = (!reqTurn90R) ? true : false;
	}
	if ( keyboard.pressed("D") ) {
		reqTurn90R = (!reqTurn90L) ? true : false;
	}

	detectCollision(sphere);

	console.log(sphere);

	if(sphere.direction.x !== 0 || sphere.direction.z !== 0){

		if((reqTurn90L || reqTurn90R) && turn == 0){
			var dir = (reqTurn90L) ? 'left':'right';
			if(turnIsPossible(sphere, dir)){
				turn = turn90;
				if(reqTurn90L)
					turning90L = true;
				else if(reqTurn90R)
					turning90R = true;
			} else {
				var distFromCenter = getDistFromCaseCenter(sphere);
				// console.log("move = "+moveDistance+" ::: distanceFromCenter = "+distFromCenter);
				moveDistance = Math.min(moveDistance, distFromCenter);
			}
		}

		if(turning90L || turning90R || turning180){
			// console.log('turning');
			moveDistance = 0;
			var rotation = Math.PI * 2 * delta;
			rotation = (turning180) ? rotation*2 : rotation;
			if(turn > 0){
				angle = (turn > rotation) ? rotation : turn;
				angle = (turning90L) ? angle : -angle; 
				var matrix = new THREE.Matrix4().makeRotationAxis( axis, angle );
				vector.applyMatrix4( matrix );
				camera.rotateOnAxis( new THREE.Vector3(0,1,0), angle);
				sphere.rotateOnAxis( new THREE.Vector3(0,1,0), angle);
				turn -= rotation;
			} else{
				turning90L = turning90R = reqTurn90L = reqTurn90R = turning180 = false;
				turn = 0;
			}
		}
		// console.log(moveDistance);
		goForward(-moveDistance);
		// dir = pWorld.sub( camera.position ).normalize();

	}

}

// function animate(){

// 	animationId = requestAnimationFrame( animate );
// 	game.update();
// 	game.world.render();
// }

