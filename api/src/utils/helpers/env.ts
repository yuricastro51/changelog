import * as dotenv from 'dotenv';

dotenv.config();

export default {
	DB_HOST: process.env.DB_HOST,
	DB_USER: process.env.DB_USER,
	DB_PASS: process.env.DB_PASS,
	DB_NAME: process.env.DB_NAME,
	DB_PORT: process.env.DB_PORT || '3306',
	PORT: process.env.PORT || 8080,
	TOKEN_SECRET: process.env.TOKEN_SECRET || 'secret',
};
