import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto.email, createUserDto.password, createUserDto.lastname, createUserDto.firstname, createUserDto.type);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findUserByIdWithoutPassword(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User | null> {
    return this.usersService.deleteUser(id);
  }
}