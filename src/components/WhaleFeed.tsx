import React from 'react';
import TransactionCard from './TransactionCard';

const WhaleFeed: React.FC = () => {
  const transactions = [
    {
      id: 1,
      type: 'Buy',
      asset: 'SOL',
      amount: 100,
      timestamp: '2025-05-01T12:00:00Z',
    },
  ];

  return (
    <div className="p-4">
      {transactions.map((tx) => (
        <TransactionCard key={tx.id} transaction={tx} />
      ))}
    </div>
  );
};

export default WhaleFeed;