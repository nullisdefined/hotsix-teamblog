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
<<<<<<< HEAD
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() userDto: UserDto): Promise<UserDto> {
    try {
      return await this.authService.signup(userDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() credentialDto: CredentialDto, @Res() res: Response): Promise<void> {
    try {
      const jwt = await this.authService.signin(credentialDto);
      res.setHeader('Authorization', 'Bearer ' + jwt.accessToken);
      res.json(jwt);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
=======
  async signup(@Req() req, @Body() userDto: UserDto): Promise<any> {
    return await this.authService.signup(userDto);
  }

  @Post('/signin')
  async signin(@Body() credentialDto: CredentialDto, @Res() res: Response): Promise<any> {
    const jwt = await this.authService.signin(credentialDto);
    res.header('Authorization', 'Bearer ' + jwt.accessToken);
    return res.json(jwt);
>>>>>>> K0hun
  }

  @Post('/password-reset')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto): Promise<void> {
    try {
      await this.authService.requestPasswordReset(requestPasswordResetDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('/password-reset')
  @HttpCode(HttpStatus.OK)
  async resetPasswordWithCode(@Body() resetPasswordWithCodeDto: ResetPasswordWithCodeDto): Promise<void> {
    try {
      await this.authService.resetPasswordWithCode(resetPasswordWithCodeDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
