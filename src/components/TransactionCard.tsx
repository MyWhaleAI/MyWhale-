import React from 'react';

interface Transaction {
  id: number;
  type: string;
  asset: string;
  amount: number;
  timestamp: string;
}

const TransactionCard: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  return (
    <div className="border p-4 mb-2 rounded shadow">
      <p><strong>Type:</strong> {transaction.type}</p>
      <p><strong>Asset:</strong> {transaction.asset}</p>
      <p><strong>Amount:</strong> {transaction.amount}</p>
      <p><strong>Time:</strong> {new Date(transaction.timestamp).toLocaleString()}</p>
    </div>
  );
};

export default TransactionCard;