let SpotLight2 = null;
let helper2 = null;
let homeMenu = null;

export function initializeScene_menu() {
	// const SpotLight1 = new THREE.SpotLight(0xffffff, 1.5);
	// SpotLight1.position.set(500, 700, 500);
	// SpotLight1.target.position.set(450, 500, 500);
	// scene.add(SpotLight1);

	// const helper = new THREE.SpotLightHelper(SpotLight1);
	// scene.add(helper);

	SpotLight2 = new THREE.SpotLight(0xffffff, 1.5);
	SpotLight2.position.set(500, 700, 500);
	SpotLight2.target.position.set(500, 500, 500);
	scene.add(SpotLight2);

	helper2 = new THREE.SpotLightHelper(SpotLight2);
	scene.add(helper2);

	document.addEventListener("keydown", (event) => {
		const speed = 10; // Vitesse de déplacement de la lampe
	
		switch (event.key.toLowerCase()) {
			case "u": // Monter
				SpotLight2.position.y += speed;
				break;
			case "h": // Aller à gauche
				SpotLight2.position.x -= speed;
				break;
			case "j": // Descendre
				SpotLight2.position.y -= speed;
				break;
			case "k": // Aller à droite
				SpotLight2.position.x += speed;
				break;
		}
	
		// Met à jour la position de la cible si nécessaire
		SpotLight2.target.updateMatrixWorld();
	
		// Met à jour le helper pour voir les changements
		helper2.update();
	});

	const loaderr = new THREE.GLTFLoader();
	loaderr.load('/3d_object/ImageToStl.com_football_stadium (5).glb', function (gltf) {
		homeMenu = gltf.scene;

		homeMenu.traverse((node) => {
			if (node.isMesh) {
				node.castShadow = true;
				node.receiveShadow = true;
				if (node.material.map) {
					node.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
					node.material.map.magFilter = THREE.NearestFilter;
					node.material.map.minFilter = THREE.LinearMipMapLinearFilter;
				}
			}
		});
	
		// Positionnement du modèle
		scene.add(homeMenu);
		homeMenu.position.set(500, 500, 500);
		homeMenu.rotation.set(0, 0, 0);
		homeMenu.scale.set(1, 1, 1);
	});
}

export function destroy_scene_menu() {
	// Vérifie d'abord si SpotLight2 et helper2 existent
	if (SpotLight2) {
		scene.remove(SpotLight2); // Retirer SpotLight2
	}
	if (helper2) {
		scene.remove(helper2); // Retirer helper2
	}
	scene.remove(homeMenu); // Retirer homeMenu de la scène
	homeMenu = null; // Réinitialiser homeMenu
}