import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Jouer");
	}

	
	async getHtml() {
		return `
			<h1>page pour jouer </h1>
		`;
	}
}

