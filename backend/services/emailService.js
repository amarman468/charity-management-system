
// Mock Email Service
export const sendEmail = async ({ to, subject, html }) => {
  console.log(`[Email Service] Sending email to ${to}`);
  console.log(`Subject: ${subject}`);
  console.log('Content:', html);
  // In future, integrate NodeMailer or 3rd party service
  return true;
};

export const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: 'Welcome to As-Shawkani Foundation',
    html: `<h1>Welcome ${user.name}!</h1><p>Thank you for joining us.</p>`
  });
};

export const sendDonationReceipt = async (donation, user) => {
  return sendEmail({
    to: user.email,
    subject: 'Donation Receipt',
    html: `<h1>Thank you for your donation of ${donation.amount} BDT</h1><p>Transaction ID: ${donation.transactionId}</p>`
  });
};
