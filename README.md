<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
////
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
      react: <EmailOTP otpCode={payload.code} />,
    });

  }
  
}
////
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import * as React from 'react'

type OtpEmailProps = {
  otpCode?: string
  appName?: string
  expiresInMinutes?: number
}

export const EmailOTP = ({ otpCode = '123456', appName = 'Nest Super', expiresInMinutes = 10 }: OtpEmailProps) =>  {
  return (
    <Html>
      <Head />
      <Preview>{`${otpCode} is your OTP code for ${appName}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={card}>
            <Text style={eyebrow}>{appName}</Text>
            <Heading style={heading}>Verify your identity</Heading>
            <Text style={paragraph}>
              Use this one-time password (OTP) to continue your request. This code is valid for {expiresInMinutes}{' '}
              minutes.
            </Text>

            <Section style={otpWrapper}>
              <Text style={otpCodeStyle}>{otpCode}</Text>
            </Section>

            <Text style={helpText}>If you didn’t request this code, you can safely ignore this email.</Text>

            <Hr style={divider} />

            <Text style={footer}>For security, never share this code with anyone.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
EmailOTP.PreviewProps= {
  code: '123456',
  appName: 'Nest Super',
  expiresInMinutes: 10,
} as OtpEmailProps

const main: React.CSSProperties = {
  margin: '0',
  padding: '40px 0',
  backgroundColor: '#f3f4f6',
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
}

const container: React.CSSProperties = {
  margin: '0 auto',
  padding: '0 16px',
  maxWidth: '600px',
}

const card: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  padding: '32px 28px',
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
}

const eyebrow: React.CSSProperties = {
  margin: '0 0 10px',
  color: '#4f46e5',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
}

const heading: React.CSSProperties = {
  margin: '0 0 12px',
  color: '#111827',
  fontSize: '28px',
  lineHeight: '34px',
  fontWeight: 700,
}

const paragraph: React.CSSProperties = {
  margin: '0 0 20px',
  color: '#4b5563',
  fontSize: '15px',
  lineHeight: '24px',
}

const otpWrapper: React.CSSProperties = {
  borderRadius: '12px',
  backgroundColor: '#111827',
  padding: '14px 18px',
  textAlign: 'center',
  marginBottom: '16px',
}

const otpCodeStyle: React.CSSProperties = {
  margin: '0',
  color: '#ffffff',
  fontSize: '32px',
  lineHeight: '38px',
  letterSpacing: '0.3em',
  fontWeight: 700,
}

const helpText: React.CSSProperties = {
  margin: '0',
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '22px',
}

const divider: React.CSSProperties = {
  margin: '20px 0',
  borderColor: '#e5e7eb',
}

const footer: React.CSSProperties = {
  margin: '0',
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '18px',
}