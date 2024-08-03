import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserId = createParamDecorator<unknown, ExecutionContext, string>(
  (_data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req["userId"];
  },
);
