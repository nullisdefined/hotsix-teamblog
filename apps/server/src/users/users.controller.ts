import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  ConflictException,
  Res,
  Req,
  ExecutionContext,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('join')
  async join(@Body() createUserDto: CreateUserDto): Promise<{ message: string } | HttpException> {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        return new HttpException(error.message, HttpStatus.CONFLICT);
      }

      return new HttpException('회원 가입에 실패하였습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Record<string, any> | HttpException> {
    try {
      return await this.usersService.loginUser(loginUserDto, res);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('reset')
  async passwordResetRequest(@Req() req: Request): Promise<{ message: string } | HttpException> {
    return await this.usersService.requestReset(req);
  }

  @Put('reset')
  async passwordReset(@Body() password: string, @Req() req: Request): Promise<{ message: string } | HttpException> {
    return await this.usersService.reset(password, req);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
