var Game = Class.create({

	initialize: function(lCase){

		this.world = new World(lCase);
		// Stats (FPS / MS)
		this.stats = new Stats();
		// ID pour l'animation
		this.animationId;
		// Horloge
		this.clock = new THREE.Clock();
		// Jeu en pause ?
		this.isPaused = false;
		// Clavier
		this.keyboard = new THREEx.KeyboardState();

	},

	initStats: function(){

		this.stats.setMode(0);
		// Align top-left
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.left = '0px';
		this.stats.domElement.style.top = '0px';

		document.body.appendChild( this.stats.domElement );
	},

	start: function(){

		this.initStats();
		this.stats.begin();
		this.animate();

	},

	// update: function(){

	// 	// console.log('game update');
	// 	this.world.update(this.clock);

	// },

	pause: function(){

		console.log('animation id = '+this.animationId);
		cancelAnimationFrame( this.animationId );
		this.isPaused = true;

	},

	resume: function(){

		this.clock = new THREE.Clock();
		this.animate();

	},

	animate: function(){

		game.animationId = requestAnimationFrame( game.animate );
		// console.log(this.animationId);
		game.checkKB();
		game.world.update(game.clock);
		game.world.render();
		game.stats.update();

	},

	checkKB: function(){

		if ( this.keyboard.pressed("space") ) {// espace (demi-tour)
			this.world.pacman.turnRequested = 'back';
		}
		if ( this.keyboard.pressed("Z") ) {// clavier haut
			this.world.pacman.speedCoef = 1.5;
		} else {
			this.world.pacman.speedCoef = 1;
		}
		if ( this.keyboard.pressed("Q") ) {
			// this.world.pacman.reqTurn90L = (!this.world.pacman.reqTurn90R) ? true : false;
			this.world.pacman.turnRequested = 'left';
		}
		if ( this.keyboard.pressed("D") ) {
			// this.world.pacman.reqTurn90R = (!this.world.pacman.reqTurn90L) ? true : false;
			this.world.pacman.turnRequested = 'right';
		}

	}

});