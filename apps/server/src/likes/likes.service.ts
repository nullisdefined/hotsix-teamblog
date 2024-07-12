import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/entities/like.entity';
import { ResponseMessage } from 'src/types/type';

@Injectable()
export class LikesService {
  constructor() {}

  @InjectRepository(Like) private likeRepository: Repository<Like>;

  async add(articleId: number, userId: number): Promise<ResponseMessage> {
    // DB에 좋아요 존재 여부 확인
    const typedLike: Like = this.likeRepository.create({ userId, articleId }); // where userId= id and articleId = articleId
    const isLike: Like = await this.likeRepository.findOne({ where: typedLike });
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

  async delete(articleId: number, userId: number): Promise<ResponseMessage> {
    // DB에 좋아요 존재 여부 확인
    const typedLike: Like = this.likeRepository.create({ userId, articleId });
    const isLike: Like = await this.likeRepository.findOne({ where: typedLike });
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

  async getLikesCount(options: FindManyOptions<Like>): Promise<number> {
    return await this.likeRepository.count(options);
  }
}
