import supertest from 'supertest';
import app from '../config/app';

describe('CORS middleware', () => {
	test('Should enable CORS', async () => {
		app.get('/test_cors', (req, res) => {
			res.send('');
		});

		const res = await supertest(app).get('/test_cors');
		expect(res.headers['access-control-allow-origin']).toBe('*');
		expect(res.headers['access-control-allow-method']).toBe('*');
		expect(res.headers['access-control-allow-headers']).toBe('*');
	});
});
