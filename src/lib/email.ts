
import nodemailer from 'nodemailer';

export async function sendInvoiceEmail(
    to: string,
    invoicePdf: Uint8Array,
    orderDetails: { orderID: string, planName: string }
) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to: to,
        subject: `Your Invoice for StatementConverter - ${orderDetails.planName}`,
        text: `Hello,

Thank you for your purchase!

Please find attached your invoice for the ${orderDetails.planName} subscription.

Order ID: ${orderDetails.orderID}

Best regards,
StatementConverter Team`,
        attachments: [
            {
                filename: `Invoice_${orderDetails.orderID}.pdf`,
                content: Buffer.from(invoicePdf),
                contentType: 'application/pdf',
            },
        ],
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        // We generally don't want to fail the HTTP request if email fails, 
        // just log it. The user already paid.
        return { success: false, error };
    }
}
