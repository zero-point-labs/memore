import { NextRequest, NextResponse } from 'next/server';
import { sendServerEmail } from '@/lib/resend-server';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message } = await request.json();

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, message' },
        { status: 400 }
      );
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 24px;">🧪 Memora Email Test</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; color: #333;">
          <h2 style="color: #667eea; margin-top: 0;">Test Message</h2>
          <p>${message}</p>
          
          <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              This is a test email from your Memora booking system. 
              If you received this, your email configuration is working correctly! 🎉
            </p>
          </div>
        </div>
      </div>
    `;

    const result = await sendServerEmail({
      to,
      subject,
      html,
      text: `Test Message: ${message}\n\nThis is a test email from your Memora booking system.`,
      template: 'test'
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully!',
        emailId: result.id
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint ready',
    usage: 'POST with { to: "email@example.com", subject: "Test", message: "Hello!" }'
  });
}
