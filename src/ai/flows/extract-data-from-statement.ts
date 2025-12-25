'use server';

/**
 * @fileOverview Extracts column names from a bank statement PDF using AI.
 *
 * - extractDataFromStatement - A function that handles the column name extraction process.
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

const ExtractDataFromStatementOutputSchema = z.object({
  columnNames: z.array(z.string()).describe('An array of column names found in the statement.'),
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

You will receive a bank statement PDF in data URI format. Your task is to extract only the column names/headers from the main transaction table in the PDF.

Return only an array of strings containing the column names.

Here is the bank statement PDF:

{{media url=pdfDataUri}}

Ensure that you only extract the column headers.`,
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
