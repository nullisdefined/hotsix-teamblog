import { PickType } from '@nestjs/mapped-types';
import { CredentialDto } from './credential.dto';
import { IsEmail, IsOptional } from 'class-validator';
import { UserDto } from './createUser.dto';

export class RequestPasswordResetDto extends PickType(UserDto, ['email']) {
  email: string;
}
