import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core/services/reflector.service';
import { AUTH_TYPES_KEY, AuthTypePayload } from '../decorators/auth.decorator';
import { AcessTokenGuard } from './access-token.guard';
import { APIKeyGuard } from './api-key.guard';
import { AuthGuardType, ConditionGuard } from '../constants/auth.constant';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly authTypeGuardMap: Record<string, CanActivate> = {
    [AuthGuardType.Beaber]: this.accessTokenGuard,
    [AuthGuardType.APIKey]: this.apiKeyGuard,
    [AuthGuardType.None]: { canActivate: () => true },
  };
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AcessTokenGuard,
    private readonly apiKeyGuard: APIKeyGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypeValue = this.reflector.getAllAndOverride<AuthTypePayload | undefined>(AUTH_TYPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? { authTypes: [AuthGuardType.None], options: { condition: ConditionGuard.And } };
    
    const guards = authTypeValue.authTypes.map((authType) => this.authTypeGuardMap[authType]);

    let error = new UnauthorizedException('Unauthorized');
    
    if (authTypeValue.options?.condition === ConditionGuard.Or)
      for (const guard of guards) {
        const canActivate = await Promise.resolve(guard.canActivate(context)).catch(err => {
          error = err;
          return false;
        });
        if (canActivate) {
          return true;
        } else {
          throw error;
        }
    } else {
        for (const guard of guards) {
          const canActivate = await Promise.resolve(guard.canActivate(context)).catch(err => {
            error = err;
            return false;
          });
          if (!canActivate) {
            throw error;
          }
        }
    }
    return true;
  }
}
