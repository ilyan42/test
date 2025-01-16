export function addLights(scene) {
    // Sunlight
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
    sunLight.position.set(50, 10000, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;
    scene.add(sunLight);

    // Spotlights
    const spotlights = [
        { position: [65, 60, 105], targetPosition: [-200, -320, 50] },
        { position: [-65, 60, 105], targetPosition: [-20, -20, 50] },
        { position: [-65, 60, -105], targetPosition: [-5, -40, 0] },
        { position: [65, 60, -105], targetPosition: [-380, -355, 200] },
    ];

    spotlights.forEach(({ position, targetPosition }) => {
        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(...position);
        spotLight.angle = Math.PI / 4;
        spotLight.penumbra = 0.2;
        spotLight.distance = 200;
        spotLight.castShadow = true;
        spotLight.intensity = 1;

        const targetObject = new THREE.Object3D();
        targetObject.position.set(...targetPosition);
        scene.add(targetObject);
        spotLight.target = targetObject;

        // Optional: Helper to visualize the spotlight
        // const helper = new THREE.SpotLightHelper(spotLight);
        // scene.add(helper);

        scene.add(spotLight);
    });
}