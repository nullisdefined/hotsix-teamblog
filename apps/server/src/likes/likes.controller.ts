import { Controller, Param, Delete, Post, Req, HttpException, HttpStatus } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':id')
  async addLike(@Param('id') id: string, @Req() req: Response) {
    try {
      return await this.likesService.add(+id, req);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteLike(@Param('id') id: string, @Req() req: Response) {
    try {
      return await this.likesService.delete(+id, req);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
