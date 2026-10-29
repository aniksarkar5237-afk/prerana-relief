import nodemailer from 'nodemailer';
import twilio from 'twilio';

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  : null;

/**
 * Dispatches an automated Email and SMS alert for NGO verification outcomes.
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.phone
 * @param {string} params.orgName
 * @param {string} params.decision - 'verified' or 'rejected'
 * @param {string} [params.rejectionReason]
 * @param {number} [params.score]
 */
export async function dispatchVerificationAlert({ email, phone, orgName, decision, rejectionReason, score }) {
  const isApproved = decision === 'verified';
  
  // HTML Template for Email
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: ${isApproved ? '#22c55e' : '#ef4444'};">
        NGO Verification ${isApproved ? 'Approved' : 'Rejected'}
      </h2>
      <p>Dear ${orgName},</p>
      <p>Your NGO verification status has been reviewed.</p>
      <div style="padding: 15px; background: #f8fafc; border-left: 4px solid ${isApproved ? '#22c55e' : '#ef4444'}; margin: 15px 0;">
        <strong>Status:</strong> ${isApproved ? 'Verified ✅' : 'Rejected ❌'}<br/>
        ${!isApproved && rejectionReason ? `<strong>Reason:</strong> ${rejectionReason}<br/>` : ''}
        ${score !== undefined ? `<strong>Integrity Score:</strong> ${score}/100` : ''}
      </div>
      <p>${isApproved ? 'You can now launch campaigns and receive donations.' : 'Please address the issues mentioned and re-apply.'}</p>
      <p>Regards,<br/>PreranaAid Administration</p>
    </div>
  `;

  // Text Template for SMS
  const smsContent = `PreranaAid: Your NGO (${orgName}) verification was ${isApproved ? 'APPROVED' : 'REJECTED'}.${!isApproved && rejectionReason ? ` Reason: ${rejectionReason}` : ''}`;

  try {
    // Dispatch Email
    if (transporter && email) {
      await transporter.sendMail({
        from: process.env.SMTP_USER || 'no-reply@preranaaid.org',
        to: email,
        subject: `PreranaAid Verification Update: ${isApproved ? 'Approved' : 'Rejected'}`,
        html: htmlContent
      });
      console.log(`[Notification] Email sent to ${email}`);
    } else {
      console.warn(`[Notification] Email skipped for ${email}. SMTP not configured.`);
    }
  } catch (error) {
    console.error(`[Notification] Failed to send email to ${email}:`, error.message);
  }

  try {
    // Dispatch SMS
    if (twilioClient && phone && process.env.TWILIO_PHONE_NUMBER) {
      await twilioClient.messages.create({
        body: smsContent,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });
      console.log(`[Notification] SMS sent to ${phone}`);
    } else {
      console.warn(`[Notification] SMS skipped for ${phone || 'unknown'}. Twilio credentials or phone number missing.`);
    }
  } catch (error) {
    console.error(`[Notification] Failed to send SMS to ${phone}:`, error.message);
  }
}
