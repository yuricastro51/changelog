import { getConnectionManager, Connection } from 'typeorm';

export async function getMyConnection(): Promise<Connection> {
	const connectionManager = getConnectionManager();

	if (connectionManager.has('changelog')) {
		return connectionManager.get('changelog');
	}

	const connection = connectionManager.create({
		type: 'mysql',
		host: process.env.DB_HOST,
		port: 3306,
		username: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
		entities: ['./src/entity/*.ts'],
		synchronize: true,
		name: 'changelog',
	});

	await connection.connect();

	return connection;
}
