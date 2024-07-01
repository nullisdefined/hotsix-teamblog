import { HttpException, Injectable, Res, UnauthorizedException, HttpStatus, BadRequestException } from '@nestjs/common';
import { UserDto } from 'src/auth/dto/user.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CredentialDto } from 'src/auth/dto/credential.dto';

@Injectable()
export class UsersService {
  @InjectRepository(User) private usersRepository: Repository<User>;

  async findByFields(options: FindOneOptions<User>): Promise<User | undefined> {
    return await this.usersRepository.findOne(options);
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
    const user = await this.findByFields({
      where: { userId },
    });
    if (!user) {
      throw new BadRequestException('존재하지 않는 사용자입니다.');
    }
    await this.usersRepository.delete(userId);
  }
}
