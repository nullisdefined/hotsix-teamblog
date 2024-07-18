import { IsEmail } from 'class-validator';

export class CheckEmailDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;
}
