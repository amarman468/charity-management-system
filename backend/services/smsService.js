
// Mock SMS Service
export const sendSMS = async ({ to, message }) => {
    console.log(`[SMS Service] Sending SMS to ${to}`);
    console.log(`Message: ${message}`);
    // In future, integrate Twilio or local SMS gateway
    return true;
};

export const sendDonationSMS = async (donation, user) => {
    if (!user.phone) return false;
    return sendSMS({
        to: user.phone,
        message: `Thank you for donating ${donation.amount} BDT. TrxID: ${donation.transactionId}. As-Shawkani Fdn.`
    });
};
