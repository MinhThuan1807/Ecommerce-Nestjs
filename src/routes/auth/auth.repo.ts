import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { RegisterBodyType, VerificationCodeType } from './auth.model'
import { UserType } from 'src/shared/models/shared-user.model'
import { TypeOfVerificationCodeType } from 'src/shared/constants/auth.constant'
@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    data: Omit<RegisterBodyType, 'confirmPassword' | 'code'> & Pick<UserType, 'roleId'>,
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    // const existing = await this.prismaService.user.findFirst({
    //   where: {
    //     OR: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
    //   },
    // })

    // if (existing) {
    //   if (existing.email === data.email) {
    //     throw new ConflictException('Email already exists')
    //   }
    //   if (existing.phoneNumber === data.phoneNumber) {
    //     throw new ConflictException('Phone number already exists')
    //   }
    // }
    return this.prismaService.user.create({
      data: data,
      omit: {
        password: true,
        totpSecret: true,
      },
    })
  }

  createVerificationCode(
    payload: Pick<VerificationCodeType, 'email' | 'type' | 'code' | 'expiresAt'>,
  ): Promise<VerificationCodeType> {
    return this.prismaService.verificationCode.upsert({
      where: {
        email_type: {
          email: payload.email,
          type: payload.type,
        },
      },
      create: payload,
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt,
      },
    })
  }

  async findVerificationCode(
    payload: { email: string } | { id: number} | {
      email: string
      type: TypeOfVerificationCodeType
      code: string
    },
  ): Promise<VerificationCodeType> {
    return this.prismaService.verificationCode.findFirst({
      where: payload,
    })
  }
}
