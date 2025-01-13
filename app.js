(function() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x363535);

    const container = document.getElementById('threejs-container');
    container.appendChild(renderer.domElement);

    // Configuration des vues
    const views = {
        vue1: {
            camera: {
                position: [0, 20, 0],
                rotation: -Math.PI / 60,
            }
        },
        vue2: {
            camera: {
                position: [-100, 150, 40],
                rotation: -Math.PI / 2,
            }
        }
    };

    // Fonction simple pour changer de vue
    function changeView(viewName) {
        const view = views[viewName];
        if (view) {
            const [x, y, z] = view.camera.position;
            camera.position.set(x, y, z);
            camera.rotation.x = view.camera.rotation;
			if (viewName === 'vue1') {
				camera.rotation.y = 3.14;
				camera.rotation.z = 0;

			} else {
				camera.rotation.y = -Math.PI / 5;
				camera.rotation.z = -Math.PI / 2;
			}
			

        }
    }

    function resizeRenderer() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    }

    // Lumière simple
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(1, 1, 1).normalize();
    // scene.add(light);

	//lumiere directionnelle
	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(1, 1, 1);
	scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Chargement et configuration du modèle
    const loader = new THREE.GLTFLoader();
    loader.load('3d_object/ImageToStl.com_football_stadium (1).glb', function (gltf) {
        const model = gltf.scene;
        scene.add(model);

        // Configuration initiale
        model.position.set(0, 0, 0);
        model.scale.set(0.03, 0.04, 0.03);
        changeView('vue1'); // Vue initiale

        // Contrôles clavier simples
		//changer de vue au click de la souris

		if (document.addEventListener) {
			document.addEventListener('keydown', function(event) {
				if (event.key === '1') {
					changeView('vue1');
				} else if (event.key === '2') {
					changeView('vue2');
				}
			});
		}
		//changer de vue au click de la souris




        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    });

    resizeRenderer();
    window.addEventListener('resize', resizeRenderer);
})();
