import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDTO, RegisterBodyDTO } from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodSerializerDto(RegisterBodyDTO)
  async register(@Body() body: RegisterBodyDTO) {
    return this.authService.register(body);
  }

  @Post('login')
  @ZodSerializerDto(LoginBodyDTO)
  async login(@Body() body: LoginBodyDTO ) {
    return this.authService.login(body);
  }

}
