import { Controller, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDto } from './dto/comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { OwnerGuard } from './guards/owner.guard';
import { ResponseMessage } from 'src/types/type';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  async createComment(@Param('id') id: number, @Body() commentDto: CommentDto, @Req() req): Promise<boolean> {
    await this.commentsService.create(id, commentDto, req.user.userId);
    return true;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  async updateComment(@Param('id') id: number, @Body() commentDto: CommentDto): Promise<boolean> {
    await this.commentsService.update(id, commentDto);
    return true;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  async deleteComment(@Param('id') id: number): Promise<boolean> {
    await this.commentsService.delete(id);
    return true;
  }
}
