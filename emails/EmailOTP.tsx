import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import * as React from 'react'

type OtpEmailProps = {
  otpCode?: string
  appName?: string
  expiresInMinutes?: string
}

export const EmailOTP = ({ otpCode = '123456', appName = 'Nest Super', expiresInMinutes = '10' }: OtpEmailProps) =>  {
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
  expiresInMinutes: '10',
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