import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import useTransactions from './hooks/useTransactions';
import useTransactionLibrary from './hooks/useTransactionLibrary';
import Dashboard from './pages/Dashboard';
import ReviewAndConfirm from './pages/ReviewAndConfirm';
import { HOME_PATH, REVIEW_AND_CONFIRM_PATH } from './routes/routes';

const App = () => {
  const {
    transactions,
    handleAddTransaction,
    handleRemoveTransaction,
    handleSubmitTransactions,
    handleRemoveAllTransactions,
    handleReorderTransactions,
  } = useTransactions();

  const { handleSaveTransactionBatch, handleDownloadTransactionBatch } = useTransactionLibrary();

  const navigate = useNavigate();

  return (
    <>
      {/* App Header */}
      <Header />

      <Routes>
        {/* Dashboard Screen (Create transactions) */}
        <Route
          path={HOME_PATH}
          element={
            <Dashboard
              transactions={transactions}
              handleAddTransaction={handleAddTransaction}
              handleRemoveTransaction={handleRemoveTransaction}
              handleSubmitTransactions={() => navigate(REVIEW_AND_CONFIRM_PATH)}
              handleSaveTransactionBatch={handleSaveTransactionBatch}
              handleDownloadTransactionBatch={handleDownloadTransactionBatch}
              handleRemoveAllTransactions={handleRemoveAllTransactions}
              handleReorderTransactions={handleReorderTransactions}
            />
          }
        />

        {/* Review & Confirm Screen */}
        <Route
          path={REVIEW_AND_CONFIRM_PATH}
          element={
            <ReviewAndConfirm
              transactions={transactions}
              handleRemoveTransaction={handleRemoveTransaction}
              handleSaveTransactionBatch={handleSaveTransactionBatch}
              handleDownloadTransactionBatch={handleDownloadTransactionBatch}
              handleRemoveAllTransactions={handleRemoveAllTransactions}
              handleSubmitTransactions={handleSubmitTransactions}
              handleReorderTransactions={handleReorderTransactions}
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;
