(function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000080); // Couleur de fond noire

    // Chargement du ciel HDRI
    const skyTexture = new THREE.TextureLoader().load('image/NWRZ_B_SkyBoxNight_baseColor.png');
    const skyMaterial = new THREE.MeshBasicMaterial({
        map: skyTexture,
        side: THREE.BackSide // Inverse l'orientation pour être visible de l'intérieur
    });

    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);

	const ciel = new THREE.TextureLoader().load('image/Capture d’écran 2025-01-15 à 16.35.37.png');
	scene.background = ciel;
    // scene.add(sky);

    // Position de la caméra
    camera.position.set(0, 0, 0); // Au centre de la sphère

    const container = document.getElementById('threejs-container');
    container.appendChild(renderer.domElement);

    // Configuration des vues
    const views = {
        vue1: {
            camera: {
                position: [0, 20, -40],
                rotation: [-Math.PI / 60, 3.14, 0],
            }
        },
        vue2: {
            camera: {
                position: [85, 100, 0],
                rotation: [-Math.PI / 2, Math.PI / 4, Math.PI / 2],
            }
        },
        vue3: {
            camera: {
                position: [0, 60, 200],
                rotation: [-Math.PI / 60, 3.14, 0],
            }
        },
    };

    let currentTransition = null;

    // Fonction pour interpoler entre deux positions et rotations
    function smoothTransition(targetPosition, targetRotation, duration = 1) {
        if (currentTransition) cancelAnimationFrame(currentTransition);

        const startPosition = camera.position.clone();
        const startRotation = new THREE.Euler().copy(camera.rotation);

        const startTime = performance.now();
        const endTime = startTime + duration * 1000;

        function animate() {
            const now = performance.now();
            const t = Math.min((now - startTime) / (endTime - startTime), 1);

            // Interpolation de la position
            camera.position.lerpVectors(startPosition, new THREE.Vector3(...targetPosition), t);

            // Interpolation de la rotation
            camera.rotation.x = startRotation.x + t * (targetRotation[0] - startRotation.x);
            camera.rotation.y = startRotation.y + t * (targetRotation[1] - startRotation.y);
            camera.rotation.z = startRotation.z + t * (targetRotation[2] - startRotation.z);

            if (t < 1) {
                currentTransition = requestAnimationFrame(animate);
            }
        }

        animate();
    }

    // Fonction pour changer de vue avec transition
    function changeView(viewName) {
        const view = views[viewName];
        if (view) {
            smoothTransition(view.camera.position, view.camera.rotation, 1.5); // Transition de 1,5 seconde
        }
    }

    function resizeRenderer() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    // Lumières simples ajoutées aux positions spécifiées
    const lightPositions = [
        { x: 40, y: 60, z: 80 },
        { x: -40, y: 60, z: 80 },
        { x: -40, y: 60, z: -80 },
        { x: 40, y: 60, z: -80 }
    ];

    lightPositions.forEach(pos => {
        const simpleLight = new THREE.PointLight(0xffffff, 1, 100);
        simpleLight.position.set(pos.x, pos.y, pos.z);
		simpleLight.intensity = 2;
        scene.add(simpleLight);
    });



	const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight2.position.set(500, 100, 1);
	// scene.add(directionalLight2);

	// const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
	// directionalLight3.position.set(-5000, 100, 1);
	// scene.add(directionalLight3);

    const ambientLight = new THREE.AmbientLight(0x404040);
    // scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.5); // Couleur blanche et intensité de 1
    sunLight.position.set(50, 10000, 50); // Position en hauteur et à un angle
    sunLight.castShadow = true; // Active les ombres si nécessaire

    // Configuration des ombres
    sunLight.shadow.mapSize.width = 2048; // Résolution des ombres
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5; // Distance minimale pour les ombres
    sunLight.shadow.camera.far = 500; // Distance maximale pour les ombres
    sunLight.shadow.camera.left = -100; // Limites pour le volume des ombres
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;

    // Ajout de la lumière à la scène
    scene.add(sunLight);


    const spotLight1 = new THREE.SpotLight(0xffffff, 1);
    spotLight1.position.set(65, 60, 105); // Lumière en hauteur
    spotLight1.angle = Math.PI / 4; // Angle du faisceau
    spotLight1.penumbra = 0.2; // Douceur des bords
    spotLight1.distance = 300; // Portée
    spotLight1.castShadow = true; // Active les ombres
    spotLight1.intensity = 1; // Intensité
    scene.add(spotLight1);

    // Cible de la lumière
    const targetObject = new THREE.Object3D();
    targetObject.position.set(-200, -320, 50);
    scene.add(targetObject);
    spotLight1.target = targetObject;

    // SpotLightHelper
    const spotLightHelper = new THREE.SpotLightHelper(spotLight1);
    // scene.add(spotLightHelper);

    const spotLight2 = new THREE.SpotLight(0xffffff, 1);
    spotLight2.position.set(-65, 60, 105); // Lumière en hauteur
    spotLight2.angle = Math.PI / 4; // Angle du faisceau
    spotLight2.penumbra = 0.2; // Douceur des bords
    spotLight2.distance = 200; // Portée
    spotLight2.castShadow = true; // Active les ombres
    spotLight2.intensity = 1; // Intensité

    scene.add(spotLight2);

    // Cible de la lumière
    const targetObjectt = new THREE.Object3D();
    targetObjectt.position.set(-20, -20, 50); // Position de la cible (ajustée pour une inclinaison)
    scene.add(targetObjectt);
    spotLight2.target = targetObjectt; // Assignation correcte de la cible

    // SpotLightHelper pour visualiser le faisceau
    const spotLightHelperr = new THREE.SpotLightHelper(spotLight2);
    // scene.add(spotLightHelperr);

    // Fonction pour ajuster dynamiquement la cible (facultatif)


    const spotLight3 = new THREE.SpotLight(0xffffff, 1);
    spotLight3.position.set(-65, 60, -105); // Lumière en hauteur
    spotLight3.angle = Math.PI / 4; // Angle du faisceau
    spotLight3.penumbra = 0.2; // Douceur des bords
    spotLight3.distance = 200; // Portée
    spotLight3.castShadow = true; // Active les ombres
    spotLight3.intensity = 1; // Intensité

    scene.add(spotLight3);

    // Cible de la lumière
    const targetObjecttt = new THREE.Object3D();
    targetObjecttt.position.set(-5, -40, 0);
    scene.add(targetObjecttt);
    spotLight3.target = targetObjecttt;

    // SpotLightHelper
    // const spotLightHelperrr = new THREE.SpotLightHelper(spotLight3);
    // scene.add(spotLightHelperrr);
    // document.addEventListener('keydown', (event) => {
    // 	if (event.key === 'ArrowUp') {
    // 		targetObjecttt.position.y += 15; // Monte la cible
    // 	} else if (event.key === 'ArrowDown') {
    // 		targetObjecttt.position.y -= 15; // Descend la cible
    // 	} else if (event.key === 'ArrowLeft') {
    // 		targetObjecttt.position.x -= 15; // Déplace la cible à gauche
    // 	} else if (event.key === 'ArrowRight') {
    // 		targetObjecttt.position.x += 15; // Déplace la cible à droite
    // 	}
    // 	spotLightHelperrr.update(); // Met à jour le SpotLightHelper après le changement
    // });

    const spotLight4 = new THREE.SpotLight(0xffffff, 1);
    spotLight4.position.set(65, 60, -105); // Lumière en hauteur
    spotLight4.angle = Math.PI / 4; // Angle du faisceau
    spotLight4.penumbra = 0.2; // Douceur des bords
    spotLight4.distance = 200; // Portée
    spotLight4.castShadow = true; // Active les ombres
    spotLight4.intensity = 1; // Intensité

    scene.add(spotLight4);

	// Cible de la lumière
	const targetObjectttt = new THREE.Object3D();
	targetObjectttt.position.set(-380, -355, 200);
	scene.add(targetObjectttt);
	spotLight4.target = targetObjectttt;

	// SpotLightHelper
	const spotLightHelperrrr = new THREE.SpotLightHelper(spotLight4);

	// scene.add(spotLightHelperrrr);

	// document.addEventListener('keydown', (event) => {
	// 	if (event.key === 'ArrowUp') {
	// 		targetObjectttt.position.y += 15; // Monte la cible
	// 	} else if (event.key === 'ArrowDown') {
	// 		targetObjectttt.position.y -= 15; // Descend la cible
	// 	} else if (event.key === 'ArrowLeft') {
	// 		targetObjectttt.position.x -= 15; // Déplace la cible à gauche
	// 	} else if (event.key === 'ArrowRight') {
	// 		targetObjectttt.position.x += 15; // Déplace la cible à droite
	// 	}
	// 	spotLightHelperrrr.update(); // Met à jour le helper pour refléter les changements
	// 	console.log(targetObjectttt.position); // Affiche la position de la cible
	// });



	
	// Repère pour la position de la lumière
	const lightPositionHelper = new THREE.SphereGeometry(0.2, 16, 16);
	const lightPositionMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
	const lightPositionMesh = new THREE.Mesh(lightPositionHelper, lightPositionMaterial);
	lightPositionMesh.position.copy(spotLight1.position);
	scene.add(lightPositionMesh);
	
	// Animation
	function animate() {
		requestAnimationFrame(animate);
	
		// Mise à jour du SpotLightHelper (nécessaire si la lumière bouge)
		spotLightHelper.update();
	
		renderer.render(scene, camera);
	}
	animate();






    // Chargement et configuration du modèle
    const loader = new THREE.GLTFLoader();
    // loader.load('3d_object/ImageToStl.com_football_stadium (1).glb', function (gltf) {
	loader.load('3d_object/footballStadium copy 5.glb', function (gltf) {
        const model = gltf.scene;
        scene.add(model);

        // Configuration initiale
        model.position.set(0, 0, 0);
        model.scale.set(1.7, 1.54, 2);
		changeView('vue1'); // Vue par défaut

        // Contrôles clavier simples
        document.addEventListener('keydown', function (event) {
            if (event.key === '1') {
                changeView('vue1');
            } else if (event.key === '2') {
                changeView('vue2');
            }
			else if (event.key === '3') {
				changeView('vue3');
			}
        });

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    });

    resizeRenderer();
    window.addEventListener('resize', resizeRenderer);
})();
