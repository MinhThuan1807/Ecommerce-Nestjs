import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { RoleIdService } from './role-id.service'
import { HashingService } from 'src/shared/services/hashing.service'
import { generateOTP, isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { LogoutBodyType, RefreshTokenBodyType, RegisterBodyType, SendOTPBodyType } from './auth.model'
import { TokenService } from 'src/shared/services/token.service'
import { AuthRepository } from './auth.repo'
import { SharedUserRepo } from 'src/shared/repositories/shared-user.repo'
import { addMilliseconds } from 'date-fns'
import envConfig from 'src/shared/config'
import ms, { StringValue } from 'ms'
import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant'
import { EmailService } from 'src/shared/services/email.service'
import { LoginBodyDTO, LoginResDTO, LogoutBodyDTO } from './auth.dto'
import { PrismaService } from 'src/shared/services/prisma.service'
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type'

@Injectable()
export class AuthService {
  constructor(
    private readonly roleIdService: RoleIdService,
    private readonly HashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepo: SharedUserRepo,
    private readonly emailService: EmailService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(body: RegisterBodyType) {
    try {
      const verificationCode = await this.authRepository.findVerificationCode({
        email: body.email,
        type: TypeOfVerificationCode.REGISTER,
        code: body.code,
      })
      if (!verificationCode) {
        throw new UnprocessableEntityException([
          {
            message: 'Invalid verification code',
            path: 'code',
          },
        ])
      }
      if (verificationCode.expiresAt < new Date()) {
        throw new UnprocessableEntityException([
          {
            message: 'Verification code has expired',
            path: 'code',
          },
        ])
      }

      const clientRoleId = await this.roleIdService.getRoleId()
      const hashedPassword = await this.HashingService.hash(body.password)

      return this.authRepository.createUser({
        name: body.name,
        email: body.email,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        roleId: clientRoleId,
      })
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new UnprocessableEntityException([
          {
            message: 'Email already exists',
            path: 'email',
          },
        ])
      }
      throw new InternalServerErrorException('Failed to register user')
    }
  }

  async sendOTP(body: SendOTPBodyType) {
    // check if user exists with the email
    const user = await this.sharedUserRepo.findUnique({ email: body.email })
    if (user) {
      throw new UnprocessableEntityException([
        {
          message: 'Email already exists',
          path: 'email',
        },
      ])
    }
    const code = generateOTP()
    // save the OTP in the database with the user id and expiry time of 5 minutes
    const verificationCode = this.authRepository.createVerificationCode({
      email: body.email,
      type: body.type,
      code,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN as StringValue)), // 5 minutes from now
    })
    // Step 3: Send the OTP to the user's email
    const { error } = await this.emailService.sendOTP({
      email: body.email,
      code,
    })
    if (error) {
      throw new UnprocessableEntityException([
        {
          message: 'Failed to send OTP email. Please try again later.',
          path: 'email',
        },
      ])
    }
    return verificationCode
  }

  async login(body: LoginBodyDTO & { userAgent: string; ip: string }) {
    const user = await this.authRepository.findUniqueIncludeRole({ email: body.email })
    if (!user) {
      throw new UnprocessableEntityException([
        {
          message: 'Invalid email or password',
          path: 'email',
        },
      ])
    }
    const isPasswordValid = await this.HashingService.compare(body.password, user.password)
    if (!isPasswordValid) {
      throw new UnprocessableEntityException([
        {
          message: 'Invalid email or password',
          path: 'password',
        },
      ])
    }

    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent: body.userAgent,
      ip: body.ip,
    })

    const tokens = await this.generateTokens({
      userId: user.id,
      deviceId: device.id,
      roleId: user.roleId,
      roleName: user.role.name,
    })
    return tokens
    // return new LoginResDTO(await this.user.createLoginResponse(user))
  }

  async generateTokens({ userId, deviceId, roleId, roleName }: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        userId,
        deviceId,
        roleId,
        roleName,
      }),
      this.tokenService.signRefreshToken({ userId }),
    ])

    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
        deviceId: deviceId,
      },
    })

    return { accessToken, refreshToken }
  }

  async refreshToken({ refreshToken, userAgent, ip }: RefreshTokenBodyType & { userAgent: string; ip: string }) {
    // async refreshToken({ refreshToken }: RefreshTokenBodyType) {
    try {
      // step 1: verify the refresh token
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)

      // step 2: check if the refresh token exists in the database
      const refreshTokenData = await this.authRepository.findRefreshTokenIncludeUserRole({
        token: refreshToken,
      })

      if (!refreshTokenData) {
        throw new UnauthorizedException('Invalid refresh token')
      }
      // step 3: update the last active date of the device associated with the refresh token
      const {
        deviceId,
        user: { roleId, name: roleName },
      } = refreshTokenData

      const $updateDevice = this.authRepository.updateDeviceLastActive(deviceId, userAgent, ip)

      // step 4: delete the used refresh token from the database
      const $deleteRefreshToken = this.authRepository.deleteRefreshToken(refreshToken)

      // step 5: generate new access token and refresh token
      const $tokens = this.generateTokens({ userId, deviceId, roleId, roleName })
      const [, , tokens] = await Promise.all([$updateDevice, $deleteRefreshToken, $tokens])
      return tokens
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new UnauthorizedException()
    }
  }

  async logout(body: LogoutBodyType) {
    try {
      await this.tokenService.verifyRefreshToken(body.refreshToken)

      const deleteRefreshToken = await this.authRepository.deleteRefreshToken(body.refreshToken)

      await this.authRepository.updateDeviceId(deleteRefreshToken.deviceId, {
        isActive: false,
      })
      return {message: 'Logged out successfully'}
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Invalid refresh token')
      }
      throw new UnauthorizedException()
    }
  }
}
