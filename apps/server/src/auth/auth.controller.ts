import {
  Controller,
  Post,
  Body,
  Patch,
  Res,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/createUser.dto';
import { Response } from 'express';
import { CredentialDto } from './dto/credential.dto';
import { RequestPasswordResetDto } from './dto/requestPasswordReset.dto';
import { ResetPasswordWithCodeDto } from './dto/resetPasswordWithCode.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() userDto: UserDto): Promise<UserDto> {
    return await this.authService.signup(userDto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() credentialDto: CredentialDto, @Res() res: Response): Promise<boolean> {
    const jwt = await this.authService.signin(credentialDto);
    res.setHeader('Authorization', 'Bearer ' + jwt.accessToken);
    res.json(jwt);
    return true;
  }

  @Post('/password-reset')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto): Promise<boolean> {
    await this.authService.requestPasswordReset(requestPasswordResetDto);
    return true;
  }

  @Patch('/password-reset')
  @HttpCode(HttpStatus.OK)
  async resetPasswordWithCode(@Body() resetPasswordWithCodeDto: ResetPasswordWithCodeDto): Promise<void> {
    await this.authService.resetPasswordWithCode(resetPasswordWithCodeDto);
  }
}
