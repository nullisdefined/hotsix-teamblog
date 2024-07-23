import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { CommentsService } from '../comments.service';

@Injectable()
export class ModifyGuard implements CanActivate {
  constructor(private commentsService: CommentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const commentId = request.params.id;

    const comment = await this.commentsService.findOne(+commentId);

    if (!(comment.userId === user.userId || user.role === 'admin')) {
      throw new ForbiddenException('You do not have permission to modify this comment');
    }

    return true;
  }
}
