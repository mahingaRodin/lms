import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new BadRequestException(
        'You are not authorized to perform this action.',
      );
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action since you are not logged in.',
      );
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET as string) as any;
      req.user = decoded;
      return true;
    } catch (error) {
      console.error('Token verification error:', error);
      throw new InternalServerErrorException('Error while verifying token.');
    }
  }
}
