export const REQUEST_TOKEN_KEY = 'user';

export const AuthGuardType = {
  Beaber: 'Bearer',
  None: 'None',
  APIKey: 'APIKey',
} as const;

export type AuthType = typeof AuthGuardType[keyof typeof AuthGuardType];
/**
 * This declaration pattern provides several key benefits:

Single Source of Truth: You define the values once in the AuthType object, and the type is automatically derived from it. No duplication needed.

Type Safety with Literal Types: The as const assertion narrows the types from string to literal types ('Bearer' | 'None' | 'APIKey'), providing stronger type checking.

Autocomplete for Values: You can use AuthType.Bearer with IDE autocomplete and typo protection, while still getting the string value.

Type for Function Parameters: The AuthType gives you a union type ('Bearer' | 'None' | 'APIKey') that can be used in function signatures:

Refactoring Safety: If you change 'Bearer' to 'BearerToken' in one place, TypeScript will flag all usages that need updating.

Better than Enums: More flexible than TypeScript enums - works at runtime as a plain object, can be easily serialized, and has clearer JavaScript output.
 */

export const ConditionGuard = {
  And: 'and',
  Or: 'or',
} as const;

export type ConditionGuardType = typeof ConditionGuard[keyof typeof ConditionGuard];

export const TypeOfVerificationCode = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  LOGIN: 'LOGIN',
  DISABLE_2FA: 'DISABLE_2FA',
} as const; 
