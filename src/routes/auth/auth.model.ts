import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant';
import { UserSchema } from 'src/shared/models/shared-user.model';
import { z } from 'zod'

export const RegisterBodySchema = UserSchema.pick({
  email: true,
  name: true,
  phoneNumber: true,
  password: true,
}).extend({
  confirmPassword: z.string().min(8).max(100),
  code: z.string(),
}).strict().superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: 'custom',
      message: 'Passwords do not match',
    })
  }
})

export const RegisterResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
})

export const VerificationCode = z.object({
  id: z.number(),
  email: z.string(),
  code: z.string(),
  type: z.enum([TypeOfVerificationCode.REGISTER, TypeOfVerificationCode.FORGOT_PASSWORD, TypeOfVerificationCode.LOGIN, TypeOfVerificationCode.DISABLE_2FA]),
  expiresAt: z.date(),
  createdAt: z.date(),
})

export const SendOTPBodySchema = VerificationCode.pick({
  email: true,
  type: true,
}).strict()

export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true,
}).strict()

export const LoginResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export const RefreshTokenSchema = z.object({
  token: z.string(),
  userId: z.number(),
  deviceId: z.number(),
  // expireAt: z.date()
})

export const RefreshTokenBodySchema = z.object({
  refreshToken: z.string(),
}).strict()

export const RefreshTokenResSchema = LoginResSchema

export const DeviceSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userAgent: z.string(),
  ip: z.string(),
  lastActive: z.date(),
  isActive: z.boolean(),
})

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  isActive: z.boolean(),
  createById: z.number().nullable(),
  updateById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const LogoutBodySchema = RefreshTokenBodySchema


export type RegisterBodyType = z.infer<typeof RegisterBodySchema>
export type RegisterResType = z.infer<typeof RegisterResSchema>
export type VerificationCodeType = z.infer<typeof VerificationCode>
export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>
export type LoginBodyType = z.infer<typeof LoginBodySchema>
export type LoginResType = z.infer<typeof LoginResSchema>
export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>
export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>
export type RefreshTokenResType = LoginResType
export type DeviceType = z.infer<typeof DeviceSchema>
export type RoleType = z.infer<typeof RoleSchema>
export type LogoutBodyType = RefreshTokenBodyType