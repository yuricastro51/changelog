import { IUser } from 'src/utils/types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User implements IUser {
	@PrimaryGeneratedColumn('increment')
	id!: string;
	@Column()
	email!: string;
	@Column()
	password!: string;
}
