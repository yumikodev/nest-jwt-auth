import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtConfig } from "src/config/env";
import { compare, genSalt, hash } from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user || !(await compare(password, user.password)))
      throw new BadRequestException("Invalid email or password");

    return this.generateTokens(user.id);
  }

  async register({ email, password, username }: RegisterDto) {
    const existsUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
      select: { id: true },
    });

    if (existsUser)
      throw new BadRequestException("Username or email is already in use");

    const salt = await genSalt(10);

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: await hash(password, salt),
      },
      select: { id: true },
    });

    return this.generateTokens(user.id);
  }

  async refresh({ token }: RefreshDto) {
    const { REFRESH_SECRET } = this.config.get<JwtConfig>("JWT");

    const { userId } = await this.jwt
      .verifyAsync<Record<"userId", string>>(token, {
        secret: REFRESH_SECRET,
      })
      .catch(() => {
        throw new BadRequestException("Invalid refresh token");
      });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) throw new NotFoundException("Unknown user");

    return this.generateTokens(user.id);
  }

  private async generateTokens(userId: string) {
    const { ACCESS_EXP, ACCESS_SECRET, REFRESH_EXP, REFRESH_SECRET } =
      this.config.get<JwtConfig>("JWT");

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { userId },
        { expiresIn: ACCESS_EXP, secret: ACCESS_SECRET },
      ),
      this.jwt.signAsync(
        { userId },
        { expiresIn: REFRESH_EXP, secret: REFRESH_SECRET },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
