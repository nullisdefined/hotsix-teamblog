import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/entities/like.entity';

@Injectable()
export class LikesService {
  constructor(private readonly jwtService: JwtService) {}

  @InjectRepository(Like) private likeRepository: Repository<Like>;

  async add(articleId: number, req: any) {
    const token = await req.cookies['access_token'];

    const { id } = await this.jwtService.verifyAsync(token, {
      secret: 'Secret',
    });

    const newLike = this.likeRepository.create({ userId: id, articleId: articleId });
    const isLike = await this.likeRepository.findOne({ where: newLike });

    if (isLike) {
      return {
        message: '추가할 좋아요 없음',
      };
    }

    await this.likeRepository.save(newLike);
    return {
      message: '이미 좋아요 존재',
    };
  }

  async delete(articleId: number, req: any) {
    const token = await req.cookies['access_token'];

    const { id } = await this.jwtService.verifyAsync(token, {
      secret: 'Secret',
    });

    const newLike = this.likeRepository.create({ userId: id, articleId: articleId });
    const isLike = await this.likeRepository.findOne({ where: newLike });

    if (!isLike) {
      return {
        message: '삭제할 좋아요가 없음',
      };
    }

    await this.likeRepository.delete(newLike);
    return {
      message: '좋아요 삭제 완료',
    };
  }
}
