import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Like } from 'src/entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    JwtModule.register({
      secret: 'Secret', // 오픈되어선 안되는 정보 -> 따로 빼야됨
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
