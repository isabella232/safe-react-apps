import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import TransactionsBatchList from '../components/TransactionsBatchList';

import { useTransactionLibrary, useTransactions } from '../store';

type EditTransactionLibraryProps = {
  networkPrefix: string | undefined;
  nativeCurrencySymbol: string | undefined;
  getAddressFromDomain: (name: string) => Promise<string>;
};

const EditTransactionLibrary = ({
  networkPrefix,
  nativeCurrencySymbol,
  getAddressFromDomain,
}: EditTransactionLibraryProps) => {
  const { transactions, removeAllTransactions, replaceTransaction, reorderTransactions, removeTransaction } =
    useTransactions();
  const { downloadBatch, saveBatch } = useTransactionLibrary();

  return (
    <TransactionsSectionWrapper item xs={12} md={6}>
      <TransactionsBatchList
        transactions={transactions}
        batchTitle={'TODO: SHOW BATCH NAME!!  [Edit page]'}
        removeTransaction={removeTransaction}
        saveBatch={saveBatch}
        downloadBatch={downloadBatch}
        removeAllTransactions={removeAllTransactions}
        replaceTransaction={replaceTransaction}
        reorderTransactions={reorderTransactions}
        showTransactionDetails={false}
        showBatchHeader
        networkPrefix={networkPrefix}
        getAddressFromDomain={getAddressFromDomain}
        nativeCurrencySymbol={nativeCurrencySymbol}
      />
    </TransactionsSectionWrapper>
  );
};

export default EditTransactionLibrary;

const TransactionsSectionWrapper = styled(Grid)`
  position: sticky;
  top: 40px;
  align-self: flex-start;
`;
