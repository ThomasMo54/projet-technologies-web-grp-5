import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'abc@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'strongPassword123' })
  password: string;
}