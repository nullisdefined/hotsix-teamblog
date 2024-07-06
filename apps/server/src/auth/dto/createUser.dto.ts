import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { IsStrongPassword } from '../password.validator';

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
  // TODO: 이미지 파일 경로 검사
  profileImage: string;
  @IsOptional()
  @IsUrl({}, { message: '올바른 URL 형식이 아닙니다.' })
  @Transform(({ value }) => (value === '' ? null : value))
  gitUrl: string;
  @IsOptional()
  @IsString({ message: '올바른 타입이 아닙니다.' })
  introduce: string;
}
