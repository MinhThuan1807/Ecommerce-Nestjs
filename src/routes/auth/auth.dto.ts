import { createZodDto } from 'nestjs-zod'
import { LoginBodySchema, LoginResSchema, LogoutBodySchema, RefreshTokenBodySchema, RefreshTokenResSchema, RegisterBodySchema, RegisterResSchema, SendOTPBodySchema} from './auth.model'
import { MessageResponseSchema } from 'src/shared/models/response.model'


export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}

export class RegisterResponseDTO extends createZodDto(RegisterResSchema) {} 

export class SendOTPBodyDTO extends createZodDto(SendOTPBodySchema) {}

export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}

export class LoginResDTO extends createZodDto(LoginResSchema) {}

export class RefreshTokenResDTO extends createZodDto(RefreshTokenResSchema) {}

export class RefreshTokenBodyDTO extends createZodDto(RefreshTokenBodySchema) {}

export class LogoutBodyDTO extends createZodDto(LogoutBodySchema) {}

export class LogoutResDTO extends createZodDto(MessageResponseSchema) {
  message = 'Logged out successfully'
}