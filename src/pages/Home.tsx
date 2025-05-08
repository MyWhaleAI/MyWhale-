import React from 'react';
import WalletConnect from '../components/WalletConnect';
import WhaleFeed from '../components/WhaleFeed';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto">
      <WalletConnect />
      <WhaleFeed />
    </div>
  );
};

export default Home;