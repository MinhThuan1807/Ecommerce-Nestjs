import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDTO, LoginResDTO, LogoutBodyDTO, RefreshTokenBodyDTO, RefreshTokenResDTO, RegisterBodyDTO, RegisterResponseDTO, SendOTPBodyDTO } from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { UserAgent } from 'src/shared/decorators/userAgent.decorator';
import { Ip } from '@nestjs/common';
import { MessageResDTO } from 'src/shared/dto/response.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodSerializerDto(RegisterResponseDTO)
  async register(@Body() body: RegisterBodyDTO) {
    return this.authService.register(body);
  }

  @Post('otp')
  sendOTP(@Body() body: SendOTPBodyDTO) {
    return this.authService.sendOTP(body);
  }


  @Post('login')
  @ZodSerializerDto(LoginResDTO)
  async login(@Body() body: LoginBodyDTO & { userAgent: string; ip: string }, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.login({
      ...body,
      userAgent,
      ip,
    });
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(RefreshTokenResDTO)
  async refreshToken(@Body() body: RefreshTokenBodyDTO & { userAgent: string; ip: string }, @UserAgent() userAgent: string, @Ip() ip: string) {
  // async refreshToken(@Body() body: RefreshTokenBodyDTO ) {
    return this.authService.refreshToken({
      refreshToken: body.refreshToken,
      userAgent,
      ip,
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(MessageResDTO)
  async logout(@Body() body: LogoutBodyDTO) {
    return this.authService.logout(body);
  }
}
