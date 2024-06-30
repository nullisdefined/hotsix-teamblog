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
    // 로그인여부 확인 + jwt토큰 확인 + userId 확인
    const token = await req.cookies['access_token'];
    const { id } = await this.jwtService.verifyAsync(token, {
      secret: 'Secret',
    });

    // DB에 좋아요 존재 여부 확인
    const typedLike = this.likeRepository.create({ userId: id, articleId: articleId }); // where userId= id and articleId = articleId
    const isLike = await this.likeRepository.findOne({ where: typedLike });
    if (isLike) {
      return {
        message: '좋아요 추가 중복',
      };
    }

    // DB에 insert
    await this.likeRepository.save(typedLike);

    return {
      message: '좋아요 추가 완료',
    };
  }

  async delete(articleId: number, req: any) {
    // 로그인여부 확인 + jwt토큰 확인 + userId 확인
    const token = await req.cookies['access_token'];
    const { id } = await this.jwtService.verifyAsync(token, {
      secret: 'Secret',
    });

    // DB에 좋아요 존재 여부 확인
    const typedLike = this.likeRepository.create({ userId: id, articleId: articleId });
    const isLike = await this.likeRepository.findOne({ where: typedLike });
    if (!isLike) {
      return {
        message: '삭제할 좋아요가 없음',
      };
    }

    // DB에 delete
    await this.likeRepository.delete(typedLike);

    return {
      message: '좋아요 삭제 완료',
    };
  }
}
