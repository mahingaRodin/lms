import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

  @ApiTags('Authentication')
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({
      status: 201,
      description: 'User successfully logged in.',
    })
    @Post('login')
    async login(@Body() dto: LoginDto) {
      const user = await this.authService.validateUser(dto.email, dto.password);
      if (!user) throw new UnauthorizedException('Invalid credentials');
      return this.authService.login(user);
    }

    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({
      status: 201,
      description: 'User successfully registered',
    })
    @Post('register')
    async register(@Body() dto: RegisterDto) {
      return this.authService.register(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req) {
      return req.user; // Contains payload from JWT
    }
  }
