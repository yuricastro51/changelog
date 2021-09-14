import { IUser } from 'src/utils/types';
import { Repository } from 'typeorm';

export interface ILoadUserByEmailRepository {
	load(email: string, repository: Repository<IUser>): Promise<IUser | null>;
}
