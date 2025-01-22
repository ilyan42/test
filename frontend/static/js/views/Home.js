import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Home");
		// this.loadCss("/css/home.css");
	}

	async getHtml() {
		return `
			<style>
				.container {
					position: absolute;
					top: 20%;
					left: 0;
					/* width et height définissent les dimensions */
					width: 35%;
					height: 60vh;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					padding-left: 15%;
					z-index: 1;
					pointer-events: auto;
					// background-image: url('/image/home.svg');
					
					background-size: cover; /* Adapte l'image au container */
					background-repeat: no-repeat; /* Empêche la répétition */
					background-position: center; /* Centre l'image */
				}

				

				#login-form {
					background-image: url('/image/homeV2.svg');
					padding: 2rem;
					border-radius: 8px;
					// border: 1px solid #ddd;
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
					width: 33vh;
					height: 28vh;
					background-size: cover; /* Adapte l'image au container */
					background-repeat: no-repeat; /* Empêche la répétition */
					background-position: center; /* Centre l'image */
				}
	
				h1 {
					margin-bottom: 1.5rem;
					color: rgba(255, 255, 255, 100);
				}
	
				.form-group {
					margin-bottom: 1rem;
				}
	
				label {
					display: block;
					margin-bottom: 0.5rem;
					color: rgba(255, 255, 255, 100);
				}
	
				input {
					width: 100%;
					padding: 0.75rem;
					border: 1px solid #ddd;
					border-radius: 4px;
					box-sizing: border-box;
					background-color: rgba(255, 255, 255, 0.1);
				}
	
				button {
					width: 100%;
					padding: 0.75rem;
					background-color: rgba(255, 255, 255, 0.1);
					color: white;
					border: none;
					border-radius: 4px;
					cursor: pointer;
				}
	
				button:hover {
					background-color: #0056b3;
				}
			</style>
			<div class="container">
				<form id="login-form" method="POST">
					<h1>Login Page</h1>
					<div class="form-group">
						<label for="username">Username:</label>
						<input type="text" id="username" name="username" required>
					</div>
					<div class="form-group">
						<label for="password">Password:</label>
						<input type="password" id="password" name="password" required>
					</div>
					<div class="form-group">
						<button type="submit">Login</button>
					</div>
				</form>
			</div>
		`;
	}


	// loadCss(cssPath) {
	// 	console.log(`Trying to load CSS: ${cssPath}`);
	// 	const existingLink = document.querySelector(`link[href="${cssPath}"]`);
	// 	if (!existingLink) {
	// 		const link = document.createElement("link");
	// 		link.rel = "stylesheet";
	// 		link.type = "text/css";
	// 		link.href = cssPath;
	// 		document.head.appendChild(link);
	// 		console.log(`CSS loaded successfully: ${cssPath}`);
	// 	} else {
	// 		console.log(`CSS already loaded: ${cssPath}`);
	// 	}
	// }
}

