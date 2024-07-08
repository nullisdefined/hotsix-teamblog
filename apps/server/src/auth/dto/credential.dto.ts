import { PickType } from '@nestjs/mapped-types';
import { UserDto } from './createUser.dto';
import { IsString } from 'class-validator';

export class CredentialDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
