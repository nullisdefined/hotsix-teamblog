import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CredentialDto } from './dto/credential.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Payload } from './dto/payload.dto';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/createUser.dto';
import { ResetPasswordWithCodeDto } from './dto/resetPasswordWithCode.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { RequestPasswordResetDto } from './dto/requestPasswordReset.dto';

@Injectable()
export class AuthService {
  private verificationCodes = new Map<string, { code: string; expiry: Date }>();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signup(newUser: UserDto): Promise<UserDto> {
    await this.checkDuplicateEmailAndNickname(newUser.email, newUser.nickname);
    return await this.usersService.save(newUser);
  }

  async signin(credentialDto: CredentialDto): Promise<{ accessToken: string } | undefined> {
    const user: User = await this.usersService.findByFields({
      where: { email: credentialDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const isValidPassword = await this.validatePassword(credentialDto.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const payload: Payload = { id: user.userId, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async requestPasswordReset(requestPasswordResetDto: RequestPasswordResetDto): Promise<void> {
    const { email } = requestPasswordResetDto;
    const user: User = await this.usersService.findByFields({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('등록되지 않은 이메일입니다.');
    }

    const verificationCode = this.generateVerificationCode();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);
    this.verificationCodes.set(email, { code: verificationCode, expiry });

    await this.mailerService.sendMail({
      to: email,
      subject: '비밀번호 재설정 인증 코드',
      text: `인증 코드는 ${verificationCode} 입니다. 이 코드는 15분 동안 유효합니다.`,
    });
  }

  async resetPasswordWithCode(resetPasswordWithCodeDto: ResetPasswordWithCodeDto): Promise<void> {
    const { email, verificationCode, newPassword } = resetPasswordWithCodeDto;

    const user = await this.usersService.findByFields({ where: { email } });
    if (!user) {
      throw new BadRequestException('등록되지 않은 이메일입니다.');
    }

    this.validateVerificationCode(email, verificationCode);

    const hashedPassword = await this.hashPassword(newPassword);
    user.password = hashedPassword;
    await this.usersService.save(user);
    this.verificationCodes.delete(email);
  }

  private async checkDuplicateEmailAndNickname(email: string, nickname: string): Promise<void> {
    const userByEmail = await this.usersService.findByFields({ where: { email } });
    if (userByEmail) {
      throw new HttpException('이미 사용 중인 이메일입니다.', HttpStatus.BAD_REQUEST);
    }

    const userByNickname = await this.usersService.findByFields({ where: { nickname } });
    if (userByNickname) {
      throw new HttpException('이미 사용 중인 닉네임입니다.', HttpStatus.BAD_REQUEST);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private validateVerificationCode(email: string, code: string): void {
    const storedData = this.verificationCodes.get(email);
    if (!storedData || storedData.code !== code || storedData.expiry < new Date()) {
      throw new UnauthorizedException('유효하지 않거나 만료된 인증 코드입니다.');
    }
  }
}
