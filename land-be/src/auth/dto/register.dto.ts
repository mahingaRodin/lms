import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/entities/user.entity';
import { LoginDto } from './login.dto';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  nationalId: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  fullName: string;
}
