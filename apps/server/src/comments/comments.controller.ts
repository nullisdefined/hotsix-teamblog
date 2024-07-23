import { Controller, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDto } from './dto/comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { ModifyGuard } from './guards/modify.guard';
import { ResponseMessage } from 'src/types/type';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  async createComment(@Param('id') id: string, @Body() commentDto: CommentDto, @Req() req): Promise<ResponseMessage> {
    return await this.commentsService.create(+id, commentDto, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), ModifyGuard)
  async updateComment(@Param('id') id: string, @Body() commentDto: CommentDto): Promise<ResponseMessage> {
    return await this.commentsService.update(+id, commentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), ModifyGuard)
  async deleteComment(@Param('id') id: string): Promise<ResponseMessage> {
    return await this.commentsService.delete(+id);
  }
}
