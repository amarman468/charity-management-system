import PDFDocument from 'pdfkit';

export const generateDonationReceipt = (donation, donor, campaign) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('As-Shawkani Foundation', { align: 'center' });
      doc.fontSize(16).text('Donation Receipt', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12);
      doc.text(`Receipt Number: ${donation.transactionId}`, { align: 'left' });
      doc.text(`Date: ${new Date(donation.createdAt).toLocaleDateString()}`, { align: 'left' });
      doc.moveDown();

      doc.text(`Donor Name: ${donor.name}`, { align: 'left' });
      doc.text(`Donor Email: ${donor.email}`, { align: 'left' });
      doc.moveDown();

      doc.text(`Campaign: ${campaign.title}`, { align: 'left' });
      doc.moveDown();

      doc.fontSize(18);
      doc.text(`Amount: ${donation.amount} BDT`, { align: 'center' });
      doc.moveDown();

      doc.fontSize(12);
      doc.text(`Payment Method: ${donation.paymentMethod}`, { align: 'left' });
      doc.moveDown();

      doc.fontSize(10);
      doc.text('Thank you for your generous donation!', { align: 'center' });
      doc.text('This receipt is generated automatically.', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export const generateVolunteerCertificate = (task, volunteer) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(24).text('Certificate of Participation', { align: 'center' });
      doc.moveDown(2);

      doc.fontSize(16);
      doc.text('This is to certify that', { align: 'center' });
      doc.moveDown();

      doc.fontSize(20);
      doc.text(volunteer.name, { align: 'center' });
      doc.moveDown();

      doc.fontSize(14);
      doc.text('has successfully completed the volunteer task:', { align: 'center' });
      doc.moveDown();

      doc.fontSize(16);
      doc.text(`"${task.title}"`, { align: 'center' });
      doc.moveDown(2);

      doc.fontSize(12);
      doc.text(`Task Description: ${task.description}`, { align: 'left' });
      doc.moveDown();

      if (task.completedDate) {
        doc.text(`Completed on: ${new Date(task.completedDate).toLocaleDateString()}`, { align: 'left' });
      }

      doc.moveDown(3);
      doc.text('As-Shawkani Foundation', { align: 'center' });
      doc.text(new Date().toLocaleDateString(), { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
