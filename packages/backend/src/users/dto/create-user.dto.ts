import { IsEmail, IsNotEmpty, IsString, IsEnum, MaxLength, MinLength } from 'class-validator';
import { UserType } from '../user-type.enum';
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ example: 'abc@gmail.com' })
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @ApiProperty({ example: 'strongPassword123' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ example: 'Doe' })
  lastname: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ example: 'John' })
  firstname: string;

  @IsEnum(UserType)
  @ApiProperty({ example: UserType.STUDENT, enum: UserType })
  type: UserType;
}