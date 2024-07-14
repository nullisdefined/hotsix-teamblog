import { IsString, IsOptional, MaxLength } from 'class-validator';

export class ArticleDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  thumb?: string;

  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  description?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  status?: string;
}
