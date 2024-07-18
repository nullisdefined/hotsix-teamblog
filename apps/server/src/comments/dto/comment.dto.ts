import { IsString, MaxLength } from 'class-validator';

export class CommentDto {
  @IsString()
  @MaxLength(500)
  comment: string;
}
