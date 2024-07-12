import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, OneToMany } from 'typeorm';
import { Article } from './article.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { UserRole } from 'src/types/type';

@Entity()
@Unique(['email', 'nickname'])
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  nickname: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  profileImage: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gitUrl: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
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
