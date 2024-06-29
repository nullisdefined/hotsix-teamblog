import { Controller, Post, Body, Patch, Param, Delete, Req, HttpException, HttpStatus } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDto } from './dto/comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':id')
  createComment(@Param('id') id: string, @Body() commentDto: CommentDto, @Req() req: Request) {
    try {
      return this.commentsService.create(+id, commentDto, req);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  updateComment(@Param('id') id: string, @Body() commentDto: CommentDto, @Req() req: Request) {
    try {
      return this.commentsService.update(+id, commentDto, req);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  deleteComment(@Param('id') id: string, @Req() req: Request) {
    try {
      return this.commentsService.delete(+id, req);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
