const views = {
    vue1: {
        camera: {
            position: [0, 20, 45],
            // rotation: [-Math.PI / 60, -Math.PI / 1, 0],
            rotation: [Math.PI / 20, 0, 0],

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
            position: [0, 80, -200],
            rotation: [-Math.PI / 60, 0, 0],
        }
    },
    vue4: {
        camera: {
            // position: [200, 300, 500],
            position: [100, 100, 350],


            rotation: [-Math.PI / 100, Math.PI / 4, 0],
        }
    },
	vue5: {
		camera: {
			// position: [200, 300, 500],
			position: [450, 510, 510],
			rotation: [0, 0, 0],
		}
	},
};

export function changeView(viewName) {
    const view = views[viewName];
    if (view) {
        smoothTransition(view.camera.position, view.camera.rotation, 1.5); // Transition de 1,5 seconde
    }
}


export function smoothTransition(targetPosition, targetRotation, duration = 1) {
    let currentTransition = null;

    if (currentTransition) cancelAnimationFrame(currentTransition);

    const startPosition = camera.position.clone();
    const startRotation = new THREE.Euler().copy(camera.rotation);

    const startTime = performance.now();
    const endTime = startTime + duration * 1000;

    function animate() {
        const now = performance.now();
        const t = Math.min((now - startTime) / (endTime - startTime), 1);

        // Interpolation de la position
        camera.position.lerpVectors(
            startPosition,
            new THREE.Vector3(targetPosition[0], targetPosition[1], targetPosition[2]),
            t
        );

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