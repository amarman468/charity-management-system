
// Mock Payment Service

export const initiatePayment = async ({ amount, method, user, campaignId }) => {
    console.log(`[Payment Service] Initiating ${method} payment of ${amount} for User ${user._id}`);

    // Mock logic - in real world, this calls bKash/Nagad API
    const transactionId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return {
        success: true,
        transactionId,
        paymentUrl: `http://mock-payment-gateway.com/pay?amount=${amount}&trx=${transactionId}` // Mock URL
    };
};

export const verifyPayment = async (transactionId) => {
    console.log(`[Payment Service] Verifying transaction ${transactionId}`);
    // Mock always success
    return {
        success: true,
        status: 'completed'
    };
};
