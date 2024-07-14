import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/auth/dto/createUser.dto';
import { CheckEmailDto } from './dto/checkEmail.dto';
import { CheckNicknameDto } from './dto/checkNickname.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  @InjectRepository(User) private usersRepository: Repository<User>;

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

  async isEmailDuplicate(checkEmailDto: CheckEmailDto): Promise<boolean> {
    const user = await this.findByFields({
      where: { email: checkEmailDto.email },
    });
    return !!user;
  }

  async isNicknameDuplicate(nickname: string): Promise<boolean> {
    const user = await this.findByFields({
      where: { nickname },
    });
    return !!user;
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.findByFields({
      where: { userId },
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    if (updateUserDto.nickname && updateUserDto.nickname !== user.nickname) {
      const isNicknameDuplicate = await this.isNicknameDuplicate(updateUserDto.nickname);
      if (isNicknameDuplicate) {
        throw new BadRequestException('이미 사용 중인 닉네임입니다.');
      }
    }

    try {
      await this.usersRepository.update(userId, updateUserDto);
    } catch (error) {
      throw new InternalServerErrorException('사용자 정보 업데이트 중 오류가 발생했습니다.');
    }
  }

  async getUserInfo(userId: number): Promise<User> {
    const user = await this.findByFields({
      where: { userId },
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    return user;
  }
}
