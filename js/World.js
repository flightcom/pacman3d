var World = Class.create({

	// Class constructor
	initialize: function (lCase) {

		// Scène
		this.scene = new THREE.Scene();
		// Moteur de rendu
		this.renderer = Detector.webgl ? new THREE.WebGLRenderer( {antialias:true} ) : new THREE.CanvasRenderer();
		// Les obstacles (murs)
		this.obstacles = [];
		this.walls = [];
		this.lights = [];
		this.map = {
			width: lCase*17,
			height: lCase*20,
			offset: {x:10*lCase,z:8.5*lCase}
		}
		// set the scene size
		this.width = window.innerWidth,
		this.height = window.innerHeight;

		this.camera = new THREE.PerspectiveCamera(  
			45,
			this.width / this.height,
			0.1,
			10000  );
		// this.camera.position.setZ(20);
		// this.camera.position.setY(20);

		// start the renderer
		this.renderer.setSize(this.width, this.height);
		// this.renderer.shadowMapEnabled = true;
		// to antialias the shadow
		// this.renderer.shadowMapSoft = true;
		// On construit la map;
		this.minimap = new Minimap(this.map.width+1, this.map.height+1, 12, 'rgba(0,0,0,.75)');
		this.build();
		this.obstacles = this.getObstacles();

		// On ajoute notre héro
		this.pacman = new Pacman(lCase);
		this.pacman.obstacles = this.obstacles;
		this.pacman.mesh.position.set(lCase*3/2, lCase/2, 0);
		// on associe la camera a Pacman
		this.pacman.mesh.add(this.camera);
		// this.scene.add(this.camera);
		// On place Pacman dans notre décor
		this.scene.add(this.pacman.mesh);

		// Test fantome
		// this.ghost = new Ghost(lCase);
		// this.ghost.obstacles = this.obstacles;
		// this.ghost.mesh.position.set(lCase*3/2, lCase/2, -100);
		// this.scene.add(this.ghost.mesh);

		var ambient	= new THREE.AmbientLight( 0x444444 );
		this.scene.add( ambient );

		this.render();

		console.log(this.minimap);

	},

	render: function(){

		// console.log(this.pacman.getOrientation());
		this.renderer.render(this.scene, this.camera);

	},

	update: function(clock){

		this.pacman.move(clock);
		// this.minimap.
		this.minimap.drawPlot({
			point:{
				x:-this.pacman.mesh.position.z+this.map.offset.z,
				y: this.pacman.mesh.position.x+this.map.offset.x
			},
			color:'rgba(255,0,0,.5)',
			thickness:1,
			isStatic:0
		});
		// this.minimap.update();
		if(Math.abs(this.pacman.mesh.position.z) > this.map.width/2 )
			this.pacman.mesh.position.setZ(-this.pacman.mesh.position.z);

	},

	build: function(){

		// FLOOR
		var floorTexture   = new THREE.ImageUtils.loadTexture( 'img/wall1.jpg' );
		floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
		floorTexture.repeat.set( 20, 17 );
		var floorMaterial  = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
		var floorGeometry  = new THREE.PlaneGeometry(20*lCase, 17*lCase, 1, 1);
		var floor          = new THREE.Mesh(floorGeometry, floorMaterial);
		// floor.receiveShadow = true;
		floor.position.y = 0;
		floor.rotation.x = Math.PI / 2;
		this.scene.add(floor);

		// ceil
		var ceilTexture = new THREE.ImageUtils.loadTexture( 'img/wall1.jpg' );
		ceilTexture.wrapS = ceilTexture.wrapT = THREE.RepeatWrapping; 
		ceilTexture.repeat.set( 20, 17 );
		var ceilMaterial = new THREE.MeshBasicMaterial( { map: ceilTexture, side: THREE.DoubleSide } );
		var ceilGeometry = new THREE.PlaneGeometry(20*lCase, 17*lCase, 1, 1);
		var ceil = new THREE.Mesh(ceilGeometry, ceilMaterial);
		// ceil.receiveShadow = true;
		ceil.position.y = lCase;
		ceil.rotation.x = Math.PI / 2;
		ceil.rotation.z = Math.PI;
		this.scene.add(ceil);

		var wallMap = [
			// Enceinte
			{lg:17,dir:0,px:-10,pz:0},{lg:17,dir:0,px:10,pz:0},{lg:10,dir:1,px:5,pz:8.5},{lg:9,dir:1,px:-5.5,pz:8.5},{lg:10,dir:1,px:5,pz:-8.5},{lg:9,dir:1,px:-5.5,pz:-8.5},
			// Carré HG
			{lg:2,dir:0,px:-9,pz:6.5},{lg:2,dir:0,px:-7,pz:6.5},{lg:2,dir:1,px:-8,pz:7.5},{lg:2,dir:1,px:-8,pz:5.5},
			// Rectangle HG
			{lg:3,dir:0,px:-9,pz:3},{lg:3,dir:0,px:-7,pz:3},{lg:2,dir:1,px:-8,pz:4.5},{lg:2,dir:1,px:-8,pz:1.5},
			// Mur H
			{lg:3,dir:1,px:-8.5,pz:0.5},{lg:3,dir:1,px:-8.5,pz:-0.5},{lg:1,dir:0,px:-7,pz:0},
			// Rectangle HD
			{lg:3,dir:0,px:-9,pz:-3},{lg:3,dir:0,px:-7,pz:-3},{lg:2,dir:1,px:-8,pz:-4.5},{lg:2,dir:1,px:-8,pz:-1.5},
			// Carré HD
			{lg:2,dir:0,px:-9,pz:-6.5},{lg:2,dir:0,px:-7,pz:-6.5},{lg:2,dir:1,px:-8,pz:-7.5},{lg:2,dir:1,px:-8,pz:-5.5},
			// Petit rectangle HG
			{lg:2,dir:0,px:-6,pz:6.5},{lg:2,dir:0,px:-5,pz:6.5},{lg:1,dir:1,px:-5.5,pz:7.5},{lg:1,dir:1,px:-5.5,pz:5.5},
			// T HG
			{lg:1,dir:0,px:-6,pz:4},{lg:5,dir:1,px:-3.5,pz:4.5},{lg:2,dir:1,px:-2,pz:3.5},{lg:1,dir:0,px:-1,pz:4},{lg:2,dir:0,px:-3,pz:2.5},{lg:2,dir:0,px:-4,pz:2.5},{lg:1,dir:1,px:-3.5,pz:1.5},{lg:2,dir:1,px:-5,pz:3.5},
			// T H
			{lg:5,dir:0,px:-6,pz:0},{lg:1,dir:1,px:-5.5,pz:-2.5},{lg:2,dir:0,px:-5,pz:-1.5},{lg:2,dir:1,px:-4,pz:-0.5},{lg:1,dir:0,px:-3,pz:0},{lg:2,dir:1,px:-4,pz:0.5},{lg:2,dir:0,px:-5,pz:1.5},{lg:1,dir:1,px:-5.5,pz:2.5},
			// Couloir HG
			{lg:3,dir:0,px:-4,pz:7},{lg:3,dir:0,px:-1,pz:7},{lg:3,dir:1,px:-2.5,pz:5.5},
			// T HD
			{lg:1,dir:0,px:-6,pz:-4},{lg:5,dir:1,px:-3.5,pz:-4.5},{lg:2,dir:1,px:-2,pz:-3.5},{lg:1,dir:0,px:-1,pz:-4},{lg:2,dir:0,px:-3,pz:-2.5},{lg:2,dir:0,px:-4,pz:-2.5},{lg:1,dir:1,px:-3.5,pz:-1.5},{lg:2,dir:1,px:-5,pz:-3.5},
			// Petit rectangle HD
			{lg:2,dir:0,px:-6,pz:-6.5},{lg:2,dir:0,px:-5,pz:-6.5},{lg:1,dir:1,px:-5.5,pz:-7.5},{lg:1,dir:1,px:-5.5,pz:-5.5},
			// Couloir HD
			{lg:3,dir:0,px:-4,pz:-7},{lg:3,dir:0,px:-1,pz:-7},{lg:3,dir:1,px:-2.5,pz:-5.5},
			// Couloir BD
			{lg:3,dir:0,px:3,pz:-7},{lg:3,dir:0,px:0,pz:-7},{lg:3,dir:1,px:1.5,pz:-5.5},
			// Couloir BG
			{lg:3,dir:0,px:3,pz:7},{lg:3,dir:0,px:0,pz:7},{lg:3,dir:1,px:1.5,pz:5.5},
			// T B
			{lg:5,dir:0,px:2,pz:0},{lg:1,dir:1,px:2.5,pz:-2.5},{lg:2,dir:0,px:3,pz:-1.5},{lg:2,dir:1,px:4,pz:-0.5},{lg:1,dir:0,px:5,pz:0},{lg:2,dir:1,px:4,pz:0.5},{lg:2,dir:0,px:3,pz:1.5},{lg:1,dir:1,px:2.5,pz:2.5},
			// T BB
			{lg:5,dir:0,px:6,pz:0},{lg:1,dir:1,px:6.5,pz:-2.5},{lg:2,dir:0,px:7,pz:-1.5},{lg:2,dir:1,px:8,pz:-0.5},{lg:1,dir:0,px:9,pz:0},{lg:2,dir:1,px:8,pz:0.5},{lg:2,dir:0,px:7,pz:1.5},{lg:1,dir:1,px:6.5,pz:2.5},
			// Rectangle BG
			{lg:3,dir:0,px:4,pz:3},{lg:1,dir:1,px:4.5,pz:1.5},{lg:3,dir:0,px:5,pz:3},{lg:1,dir:1,px:4.5,pz:4.5},
			// Rectangle BD
			{lg:3,dir:0,px:4,pz:-3},{lg:1,dir:1,px:4.5,pz:-1.5},{lg:3,dir:0,px:5,pz:-3},{lg:1,dir:1,px:4.5,pz:-4.5},
			// Rectangle MG
			{lg:3,dir:1,px:1.5,pz:4.5},{lg:1,dir:0,px:0,pz:4},{lg:3,dir:1,px:1.5,pz:3.5},{lg:1,dir:0,px:3,pz:4},
			// Rectangle MD
			{lg:3,dir:1,px:1.5,pz:-3.5},{lg:1,dir:0,px:0,pz:-4},{lg:3,dir:1,px:1.5,pz:-4.5},{lg:1,dir:0,px:3,pz:-4},
			// _|_ BG
			{lg:1,dir:0,px:6,pz:4},{lg:2,dir:1,px:7,pz:3.5},{lg:2,dir:0,px:8,pz:2.5},{lg:1,dir:1,px:8.5,pz:1.5},{lg:6,dir:0,px:9,pz:4.5},{lg:1,dir:1,px:8.5,pz:7.5},{lg:3,dir:0,px:8,pz:6},{lg:2,dir:1,px:7,pz:4.5},
			// _|_ BD
			{lg:1,dir:0,px:6,pz:-4},{lg:2,dir:1,px:7,pz:-3.5},{lg:2,dir:0,px:8,pz:-2.5},{lg:1,dir:1,px:8.5,pz:-1.5},{lg:6,dir:0,px:9,pz:-4.5},{lg:1,dir:1,px:8.5,pz:-7.5},{lg:3,dir:0,px:8,pz:-6},{lg:2,dir:1,px:7,pz:-4.5},
			// Recoin BG
			{lg:1,dir:0,px:6,pz:8},{lg:1,dir:1,px:6.5,pz:7.5},{lg:1,dir:0,px:7,pz:8},
			// Recoin BD
			{lg:1,dir:0,px:6,pz:-8},{lg:1,dir:1,px:6.5,pz:-7.5},{lg:1,dir:0,px:7,pz:-8},
			// L renversé BG
			{lg:2,dir:0,px:4,pz:6.5},{lg:3,dir:1,px:5.5,pz:5.5},{lg:1,dir:0,px:7,pz:6},{lg:2,dir:1,px:6,pz:6.5},{lg:1,dir:0,px:5,pz:7},{lg:1,dir:1,px:4.5,pz:7.5},
			// L renversé BD
			{lg:2,dir:0,px:4,pz:-6.5},{lg:3,dir:1,px:5.5,pz:-5.5},{lg:1,dir:0,px:7,pz:-6},{lg:2,dir:1,px:6,pz:-6.5},{lg:1,dir:0,px:5,pz:-7},{lg:1,dir:1,px:4.5,pz:-7.5},
			// Prison des fantômes
			{lg:2,dir:0,px:-2,pz:-1.5},{lg:3,dir:1,px:-0.5,pz:-2.5},{lg:5,dir:0,px:1,pz:0},{lg:3,dir:1,px:-0.5,pz:2.5},{lg:2,dir:0,px:-2,pz:1.5}
		];

		// On créé le template de mur
		// var wallTTexture = this.renderer._microCache.getSet('heavy', new THREE.ImageUtils.loadTexture( 'img/wall1.jpg' ));
		var wallTTexture = new THREE.ImageUtils.loadTexture( 'img/wall1.jpg' );
		wallTTexture.wrapS = wallTTexture.wrapT = THREE.RepeatWrapping; 
		wallTTexture.repeat.set( 1, 1 );
		var wallTMaterial = new THREE.MeshBasicMaterial( { map: wallTTexture, side: THREE.DoubleSide } );

		// var wallTMaterial = new THREE.MeshLambertMaterial({color: 0xCC0000});
		var wallTGeometry = new THREE.PlaneGeometry(lCase, lCase, 1, 1);
		var wallT = new THREE.Mesh(wallTGeometry, wallTMaterial);
		// wallT.receiveShadow = false;
		// wallT.castShadow = true;

		var group = new THREE.Object3D();
		for(var i=0; i < wallMap.length; i++){
			var w = wallMap[i];
			var cpt = w.lg;
			while(cpt > 0) {
				var wall = wallT.clone();
				switch(w.dir){
					case 0:
						wall.position.x = lCase*w.px;
						wall.position.z = lCase*(w.pz-Math.abs(w.lg/2)-1/2+cpt);
						break;
					case 1:
						wall.position.x = lCase*(w.px-Math.abs(w.lg/2)-1/2+cpt);
						wall.position.z = lCase*w.pz;
						break;
				}
				this.addSpotLight(wall.position.x, lCase*0.5, wall.position.z);
				// wall.receiveShadow = true;
				wall.position.y = lCase/2;
				wall.rotation.y = Math.PI / 2 * (1-w.dir);
				// On ajoute les murs dans le tableau des obstacles pour les collisions
				this.walls.push(wall);
				group.add(wall);
				cpt--;
			}
			var points = [];
			var cPos = {x:w.pz*lCase+this.map.offset.z,y:w.px*lCase+this.map.offset.x};
			switch(w.dir){
				case 0: //horizontal
					var sP = {x:cPos.x-lCase*w.lg/2, y:cPos.y};
					var eP = {x:cPos.x+lCase*w.lg/2, y:cPos.y};
					break;
				case 1: // vertical
					var sP = {x:cPos.x, y:cPos.y-lCase*w.lg/2};
					var eP = {x:cPos.x, y:cPos.y+lCase*w.lg/2};
					break;
			}
			points.push(sP);
			points.push(eP);
			this.minimap.drawLine({points:points, color:'rgba(255,255,255,.5)', thickness:1, isStatic:1});
		}
		this.scene.add(group);

	},

	getObstacles: function () {

		return this.walls;

	},

	addSpotLight: function(x,y,z){
		// var light = new THREE.PointLight( 0xffff00, 20, 50 );
		// light.position.set(x,y,z);
		// this.lights.push(light);
		// this.scene.add( this.lights[this.lights.length-1]);

		var light	= new THREE.SpotLight( 0x8888FF, 2 );
		// spot1	= light;
		light.target.position.set( x, y, z );
		light.shadowCameraNear = 0.01;
		light.castShadow       = true;
		light.shadowDarkness   = 0.5;
		//light.shadowCameraVisible	= true;
		this.scene.add( light );

	}

});