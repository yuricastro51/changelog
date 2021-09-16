import supertest from 'supertest';
import app from '../config/app';

describe('Content-type middleware', () => {
	test('Should return JSON content-type as default', async () => {
		app.get('/test_content_type', (req, res) => {
			res.send('');
		});

		await supertest(app).get('/test_content_type').expect('content-type', /json/);
	});
});
