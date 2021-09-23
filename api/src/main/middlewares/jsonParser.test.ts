import supertest from 'supertest';
import init from '../config/app';

describe('JSON Parser middleware', () => {
	test('Should parse body as JSON', async () => {
		const app = await init();
		app.get('/test_json_parser', (req, res) => {
			res.send(req.body);
		});

		await supertest(app)
			.get('/test_json_parser')
			.send({ name: 'Yuri' })
			.expect({ name: 'Yuri' });
	});
});
