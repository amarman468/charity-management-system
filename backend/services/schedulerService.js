import Donation from '../models/Donation.js';
import User from '../models/User.js';
import { sendEmail } from './emailService.js';

// Simple in-memory scheduler
// In production, use node-cron or Agenda
export const initScheduler = () => {
    console.log('Initializing Scheduler Service...');

    // Mock Daily Report Job (runs every minute for demo purposes)
    setInterval(async () => {
        try {
            console.log('[Scheduler] Running daily report job...');
            const admins = await User.find({ role: 'admin' });
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const newDonations = await Donation.find({
                createdAt: { $gte: yesterday }
            });

            const totalAmount = newDonations.reduce((sum, d) => sum + d.amount, 0);

            if (admins.length > 0) {
                // Send summary to first admin as a demo
                const adminEmail = admins[0].email;
                console.log(`[Scheduler] Sending daily report to ${adminEmail}. Total: ${totalAmount}`);
                // await sendEmail({
                //   to: adminEmail,
                //   subject: 'Daily Donation Report',
                //   html: `<h1>Daily Report</h1><p>Total donations last 24h: ${totalAmount} BDT</p>`
                // });
            }
        } catch (error) {
            console.error('[Scheduler] Job failed:', error);
        }
    }, 60000 * 60 * 24); // 24 hours in real app
};
