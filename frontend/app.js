// import { Mesh } from 'three';
import { addLights } from './light.js';
import { changeView } from './camera.js';


(function () {
    const scene = new THREE.Scene();
    window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const ciel = new THREE.TextureLoader().load('/image/Capture d’écran 2025-01-15 à 16.35.37.png');
    scene.background = ciel;
    
    const container = document.getElementById('threejs-container');
    container.appendChild(renderer.domElement);
    
    addLights(scene);

	let loadingOverlay;
    let isLoading = false;
    let targetView = null;

    function createLoadingOverlay() {
        loadingOverlay = document.createElement('div');
        loadingOverlay.style.position = 'fixed';
        loadingOverlay.style.top = '0';
        loadingOverlay.style.left = '0';
        loadingOverlay.style.width = '100%';
        loadingOverlay.style.height = '100%';
        loadingOverlay.style.backgroundColor = 'black';
        loadingOverlay.style.zIndex = '1000';
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.justifyContent = 'center';
        loadingOverlay.style.alignItems = 'center';
        loadingOverlay.style.color = 'white';
        loadingOverlay.style.fontSize = '2rem';
        loadingOverlay.textContent = 'Chargement...';
        document.body.appendChild(loadingOverlay);
    }

    function removeLoadingOverlay() {
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(loadingOverlay);
                isLoading = false;
                if (targetView) {
                    changeView(targetView);
                    targetView = null;
                }
            }, 500);
        }
    }
    // changeView('vue1');

    function resizeRenderer() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

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



    const pongWidth_side_rl = 80;  // Largeur de la zone de jeu
    const pongHeight = 0;  // Hauteur de la zone de jeu
    const borderThickness = 20; // Épaisseur des bords

    const pongWidth_side_tb = 220;  // Largeur de la zone de jeu
    
    // Création des bords
    const border_top = new THREE.Mesh(
        new THREE.BoxGeometry(pongWidth_side_tb + borderThickness * 2, borderThickness, 1),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );

    border_top.position.set(-55, 0, 0);
    border_top.rotation.set(0, Math.PI / 2, 0);

    // scene.add(border_top);

    const border_bottom = new THREE.Mesh(
        new THREE.BoxGeometry(pongWidth_side_tb + borderThickness * 2, borderThickness, 1),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );

    border_bottom.rotation.set(0, Math.PI / 2, 0);
    border_bottom.position.set(55, 0, 0);

    // scene.add(border_bottom);

    const border_left = new THREE.Mesh(
        new THREE.BoxGeometry(pongWidth_side_rl + borderThickness * 2, borderThickness, 1),
        new THREE.MeshBasicMaterial({ color: 0x0000ff })
    );

    border_left.position.set(0, 0, -120);
    // scene.add(border_left);

    const border_right = new THREE.Mesh(
        new THREE.BoxGeometry(pongWidth_side_rl + borderThickness * 2, borderThickness, 1),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    border_right.position.set(0, 0, 120);
    // scene.add(border_right);
    
    // Dimensions des paddles
    const paddleGeometry = new THREE.BoxGeometry(15, 5, 5);
    const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Paddle droit
    const paddle_right = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddle_right.position.set(0, 0, 100);

    // Paddle gauche
    const paddle_left = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddle_left.position.set(0, 0, -100);


    function initializeDefaultView() {
        // Définir la vue par défaut
        const defaultView = 'vue4'; // Vue par défaut
        changeView(defaultView); // Application de la vue par défaut
    }


    const ballGeometry = new THREE.SphereGeometry(5, 32, 32);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(0, 0, 0);


    let ballDirection = new THREE.Vector3(0, 0, 1).normalize(); // Direction initiale de la balle
    let ballSpeed = 0.5; // Vitesse de la balle

    function animateBall() {
        ball.position.add(ballDirection);
    
        // Collision avec les limites du terrain
        if (ball.position.z > 120 || ball.position.z < -120) {
            ballDirection.z *= -1;
        }
        else if (ball.position.x > 55 || ball.position.x < -55) {
            ballDirection.x *= -1;
        }
    
        // Collision avec le paddle droit
        if (Math.abs(ball.position.z - paddle_right.position.z) < 5) { // Distance de collision sur l'axe Z
            if (Math.abs(ball.position.x - paddle_right.position.x) < 10) { // Distance de collision sur l'axe X
                
                // Inverser la direction Z
                ballDirection.z *= -1;
                
                // Ajouter un effet basé sur la position de collision sur le paddle
                const relativeIntersectX = ball.position.x - paddle_right.position.x;
                // Normaliser entre -1 et 1
                const normalizedIntersect = relativeIntersectX / 7.5;
                // Modifier la direction X en fonction du point d'impact
                ballDirection.x = normalizedIntersect;
                // Normaliser le vecteur de direction
                ballDirection.normalize();
            }
        }
    
        // Collision avec le paddle gauche
        if (Math.abs(ball.position.z - paddle_left.position.z) < 5) { // Distance de collision sur l'axe Z
            if (Math.abs(ball.position.x - paddle_left.position.x) < 10) { // Distance de collision sur l'axe X
                // Inverser la direction Z
                ballDirection.z *= -1;
                
                // Ajouter un effet basé sur la position de collision sur le paddle
                const relativeIntersectX = ball.position.x - paddle_left.position.x;
                // Normaliser entre -1 et 1
                const normalizedIntersect = relativeIntersectX / 7.5;
                // Modifier la direction X en fonction du point d'impact
                ballDirection.x = normalizedIntersect;
                // Normaliser le vecteur de direction
                ballDirection.normalize();
            }
        }
    }

	const blockGeometry = new THREE.BoxGeometry(10, 10, 10);
	const blockMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const block = new THREE.Mesh(blockGeometry, blockMaterial);
	block.position.set(500, 500, 500);
	scene.add(block);


    
    const loader = new THREE.GLTFLoader();
    loader.load('/3d_object/footballStadium copy 5.glb', function (gltf) {
        const model = gltf.scene;
        scene.add(model);
    
        model.position.set(0, 0, 0);
        model.rotation.set(0, Math.PI / 1, 0);
        model.scale.set(1.7, 1.54, 2);

        //vue par defaut
        initializeDefaultView();
        
        let isrotate = false;

        document.addEventListener('keydown', function (event) {
				const moveSpeed = 10; // Vitesse de déplacement
				const rotateSpeed = Math.PI / 60; // Vitesse de rotation
			
				switch (event.key) {
					case "z":
						camera.position.z -= moveSpeed; // Avancer
						break;
					case "s":
						camera.position.z += moveSpeed; // Reculer
						break;
					case "q":
						camera.position.x -= moveSpeed; // Aller à gauche
						break;
					case "d":
						camera.position.x += moveSpeed; // Aller à droite
						break;
					case "ArrowUp":
						camera.rotation.x -= rotateSpeed; // Rotation vers le haut
						break;
					case "ArrowDown":
						camera.rotation.x += rotateSpeed; // Rotation vers le bas
						break;
					case "ArrowLeft":
						camera.rotation.y -= rotateSpeed; // Rotation vers la gauche
						break;
					case "ArrowRight":
						camera.rotation.y += rotateSpeed; // Rotation vers la droite
						break;
				}
            // Ajout des déplacements individuels des paddles dans animate()
			// if (view === 'vue5' && event.key === '1')
			// {
			// 	if (!isLoading)
			// 	{
			// 		isLoading = true;
			// 		targetView = 'vue3';
					
			// 		// **Met directement la caméra sur la vue cible AVANT d'afficher l'écran de chargement**
			// 		// setTimeout(() => {
			// 			createLoadingOverlay(); // Afficher l'écran de chargement
			// 			changeView(targetView);
			// 		// }, 1500);
			
					
			// 		// Simuler un chargement (ajuster la durée si nécessaire)
			// 		setTimeout(() => {
			// 			removeLoadingOverlay(); // Retirer l'écran de chargement après un délai
			// 			changeView('vue1');
			// 		}, 3500);
			// 	}
			// }
			if (event.key === '1') {
				if (!isLoading) {
					if (window.currentView === 'vue5') {
						isLoading = true;
						createLoadingOverlay();
			
						setTimeout(() => {
							changeView('vue3');
						}, 1500); // On attend un peu avant de passer en vue3
			
						setTimeout(() => {
							removeLoadingOverlay();
							changeView('vue1'); // Maintenant on va en vue1 après la transition
							model.position.set(0, 0, 0);
							model.rotation.set(0, Math.PI / 1, 0);
							isLoading = false;
						}, 3500);
					} else {
						changeView('vue1');
						model.position.set(0, 0, 0);
						model.rotation.set(0, Math.PI / 1, 0);
					}
				}
            } else if (event.key === '2') {
                changeView('vue2');
                // scene.add(border_top);
                // scene.add(border_bottom);
                // scene.add(border_left);
                // scene.add(border_right);
                scene.add(ball);
                scene.add(paddle_right);
                scene.add(paddle_left);
                model.position.set(0, 0, 0);
                model.rotation.set(0, Math.PI / 1, 0);
                isrotate = false;
            } if (event.key === '3' && !isLoading) {
				changeView('vue3');
				if (!isLoading) {
					isLoading = true;
					targetView = 'vue5';
					window.currentView = 'vue5';
					
					// **Met directement la caméra sur la vue cible AVANT d'afficher l'écran de chargement**
					setTimeout(() => {
						createLoadingOverlay(); // Afficher l'écran de chargement
						changeView(targetView);
					}, 1500);
			
					
					// Simuler un chargement (ajuster la durée si nécessaire)
					setTimeout(() => {
						removeLoadingOverlay(); // Retirer l'écran de chargement après un délai
					}, 3500);
				}
            } else if (event.key === '4') {
                changeView('vue4');
                model.rotation.set(0, Math.PI / 1, 0);
                isrotate = true;
            }
        });
    
        // Ajout des contrôles des paddles
        let keysPressed = {};
        let paddleSpeed = 2;
    
        // Événements pour enregistrer les touches pressées
        document.addEventListener('keydown', (event) => {
            keysPressed[event.key] = true;
        });
    
        document.addEventListener('keyup', (event) => {
            keysPressed[event.key] = false;
        });
    
        function animate() {
            // console.log('Balle position:', ball.position);
            // console.log('Paddle droit position:', paddle_right.position);
            // console.log('Paddle gauche position:', paddle_left.position);
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
			console.log(camera.position);

    
            // Déplacement du paddle droit
            if (keysPressed['w'] && paddle_right.position.x > border_top.position.x + 10) {
                paddle_right.position.x -= paddleSpeed;
            }
            if (keysPressed['s'] && paddle_right.position.x < border_bottom.position.x - 12) {
                paddle_right.position.x += paddleSpeed;
            }
    
            // Déplacement du paddle gauche
            if (keysPressed['ArrowUp'] && paddle_left.position.x > border_top.position.x + 10) {
                paddle_left.position.x -= paddleSpeed;
            }
            if (keysPressed['ArrowDown'] && paddle_left.position.x < border_bottom.position.x - 12) {
                paddle_left.position.x += paddleSpeed;
            }
            animateBall();
            
        }
        animate();
    });

	// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	// directionalLight.position.set(500, 750, 500);
	// scene.add(directionalLight);


	// const light1 = new THREE.SpotLight(0xffffff, 1.5);
	// light1.position.set(700, 700, 700);  // Lumière principale venant du dessus
	// light1.target.position.set(500, 500, 500);
	// scene.add(light1);
	// scene.add(light1.target);

	// const light2 = new THREE.SpotLight(0xffffff, 0.8);
	// light2.position.set(300, 800, 300);  // Lumière secondaire pour combler les ombres
	// light2.target.position.set(500, 500, 500);
	// scene.add(light2);
	// scene.add(light2.target);

	// const light3 = new THREE.SpotLight(0xffaa88, 0.6);
	// light3.position.set(500, 300, 700);  // Contre-jour pour détacher l'objet du fond
	// light3.target.position.set(500, 500, 500);
	// scene.add(light3);
	// scene.add(light3.target);

	// // Optionnel : Ajouter une AmbientLight pour adoucir les ombres
	// const ambientLight = new THREE.AmbientLight(0x404040, 1);
	// scene.add(ambientLight);

	// const loaderr = new THREE.GLTFLoader();
	// loaderr.load('/3d_object/ImageToStl.com_football_stadium (5).glb', function (gltf) {
	// const homeMenu = gltf.scene;
		
	// 	homeMenu.traverse((node) => {
	// 		if (node.isMesh) {
	// 			node.castShadow = true;
	// 			node.receiveShadow = true;
	// 			if (node.material.map) {
	// 				node.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
	// 				node.material.map.magFilter = THREE.NearestFilter;
	// 				node.material.map.minFilter = THREE.LinearMipMapLinearFilter;
	// 			}
	// 		}
	// 	});
	
	// 	// Positionnement du modèle
	// 	scene.add(homeMenu);
	// 	homeMenu.position.set(500, 500, 500);
	// 	homeMenu.rotation.set(0, Math.PI / 1, 0);
	// 	homeMenu.scale.set(1.7, 1.54, 2);
	// });

	// // const lightss = new THREE.PointLight(0xffffff, 10, 100);
	// // lightss.position.set(500, 500, 500);
	// // scene.add(lightss);

	// const lightsss = new THREE.PointLight(0xffffff, 10, 100);
	// lightsss.position.set(748, 600, 3420);
	// scene.add(lightsss);

	// const lightssss = new THREE.PointLight(0xffffff, 10, 100);
	// lightssss.position.set(340, 600, 3420);
	// scene.add(lightssss);

	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Lumière douce globale
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1); // Vient d'en haut
    scene.add(directionalLight);

    // Trois lumières ponctuelles autour du modèle
    const pointLight1 = new THREE.PointLight(0xffffff, 1);
    pointLight1.position.set(500, 500, 500); // Lumière à droite

    const pointLight2 = new THREE.PointLight(0xffffff, 1);
    pointLight2.position.set(300, 700, 500); // Lumière au-dessus

    const pointLight3 = new THREE.PointLight(0xffffff, 1);
    pointLight3.position.set(400, 500, 700); // Lumière devant

    scene.add(pointLight1, pointLight2, pointLight3);

	const loade = new THREE.GLTFLoader();
	loade.load('/3d_object/persoTest.glb', function (gltf) {
		const model = gltf.scene;
		scene.add(model);
	
		model.position.set(400, 500, 500);
		model.scale.set(10, 10, 10);
	
		// Modifier le matériau existant au lieu de le remplacer
		model.traverse((node) => {
			if (node.isMesh) {
				const material = node.material;
				if (material) {
					material.roughness = 1;  // Enlève la brillance
					material.metalness = 0;  // Désactive l'effet métallique
				}
			}
		});
	});
	
	// Gestion du redimensionnement
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
	window.addEventListener('resize', onWindowResize, false);
    
})();
