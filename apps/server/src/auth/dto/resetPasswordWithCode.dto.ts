import { PickType } from '@nestjs/mapped-types';
import { UserDto } from './createUser.dto';
import { IsStrongPassword } from '../password.validator';
import { IsEmail, IsString } from 'class-validator';

export class ResetPasswordWithCodeDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;
  @IsString()
  verificationCode: string;
  @IsStrongPassword()
  newPassword: string;
}
