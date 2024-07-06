import { Body, Controller, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Delete('/delete')
  @UseGuards(AuthGuard())
  async deleteUser(@Req() req): Promise<void> {
    const userId = req.user.userId;
    await this.usersService.deleteUser(userId);
  }
}
