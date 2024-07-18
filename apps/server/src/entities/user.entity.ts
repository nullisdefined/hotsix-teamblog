import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, OneToMany } from 'typeorm';
import { Article } from './article.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { UserRole } from 'src/types/type';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  profileImage: string;

  @Column()
  gitUrl: string;

  @Column()
  introduce: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}
