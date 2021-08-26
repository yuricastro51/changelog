import { User } from 'src/utils/types';

export interface ILoadUserByEmailRepository {
	load(email: string): Promise<User | null>;
}
