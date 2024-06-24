import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { JoinDto } from './dto/join.dto';
import { LoginDto } from './dto/login.dto';
import { ResetDto } from './dto/reset.dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  join(@Body() joinDto: JoinDto) {
    return this.usersService.join(joinDto);
  }

  @Delete()
  delete() {

  }
  @Post('/login')
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    return await this.usersService.login(loginDto, res);
  }

  @Post('/reset')
  resetPost(@Body() resetDto: ResetDto) {
    this.usersService.resetPost(resetDto);
  }

  @Put('/reset')
  resetPut() {
    this.usersService.resetPut();
  }
}
