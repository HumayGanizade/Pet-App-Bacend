import {
  Body,
  Controller,
  Get, Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ChangePasswordDto } from '../event/dto/change-password.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  editUser(@Body() dto: EditUserDto, @Req() req: any) {
    return this.userService.editUser(dto, req.user.id);
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.id, dto);
  }
}
