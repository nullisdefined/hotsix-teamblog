import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { IsStrongPassword } from '../../validators/password.validator';
import { IsValidImageUrl } from '../../validators/image.url.validator';

export class UserDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;
  @IsStrongPassword()
  password: string;
  @IsOptional()
  @IsString({ message: '올바른 타입이 아닙니다.' })
  name: string;
  @IsNotEmpty({ message: '닉네임은 비워둘 수 없습니다.' })
  @IsString({ message: '올바른 타입이 아닙니다.' })
  nickname: string;
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsValidImageUrl({ message: '올바른 이미지 URL 형식이 아니거나 허용되지 않은 도메인입니다.' })
  profileImage: string;
  @IsOptional()
  @IsUrl({}, { message: '올바른 URL 형식이 아닙니다.' })
  @Transform(({ value }) => (value === '' ? null : value))
  gitUrl: string;
  @IsOptional()
  @IsString({ message: '올바른 타입이 아닙니다.' })
  introduce: string;
}
