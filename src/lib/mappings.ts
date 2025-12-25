export type MappingOptions = {
  date: { label: string; keywords: string[]; required?: boolean };
  description: { label: string; keywords: string[]; required?: boolean };
  amount_credit_debit: { label: string; keywords: string[]; required?: boolean };
  transaction_type: { label: string; keywords: string[]; required?: boolean };
  balance: { label: string; keywords: string[]; required?: boolean };
};

export const MAPPING_OPTIONS: MappingOptions = {
  date: {
    label: 'Date',
    keywords: ['date', 'posting date', 'transaction date'],
    required: true,
  },
  description: {
    label: 'Description',
    keywords: ['description', 'details', 'narrative', 'memo'],
    required: true,
  },
  amount_credit_debit: {
    label: 'Amount (Credit/Debit in one column)',
    keywords: ['amount', 'value'],
    required: true,
  },
  transaction_type: {
    label: 'Transaction Type',
    keywords: ['type', 'category'],
  },
  balance: {
    label: 'Balance',
    keywords: ['balance', 'running balance'],
  },
};
