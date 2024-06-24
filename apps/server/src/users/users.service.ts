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

  async createUser(createUserDto: CreateUserDto): Promise<{ message: string } | HttpException> {
    const email = createUserDto.email;

    const isExistUser = await this.findOneByEmail(email);

    if (isExistUser) {
      throw new HttpException('이미 존재하는 이메일', HttpStatus.BAD_REQUEST);
    }

    await this.saveUser(createUserDto);

    return {
      message: '회원가입 성공',
    };
  }

  async loginUser(loginUserDto: LoginUserDto, res: any): Promise<{ access_token: string } | HttpException> {
    const { email, password } = loginUserDto;

    const user = await this.findOneByEmail(email);

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

  async requestReset(req: any): Promise<{ message: string } | HttpException> {
    try {
      const payload = await this.verifyToken(req);

      console.log(payload);

      return {
        message: '비밀번호 초기화 요청 수락',
      };
    } catch (error) {
      return error;
    }
  }

  async reset(password: string, req: any): Promise<{ message: string } | HttpException> {
    try {
      const payload = await this.verifyToken(req);

      console.log(payload);

      const { email } = payload;

      const user = await this.findOneByEmail(email);
      user.password = password;

      await this.saveUser(user);
      return {
        message: '비밀번호 변경 완료',
      };
    } catch (error) {
      return error;
    }
  }

  async verifyToken(req: any): Promise<any> {
    const token = await req.cookies['jwt'];

    if (!token) {
      throw new HttpException('토큰 없음', HttpStatus.UNAUTHORIZED);
    }

    try {
      return await this.jwtService.verifyAsync(token, {
        secret: 'Secret',
      });
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return new HttpException('로그인 세션 만료', HttpStatus.UNAUTHORIZED);
      }
      if (error instanceof TokenExpiredError) {
        return new HttpException('잘못된 토큰', HttpStatus.BAD_REQUEST);
      }

      return new HttpException(error.name, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async saveUser(user: CreateUserDto): Promise<User> {
    return await this.usersRepository.save(user);
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
