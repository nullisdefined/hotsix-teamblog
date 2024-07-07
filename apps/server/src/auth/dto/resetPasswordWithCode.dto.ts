import { PickType } from '@nestjs/mapped-types';
import { UserDto } from './createUser.dto';
import { IsStrongPassword } from '../validators/password.validator';
import { IsEmail, IsString } from 'class-validator';

export class ResetPasswordWithCodeDto extends PickType(UserDto, ['email']) {
  email: string;
  @IsString()
  verificationCode: string;
  @IsStrongPassword()
  newPassword: string;
}
