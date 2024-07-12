import { Controller, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDto } from './dto/comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { OwnerGuard } from './guards/owner.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  createComment(@Param('id') id: string, @Body() commentDto: CommentDto, @Req() req) {
    return this.commentsService.create(+id, commentDto, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  updateComment(@Param('id') id: string, @Body() commentDto: CommentDto) {
    return this.commentsService.update(+id, commentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  deleteComment(@Param('id') id: string) {
    return this.commentsService.delete(+id);
  }
}
