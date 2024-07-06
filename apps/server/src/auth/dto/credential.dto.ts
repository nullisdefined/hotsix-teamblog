import { PickType } from '@nestjs/mapped-types';
import { UserDto } from './createUser.dto';

export class CredentialDto extends PickType(UserDto, ['email', 'password']) {
  email: string;
  password: string;
}
