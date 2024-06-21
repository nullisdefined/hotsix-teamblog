import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  userId: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column()
  createdAt: string;

  @Column()
  profileImage: string;

  @Column()
  gitUrl: string;

  @Column()
  introduce: string;
}
