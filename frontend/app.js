// import { Mesh } from 'three';
import { addLights } from './light.js';
import { changeView } from './camera.js';


(function () {
    const scene = new THREE.Scene();
    window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 5000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio, 20);
    
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
        loadingOverlay.id = 'loadingOverlay';
        loadingOverlay.innerHTML = `
            <link rel="stylesheet" href="./static/js/css/test.css">
            <div class="loading-container">
                <div class="spinner"></div>
                <div class="loading-text">Chargement<span>.</span><span>.</span><span>.</span></div>
            </div>
        `;
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
            }, 1000);
        }
    }

    createLoadingOverlay(); // Démarrer l'animation de chargement
    setTimeout(removeLoadingOverlay, 5000); // Simule un chargement de 5s


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
        const defaultView = 'vue1'; // Vue par défaut
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

    let homeMenu = null;

    let SpotLight2 = null;
    let helper2 = null;

    function initializeScene_menu() {
        if (window.currentView === 'vue5') {
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
    }

    function destroy_scene_menu() {
        if (window.currentView !== 'vue5' && homeMenu) {
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
    }



    
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
			if (event.key === '1') {
				if (!isLoading) {
					if (window.currentView === 'vue5') {
						isLoading = true;
						createLoadingOverlay();
                        window.currentView = 'vue3';
                        
						setTimeout(() => {
                            changeView('vue3');
						}, 1500); // On attend un peu avant de passer en vue3
                        
						setTimeout(() => {
                            destroy_scene_menu();
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
					setTimeout(() => {
                        createLoadingOverlay(); // Afficher l'écran de chargement
						changeView(targetView);
                        initializeScene_menu();
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
            console.log(window.currentView);
			// console.log(camera.position);

    
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

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
	window.addEventListener('resize', onWindowResize, false);
    
})();
