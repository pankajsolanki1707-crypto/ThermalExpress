import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function generateReceiptPDF(receiptNumber: string, storeName: string): Promise<Blob> {
  const receiptElement = document.getElementById('printable-thermal-receipt');
  if (!receiptElement) {
    throw new Error('Thermal receipt preview element not found.');
  }

  // Render element to canvas with crisp line heights and fonts
  const canvas = await html2canvas(receiptElement, {
    scale: 3,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
    onclone: (clonedDoc) => {
      const clonedReceipt = clonedDoc.getElementById('printable-thermal-receipt');
      if (clonedReceipt) {
        // Ensure text lines up cleanly without clipping or squashing font glyphs
        clonedReceipt.style.lineHeight = '1.6';
        clonedReceipt.style.letterSpacing = '0.02em';
        clonedReceipt.style.padding = '20px 16px';
        clonedReceipt.style.boxShadow = 'none';
        
        // Hide decorative jagged tears for PDF export
        const noPrintElems = clonedReceipt.querySelectorAll('.no-print');
        noPrintElems.forEach((el) => {
          (el as HTMLElement).style.display = 'none';
        });
      }
    },
  });

  const imgData = canvas.toDataURL('image/png');

  // Calculate PDF dimensions (80mm width standard)
  const imgWidthMm = 80;
  const pageHeightMm = (canvas.height * imgWidthMm) / canvas.width;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [imgWidthMm, Math.max(pageHeightMm, 80)],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, imgWidthMm, pageHeightMm);
  return pdf.output('blob');
}

export async function downloadReceiptPDF(receiptNumber: string, storeName: string): Promise<void> {
  const blob = await generateReceiptPDF(receiptNumber, storeName);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeStoreName = (storeName || 'Store').replace(/[^a-zA-Z0-9]/g, '_');
  link.href = url;
  link.download = `Receipt_#${receiptNumber}_${safeStoreName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function shareReceiptPDF(receiptNumber: string, storeName: string, customerPhone?: string): Promise<boolean> {
  try {
    const pdfBlob = await generateReceiptPDF(receiptNumber, storeName);
    const safeStoreName = (storeName || 'Store').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `Receipt_#${receiptNumber}_${safeStoreName}.pdf`;
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: `Receipt #${receiptNumber} from ${storeName}`,
        text: `Thank you for shopping at ${storeName}! Receipt #${receiptNumber}`,
      });
      return true;
    }
  } catch (err: unknown) {
    const error = err as Error;
    if (error.name !== 'AbortError') {
      console.warn('PDF Web Share not available or aborted:', error);
    }
  }
  return false;
}
