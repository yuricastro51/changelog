export default class ServerError extends Error {
	constructor() {
		super('Internal Error');
		this.name = 'ServerError';
	}
}
