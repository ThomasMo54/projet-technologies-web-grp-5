import { IsEmail, IsNotEmpty, IsString, IsEnum, MaxLength, MinLength } from 'class-validator';
import { UserType } from '../user-type.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastname: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstname: string;

  @IsEnum(UserType)
  type: UserType;
}