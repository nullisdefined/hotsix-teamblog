import { Controller, Param, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from '@nestjs/passport';
import { ResponseMessage } from 'src/types/type';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  async addLike(@Param('id') id: string, @Req() req): Promise<ResponseMessage> {
    return await this.likesService.add(+id, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteLike(@Param('id') id: string, @Req() req): Promise<ResponseMessage> {
    return await this.likesService.delete(+id, req.user.userId);
  }
}
