import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  photoId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  fileName: string;

  @Column({ type: 'int', nullable: false })
  articleId: number;

  @ManyToOne(() => Article, article => article.photos)
  article: Article;
}
