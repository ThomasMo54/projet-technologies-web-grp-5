import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body: { email: string; password: string; lastname: string; firstname: string; type: string }) {
    return this.usersService.createUser(body.email, body.password, body.lastname, body.firstname, body.type);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findUserById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<User>): Promise<User | null> {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User | null> {
    return this.usersService.deleteUser(id);
  }
}