'use server';

/**
 * @fileOverview Extracts tabular data and currency from a bank statement PDF using AI.
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

const ExtractDataFromStatementOutputSchema = z.object({
  extractedData: z
    .string()
    .describe('The extracted tabular data from the bank statement in a JSON format.'),
  currency: z.string().describe("The currency (e.g., USD, EUR, $, £) found in the bank statement."),
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

You will receive a bank statement PDF in data URI format. Your task is to extract all tabular data from the PDF and return it in JSON format.
You must also identify the currency used in the statement (e.g., USD, EUR, $, £) and return it.

Here is the bank statement PDF:

{{media url=pdfDataUri}}

Ensure that the extracted data is accurate and well-structured.`,
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
