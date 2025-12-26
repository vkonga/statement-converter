'use server';

import {
  extractDataFromStatement,
  ExtractDataFromStatementOutput,
} from '@/ai/flows/extract-data-from-statement';
import { auth, firestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { PDFDocument } from 'pdf-lib';

// Define the shape of the data *after* we process it.
export type ProcessedStatementData = {
  transactions: Record<string, string>[];
  currency: string;
  fileName: string;
  pageCount: number;
};

export async function deductUserCredits(idToken: string, pageCount: number): Promise<{ success: boolean; error?: string }> {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;
    const userRef = firestore.collection('users').doc(userId);

    await firestore.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error('User account not found.');
      }

      const userData = userDoc.data();
      const credits = userData?.credits || 0;

      if (credits < pageCount) {
        throw new Error(`Insufficient credits. You need ${pageCount} credits to download this file.`);
      }

      transaction.update(userRef, { credits: credits - pageCount });
    });

    return { success: true };
  } catch (error: any) {
    console.error("Credit deduction failed:", error);
    return { success: false, error: error.message || 'Failed to deduct credits.' };
  }
}

export async function processPdf(
  pdfDataUri: string,
  idToken?: string
): Promise<
  | { success: true; data: ProcessedStatementData }
  | { success: false; error: string }
> {
  if (!pdfDataUri || !pdfDataUri.startsWith('data:application/pdf;base64,')) {
    return { success: false, error: 'Invalid PDF data format.' };
  }

  let pageCount = 0;

  // Verify User (Just check existence, don't deduct yet)
  if (idToken) {
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      const userId = decodedToken.uid;
      const userRef = firestore.collection('users').doc(userId);
      const userDoc = await userRef.get(); // fast read

      if (!userDoc.exists) {
        // handle implicit user?
      }

      const pdfBuffer = Buffer.from(pdfDataUri.split(',')[1], 'base64');
      const pdfDoc = await PDFDocument.load(pdfBuffer, { updateMetadata: false });
      pageCount = pdfDoc.getPageCount();

      // Optional: Check if they *have* credits to warn them early?
      // The user wants to review first, so maybe we let them proceed even if 0 credits, 
      // but they won't be able to download.
      // However, to save server costs, we might want to block if 0 credits.
      // But let's follow the user's "Review first" flow.

    } catch (error: any) {
      console.error("Auth check failed:", error);
      return { success: false, error: 'Authentication failed.' };
    }
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
        fileName: '', // This will be set on the client
        pageCount: pageCount,
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
