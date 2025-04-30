export default function WhaleFeed() {
  const mockData = [
    {
      address: "8fj3...sd1p",
      action: "Buy",
      asset: "SOL",
      amount: "120",
      explanation: "Закупка перед потенційним зростанням.",
      time: "2 хв тому",
    },
  ];

  return (
    <div className="space-y-4">
      {mockData.map((tx, i) => (
        <div key={i} className="card">
          <div className="text-sm text-gray-400">{tx.time}</div>
          <div className="font-mono text-lg">{tx.address}</div>
          <div className="mt-2 text-white">
            {tx.action} {tx.amount} {tx.asset}
          </div>
          <div className="mt-1 text-sm text-indigo-400">🤖 {tx.explanation}</div>
        </div>
      ))}
    </div>
  );
}