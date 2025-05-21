const fs = require('fs');
const { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL, StakeProgram } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID, getMint } = require('@solana/spl-token');
const { Metadata } = require('@metaplex-foundation/mpl-token-metadata');

const WALLET_TO_TRACK = 'AFAuwtGuLK61VkaNWjLc8vk7cjDJzS7T5HLGdFR4JQVG';
const TARGET_WALLET_PUBLIC_KEY = new PublicKey(WALLET_TO_TRACK);

const SOLANA_NETWORK = 'mainnet-beta';
const RPC_ENDPOINT = clusterApiUrl(SOLANA_NETWORK);

const connection = new Connection(RPC_ENDPOINT, 'confirmed');

const OUTPUT_PATH = './advanced_wallet_events_expanded.json';
let eventFeed = [];

const PROGRAM_IDS = {
    JUPITER_V6_AGGREGATOR: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
    RAYDIUM_AMM_V4: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
    RAYDIUM_CLMM: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
    ORCA_WHIRLPOOLS: 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3dhpbC5',
    ORCA_SWAP_V1_V2_TOKEN_SWAP: [
        '9W959DqEETiGZoccp2FjeDQamqmo3GTiJkwqsbtbaLRf',
        'DjVE6JokYcfipodY4MTC2L3q33iEZNBs6mimTUquxZ4e',
        'SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8',
    ],
    STAKE_PROGRAM: StakeProgram.programId.toString(),
    MARINADE_FINANCE: 'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aU',
};

const TOKEN_INFO_CACHE = {
    [TOKEN_PROGRAM_ID.toString()]: { symbol: "SPL_TOKEN_PROGRAM", name: "SPL Token Program", decimals: 0, source: "Static" },
    'So11111111111111111111111111111111111111112': { symbol: 'WSOL', name: 'Wrapped SOL', decimals: 9, source: "Static" },
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': { symbol: 'USDC', name: 'USD Coin', decimals: 6, source: "Static" },
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': { symbol: 'USDT', name: 'Tether USD', decimals: 6, source: "Static" },
    'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': { symbol: 'mSOL', name: 'Marinade SOL', decimals: 9, source: "Static" },
};

async function fetchTokenDetails(mintAddressString) {
    if (TOKEN_INFO_CACHE[mintAddressString]) {
        return TOKEN_INFO_CACHE[mintAddressString];
    }
    console.log(`[TokenMeta] Fetching details for new mint: ${mintAddressString}`);
    try {
        const mintPublicKey = new PublicKey(mintAddressString);
        let decimals = 0, name = 'Unknown Token', symbol = mintAddressString.slice(0, 4) + '...' + mintAddressString.slice(-4);
        let source = "Fetched";

        try {
            const mintInfo = await getMint(connection, mintPublicKey);
            decimals = mintInfo.decimals;
        } catch (e) {
            console.warn(`[TokenMeta] Failed to getMint info for ${mintAddressString}: ${e.message}`);
            source += "/MintFetchFailed";
        }

        try {
            const metadataAccount = await Metadata.findByMint(connection, mintPublicKey);
            if (metadataAccount && metadataAccount.data) {
                name = metadataAccount.data.name.replace(/\0/g, '');
                symbol = metadataAccount.data.symbol.replace(/\0/g, '');
                if (!symbol && name) symbol = name.substring(0,5).toUpperCase();
                source += "/Metaplex";
            } else {
                source += "/NoMetaplex";
            }
        } catch (e) {
            console.warn(`[TokenMeta] Could not fetch Metaplex metadata for ${mintAddressString}: ${e.message}.`);
            source += "/MetaplexError";
        }
        
        const details = { symbol, name, decimals, source };
        TOKEN_INFO_CACHE[mintAddressString] = details;
        return details;
    } catch (error) {
        console.error(`[TokenMeta] Critical error fetching details for ${mintAddressString}: ${error.message}`);
        const errorDetails = { symbol: mintAddressString.slice(0,6) + '...', name: "Fetch Error", decimals: 0, source: "FetchError" };
        TOKEN_INFO_CACHE[mintAddressString] = errorDetails;
        return errorDetails;
    }
}

if (fs.existsSync(OUTPUT_PATH)) {
    try {
        const prev = fs.readFileSync(OUTPUT_PATH, 'utf-8');
        eventFeed = JSON.parse(prev);
        console.log(`Loaded ${eventFeed.length} previous events from ${OUTPUT_PATH}`);
    } catch (err) {
        console.error('Error loading previous logs:', err.message);
    }
}

function saveToFile(events) {
    try {
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(events, null, 2));
        console.log(`Saved ${events.length} log entries to ${OUTPUT_PATH}`);
    } catch (error) {
        console.error('Error saving to file:', error.message);
    }
}

async function analyzeTransaction(signature, trackedWalletPublicKey) {
    let parsedTx;
    try {
        parsedTx = await connection.getParsedTransaction(signature, {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed',
        });
        if (!parsedTx) {
            console.warn(`[${signature}] Failed to fetch parsed transaction.`);
            return { signature, status: "FetchFailed", interpretation: "Could not fetch transaction details." };
        }
        if (!parsedTx.meta) {
            console.warn(`[${signature}] Transaction meta data is missing.`);
            return { signature, status: "MissingMeta", interpretation: "Transaction meta (balances) missing." };
        }
    } catch (error) {
        console.error(`[${signature}] Error fetching transaction: ${error.message}`);
        return { signature, status: "FetchError", interpretation: `Error fetching transaction: ${error.message}` };
    }

    const { meta, transaction, blockTime } = parsedTx;
    const accountKeyObjects = transaction.message.accountKeys;
    const accountKeyStrings = accountKeyObjects.map(acc => acc.pubkey.toString());
    const trackedWalletAddressString = trackedWalletPublicKey.toString();
    const feePayerString = transaction.message.feePayer.toString();
    const feeLamports = meta.fee;

    let interpretation = "No specific action identified for tracked wallet.";
    let involvedPlatforms = new Set();
    let detailedActions = [];

    const balanceChanges = { sol: 0, tokens: [] };
    const walletAccountIndex = accountKeyStrings.indexOf(trackedWalletAddressString);

    if (walletAccountIndex !== -1) {
        const preSol = meta.preBalances[walletAccountIndex] || 0;
        const postSol = meta.postBalances[walletAccountIndex] || 0;
        balanceChanges.sol = (postSol - preSol);
        if (trackedWalletAddressString === feePayerString) {
            balanceChanges.sol -= feeLamports; 
        }
        balanceChanges.sol /= LAMPORTS_PER_SOL;
    }

    const relevantTokenBalances = (b) => (b || []).filter(tb => tb.owner === trackedWalletAddressString || accountKeyStrings[tb.accountIndex] === trackedWalletAddressString);
    const preTokenWalletBalances = relevantTokenBalances(meta.preTokenBalances);
    const postTokenWalletBalances = relevantTokenBalances(meta.postTokenBalances);
    
    const allTrackedMintsInTx = new Set([
        ...preTokenWalletBalances.map(b => b.mint), 
        ...postTokenWalletBalances.map(b => b.mint)
    ]);

    let tokenDetailsByMint = {};
    if (allTrackedMintsInTx.size > 0) {
        const tokenDetailsMap = await Promise.all(
            [...allTrackedMintsInTx].map(async mint => {
                const details = await fetchTokenDetails(mint);
                return [mint, details]; 
            })
        );
        tokenDetailsByMint = Object.fromEntries(tokenDetailsMap);
    }

    for (const mint of allTrackedMintsInTx) {
        const tokenDetails = tokenDetailsByMint[mint]; 
        
        if (!tokenDetails) {
             console.warn(`[${signature}] Token details for mint ${mint} were unexpectedly missing from pre-fetched map. This should not happen.`);
        }

        const preB = preTokenWalletBalances.find(b => b.mint === mint);
        const postB = postTokenWalletBalances.find(b => b.mint === mint);
        let preAmt = 0, postAmt = 0;
        
        const decimals = tokenDetails.decimals; 

        if (preB?.uiTokenAmount?.uiAmountString) {
            preAmt = parseFloat(preB.uiTokenAmount.uiAmountString);
        } else if (preB?.uiTokenAmount?.amount) {
            try {
                preAmt = parseFloat((BigInt(preB.uiTokenAmount.amount) / BigInt(10**decimals)).toString());
            } catch (e) {
                console.warn(`[${signature}] Error parsing preAmount for mint ${mint}: ${e.message}`);
                preAmt = 0; 
            }
        }

        if (postB?.uiTokenAmount?.uiAmountString) {
            postAmt = parseFloat(postB.uiTokenAmount.uiAmountString);
        } else if (postB?.uiTokenAmount?.amount) {
            try {
                postAmt = parseFloat((BigInt(postB.uiTokenAmount.amount) / BigInt(10**decimals)).toString());
            } catch (e) {
                console.warn(`[${signature}] Error parsing postAmount for mint ${mint}: ${e.message}`);
                postAmt = 0; 
            }
        }

        if (preAmt !== postAmt) {
            balanceChanges.tokens.push({ 
                mint, 
                symbol: tokenDetails.symbol, 
                name: tokenDetails.name, 
                preAmount: preAmt, 
                postAmount: postAmt, 
                change: postAmt - preAmt 
            });
        }
    }
    
    const instructions = [...transaction.message.instructions, ...(meta.innerInstructions || []).flatMap(ii => ii.instructions)];
    let isLpOrStakingAction = false;

    for (const instruction of instructions) {
        if (!instruction.programId) continue;
        const programIdStr = instruction.programId.toString();
        
        if (programIdStr === PROGRAM_IDS.JUPITER_V6_AGGREGATOR) involvedPlatforms.add("Jupiter V6");
        else if (programIdStr === PROGRAM_IDS.RAYDIUM_AMM_V4) involvedPlatforms.add("Raydium AMM V4");
        else if (programIdStr === PROGRAM_IDS.RAYDIUM_CLMM) involvedPlatforms.add("Raydium CLMM");
        else if (programIdStr === PROGRAM_IDS.ORCA_WHIRLPOOLS) involvedPlatforms.add("Orca Whirlpools");
        else if (PROGRAM_IDS.ORCA_SWAP_V1_V2_TOKEN_SWAP.includes(programIdStr)) involvedPlatforms.add("Orca Swap");
        else if (programIdStr === PROGRAM_IDS.STAKE_PROGRAM) {
            involvedPlatforms.add("Native SOL Stake");
            isLpOrStakingAction = true;

            if (instruction.parsed?.type === "delegate") {
                detailedActions.push({ type: 'DELEGATE_SOL', platform: "Native SOL Stake", details: "Stake delegated." });
            } else if (instruction.parsed?.type === "withdraw") {
                detailedActions.push({ type: 'WITHDRAW_SOL_STAKE', platform: "Native SOL Stake", details: "Stake withdrawn." });
            }
        } else if (programIdStr === PROGRAM_IDS.MARINADE_FINANCE) {
            involvedPlatforms.add("Marinade Finance");
            isLpOrStakingAction = true;
        }
    }

    const spentTokens = balanceChanges.tokens.filter(t => t.change < 0);
    const receivedTokens = balanceChanges.tokens.filter(t => t.change > 0);
    let platformContext = involvedPlatforms.size > 0 ? `via ${Array.from(involvedPlatforms).join(', ')}` : 'on an unknown platform';

    if (isLpOrStakingAction) {
        if (involvedPlatforms.has("Marinade Finance")) {
            const spentSOL = balanceChanges.sol < -0.00001;
            const receivedMSOL = receivedTokens.find(t => t.mint === 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So' && t.change > 0);
            const spentMSOL = spentTokens.find(t => t.mint === 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So' && t.change < 0);
            const receivedSOL = balanceChanges.sol > 0.00001;

            if (spentSOL && receivedMSOL) {
                interpretation = `Staked ~${Math.abs(balanceChanges.sol).toFixed(5)} SOL for ~${receivedMSOL.change.toFixed(5)} mSOL with Marinade Finance.`;
                detailedActions.push({ type: 'STAKE_SOL_MARINADE', from: {symbol: 'SOL', amount: Math.abs(balanceChanges.sol)}, to: {symbol: 'mSOL', amount: receivedMSOL.change} });
            } else if (spentMSOL && receivedSOL) {
                interpretation = `Unstaked ~${Math.abs(spentMSOL.change).toFixed(5)} mSOL for ~${balanceChanges.sol.toFixed(5)} SOL with Marinade Finance.`;
                detailedActions.push({ type: 'UNSTAKE_MSOL_MARINADE', from: {symbol: 'mSOL', amount: Math.abs(spentMSOL.change)}, to: {symbol: 'SOL', amount: balanceChanges.sol} });
            } else {
                interpretation = `Interaction with Marinade Finance ${platformContext}. SOL change: ${balanceChanges.sol.toFixed(5)}. Token changes: ${balanceChanges.tokens.map(t => `${t.change.toFixed(3)} ${t.symbol}`).join(', ')}`;
            }
        } else if (involvedPlatforms.has("Native SOL Stake")) {
            if (balanceChanges.sol < -0.001) { 
                interpretation = `Delegated/Staked SOL or created stake account ${platformContext}. SOL change: ${balanceChanges.sol.toFixed(5)}.`;
                if (!detailedActions.find(a => a.type === 'DELEGATE_SOL')) { 
                     detailedActions.push({ type: 'DELEGATE_SOL_GENERIC', platform: "Native SOL Stake", amount: Math.abs(balanceChanges.sol) });
                }
            } else if (balanceChanges.sol > 0.001) { 
                interpretation = `Withdrew SOL from stake account ${platformContext}. SOL change: ${balanceChanges.sol.toFixed(5)}.`;
                 if (!detailedActions.find(a => a.type === 'WITHDRAW_SOL_STAKE')) { 
                    detailedActions.push({ type: 'WITHDRAW_SOL_STAKE_GENERIC', platform: "Native SOL Stake", amount: balanceChanges.sol });
                }
            } else { 
                interpretation = `Interaction with Native SOL Stake program ${platformContext}. SOL change: ${balanceChanges.sol.toFixed(5)}.`;
            }
        }
        else if ( (involvedPlatforms.has("Raydium AMM V4") || involvedPlatforms.has("Orca Swap") || involvedPlatforms.has("Raydium CLMM") || involvedPlatforms.has("Orca Whirlpools")) && spentTokens.length >= 1 && receivedTokens.length === 1 && (receivedTokens[0].symbol.toLowerCase().includes('lp') || receivedTokens[0].name.toLowerCase().includes('lp'))) {
            interpretation = `Added Liquidity to ${Array.from(involvedPlatforms).join('/')}: Provided ${spentTokens.map(t => `${Math.abs(t.change).toFixed(3)} ${t.symbol}`).join(' + ')} for ~${receivedTokens[0].change.toFixed(5)} ${receivedTokens[0].symbol}.`;
            detailedActions.push({type: 'ADD_LIQUIDITY', platform: Array.from(involvedPlatforms), provided: spentTokens, receivedLp: receivedTokens[0]});
        } else if ( (involvedPlatforms.has("Raydium AMM V4") || involvedPlatforms.has("Orca Swap") || involvedPlatforms.has("Raydium CLMM") || involvedPlatforms.has("Orca Whirlpools")) && spentTokens.length === 1 && (spentTokens[0].symbol.toLowerCase().includes('lp') || spentTokens[0].name.toLowerCase().includes('lp')) && receivedTokens.length >= 1) {
            interpretation = `Removed Liquidity from ${Array.from(involvedPlatforms).join('/')}: Burned ~${Math.abs(spentTokens[0].change).toFixed(5)} ${spentTokens[0].symbol} for ${receivedTokens.map(t => `${t.change.toFixed(3)} ${t.symbol}`).join(' + ')}.`;
            detailedActions.push({type: 'REMOVE_LIQUIDITY', platform: Array.from(involvedPlatforms), burnedLp: spentTokens[0], received: receivedTokens});
        }

    } else if (involvedPlatforms.size > 0) { 
        if (balanceChanges.sol < -0.00001) { 
            if (receivedTokens.length > 0) {
                const mainReceived = receivedTokens[0]; 
                interpretation = `Spent ~${Math.abs(balanceChanges.sol).toFixed(5)} SOL to buy ~${mainReceived.change.toFixed(5)} ${mainReceived.symbol} (${mainReceived.name}) ${platformContext}.`;
                detailedActions.push({ type: 'SWAP_SOL_FOR_TOKEN', platform: Array.from(involvedPlatforms), from: { symbol: 'SOL', amount: Math.abs(balanceChanges.sol) }, to: { symbol: mainReceived.symbol, name: mainReceived.name, mint: mainReceived.mint, amount: mainReceived.change } });
            } else {
                interpretation = `Spent ~${Math.abs(balanceChanges.sol).toFixed(5)} SOL ${platformContext} (received asset unclear or non-token).`;
                detailedActions.push({ type: 'SPEND_SOL', platform: Array.from(involvedPlatforms), amount: Math.abs(balanceChanges.sol) });
            }
        } else if (balanceChanges.sol > 0.00001) { 
            if (spentTokens.length > 0) {
                const mainSpent = spentTokens[0]; 
                interpretation = `Sold ~${Math.abs(mainSpent.change).toFixed(5)} ${mainSpent.symbol} (${mainSpent.name}) for ~${balanceChanges.sol.toFixed(5)} SOL ${platformContext}.`;
                detailedActions.push({ type: 'SWAP_TOKEN_FOR_SOL', platform: Array.from(involvedPlatforms), from: { symbol: mainSpent.symbol, name: mainSpent.name, mint: mainSpent.mint, amount: Math.abs(mainSpent.change) }, to: { symbol: 'SOL', amount: balanceChanges.sol } });
            } else {
                interpretation = `Received ~${balanceChanges.sol.toFixed(5)} SOL ${platformContext} (sent asset unclear or non-token).`;
                detailedActions.push({ type: 'RECEIVE_SOL', platform: Array.from(involvedPlatforms), amount: balanceChanges.sol });
            }
        } else if (spentTokens.length > 0 && receivedTokens.length > 0) { 
            const mainSpent = spentTokens[0];
            const mainReceived = receivedTokens[0];
            interpretation = `Swapped ~${Math.abs(mainSpent.change).toFixed(5)} ${mainSpent.symbol} (${mainSpent.name}) for ~${mainReceived.change.toFixed(5)} ${mainReceived.symbol} (${mainReceived.name}) ${platformContext}.`;
            detailedActions.push({ type: 'SWAP_TOKEN_FOR_TOKEN', platform: Array.from(involvedPlatforms), from: { symbol: mainSpent.symbol, name: mainSpent.name, mint: mainSpent.mint, amount: Math.abs(mainSpent.change) }, to: { symbol: mainReceived.symbol, name: mainReceived.name, mint: mainReceived.mint, amount: mainReceived.change } });
        } else if (spentTokens.length > 0) {
            interpretation = `Sent ~${Math.abs(spentTokens.reduce((sum, t) => sum + t.change, 0)).toFixed(5)} total tokens (${spentTokens.map(t => `${t.symbol} (${t.name})`).join(', ')}) ${platformContext}.`;
            detailedActions.push({ type: 'SEND_TOKENS', platform: Array.from(involvedPlatforms), tokensSent: spentTokens });
        } else if (receivedTokens.length > 0) {
            interpretation = `Received ~${receivedTokens.reduce((sum, t) => sum + t.change, 0).toFixed(5)} total tokens (${receivedTokens.map(t => `${t.symbol} (${t.name})`).join(', ')}) ${platformContext}.`;
            detailedActions.push({ type: 'RECEIVE_TOKENS', platform: Array.from(involvedPlatforms), tokensReceived: receivedTokens });
        }
    }
    else if (interpretation === "No specific action identified for tracked wallet." && (Math.abs(balanceChanges.sol) > 0.000001 || balanceChanges.tokens.length > 0)) {
        let changesSummary = [];
        if (balanceChanges.sol > 0.000001) changesSummary.push(`Received ${balanceChanges.sol.toFixed(5)} SOL`);
        else if (balanceChanges.sol < -0.000001) changesSummary.push(`Sent ${Math.abs(balanceChanges.sol).toFixed(5)} SOL`);
        
        balanceChanges.tokens.forEach(t => {
            if (t.change > 0.00001) changesSummary.push(`Received ${t.change.toFixed(5)} ${t.symbol}`);
            else if (t.change < -0.00001) changesSummary.push(`Sent ${Math.abs(t.change).toFixed(5)} ${t.symbol}`);
        });
        if (changesSummary.length > 0) {
            interpretation = `General balance changes: ${changesSummary.join(', ')}. Involved programs: ${Array.from(involvedPlatforms).join(', ') || 'Unknown'}.`;
             if (detailedActions.length === 0) { 
                detailedActions.push({type: 'GENERAL_BALANCE_CHANGE', details: changesSummary.join(', '), platforms: Array.from(involvedPlatforms) });
            }
        } else if (feePayerString === trackedWalletAddressString && involvedPlatforms.size === 0) {
            interpretation = `Paid transaction fee of ${feeLamports / LAMPORTS_PER_SOL} SOL. No other specific action identified.`;
            detailedActions.push({type: 'FEE_PAYMENT', amount: feeLamports / LAMPORTS_PER_SOL});
        }
    }

    console.log(`[${signature}] Interpretation: ${interpretation}`);
    return {
        signature,
        blockTime: blockTime ? new Date(blockTime * 1000).toISOString() : null,
        status: "Analyzed",
        feePayer: feePayerString,
        feeLamports,
        feeSOL: feeLamports / LAMPORTS_PER_SOL,
        interpretation,
        involvedPlatforms: Array.from(involvedPlatforms),
        balanceChanges,
        detailedActions,
    };
}

async function startTracking() {
    console.log(`Connecting to ${SOLANA_NETWORK} via ${RPC_ENDPOINT}`);
    console.log(`Attempting to track wallet: ${WALLET_TO_TRACK}`);
    console.log(`Listening for logs... Output will be saved to ${OUTPUT_PATH}`);
    try {
        connection.onLogs(
            TARGET_WALLET_PUBLIC_KEY,
            async (logInfo, context) => {
                const { signature, err, logs } = logInfo;
                const timestamp = new Date().toISOString();
                console.log(`\n--- Log Received [${timestamp}] ---`);
                console.log(`Signature: ${signature}`);
                console.log(`Slot: ${context.slot}`);
                if (err) {
                    console.error(`Error in logs object for ${signature}:`, err);
                    eventFeed.push({ id: eventFeed.length + 1, time: timestamp, signature, slot: context.slot, status: "LogError", errorDetails: JSON.parse(JSON.stringify(err)), rawLogsFromOnLogs: logs });
                    saveToFile(eventFeed);
                    return;
                }
                await new Promise(resolve => setTimeout(resolve, 5000)); 
                
                const analysisResult = await analyzeTransaction(signature, TARGET_WALLET_PUBLIC_KEY);
                eventFeed.push({ id: eventFeed.length + 1, time: timestamp, slot: context.slot, ...analysisResult });
                saveToFile(eventFeed);
            },
            'confirmed'
        );
    } catch (error) {
        console.error("Error subscribing to logs:", error);
    }
}

process.on('SIGINT', () => {
    console.log("\nGracefully shutting down. Saving final logs...");
    saveToFile(eventFeed);
    process.exit(0);
});

if (require.main === module) {
    startTracking().catch(err => {
        console.error("Critical error starting tracking:", err);
    });
}

if (process.env.NODE_ENV === 'test') {
    module.exports = {
        fetchTokenDetails,
        analyzeTransaction,
        saveToFile,
        TOKEN_INFO_CACHE,
        eventFeed,
        PROGRAM_IDS,
        connection,
    };
}