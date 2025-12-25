'use server';

import {
  extractDataFromStatement,
  ExtractDataFromStatementOutput,
} from '@/ai/flows/extract-data-from-statement';

// Define the shape of the data *after* we process it.
export type ProcessedStatementData = {
  transactions: Record<string, string>[];
  currency: string;
};

export async function processPdf(
  pdfDataUri: string
): Promise<
  | { success: true; data: ProcessedStatementData }
  | { success: false; error: string }
> {
  if (!pdfDataUri || !pdfDataUri.startsWith('data:application/pdf;base64,')) {
    return { success: false, error: 'Invalid PDF data format.' };
  }

  try {
    const result = await extractDataFromStatement({ pdfDataUri });

    if (result && result.transactions && result.currency) {
      // The AI returns an array of key-value pair arrays.
      // We need to convert it into a standard array of objects.
      const processedTransactions = result.transactions.map(row => {
        const transactionObject: Record<string, string> = {};
        row.forEach(cell => {
          transactionObject[cell.key] = cell.value;
        });
        return transactionObject;
      });

      const processedData: ProcessedStatementData = {
        transactions: processedTransactions,
        currency: result.currency,
      };

      return { success: true, data: processedData };
    } else {
      return {
        success: false,
        error:
          'Failed to extract transaction data. The AI model did not return the expected structure.',
      };
    }
  } catch (e) {
    console.error('AI processing error:', e);
    const errorMessage =
      e instanceof Error
        ? e.message
        : 'An unknown error occurred during processing.';
    return { success: false, error: `AI processing failed: ${errorMessage}` };
  }
}
