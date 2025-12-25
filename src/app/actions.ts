'use server';

import { extractDataFromStatement } from '@/ai/flows/extract-data-from-statement';

export async function processPdf(
  pdfDataUri: string
): Promise<
  | { success: true; data: string[] }
  | { success: false; error: string }
> {
  if (!pdfDataUri || !pdfDataUri.startsWith('data:application/pdf;base64,')) {
    return { success: false, error: 'Invalid PDF data format.' };
  }

  try {
    const result = await extractDataFromStatement({ pdfDataUri });
    if (result.columnNames) {
      return { success: true, data: result.columnNames };
    } else {
      return {
        success: false,
        error:
          'Failed to extract column names. The AI model did not return any data.',
      };
    }
  } catch (e) {
    console.error('AI processing error:', e);
    const errorMessage =
      e instanceof Error ? e.message : 'An unknown error occurred during processing.';
    return { success: false, error: `AI processing failed: ${errorMessage}` };
  }
}
