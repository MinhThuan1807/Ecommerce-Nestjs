import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { RoleIdService } from './role-id.service'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { LoginBodyDTO, RegisterBodyDTO } from './auth.dto'
import { TokenService } from 'src/shared/services/token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly roleIdService: RoleIdService,
    private readonly HashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(body: RegisterBodyDTO) {
    try {
      const clientRoleId = await this.roleIdService.getRoleId()
      const hashedPassword = await this.HashingService.hash(body.password)

      const existing = await this.prismaService.user.findFirst({
        where: {
          OR: [{ email: body.email }, { phoneNumber: body.phoneNumber }],
        },
      })

      if (existing) {
        if (existing.email === body.email) {
          throw new ConflictException('Email already exists')
        }
        if (existing.phoneNumber === body.phoneNumber) {
          throw new ConflictException('Phone number already exists')
        }
      }

      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
          phoneNumber: body.phoneNumber,
          roleId: clientRoleId,
        },
        omit: {
          password: true,
          totpSecret: true,
        },
      })
      return user
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException('Email already exists')
      }
      console.log(error)
      throw error
    }
  }

  async login(body: LoginBodyDTO) {

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
