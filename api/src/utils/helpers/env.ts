import * as dotenv from 'dotenv';

dotenv.config();

export default {
	DB_HOST: process.env.DB_HOST,
	DB_USER: process.env.DB_USER,
	DB_PASS: process.env.DB_PASS,
	DB_NAME: process.env.DB_NAME,
	PORT: 8080,
};