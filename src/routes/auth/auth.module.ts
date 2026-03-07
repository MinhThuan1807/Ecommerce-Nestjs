import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { RoleIdService } from './role-id.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RoleIdService]
})
export class AuthModule {}
