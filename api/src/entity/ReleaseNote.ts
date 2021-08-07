import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'release_note' })
export class ReleaseNote {
	@PrimaryGeneratedColumn('uuid')
	uuid!: string;
	@Column()
	version!: string;
	@Column({ name: 'release_date' })
	releaseDate!: Date;
	@Column()
	description!: string;
}
