import {
  HttpException,
  Injectable,
  Res,
  UnauthorizedException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CredentialDto } from 'src/auth/dto/credential.dto';
import { UserDto } from 'src/auth/dto/createUser.dto';

@Injectable()
export class UsersService {
  @InjectRepository(User) private usersRepository: Repository<User>;

  async findByFields(options: FindOneOptions<User>): Promise<User | undefined> {
    const user = await this.usersRepository.findOne(options);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  async save(credentialDto: CredentialDto): Promise<UserDto | undefined> {
    await this.transformPassword(credentialDto);
    return await this.usersRepository.save(credentialDto);
  }

  async transformPassword(user: CredentialDto): Promise<void> {
    const saltRounds = 12;
    user.password = await bcrypt.hash(user.password, saltRounds);
    return Promise.resolve();
  }

  async deleteUser(userId: number): Promise<void> {
    let user = await this.findByFields({
      where: { userId },
    });
    if (!user) {
      throw new BadRequestException('존재하지 않는 사용자입니다.');
    }
    await this.usersRepository.delete(userId);
  }
}
