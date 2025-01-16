import { addLights } from './light.js';


(function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const ciel = new THREE.TextureLoader().load('image/Capture d’écran 2025-01-15 à 16.35.37.png');
    scene.background = ciel;
    
    const container = document.getElementById('threejs-container');
    container.appendChild(renderer.domElement);
    
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
        vue4: {
            camera: {
                position: [0, 200, 0],
                rotation: [-Math.PI / 2, 0, 0],
            }
        }
    };
    

    addLights(scene);
    let currentTransition = null;

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

    // Ajouter paddles à la scène
    scene.add(paddle_right);
    scene.add(paddle_left);

    // Vitesse de déplacement des paddles
    const paddle_speed = 5;

    // Écoute des événements clavier
    document.addEventListener('keydown', function (event) {
        // Déplacement du paddle droit
        if (event.key === 'ArrowUp' && paddle_right.position.x > border_top.position.x + 10) {
            paddle_right.position.x -= paddle_speed;
        } else if (event.key === 'ArrowDown' && paddle_right.position.x < border_bottom.position.x - 10) {
            paddle_right.position.x += paddle_speed;
        }
        
        else if (event.key === 'w' && paddle_left.position.x > border_top.position.x + 10) {
            // Déplace le paddle vers le haut (dans l'axe x négatif)
            paddle_left.position.x -= paddle_speed;
        } else if (event.key === 's' && paddle_left.position.x < border_bottom.position.x - 10) {
            // Déplace le paddle vers le bas (dans l'axe x positif)
            paddle_left.position.x += paddle_speed;
        }
    });



    const ballGeometry = new THREE.SphereGeometry(5, 32, 32);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(0, 0, 0);

    scene.add(ball);

    let speedx = -0.1;
    let speedy = 0.1;

    function animateBall() {
        ball.position.x += speedx;
        ball.position.z += speedy;
    }















    const loader = new THREE.GLTFLoader();
    loader.load('3d_object/footballStadium copy 5.glb', function (gltf)
    {
        const model = gltf.scene;
        scene.add(model);

        model.position.set(0, 0, 0);
        model.scale.set(1.7, 1.54, 2);
        changeView('vue1');

        document.addEventListener('keydown', function (event)
        {
            if (event.key === '1') {
                changeView('vue1');
            } else if (event.key === '2') {
                changeView('vue2');
                scene.add(border_top);
                scene.add(border_bottom);
                scene.add(border_left);
                scene.add(border_right);
                scene.add(paddle_right);
                scene.add(paddle_left);
            }
            else if (event.key === '3') {
                changeView('vue3');
            }
            else if (event.key === '4') {
                changeView('vue4');
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
