import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CredentialDto } from './dto/credential.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Payload } from './dto/payload.dto';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { ResetPasswordWithCodeDto } from './dto/resetPasswordWithCode.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { RequestPasswordResetDto } from './dto/requestPasswordReset.dto';

@Injectable()
export class AuthService {
  private verificationCodes = new Map<string, string>();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signup(newUser: UserDto): Promise<UserDto> {
    let user: UserDto = await this.usersService.findByFields({
      where: { email: newUser.email },
    });
    if (user) {
      throw new HttpException('이메일 또는 닉네임이 중복되었습니다.', HttpStatus.BAD_REQUEST);
    }
    return await this.usersService.save(newUser);
  }

  async signin(credentialDto: CredentialDto): Promise<{ accessToken: string } | undefined> {
    let user: User = await this.usersService.findByFields({
      where: { email: credentialDto.email },
    });
    const isValidatePassword = await bcrypt.compare(credentialDto.password, user.password);
    if (!user || !isValidatePassword) {
      throw new UnauthorizedException();
    }
    const payload: Payload = { id: user.userId, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async requestPasswordReset(requestPasswordResetDto: RequestPasswordResetDto): Promise<void> {
    const { email } = requestPasswordResetDto;
    let user: User = await this.usersService.findByFields({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('등록되지 않은 이메일입니다.');
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 코드 생성
    this.verificationCodes.set(email, verificationCode);

    await this.mailerService.sendMail({
      to: email,
      subject: '비밀번호 재설정 인증 코드',
      text: `인증 코드는 ${verificationCode} 입니다.`,
    });
  }

  async resetPasswordWithCode(resetPasswordWithCodeDto: ResetPasswordWithCodeDto): Promise<void> {
    const { email, verificationCode, newPassword } = resetPasswordWithCodeDto;

    const user = await this.usersService.findByFields({ where: { email } });
    if (!user) {
      throw new BadRequestException('등록되지 않은 이메일입니다.');
    }

    const storedCode = this.verificationCodes.get(email);
    if (!storedCode || storedCode !== verificationCode) {
      throw new UnauthorizedException('유효하지 않은 인증 코드입니다.');
    }

    user.password = newPassword;
    await this.usersService.save(user);

    this.verificationCodes.delete(email);
  }
}
