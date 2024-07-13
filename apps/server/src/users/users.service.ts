import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/auth/dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async findByFields(options: FindOneOptions<User>): Promise<User | undefined> {
    return await this.usersRepository.findOne(options);
  }

  async save(userDto: UserDto): Promise<UserDto> {
    const hashedPassword = await this.hashPassword(userDto.password);
    const user = this.usersRepository.create({
      ...userDto,
      password: hashedPassword,
    });
    return await this.usersRepository.save(user);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.findByFields({
      where: { userId },
    });
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
    await this.usersRepository.remove(user);
  }
}
