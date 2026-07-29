import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

export type AuthUser = {
  accountNo: string;
  email: string;
  role: string[];
  exp: number;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Account is inactive');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const decoded = this.jwtService.decode<{ exp: number }>(accessToken);

    return {
      accessToken,
      user: {
        accountNo: user.id,
        email: user.email,
        role: [user.role],
        exp: decoded.exp * 1000,
      } satisfies AuthUser,
    };
  }

  async me(user: AuthUser): Promise<AuthUser> {
    const dbUser = await this.prisma.adminUser.findUnique({
      where: { id: user.accountNo },
    });

    if (!dbUser || !dbUser.isActive) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
