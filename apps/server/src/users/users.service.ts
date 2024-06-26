import { HttpException, Injectable, Res, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { JoinDto } from './dto/join.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ResetDto } from './dto/reset.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(private readonly jwtService: JwtService) {}

  @InjectRepository(User) private usersRepository: Repository<User>;

  async join(joinDto: JoinDto): Promise<User> {
    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(joinDto.password, saltRounds);
      const newUser = this.usersRepository.create({ ...joinDto, password: hashedPassword });
      return await this.usersRepository.save(newUser);
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async getAccessToken(payload: { id: number; email: string; }) {
    return await this.jwtService.signAsync(payload);
  }

  async login(loginDto: LoginDto, @Res() res: Response) {
    // 사용자 확인
    const user = await this.usersRepository.findOne({ where: { email: loginDto.email } });
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('잘못된 비밀번호입니다.');
    }

    // JWT 발급
    const payload = { id: user.userId, email: user.email };
    const accessToken = await this.getAccessToken(payload);

    // return { accessToken, message: '로그인 성공' };

    // 쿠키 설정
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1day
    });

    return res.send({ message: '로그인 성공' });
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

      const user = await this.usersRepository.findOne({ where: { email } });

      user.password = password;

      await this.usersRepository.save(user);
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
}
