export type WhaleStrategies = {
  defi?: boolean;
  nft?: boolean;
  yield?: boolean;
  staking?: boolean;
  dao?: boolean;
  meme?: boolean;
};

const strategyToTransactionTypesMap: Record<keyof WhaleStrategies, string[]> = {
  defi: [
    "SWAP", "ADD_LIQUIDITY", "REMOVE_LIQUIDITY", "LOAN", "BORROW_OBLIGATION_LIQUIDITY",
    "REPAY_OBLIGATION_LIQUIDITY", "DEPOSIT_RESERVE_LIQUIDITY", "WITHDRAW_OBLIGATION_COLLATERAL",
    "CREATE_AMM", "TOKEN_MINT", "TRANSFER"
  ],
  nft: [
    "NFT_MINT", "NFT_SALE", "NFT_BID", "NFT_LISTING", "NFT_CANCEL_LISTING", "BURN_NFT",
    "COMPRESSED_NFT_MINT", "COMPRESSED_NFT_TRANSFER", "COMPRESSED_NFT_BURN",
    "CREATE_MASTER_EDITION", "AUCTION_HOUSE_CREATE", "BUY_ITEM", "SELL_NFT", "TRANSFER"
  ],
  yield: [
    "HARVEST_REWARD", "DEPOSIT_TO_FARM_VAULT", "WITHDRAW_FROM_FARM_VAULT", "INIT_FARM",
    "ADD_REWARDS", "STAKE", "UNSTAKE"
  ],
  staking: [
    "STAKE", "UNSTAKE", "STAKE_SOL", "UNSTAKE_SOL", "STAKE_TOKEN", "UNSTAKE_TOKEN",
    "INIT_STAKE", "CLAIM_REWARD"
  ],
  dao: [
    "VOTE", "CREATE_PROPOSAL", "APPROVE_PROPOSAL", "REJECT_PROPOSAL",
    "ACTIVATE_PROPOSAL", "ADD_MEMBER", "CREATE_MULTISIG"
  ],
  meme: [
    "TRANSFER", "SWAP", "TOKEN_MINT", "BURN", "ADD_LIQUIDITY", "REMOVE_LIQUIDITY"
  ],
};

export function getTransactionTypesFromPreferences(preferences?: WhaleStrategies | null): string[] {
  if (!preferences) {
    return ["ALL"];
  }

  const selectedTypes = new Set<string>();
  let hasActiveStrategy = false;

  for (const strategyKey in preferences) {
    const key = strategyKey as keyof WhaleStrategies;
    if (preferences[key]) {
      hasActiveStrategy = true;
      const typesForStrategy = strategyToTransactionTypesMap[key];
      if (typesForStrategy) {
        typesForStrategy.forEach(type => selectedTypes.add(type));
      }
    }
  }

  if (!hasActiveStrategy || selectedTypes.size === 0) {
    return ["ALL"];
  }

  return Array.from(selectedTypes);
}