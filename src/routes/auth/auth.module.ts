import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { RoleIdService } from './role-id.service';
import { AuthRepository } from './auth.repo';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RoleIdService, AuthRepository]
})
export class AuthModule {}
