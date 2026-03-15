export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
} as const;


import { z } from 'zod'
export const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  password: z.string().min(8).max(100),
  phoneNumber: z.string(),
  totpSecret: z.string().nullable(),
  avatar: z.string().nullable(),
  roleId: z.number().positive(),
  status: z.enum(UserStatus),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type UserType = z.infer<typeof UserSchema>
