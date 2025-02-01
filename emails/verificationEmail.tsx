import { Html, Head, Body, Container, Text, Button, Section } from '@react-email/components';

interface emailVerficationProps {
    username:string,
    otp : string
}

export default function VerificationEmail({ username, otp } : emailVerficationProps) {
  return (
    <Html>
      <Head />
      <Body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#fff' }}>
          <Section style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#333' }}>Email Verification</h2>
          </Section>
          
          <Section style={{ marginBottom: '20px' }}>
            <Text style={{ fontSize: '16px', color: '#555' }}>
              Hello {username},
            </Text>
            <Text style={{ fontSize: '16px', color: '#555' }}>
              Thank you for registering with us! To complete your sign-up, please enter the following verification code:
            </Text>
            <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#007BFF', marginTop: '20px' }}>
              {otp}
            </Text>
            <Text style={{ fontSize: '16px', color: '#555', marginTop: '20px' }}>
              The code is valid for the next 10 minutes. Please make sure to use it before it expires.
            </Text>
          </Section>

          <Section style={{ textAlign: 'center', marginTop: '30px' }}>
            <Text style={{ fontSize: '12px', color: '#888' }}>
              If you did not request this verification, please ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
