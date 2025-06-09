import fetch from 'node-fetch';
import { config } from './config';
import { AppTransaction } from './transactionAdapter';

export async function sendTransactionToNextApp(transaction: AppTransaction): Promise<boolean> {
  try {
    const response = await fetch(config.nextAppSaveEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Failed to send transaction to Next.js app. Status: ${response.status}. Body: ${errorBody}`,
        transaction
      );
      return false;
    }
    console.log('Transaction successfully sent to Next.js app:', transaction.signature);
    return true;
  } catch (error) {
    console.error('Error sending transaction to Next.js app:', error, transaction);
    return false;
  }
}