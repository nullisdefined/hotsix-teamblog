import { PickType } from '@nestjs/mapped-types';
import { UserDto } from './createUser.dto';
import { IsEmail, IsString } from 'class-validator';
import { IsStrongPassword } from 'src/validators/password.validator';

export class ResetPasswordWithCodeDto extends PickType(UserDto, ['email']) {
  email: string;
  @IsString()
  verificationCode: string;
  @IsStrongPassword()
  newPassword: string;
}
