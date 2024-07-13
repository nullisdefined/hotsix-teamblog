import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserDto } from './dto/createUser.dto';
import { CredentialDto } from './dto/credential.dto';
import { RequestPasswordResetDto } from './dto/requestPasswordReset.dto';
import { ResetPasswordWithCodeDto } from './dto/resetPasswordWithCode.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;

  const testUser: UserDto = {
    email: 'test@example.com',
    password: 'Password123!',
    name: 'Test User',
    nickname: 'tester',
    profileImage: '',
    gitUrl: 'https://github.com/tester',
    introduce: 'Hello, I am a tester',
  };

  const credentialDto: CredentialDto = {
    email: 'test@example.com',
    password: 'Password123!',
  };

  const requestPasswordResetDto: RequestPasswordResetDto = {
    email: 'test@example.com',
  };

  const resetPasswordWithCodeDto: ResetPasswordWithCodeDto = {
    email: 'test@example.com',
    verificationCode: '123456',
    newPassword: 'NewPassword123!',
  };

  beforeEach(async () => {
    mockAuthService = {
      signup: jest.fn(),
      signin: jest.fn(),
      requestPasswordReset: jest.fn(),
      resetPasswordWithCode: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('컨트롤러가 정의되어 있어야 합니다', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('새로운 사용자를 성공적으로 생성해야 합니다', async () => {
      mockAuthService.signup.mockResolvedValue(testUser);

      const result = await controller.signup(testUser);

      expect(result).toEqual(testUser);
      expect(mockAuthService.signup).toHaveBeenCalledWith(testUser);
    });

    it('회원가입 실패 시 BadRequestException을 발생시켜야 합니다', async () => {
      mockAuthService.signup.mockRejectedValue(new Error('이미 존재하는 이메일입니다'));

      await expect(controller.signup(testUser)).rejects.toThrow(BadRequestException);
      await expect(controller.signup(testUser)).rejects.toThrow('이미 존재하는 이메일입니다');
    });
  });

  describe('signin', () => {
    it('성공적인 로그인 시 JWT 토큰을 반환하고 인증 헤더를 설정해야 합니다', async () => {
      const jwt = { accessToken: 'test-token' };
      mockAuthService.signin.mockResolvedValue(jwt);

      const mockResponse = {
        setHeader: jest.fn(),
        json: jest.fn(),
      };

      await controller.signin(credentialDto, mockResponse as any);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('Authorization', 'Bearer test-token');
      expect(mockResponse.json).toHaveBeenCalledWith(jwt);
    });

    it('로그인 실패 시 UnauthorizedException을 발생시켜야 합니다', async () => {
      mockAuthService.signin.mockRejectedValue(new Error('잘못된 인증 정보입니다'));

      const mockResponse = {
        setHeader: jest.fn(),
        json: jest.fn(),
      };

      await expect(controller.signin(credentialDto, mockResponse as any)).rejects.toThrow(UnauthorizedException);
      await expect(controller.signin(credentialDto, mockResponse as any)).rejects.toThrow('잘못된 인증 정보입니다');
    });
  });

  describe('requestPasswordReset', () => {
    it('유효한 이메일로 비밀번호 재설정을 요청해야 합니다', async () => {
      mockAuthService.requestPasswordReset.mockResolvedValue(undefined);

      await controller.requestPasswordReset(requestPasswordResetDto);

      expect(mockAuthService.requestPasswordReset).toHaveBeenCalledWith(requestPasswordResetDto);
    });

    it('비밀번호 재설정 요청 실패 시 BadRequestException을 발생시켜야 합니다', async () => {
      mockAuthService.requestPasswordReset.mockRejectedValue(new Error('사용자를 찾을 수 없습니다'));

      await expect(controller.requestPasswordReset(requestPasswordResetDto)).rejects.toThrow(BadRequestException);
      await expect(controller.requestPasswordReset(requestPasswordResetDto)).rejects.toThrow(
        '사용자를 찾을 수 없습니다',
      );
    });
  });

  describe('resetPasswordWithCode', () => {
    it('유효한 코드로 비밀번호를 재설정해야 합니다', async () => {
      mockAuthService.resetPasswordWithCode.mockResolvedValue(undefined);

      await controller.resetPasswordWithCode(resetPasswordWithCodeDto);

      expect(mockAuthService.resetPasswordWithCode).toHaveBeenCalledWith(resetPasswordWithCodeDto);
    });

    it('비밀번호 재설정 실패 시 BadRequestException을 발생시켜야 합니다', async () => {
      mockAuthService.resetPasswordWithCode.mockRejectedValue(new Error('유효하지 않은 인증 코드입니다'));

      await expect(controller.resetPasswordWithCode(resetPasswordWithCodeDto)).rejects.toThrow(BadRequestException);
      await expect(controller.resetPasswordWithCode(resetPasswordWithCodeDto)).rejects.toThrow(
        '유효하지 않은 인증 코드입니다',
      );
    });
  });
});
