import { SetMetadata } from "@nestjs/common";
import { AuthType, ConditionGuardType } from "../constants/auth.constant";
import { ConditionGuard } from 'src/shared/constants/auth.constant';

export const AUTH_TYPES_KEY = 'authTypes';

export type AuthTypePayload = {authTypes: AuthType[], options?: { condition?: ConditionGuardType }}

export const Auth = (authTypes: AuthType[], options?: { condition: ConditionGuardType | undefined }) => {
  return SetMetadata(AUTH_TYPES_KEY, {authTypes, options: options ?? { condition: ConditionGuard.And }} as AuthTypePayload);
}