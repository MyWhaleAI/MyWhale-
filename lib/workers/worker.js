const fs = require('fs');
const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');

// Wallet you want to track
const WALLET = 'AFAuwtGuLK61VkaNWjLc8vk7cjDJzS7T5HLGdFR4JQVG';
const publicKey = new PublicKey(WALLET);

// Connect to Solana Devnet with WebSocket
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// JSON file to write logs
const outputPath = './wallet_events.json';
let feed = [];

// Load previous events if file exists
if (fs.existsSync(outputPath)) {
  try {
    const prev = fs.readFileSync(outputPath, 'utf-8');
    feed = JSON.parse(prev);
  } catch (err) {
    console.error('Error loading previous logs:', err.message);
  }
}

// Save updated feed to file
function saveToFile(events) {
  fs.writeFileSync(outputPath, JSON.stringify(events, null, 2));
  console.log(`Saved ${events.length} log entries to wallet_events.json`);
}

// Start log tracking
async function startTracking() {
  console.log(`Tracking wallet logs for: ${WALLET} (Devnet)`);

  connection.onLogs(publicKey, (logInfo) => {
    const timestamp = new Date().toISOString();

    const entry = {
      id: feed.length + 1,
      time: timestamp,
      rawLog: logInfo
    };

    feed.push(entry);
    saveToFile(feed);
  }, 'confirmed');
}

startTracking();
