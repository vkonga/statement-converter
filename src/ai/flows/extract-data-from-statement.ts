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
  prompt: `You are an expert data extraction specialist.

You will receive a bank statement PDF in data URI format. Your task is to perform the following actions:
1. Identify the main transaction table in the PDF.
2. Extract all the transaction data from this table. Each row should be represented as an array of key-value pairs, where the key is the column header and the value is the cell content.
3. Determine the currency used in the statement (e.g., USD, EUR, GBP, CAD) and return its three-letter code.

Return a JSON object containing the array of transactions and the currency code.

Here is the bank statement PDF:

{{media url=pdfDataUri}}

Ensure your output is a valid JSON object matching the required schema.`,
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
