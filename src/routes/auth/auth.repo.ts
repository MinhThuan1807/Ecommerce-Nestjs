import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { DeviceType, RefreshTokenType, RegisterBodyType, RoleType, VerificationCodeType } from './auth.model'
import { UserType } from 'src/shared/models/shared-user.model'
import { TypeOfVerificationCodeType } from 'src/shared/constants/auth.constant'
@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    data: Omit<RegisterBodyType, 'confirmPassword' | 'code'> & Pick<UserType, 'roleId'>,
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
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
    payload:
      | { email: string }
      | { id: number }
      | {
          email: string
          type: TypeOfVerificationCodeType
          code: string
        },
  ): Promise<VerificationCodeType> {
    return this.prismaService.verificationCode.findFirst({
      where: payload,
    })
  }

  createDevice(
    data: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> & Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>,
  ) {
    {
      return this.prismaService.device.create({
        data,
      })
    }
  }

  async findUniqueIncludeRole(
    uniqueObject: { email: string } | { id: number },
  ): Promise<(UserType & { role: RoleType }) | null> {
    return this.prismaService.user.findFirst({
      where: uniqueObject,
      include: {
        role: true,
      },
    })
  }

  async findRefreshTokenIncludeUserRole(uniqueObject: { token: string }): Promise<RefreshTokenType & { user: UserType & { role: RoleType }} | null> {
    return this.prismaService.refreshToken.findUnique({
      where: uniqueObject,
      include: {
        user: {
          include: {
            role: true,
          }
        }
      },
    })
  }

  async updateDeviceLastActive(deviceId: number, userAgent: string, ip: string) {
    return await this.prismaService.device.update({
      where: {
        id: deviceId,
      },
      data: {
        lastActive: new Date(),
        userAgent,
        ip,
      },
    })
  }

  async updateDeviceId(deviceId: number, data: Partial<DeviceType>) {
    return await this.prismaService.device.update({
      where: {
        id: deviceId,
      },
      data: {
        lastActive: new Date(),
        ...data,
      },
    })
  }

  async deleteRefreshToken(token: string) {
    return await this.prismaService.refreshToken.delete({
      where: {
        token,
      },
    })
  }
}
  
