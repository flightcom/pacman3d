var Pacman = Class.create(Character, {

	draw: function(){

		// SPHERE
		// create the sphere's material
		var radius = (this.dim*0.6)/2, segments = 16, rings = 16;
		var material = new THREE.MeshLambertMaterial({color: 0xFFF700});
		var geometry = new THREE.SphereGeometry(radius, segments, rings);
		// var material = new THREE.Object3D();
		// we will cover the sphereMaterial next!
		var sphere = new THREE.Mesh(geometry,material);
		// set its position
		sphere.receiveShadow = true;

		return sphere;

	}
});