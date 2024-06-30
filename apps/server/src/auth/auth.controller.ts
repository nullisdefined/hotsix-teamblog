import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { Response } from 'express';
import { CredentialDto } from './dto/credential.dto';
import { RequestPasswordResetDto } from './dto/requestPasswordReset.dto';
import { ResetPasswordWithCodeDto } from './dto/resetPasswordWithCode.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/signup')
  async signup(@Req() req, @Body() userDto: UserDto): Promise<any>{
    return await this.authService.signup(userDto);
  }

  @Post('/signin')
  async signin(@Body() credentialDto: CredentialDto, @Res() res: Response): Promise<any> {
    const jwt =  await this.authService.signin(credentialDto);
    res.header('Authorization', 'Bearer '+ jwt.accessToken);
    return res.json(jwt);
  }

  @Post('/password-reset')
  async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto): Promise<void> {
    await this.authService.requestPasswordReset(requestPasswordResetDto);
  }

  @Put('/password-reset')
  async resetPasswordWithCode(@Body() resetPasswordWithCodeDto: ResetPasswordWithCodeDto): Promise<void> {
    await this.authService.resetPasswordWithCode(resetPasswordWithCodeDto);
  }

  @Delete('/delete')
  @UseGuards(AuthGuard())
  async deleteUser(@Req() req): Promise<void> {
    const userId = req.user.userId;
    await this.usersService.deleteUser(userId);
  }
}
