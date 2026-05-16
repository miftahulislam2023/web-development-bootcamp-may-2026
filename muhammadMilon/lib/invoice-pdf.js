import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/**
 * @param {{
 *   invoiceId: string,
 *   userName: string,
 *   userEmail: string,
 *   templateName: string,
 *   amountCents: number,
 *   date: Date | string,
 *   currency?: string,
 *   paymentStatus?: string,
 * }} input
 * @returns {Promise<Buffer>}
 */
export async function generateInvoicePdfBuffer(input) {
  const {
    invoiceId,
    userName,
    userEmail,
    templateName,
    amountCents,
    date,
    currency = "USD",
    paymentStatus = "SUCCESS",
  } = input;

  if (!invoiceId?.trim()) {
    throw new Error("Invoice ID is required");
  }
  if (!userEmail?.trim()) {
    throw new Error("User email is required");
  }
  if (!templateName?.trim()) {
    throw new Error("Template name is required");
  }

  const parsedDate = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid purchase date");
  }

  const amount = (Number(amountCents || 0) / 100).toFixed(2);
  const dateLabel = parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const accent = rgb(0.39, 0.4, 0.95);
  const muted = rgb(0.45, 0.45, 0.5);
  const dark = rgb(0.1, 0.1, 0.12);

  let y = height - 56;

  page.drawRectangle({
    x: 0,
    y: height - 72,
    width,
    height: 72,
    color: rgb(0.97, 0.97, 1),
  });

  page.drawText("Nexora Studio", {
    x: 50,
    y: height - 42,
    size: 22,
    font: bold,
    color: accent,
  });
  page.drawText("Template Marketplace Invoice", {
    x: 50,
    y: height - 58,
    size: 10,
    font: regular,
    color: muted,
  });

  y = height - 110;
  page.drawText("INVOICE", { x: 50, y, size: 16, font: bold, color: dark });
  y -= 22;
  page.drawText(`Invoice ID: ${invoiceId}`, { x: 50, y, size: 10, font: regular, color: dark });
  y -= 16;
  page.drawText(`Date: ${dateLabel}`, { x: 50, y, size: 10, font: regular, color: dark });
  y -= 16;
  page.drawText(`Payment status: ${paymentStatus}`, {
    x: 50,
    y,
    size: 10,
    font: bold,
    color: rgb(0.09, 0.6, 0.35),
  });

  y -= 36;
  page.drawText("Bill to", { x: 50, y, size: 11, font: bold, color: dark });
  y -= 18;
  page.drawText(userName?.trim() || userEmail, { x: 50, y, size: 10, font: regular, color: dark });
  y -= 16;
  page.drawText(userEmail, { x: 50, y, size: 10, font: regular, color: muted });

  y -= 36;
  page.drawRectangle({
    x: 50,
    y: y - 80,
    width: width - 100,
    height: 80,
    borderColor: rgb(0.9, 0.9, 0.92),
    borderWidth: 1,
    color: rgb(0.99, 0.99, 1),
  });

  page.drawText("Item", { x: 62, y: y - 22, size: 10, font: bold, color: muted });
  page.drawText(templateName, { x: 62, y: y - 40, size: 11, font: regular, color: dark });
  page.drawText(`Amount: $${amount} ${currency}`, {
    x: 62,
    y: y - 58,
    size: 10,
    font: regular,
    color: dark,
  });

  y -= 110;
  page.drawText(`Total paid: $${amount} ${currency}`, {
    x: width - 50 - bold.widthOfTextAtSize(`Total paid: $${amount} ${currency}`, 12),
    y,
    size: 12,
    font: bold,
    color: dark,
  });

  page.drawText("Thank you for your purchase.", {
    x: 50,
    y: 48,
    size: 9,
    font: regular,
    color: muted,
  });
  page.drawText("support@nexora-studio.com", {
    x: 50,
    y: 34,
    size: 8,
    font: regular,
    color: muted,
  });

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}
