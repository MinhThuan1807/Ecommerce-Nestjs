import { Injectable } from "@nestjs/common";
import { Resend } from 'resend';
import envConfig from "../config";
import {EmailOTP}   from "../../../emails/EmailOTP";

@Injectable()
export class EmailService {

  private resend: Resend;

  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY)
  }

  async sendOTP(payload: { email: string, code: string }) {
    return this.resend.emails.send({
      from: 'Ecommerce <no-reply@beautyst.click>',
      to: [payload.email],
      subject: 'Your OTP Code',
      react: <EmailOTP otpCode={payload.code} expiresInMinutes={envConfig.OTP_EXPIRES_IN} />,
    });

  }
  
}