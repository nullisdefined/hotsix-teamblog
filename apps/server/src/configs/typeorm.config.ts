import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { Comment } from 'src/entities/comment.entity';
import { Like } from 'src/entities/like.entity';
import { Photo } from 'src/entities/photo.entity';
import { User } from 'src/entities/user.entity';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'mysql',
  database: 'hotsix-blog',
  // __dirname + '/../**/*.entity.{js,ts}'
  entities: [User, Article, Comment, Photo, Like],
  synchronize: false,
};
