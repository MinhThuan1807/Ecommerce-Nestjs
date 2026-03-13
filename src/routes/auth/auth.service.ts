import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common'
import { RoleIdService } from './role-id.service'
import { HashingService } from 'src/shared/services/hashing.service'
import { generateOTP, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { RegisterBodyType, SendOTPBodyType } from './auth.model'
import { TokenService } from 'src/shared/services/token.service'
import { AuthRepository } from './auth.repo'
import { SharedUserRepo } from 'src/shared/repositories/shared-user.repo'
import { addMilliseconds } from 'date-fns'
import envConfig from 'src/shared/config'
import ms, { StringValue }  from 'ms'
import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant'

@Injectable()
export class AuthService {
  constructor(
    private readonly roleIdService: RoleIdService,
    private readonly HashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepo: SharedUserRepo,
  ) {}

  async register(body: RegisterBodyType) {
    try {
      const verificationCode = await this.authRepository.findVerificationCode({
        email: body.email,
        type: TypeOfVerificationCode.REGISTER,
        code: body.code,
      })
      if(!verificationCode) {
        throw new UnprocessableEntityException([
          {
            message: 'Invalid verification code',
            path: 'code'
          }
        ])
      }
      if(verificationCode.expiresAt < new Date()) {
         throw new UnprocessableEntityException([
          {
            message: 'Verification code has expired',
            path: 'code'
          }
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
            path: 'email'
          }
        ])
      }
      throw new InternalServerErrorException('Failed to register user')
    }
  }

  async sendOTP(body: SendOTPBodyType) {
    // check if user exists with the email
    const user = await this.sharedUserRepo.findUnique({ email: body.email })
    if(user) {
     throw new UnprocessableEntityException([
          {
            message: 'Email already exists',
            path: 'email'
          }
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


    return verificationCode
  }
  //generate access token and refresh token
  // async generateTokens(payload: { userId: number }) {
  //   const [accessToken, refreshToken] = await Promise.all([
  //     this.tokenService.signAccessToken(payload),
  //     this.tokenService.signRefreshToken(payload),
  //   ]);

  //   const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken);
  //   await this.prismaService.refreshToken.create({
  //     data: {
  //       token: refreshToken,
  //       userId: payload.userId,
  //       expiresAt: new Date(decodedRefreshToken.exp * 1000), // convert to milliseconds
  //     }
  //   });

  //   return { accessToken, refreshToken };
  // }

  // refresh access token
  // async refreshToken(refreshToken: string) {
  //   try {
  //     // step 1: verify the refresh token
  //     const { userId } = await this.tokenService.verifyRefreshToken(refreshToken);

  //     // step 2: check if the refresh token exists in the database
  //     await this.prismaService.refreshToken.findFirstOrThrow({
  //       where: {
  //         token: refreshToken
  //       }
  //     })

  //     // step 3: delete the used refresh token from the database
  //     await this.prismaService.refreshToken.delete({
  //       where: {
  //         token: refreshToken
  //       }
  //     })

  //     // step 4: generate new access token and refresh token
  //     const tokens = await this.generateTokens({ userId });
  //     return tokens;
  //   } catch (error) {
  //     if(isNotFoundPrismaError(error)) {
  //       throw new UnauthorizedException('Invalid refresh token');
  //     }
  //     throw new UnauthorizedException();
  //   }
  // }
}
