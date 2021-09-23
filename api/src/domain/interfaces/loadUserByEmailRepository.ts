import { IUser } from 'src/utils/types';
import { Repository } from 'typeorm';

export interface ILoadUserByEmailRepository {
	load(email: string): Promise<IUser | null>;
}
