import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const email = createUserDto.email;

    const isExistUser = await this.usersRepository.findOne({ where: { email } });

    if (isExistUser) {
      throw new HttpException('이미 존재하는 이메일', HttpStatus.BAD_REQUEST);
    }

    return await this.usersRepository.save(createUserDto);
  }

  async loginUser(loginUserDto: LoginUserDto, res: any) {
    const { email, password } = loginUserDto;

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || user.password !== password) {
      throw new HttpException('로그인 실패', HttpStatus.UNAUTHORIZED);
    }

    // jwt 발급
    const payload = { email: user.email, userName: user.userName };

    const token = await this.jwtService.signAsync(payload);

    res.cookie('jwt', token, {
      httpOnly: true,
    });

    return {
      access_token: token,
    };
  }

  async requestReset(req: any) {
    const token = await req.cookies['jwt'];

    if (!token) {
      throw new HttpException('토큰 없음', HttpStatus.UNAUTHORIZED);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'Secret',
      });

      console.log(payload);

      return {
        message: '비밀번호 초기화 요청 수락',
      };
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return new HttpException('로그인 세션 만료', HttpStatus.UNAUTHORIZED);
      }
      if (error instanceof TokenExpiredError) {
        return new HttpException('잘못된 토큰', HttpStatus.BAD_REQUEST);
      }

      return error;
    }
  }

  async reset(password: string, req: any) {
    const token = await req.cookies['jwt'];

    if (!token) {
      throw new HttpException('토큰 없음', HttpStatus.UNAUTHORIZED);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'Secret',
      });

      console.log(payload);

      const { email } = payload;

      const user = await this.usersRepository.findOne({ where: { email }})
      user.password = password;
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return new HttpException('로그인 세션 만료', HttpStatus.UNAUTHORIZED);
      }
      if (error instanceof TokenExpiredError) {
        return new HttpException('잘못된 토큰', HttpStatus.BAD_REQUEST);
      }

      return error;
    }
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
