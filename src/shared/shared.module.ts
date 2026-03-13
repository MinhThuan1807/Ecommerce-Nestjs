import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { HashingService } from './services/hashing.service'
import { TokenService } from './services/token.service'
import { JwtModule } from '@nestjs/jwt'
import { AcessTokenGuard } from './guards/access-token.guard'
import { APIKeyGuard } from './guards/api-key.guard'
import { AuthenticationGuard } from './guards/authenticaiton.guard'
import { APP_GUARD } from '@nestjs/core'
import { SharedUserRepo } from './repositories/shared-user.repo'

const sharedProviders = [PrismaService, HashingService, TokenService, AuthenticationGuard, SharedUserRepo]

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [
    ...sharedProviders,
    AcessTokenGuard,
    APIKeyGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  exports: sharedProviders,
})
export class SharedModule {}
