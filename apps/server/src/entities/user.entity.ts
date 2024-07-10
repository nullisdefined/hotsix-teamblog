import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  BaseEntity,
} from 'typeorm';
import { Article } from './article.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 15, nullable: false, unique: true })
  nickname: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  profileImage: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gitUrl: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  introduce: string;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}
