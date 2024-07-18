import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ArticlesService } from '../articles.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private articlesService: ArticlesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const articleId = request.params.id;

    const article = await this.articlesService.findOne(+articleId);

    if (!(article.userId === user.userId || user.role === 'admin')) {
      throw new ForbiddenException('You do not have permission to modify this article');
    }

    return true;
  }
}
