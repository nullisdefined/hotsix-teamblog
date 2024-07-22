import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/entities/like.entity';

@Injectable()
export class LikesService {
  constructor() {}

  @InjectRepository(Like) private likeRepository: Repository<Like>;

  async add(articleId: number, userId: number): Promise<void> {
    const typedLike: Like = this.likeRepository.create({ userId, articleId });
    const isLike: Like = await this.likeRepository.findOne({ where: typedLike });
    if (isLike) {
      throw new ConflictException('좋아요 추가 중복');
    }
    await this.likeRepository.save(typedLike);
  }

  async delete(articleId: number, userId: number): Promise<void> {
    const typedLike: Like = this.likeRepository.create({ userId, articleId });
    const isLike: Like = await this.likeRepository.findOne({ where: typedLike });
    if (!isLike) {
      throw new NotFoundException('삭제할 좋아요가 없음');
    }
    await this.likeRepository.delete(typedLike);
  }
  async getLikesCount(options: FindManyOptions<Like>): Promise<number> {
    return await this.likeRepository.count(options);
  }
  async checkIfUserLiked(userId: number, articleId: number): Promise<boolean> {
    const isLike: Like = await this.likeRepository.findOne({ where: { userId, articleId } });
    if (!isLike) {
      return false;
    }
    return true;
  }
}
