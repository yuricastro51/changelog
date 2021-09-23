import supertest from 'supertest';
import init from '../config/app';

describe('Content-type middleware', () => {
	test('Should return JSON content-type as default', async () => {
		const app = await init();
		app.get('/test_content_type', (req, res) => {
			res.send('');
		});

		await supertest(app).get('/test_content_type').expect('content-type', /json/);
	});

	test('Should return XML content-type if forced', async () => {
		const app = await init();
		app.get('/test_content_type_xml', (req, res) => {
			res.type('xml');
			res.send('');
		});

		await supertest(app).get('/test_content_type_xml').expect('content-type', /xml/);
	});
});
