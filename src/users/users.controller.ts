import { Controller, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserId } from "src/auth/user-id.decorator";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("profile")
  getProfile(@UserId() userId: string) {
    return this.usersService.getUser(userId);
  }

  @Get()
  getUsers() {
    return this.usersService.getAll();
  }
}
