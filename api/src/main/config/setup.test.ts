import supertest from 'supertest';
import init from './app';

describe('App Setup', () => {
	test('Should disable x-powered-by header', async () => {
		const app = await init();
		app.get('/test_powered_by', (req, res) => {
			res.send('');
		});

		const res = await supertest(app).get('/test_powered_by');
		expect(res.headers['x-powered-by']).toBeUndefined();
	});
});
