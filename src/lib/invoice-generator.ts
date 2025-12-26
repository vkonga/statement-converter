
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface InvoiceData {
    orderID: string;
    date: Date;
    userName: string;
    userEmail: string;
    planName: string;
    amount: number; // In dollars
    currency: string;
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const fontSize = 12;
    const titleSize = 24;
    const margin = 50;

    // Helper to draw text
    const drawText = (text: string, x: number, y: number, size: number = fontSize, usedFont = font) => {
        page.drawText(text, { x, y, size, font: usedFont, color: rgb(0, 0, 0) });
    };

    let y = height - margin;

    // Header
    drawText('INVOICE', margin, y, titleSize, boldFont);
    y -= 30;
    drawText('StatementConverter', margin, y, 14, boldFont);
    y -= 20;
    drawText('support@statementconverter.com', margin, y, 10);

    y -= 40;

    // Order Details
    drawText(`Order ID: ${data.orderID}`, margin, y);
    y -= 20;
    drawText(`Date: ${data.date.toLocaleDateString()}`, margin, y);

    y -= 40;

    // Bill To
    drawText('Bill To:', margin, y, 14, boldFont);
    y -= 20;
    drawText(data.userName, margin, y);
    y -= 20;
    drawText(data.userEmail, margin, y);

    y -= 50;

    // Line Items Header
    const col1 = margin;
    const col2 = width - margin - 100;

    drawText('Description', col1, y, 12, boldFont);
    drawText('Amount', col2, y, 12, boldFont);

    y -= 10;
    page.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness: 1,
        color: rgb(0, 0, 0),
    });
    y -= 30;

    // Line Item
    drawText(`${data.planName} Subscription`, col1, y);
    drawText(`$${data.amount.toFixed(2)} ${data.currency}`, col2, y);

    y -= 20;
    page.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
    });

    y -= 40;

    // Total
    drawText('Temp Total:', width - margin - 180, y, 12, boldFont);
    drawText(`$${data.amount.toFixed(2)}`, col2, y, 12, boldFont);

    // Footer
    drawText('Thank you for your business!', margin, 50, 10);

    return await pdfDoc.save();
}
