import { createLoadingOverlay, removeLoadingOverlay } from './loading_screen.js';
import { initializeScene_menu, destroy_scene_menu } from './Init_destroy_homeMenu.js';

const views = {
	vue1: { camera: { position: [0, 20, 45], rotation: [Math.PI / 20, 0, 0] } },
	vue2: { camera: { position: [85, 100, 0], rotation: [-Math.PI / 2, Math.PI / 4, Math.PI / 2] } },
	vue3: { camera: { position: [0, 80, -200], rotation: [-Math.PI / 60, 0, 0] } },
	vue4: { camera: { position: [100, 100, 350], rotation: [-Math.PI / 100, Math.PI / 4, 0] } },
	vue5: { camera: { position: [450, 510, 510], rotation: [0, 0, 0] } },
};

let isLoading = false;
window.currentView = null;

export function smoothTransition(targetPosition, targetRotation, duration = 1.5) {
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

export function changeView(viewName) {
	const view = views[viewName];
	if (!view || window.currentView === viewName)
        return;
	const previousView = window.currentView;
	window.currentView = viewName;
	smoothTransition(view.camera.position, view.camera.rotation, 1.5);
	handleViewTransitions(viewName, previousView);
}

function handleViewTransitions(viewName, previousView)
{
	if (isLoading)
        return;

	if (previousView === 'vue5' && viewName === 'vue1')
    {
		console.log('Chargement de la vue 1...');
		isLoading = true;
		createLoadingOverlay();

		setTimeout(() =>
        {
			changeView('vue3');
            destroy_scene_menu();
		}, 1500);

		setTimeout(() =>
        {
			removeLoadingOverlay();
			changeView('vue1');
			isLoading = false;
		}, 3500);
	}
    else
    {
		switch (viewName)
        {
			case 'vue2':
				setTimeout(() => changeView('vue2'), 1500);
				break;

			case 'vue3':
				if (!isLoading)
                {
					console.log(viewName);
					isLoading = true;
                    changeView('vue3'); // Changer de vue vers vue3
					setTimeout(() =>
                    {
						window.currentView = 'vue3'; // Mettre à jour window.currentView   
						createLoadingOverlay(); // Afficher l'écran de chargement pour vue3
					}, 1500);


					setTimeout(() =>
                    {
						// Attendre que vue3 soit complètement chargée avant de passer à vue5
						console.log('Transition vers vue5');
						isLoading = false;
						changeView('vue5'); // Effectuer la transition vers vue5
                        initializeScene_menu();
					}, 3500); // Délai pour que la transition de vue3 se termine
					
					setTimeout(() => removeLoadingOverlay(), 5000); // Retirer l'écran de chargement après un délai
				}
				break;

			case 'vue4':
				setTimeout(() => changeView('vue1'), 500);
				break;

			case 'vue5':
				// Ce bloc est maintenant correctement exécuté après la transition vers vue5.
				console.log('Arrivé dans vue5');
				break; // Pas de changement pour vue5, on ne fait rien ici
		}
	}
}