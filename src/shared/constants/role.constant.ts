export const ROLE = {
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT',
  SELLER: 'SELLER',
} as const;

export const ROLE_NUMBERS: Record<keyof typeof ROLE, number> = {
  ADMIN: 1,
  CLIENT: 2,
  SELLER: 3,
}

export type roleType = typeof ROLE[keyof typeof ROLE];