import { ContractMethod } from '../hooks/useServices/interfaceRepository';

export interface ProposedTransaction {
  id: number | string;
  description: {
    to: string;
    value: string;
    hexEncodedData?: string;
    contractMethod?: ContractMethod;
    contractFieldsValues?: Record<string, string>;
    nativeCurrencySymbol?: string;
    networkPrefix?: string;
  };
  raw: { to: string; value: string; data: string };
}
