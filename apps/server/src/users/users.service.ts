import { HttpException, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { JoinDto } from './dto/join.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ResetDto } from './dto/reset.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  @InjectRepository(User) private usersRepository: Repository<User>

  async join(joinDto: JoinDto): Promise<User> {
    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(joinDto.password, saltRounds);
      const newUser = this.usersRepository.create({ ...joinDto, password: hashedPassword });    
      return await this.usersRepository.save(newUser);
    } catch(error) {
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
    const accessToken = this.getAccessToken(payload);

    // return { accessToken, message: '로그인 성공' };

    // 쿠키 설정
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1day
    });

    return res.send({ message: '로그인 성공' });
  }

  async resetPost(resetDto: ResetDto) {
    // 비밀번호 초기화 로직
  }

  async resetPut() {

  }
}
