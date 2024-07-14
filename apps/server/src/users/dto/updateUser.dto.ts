import { PartialType, OmitType } from '@nestjs/mapped-types';
import { UserDto } from 'src/auth/dto/createUser.dto';

export class UpdateUserDto extends PartialType(OmitType(UserDto, ['email', 'password'] as const)) {}
