//sheet.js

// LUMIERE

// spotlight #1 -- yellow, dark shadow
var spotlight = new THREE.SpotLight(0xffff00);
spotlight.position.set(-60,150,-30);
spotlight.shadowCameraVisible = true;
spotlight.shadowDarkness = 0.95;
spotlight.intensity = 2;
// must enable shadow casting ability for the light
spotlight.castShadow = true;
scene.add(spotlight);
