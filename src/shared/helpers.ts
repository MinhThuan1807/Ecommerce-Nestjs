import { Prisma } from '../../generated/prisma/client'
import { randomInt } from 'node:crypto';


export function isUniqueConstraintPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'  
}

export function isNotFoundPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}

export function generateOTP(): string {
  return String(randomInt(100000, 1000000));
}  