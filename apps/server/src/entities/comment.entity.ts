import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { User } from './user.entity';
import { Article } from './article.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column()
  userId: number;

  @Column()
  articleId: number;

  @Column()
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Article, (article) => article.comments)
  @JoinColumn({ name: 'articleId' })
  article: Article;
}
