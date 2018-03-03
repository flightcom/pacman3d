var Character = Class.create({
	
	initialize: function(refDim){

		this.dim = refDim;
		this.mesh = this.draw();
		this.direction = this.getOrientation();
		this.axe = new THREE.Vector3(0, 1, 0);
		this.turn = 0;
		this.isRotating = this.turnRequested = false;
		this.obstacles = [];

		this.rays = [
			new THREE.Vector3(0, 0, 1),
			new THREE.Vector3(1, 0, 0),
			new THREE.Vector3(0, 0, -1),
			new THREE.Vector3(-1, 0, 0)
		];

		this.pas = 2.3*this.dim;
		this.speedCoef = 1;
	},

	update: function(clock){

		var angle;
		var delta = clock.getDelta(); // seconds.
		var moveDistance = this.pas * delta; // 200 pixels per second
		var rotateAngleQuart = Math.PI * 2 * delta;   // pi/2 radians (90 degrees) per second
		var rotateAngleDemi = Math.PI * 4 * delta;   // pi/2 radians (90 degrees) per second

	},

	move: function(clock){

		var angle;
		var delta = clock.getDelta(); // seconds.
		var moveDistance = this.pas * delta; // 200 pixels per second
		var distFromCenter = this.getDistFromCaseCenter2();

		if( this.turnRequested != false){

			if(!this.isRotating) 
			{
				var angle = 0;
				switch(this.turnRequested){

					case 'left':
						this.turn = Math.PI/2;
						break;
					case 'right':
						this.turn = -Math.PI/2;
						break
					case 'back':
						this.turn = Math.PI;
						break;
				}

				if(Math.abs(this.turn) == Math.PI){
					this.isRotating = true;
				}
				else {
					if(!this.collide(this.turnRequested)){
						if(this.isOnCenter()){
							this.isRotating = true;
						}
						else {
							moveDistance = Math.min(moveDistance, distFromCenter);
						}
					}
				}
			} else {
				moveDistance = 0;
				this.rotate(delta);
			}
		}

		if(this.collide()){
			if(!this.isOnCenter()){
				moveDistance = -distFromCenter;
			} else {
				moveDistance = 0;
			}
		}

		this.go(-moveDistance);

	},

	rotate: function(delta){

		// var rotation = Math.PI * 2 * delta;
		var sign = this.turn && this.turn / Math.abs(this.turn);
		var rotation = sign * Math.PI * 3 * delta;
		var angle = (Math.abs(this.turn) > Math.abs(rotation)) ? rotation : this.turn;

		this.mesh.rotateOnAxis( new THREE.Vector3(0,1,0), angle);
		this.turn -= angle;
		if(sign*this.turn <= 0){
			this.isRotating = this.turnRequested = false;
		}

	},

	go: function(dist){

		this.mesh.translateZ( dist*this.speedCoef );

	},

	readyForRotation: function(){

		// On check : pas de collision, centré, type de rotation
		if(Math.abs(this.turn) == Math.PI){
			return true;
		}
		else {
			if(!this.collide(this.turnRequested) && this.isOnCenter()){
				return true;
			}
		}
		return false;

	},

	kill: function(){
		
	},

	getOrientation: function(){
		var pLocal = new THREE.Vector3( 0, 0, -1 );
		var pWorld = pLocal.applyMatrix4( this.mesh.matrixWorld );
		var dir = pWorld.sub( this.mesh.position ).normalize();
		return dir;
	},

	getDistFromCaseCenter: function(){
		var deltaX, deltaZ;
		var x = Math.abs(this.mesh.position.x);
		var z = Math.abs(this.mesh.position.z);

		deltaX = Math.ceil(x/this.dim)*this.dim - this.dim/2 - x;
		deltaZ = Math.ceil(z/this.dim)*this.dim - z;

		var dir = this.getOrientation();

		if(Math.abs(dir.z) <= 0.1){
			return Math.abs(deltaX);
		}
		if(Math.abs(dir.x) <= 0.1){
			return Math.abs(deltaZ);
		}
	},

	getDistFromCaseCenter2: function(){

		// Orientation perso
		var dir = this.getOrientation();
		// delta
		var d = 0;
		// Orientation simplifié
		var dirP = (Math.round(dir.x) == 0) ? (Math.round(dir.z) > 0 ) ? 'z':'-z' : (Math.round(dir.x) > 0) ? 'x':'-x';
		var prevC = nextC = 0;
		var ref = 0;

		var x = this.mesh.position.x;
		var z = this.mesh.position.z;

		// console.log(dirP);

		switch(dirP){
			case 'x':
				ref = x;
				prevC = Math.floor(x/this.dim)*this.dim - this.dim/2;
				nextC = Math.ceil(x/this.dim)*this.dim - this.dim/2;
				break;
			case '-x':
				ref = x;
				prevC = Math.ceil(x/this.dim)*this.dim - this.dim/2;
				nextC = Math.floor(x/this.dim)*this.dim - this.dim/2;
				break;
			case 'z':
				ref = z;
				prevC = Math.floor(z/this.dim)*this.dim;
				nextC = Math.ceil(z/this.dim)*this.dim;
				break;
			case '-z':
				ref = z;
				prevC = Math.ceil(z/this.dim)*this.dim;
				nextC = Math.floor(z/this.dim)*this.dim;
				break;
		}

		d = Math.min(Math.abs(nextC-ref), Math.abs(ref-prevC));

		return d;

	},

	isOnCenter: function(){

		if(this.getDistFromCaseCenter2() < this.dim*0.01){
			return true;
		}

		return false;
	},

	collide: function(dir){

		switch (dir || 'forward') {
			case 'forward'	: var angle = 0;			break;
			case 'left'		: var angle = Math.PI/2;	break;
			case 'right'	: var angle = -Math.PI/2;	break;
			default			: var angle = 0;			break;
		}

		var distance = this.dim/2;
		var direction = this.getOrientation();
		var vector = direction.clone();
		var axis = new THREE.Vector3(0,1,0).normalize();
		var rotationMatrix = new THREE.Matrix4(); 
		var matrix = rotationMatrix.makeRotationAxis( axis, angle );//.multiplyVector3( this.mesh.position );
		vector.applyMatrix4( matrix );
		var raycaster = new THREE.Raycaster( this.mesh.position, vector );
		var collisions = raycaster.intersectObjects(this.obstacles);
		if (collisions.length > 0 && collisions[0].distance <= distance*1.01) {
			return true;
		}

		return false;
	},

	allowedMoves: function(){

		var distance = this.dim/2;
		var possibleMoves = this.rays;
		var allowedMoves = [];
		for(var i=0; i < dirs.length; i++){
			var raycaster = new THREE.Raycaster( this.mesh.position, dirs[i].sub( this.mesh.position ).normalize() );
			var collisions = raycaster.intersectObjects(this.obstacles);
			if ((collisions.length > 0 && collisions[0].distance >= distance) || collisions.length == 0) {
				allowedMoves.push(dirs[i]);
			}
		}
		return allowedMoves;
	}
});