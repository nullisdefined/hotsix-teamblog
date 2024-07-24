import {
  Body,
  Controller,
  Delete,
  Get,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Post,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { CheckEmailDto } from './dto/checkEmail.dto';
import { CheckNicknameDto } from './dto/checkNickname.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async getUserId(@Req() req): Promise<any> {
    return req.user.userId;
  }

  @Get('/')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async getUserInfo(@Query('userId') userId: number): Promise<any> {
    return await this.usersService.getUserInfo(userId);
  }

  @Delete('/delete')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Req() req): Promise<void> {
    const userId = req.user.userId;
    await this.usersService.deleteUser(userId);
  }

  @Post('/check-email')
  @HttpCode(HttpStatus.OK)
  async checkEmailDuplicate(@Body() checkEmailDto: CheckEmailDto): Promise<{ isDuplicate: boolean }> {
    const isDuplicate = await this.usersService.isEmailDuplicate(checkEmailDto);
    return { isDuplicate };
  }

  @Post('/check-nickname')
  @HttpCode(HttpStatus.OK)
  async checkNicknameDuplicate(@Body() checkNicknameDto: CheckNicknameDto): Promise<{ isDuplicate: boolean }> {
    const { nickname } = checkNicknameDto;
    const isDuplicate = await this.usersService.isNicknameDuplicate(nickname);
    return { isDuplicate };
  }

  @Patch('/update')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto): Promise<void> {
    const userId = req.user.userId;
    await this.usersService.updateUser(userId, updateUserDto);
  }
}
