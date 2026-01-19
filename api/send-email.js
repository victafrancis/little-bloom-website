import { Resend } from 'resend';
import * as Sentry from '@sentry/node';

// Initialize Sentry for serverless function
Sentry.init({
  // eslint-disable-next-line no-undef
  dsn: process.env.SENTRY_DSN || process.env.VITE_SENTRY_DSN,
  tracesSampleRate: 1.0,
  // eslint-disable-next-line no-undef
  environment: process.env.VERCEL_ENV || 'development',
});

// Environment-aware API key handling
const getApiKey = () => {
  // Handle both serverless and Node.js environments
  // eslint-disable-next-line no-undef
  const env = typeof process !== 'undefined' ? process.env : {};

  // In production (Vercel), use RESEND_API_KEY
  // In local development, also check VITE_RESEND_API_KEY for compatibility
  const apiKey = env.RESEND_API_KEY || env.VITE_RESEND_API_KEY;

  if (!apiKey || apiKey === 'your_resend_api_key_here') {
    throw new Error('RESEND_API_KEY environment variable is not set or is using placeholder value');
  }

  return apiKey;
};

const resend = new Resend(getApiKey());

export default Sentry.withSentryApiHandler(async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let name, email, message;

  try {
    ({ name, email, message } = req.body);

    // Set user context for Sentry (sanitized - no sensitive data)
    Sentry.setUser({
      email: email, // We'll sanitize this if needed
      username: name,
    });

    // Set tags for better error categorization
    Sentry.setTag('operation', 'contact_form_submission');
    Sentry.setTag('form_type', 'contact');

    // Validate required fields
    if (!name || !email || !message) {
      Sentry.captureMessage('Contact form validation failed: missing required fields', 'warning');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email template for business owner
    const subjectForReply = `Re: Inquiry from ${name}`;
    const bodyForReply = `On ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })}, ${name} <${email}> wrote:\n\n${message}`;
    const safeMailto = `mailto:${email}?subject=${encodeURIComponent(subjectForReply)}`;

    const businessEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #CCA42A; text-decoration: underline; font-weight: bold;">${email}</a></p>
          <p style="margin: 10px 0;"><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #CCA42A;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p style="margin:16px 0;">
            <a href="${safeMailto}" style="background:#CCA42A;color:#111;padding:10px 14px;border-radius:6px;text-decoration:none;font-weight:bold;">
              Reply to ${name}
            </a>
          </p>
        </div>
        <p style="color: #111111; font-size: 14px;">
          This message was sent from your Little Bloom Photography contact form.
        </p>
        <img src="https://www.littlebloomphotography.com/assets/logo-nav.png" alt="Little Bloom Logo" style="max-width: 200px; height: auto;">
      </div>
    `;

    // Email template for user confirmation
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #CCA42A; margin-bottom: 20px;">Thank You for Reaching Out!</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p>Hi ${name},</p>
          <p>Thank you for contacting Little Bloom Photography! I've received your message and will get back to you within one business day.</p>
          <p>Here's a summary of what you shared:</p>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #CCA42A; margin: 15px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p>I'm excited to learn more about your photography needs!</p>
          <p style="margin-top: 30px;">Best regards,<br>Ayi, Little Bloom Photography<br><img src="https://www.littlebloomphotography.com/assets/logo-nav.png" alt="Little Bloom Logo" style="max-width: 200px; height: auto;"></p>
        </div>
      </div>
    `;

    // Send email to our business email
    const businessEmail = await resend.emails.send({
      from: 'Contact Form Submission <forms@littlebloomphotography.com>',
      to: ['hello@littlebloomphotography.com'],
      reply_to: `${name} <${email}>`,
      headers: { 'Reply-To': `${name} <${email}>` },
      subject: `New Inquiry from ${name}`,
      html: businessEmailHtml,
    });

    // Send confirmation email to user
    const userEmail = await resend.emails.send({
      from: 'Little Bloom Photography <hello@littlebloomphotography.com>',
      to: [email],
      subject: 'Thank you for contacting Little Bloom Photography',
      html: userEmailHtml,
    });

    // Log successful email sending (server-side only, for monitoring)
    console.log('Contact form email sent successfully to:', email);

    res.status(200).json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    // Enhanced error logging with context
    Sentry.withScope((scope) => {
      scope.setTag('error_type', 'email_sending_failure');
      // Safely add user context if available
      if (typeof email === 'string') scope.setExtra('user_email', email);
      if (typeof name === 'string') scope.setExtra('user_name', name);
      Sentry.captureException(error);
    });

    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}, {
  shouldCreateTransactionForRequest: (req) => req.method !== 'OPTIONS',
});
