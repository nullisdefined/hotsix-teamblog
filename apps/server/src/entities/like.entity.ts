import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Article } from './article.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  likeId: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'int', nullable: false })
  articleId: number;

  @ManyToOne(() => User, user => user.likes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Article, article => article.likes)
  @JoinColumn({ name: 'articleId' })
  article: Article;
}
