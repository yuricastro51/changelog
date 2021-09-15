import env from '../../utils/helpers/env';
import { getConnectionManager, Connection } from 'typeorm';

export async function getMyConnection(): Promise<Connection> {
	const connectionManager = getConnectionManager();

	if (connectionManager.has('changelog')) {
		return connectionManager.get('changelog');
	}

	const connection = connectionManager.create({
		type: 'mysql',
		host: env.DB_HOST,
		port: 3306,
		username: env.DB_USER,
		password: env.DB_PASS,
		database: env.DB_NAME,
		entities: ['src/domain/entities/**/*.ts'],
		synchronize: true,
		name: 'changelog',
	});

	await connection.connect();

	return connection;
}
