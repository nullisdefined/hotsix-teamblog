import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, HttpException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let mailerService: MailerService;

  const mockUsersService = {
    findByFields: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailerService, useValue: mockMailerService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    mailerService = module.get<MailerService>(MailerService);

    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 합니다', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('새로운 사용자를 성공적으로 생성해야 합니다', async () => {
      const newUser = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
        nickname: 'tester',
        profileImage: '',
        gitUrl: 'https://github.com/tester',
        introduce: 'Hello, I am a tester',
      };

      mockUsersService.findByFields.mockResolvedValue(null);
      mockUsersService.save.mockResolvedValue(newUser);

      const result = await authService.signup(newUser);

      expect(result).toEqual(newUser);
      expect(mockUsersService.findByFields).toHaveBeenCalledTimes(2);
      expect(mockUsersService.save).toHaveBeenCalledWith(newUser);
    });

    it('이미 존재하는 이메일로 가입 시 예외를 발생시켜야 합니다', async () => {
      const existingUser = {
        email: 'existing@example.com',
        password: 'Password123!',
        name: 'Existing User',
        nickname: 'existinguser',
        profileImage: '',
        gitUrl: 'https://github.com/existinguser',
        introduce: 'I am an existing user',
      };

      mockUsersService.findByFields.mockResolvedValue(existingUser);

      await expect(authService.signup(existingUser)).rejects.toThrow(HttpException);
    });
  });

  describe('signin', () => {
    it('유효한 자격 증명으로 로그인 시 JWT 토큰을 반환해야 합니다', async () => {
      const credentialDto = { email: 'test@example.com', password: 'password123' };
      const user = { userId: 1, email: 'test@example.com', password: 'hashedPassword' };
      const token = 'jwt-token';

      mockUsersService.findByFields.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(token);

      const result = await authService.signin(credentialDto);

      expect(result).toEqual({ accessToken: token });
      expect(bcrypt.compare).toHaveBeenCalledWith(credentialDto.password, user.password);
    });

    it('잘못된 자격 증명으로 로그인 시 예외를 발생시켜야 합니다', async () => {
      const credentialDto = { email: 'test@example.com', password: 'wrongpassword' };
      const user = { userId: 1, email: 'test@example.com', password: 'hashedPassword' };

      mockUsersService.findByFields.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.signin(credentialDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('requestPasswordReset', () => {
    it('유효한 이메일로 비밀번호 재설정을 요청해야 합니다', async () => {
      const requestPasswordResetDto = { email: 'test@example.com' };
      const user = { email: 'test@example.com' };

      mockUsersService.findByFields.mockResolvedValue(user);
      mockMailerService.sendMail.mockResolvedValue(true);

      await authService.requestPasswordReset(requestPasswordResetDto);

      expect(mockMailerService.sendMail).toHaveBeenCalled();
    });

    it('존재하지 않는 이메일로 요청 시 예외를 발생시켜야 합니다', async () => {
      const requestPasswordResetDto = { email: 'nonexistent@example.com' };

      mockUsersService.findByFields.mockResolvedValue(null);

      await expect(authService.requestPasswordReset(requestPasswordResetDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('resetPasswordWithCode', () => {
    it('유효한 코드로 비밀번호를 재설정해야 합니다', async () => {
      const resetPasswordWithCodeDto = {
        email: 'test@example.com',
        verificationCode: '123456',
        newPassword: 'newpassword123',
      };
      const user = { email: 'test@example.com', password: 'oldpassword' };
      const hashedPassword = 'newhashedpassword';

      mockUsersService.findByFields.mockResolvedValue(user);
      (authService as any).verificationCodes.set('test@example.com', {
        code: '123456',
        expiry: new Date(Date.now() + 1000000),
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      await authService.resetPasswordWithCode(resetPasswordWithCodeDto);

      expect(mockUsersService.save).toHaveBeenCalledWith({
        ...user,
        password: hashedPassword,
      });
    });

    it('잘못된 코드로 재설정 시 예외를 발생시켜야 합니다', async () => {
      const resetPasswordWithCodeDto = {
        email: 'test@example.com',
        verificationCode: 'wrongcode',
        newPassword: 'newpassword123',
      };
      const user = { email: 'test@example.com', password: 'oldpassword' };

      mockUsersService.findByFields.mockResolvedValue(user);
      (authService as any).verificationCodes.set('test@example.com', {
        code: '123456',
        expiry: new Date(Date.now() + 1000000),
      });

      await expect(authService.resetPasswordWithCode(resetPasswordWithCodeDto)).rejects.toThrow(UnauthorizedException);
    });

    it('만료된 코드로 재설정 시 예외를 발생시켜야 합니다', async () => {
      const resetPasswordWithCodeDto = {
        email: 'test@example.com',
        verificationCode: '123456',
        newPassword: 'newpassword123',
      };
      const user = { email: 'test@example.com', password: 'oldpassword' };

      mockUsersService.findByFields.mockResolvedValue(user);
      (authService as any).verificationCodes.set('test@example.com', {
        code: '123456',
        expiry: new Date(Date.now() - 1000000),
      });

      await expect(authService.resetPasswordWithCode(resetPasswordWithCodeDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
