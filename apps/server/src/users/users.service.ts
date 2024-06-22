import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  @InjectRepository(User) private usersRepository: Repository<User>;

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const email = createUserDto.email;

    const isExistUser = await this.usersRepository.findOne({ where: { email } });

    if (isExistUser) {
      throw new HttpException('이미 존재하는 이메일입니다.', HttpStatus.BAD_REQUEST);
    }

    return await this.usersRepository.save(createUserDto);
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const isExistUser = await this.usersRepository.findOne({ where: { email } });

    if (!isExistUser) {
      throw new HttpException('로그인 실패', HttpStatus.BAD_REQUEST);
    }

    // if (isEx)
  }

  // async findAll() {
  //   return await this.usersRepository.find();
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
