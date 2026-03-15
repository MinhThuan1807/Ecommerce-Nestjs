import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { TokenPayload } from '../types/jwt.type';
import { REQUEST_TOKEN_KEY } from '../constants/auth.constant';
import { AccessTokenPayload } from '../types/jwt.type';

export const ActiveUser = createParamDecorator(
  (field: keyof AccessTokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: AccessTokenPayload = request[REQUEST_TOKEN_KEY];

    return field ? user?.[field] : user;
  },
);