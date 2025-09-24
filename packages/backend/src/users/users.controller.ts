import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  ForbiddenException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto.email, createUserDto.password, createUserDto.lastname, createUserDto.firstname, createUserDto.type);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any): Promise<User | null> {
    if (req.user.uuid !== id) {
      throw new ForbiddenException('You are not allowed to access this resource');
    }
    return this.usersService.findUserByIdWithoutPassword(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req: any): Promise<User | null> {
    if (req.user.uuid !== id) {
      throw new ForbiddenException('You are not allowed to access this resource');
    }
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any): Promise<User | null> {
    if (req.user.uuid !== id) {
      throw new ForbiddenException('You are not allowed to access this resource');
    }
    return this.usersService.deleteUser(id);
  }
}