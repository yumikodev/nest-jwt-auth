import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtConfig } from "src/config/env";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: Request = ctx.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader)
      throw new BadRequestException("Missing authorization header");

    const exp = authHeader.slice(0, 7).trim();

    if (!/[Bb]earer/g.test(exp))
      throw new BadRequestException("Invalid authorization header");

    const { ACCESS_SECRET } = this.config.get<JwtConfig>("JWT");

    try {
      const { userId } = await this.jwt.verifyAsync(authHeader.slice(7), {
        secret: ACCESS_SECRET,
      });

      req["userId"] = userId;

      return true;
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException("Invalid auth token");
    }
  }
}
