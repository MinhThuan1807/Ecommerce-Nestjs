export const ROLE = {
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT',
  SELLER: 'SELLER',
} as const;

export type roleType = typeof ROLE[keyof typeof ROLE];