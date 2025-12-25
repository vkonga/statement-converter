'use server';

/**
 * @fileOverview Extracts structured data from a bank statement PDF using AI.
 *
 * - extractDataFromStatement - A function that handles the data extraction process.
 * - ExtractDataFromStatementInput - The input type for the extractDataFromStatement function.
 * - ExtractDataFromStatementOutput - The return type for the extractDataFromStatement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractDataFromStatementInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A bank statement PDF, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractDataFromStatementInput = z.infer<typeof ExtractDataFromStatementInputSchema>;

// Defines a single row as an array of key-value pairs.
// This is more robust for the model than a generic object.
const TransactionSchema = z.array(z.object({
    key: z.string().describe("The column header for this cell."),
    value: z.string().describe("The text content of this cell.")
}));


const ExtractDataFromStatementOutputSchema = z.object({
  transactions: z.array(TransactionSchema).describe('An array of transaction objects found in the statement. Each transaction is a list of key-value pairs representing a row.'),
  currency: z.string().describe('The currency code (e.g., USD, EUR) found in the statement.'),
});
export type ExtractDataFromStatementOutput = z.infer<typeof ExtractDataFromStatementOutputSchema>;

export async function extractDataFromStatement(
  input: ExtractDataFromStatementInput
): Promise<ExtractDataFromStatementOutput> {
  return extractDataFromStatementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractDataFromStatementPrompt',
  input: {schema: ExtractDataFromStatementInputSchema},
  output: {schema: ExtractDataFromStatementOutputSchema},
  prompt: `You are an expert data extraction specialist. Your task is to process a bank statement PDF and extract all transaction data from it.

You will receive a bank statement PDF in data URI format. You must perform the following actions:

1.  **Process All Pages**: Go through every single page of the document to find all transactions. Do not stop after the first page.
2.  **Identify the Main Transaction Table**: Locate the primary table containing the list of transactions.
3.  **Extract EVERY Transaction**: Extract every single row from the transaction table(s) across all pages. Each row must be represented as an array of key-value pairs, where the key is the column header and the value is the cell's content. Do not summarize, shorten, or omit any rows.
4.  **Determine the Currency**: Identify the currency used in the statement (e.g., USD, EUR, GBP) and return its three-letter code.

Return a JSON object containing the complete array of all extracted transactions and the currency code.

Here is the bank statement PDF:

{{media url=pdfDataUri}}

Ensure your output is a valid JSON object matching the required schema and contains every transaction from the document.`,
});

const extractDataFromStatementFlow = ai.defineFlow(
  {
    name: 'extractDataFromStatementFlow',
    inputSchema: ExtractDataFromStatementInputSchema,
    outputSchema: ExtractDataFromStatementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
