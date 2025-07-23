import { Injectable } from '@nestjs/common';
import { User, UserRole } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result as User;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      ...dto,
      password: hashedPassword,
      role: UserRole.CITIZEN,
    });
    await this.userRepo.save(user);
    return this.login(user);
  }
}
