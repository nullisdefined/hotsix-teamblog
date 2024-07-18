import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  photoId: number;

  @Column()
  fileName: string;

  @Column()
  articleId: number;

  @ManyToOne(() => Article, (article) => article.photos)
  @JoinColumn({ name: 'articleId' })
  article: Article;
}
