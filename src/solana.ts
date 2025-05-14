import { Connection, PublicKey, type ParsedTransactionWithMeta } from "@solana/web3.js"
import { config, KNOWN_PROGRAMS, KNOWN_TOKENS } from "./config"
import type { TransactionClassification } from "./types"

export class SolanaClient {
  private connection: Connection
  private retryCount = 0

  constructor() {
    this.connection = new Connection(config.rpcEndpoint, "confirmed")
  }

  async getRecentTransactions(walletAddress: string, limit = 10): Promise<string[]> {
    try {
      const pubkey = new PublicKey(walletAddress)
      const signatures = await this.connection.getSignaturesForAddress(pubkey, { limit })
      return signatures.map((sig) => sig.signature)
    } catch (error) {
      console.error(`Error fetching signatures for ${walletAddress}:`, error)
      if (this.retryCount < config.rpcMaxRetries) {
        this.retryCount++
        console.log(`Retrying (${this.retryCount}/${config.rpcMaxRetries})...`)
        await new Promise((resolve) => setTimeout(resolve, config.rpcRetryDelay))
        return this.getRecentTransactions(walletAddress, limit)
      }
      return []
    } finally {
      this.retryCount = 0
    }
  }

  async getTransaction(signature: string): Promise<ParsedTransactionWithMeta | null> {
    try {
      return await this.connection.getParsedTransaction(signature, {
        maxSupportedTransactionVersion: 0,
      })
    } catch (error) {
      console.error(`Error fetching transaction ${signature}:`, error)
      if (this.retryCount < config.rpcMaxRetries) {
        this.retryCount++
        console.log(`Retrying (${this.retryCount}/${config.rpcMaxRetries})...`)
        await new Promise((resolve) => setTimeout(resolve, config.rpcRetryDelay))
        return this.getTransaction(signature)
      }
      return null
    } finally {
      this.retryCount = 0
    }
  }

  classifyTransaction(tx: ParsedTransactionWithMeta): TransactionClassification | null {
    if (!tx || !tx.meta) return null

    // Get all instructions including inner instructions
    const instructions = [
      ...(tx.transaction.message.instructions ?? []),
      ...(tx.meta.innerInstructions?.flatMap((i) => i.instructions) ?? []),
    ]

    // Check for token swaps (DEX transactions)
    const jupiterIx = instructions.find(
      (ix) => "programId" in ix && ix.programId.toString() === KNOWN_PROGRAMS.JUPITER.address,
    )

    if (jupiterIx) {
      // This is a Jupiter swap
      const preTokenBalances = tx.meta.preTokenBalances || []
      const postTokenBalances = tx.meta.postTokenBalances || []

      // Try to determine which tokens were swapped
      let fromToken = "Unknown"
      let toToken = "Unknown"
      let fromAmount = "0"
      let toAmount = "0"

      // Simple heuristic: tokens that decreased are "from", tokens that increased are "to"
      for (const pre of preTokenBalances) {
        const post = postTokenBalances.find((p) => p.mint === pre.mint)
        if (post && pre.owner === post.owner) {
          const preBal = Number(pre.uiTokenAmount.amount)
          const postBal = Number(post.uiTokenAmount.amount)
          const diff = postBal - preBal

          // Find token symbol
          const tokenSymbol = Object.values(KNOWN_TOKENS).find((t) => t.address === pre.mint)?.symbol || "Unknown"

          if (diff < 0) {
            fromToken = tokenSymbol
            fromAmount = Math.abs(diff).toString()
          } else if (diff > 0) {
            toToken = tokenSymbol
            toAmount = diff.toString()
          }
        }
      }

      return {
        action: `Swapped ${fromToken} → ${toToken}`,
        platform: "Jupiter",
        value: `${fromAmount} ${fromToken}`,
        aiSummary: "Trading between tokens, possibly taking advantage of market conditions",
      }
    }

    // Check for staking transactions
    const marinadeIx = instructions.find(
      (ix) => "programId" in ix && ix.programId.toString() === KNOWN_PROGRAMS.MARINADE.address,
    )

    if (marinadeIx) {
      // Look for SOL balance change to estimate staking amount
      const preBalance = tx.meta.preBalances[0] || 0
      const postBalance = tx.meta.postBalances[0] || 0
      const diff = Math.abs(preBalance - postBalance) / 1e9 // Convert lamports to SOL

      if (preBalance > postBalance) {
        return {
          action: `Staked SOL`,
          platform: "Marinade",
          value: `${diff.toFixed(2)} SOL`,
          aiSummary: "Staking SOL for passive yield, indicating a long-term holding strategy",
        }
      } else {
        return {
          action: `Unstaked SOL`,
          platform: "Marinade",
          value: `${diff.toFixed(2)} SOL`,
          aiSummary: "Unstaking SOL, possibly to realize gains or rebalance portfolio",
        }
      }
    }

    // Check for NFT transactions
    const magicEdenIx = instructions.find(
      (ix) => "programId" in ix && ix.programId.toString() === KNOWN_PROGRAMS.MAGIC_EDEN.address,
    )

    if (magicEdenIx) {
      // Check if SOL was spent (buying) or received (selling)
      const preBalance = tx.meta.preBalances[0] || 0
      const postBalance = tx.meta.postBalances[0] || 0

      if (preBalance > postBalance) {
        const diff = (preBalance - postBalance) / 1e9
        return {
          action: `Bought NFT`,
          platform: "Magic Eden",
          value: `${diff.toFixed(2)} SOL`,
          aiSummary: "Investing in NFTs, possibly for collection or speculation",
        }
      } else {
        const diff = (postBalance - preBalance) / 1e9
        return {
          action: `Sold NFT`,
          platform: "Magic Eden",
          value: `${diff.toFixed(2)} SOL`,
          aiSummary: "Taking profits on NFT investment or rebalancing collection",
        }
      }
    }

    const tensorIx = instructions.find(
      (ix) => "programId" in ix && ix.programId.toString() === KNOWN_PROGRAMS.TENSOR.address,
    )

    if (tensorIx) {
      // Similar logic to Magic Eden
      const preBalance = tx.meta.preBalances[0] || 0
      const postBalance = tx.meta.postBalances[0] || 0

      if (preBalance > postBalance) {
        const diff = (preBalance - postBalance) / 1e9
        return {
          action: `Bought NFT`,
          platform: "Tensor",
          value: `${diff.toFixed(2)} SOL`,
          aiSummary: "Investing in NFTs on Tensor marketplace",
        }
      } else {
        const diff = (postBalance - preBalance) / 1e9
        return {
          action: `Sold NFT`,
          platform: "Tensor",
          value: `${diff.toFixed(2)} SOL`,
          aiSummary: "Selling NFTs on Tensor marketplace",
        }
      }
    }

    // Check for SPL token transfers
    const tokenTransferIx = instructions.find(
      (ix) => "parsed" in ix && ix.parsed?.type === "transfer" && ix.program === "spl-token",
    )

    if (tokenTransferIx) {
      const parsed = tokenTransferIx.parsed
      if (parsed && parsed.info) {
        const { amount, mint, authority } = parsed.info
        // Find token info
        const tokenInfo = Object.values(KNOWN_TOKENS).find((t) => t.address === mint)
        const tokenSymbol = tokenInfo?.symbol || "Unknown"
        const decimals = tokenInfo?.decimals || 9
        const formattedAmount = (Number(amount) / Math.pow(10, decimals)).toFixed(2)

        return {
          action: `Transferred ${tokenSymbol}`,
          platform: "Token Program",
          value: `${formattedAmount} ${tokenSymbol}`,
          aiSummary: "Moving tokens between wallets, possibly for security or portfolio management",
        }
      }
    }

    // If we couldn't classify the transaction
    return {
      action: "Unknown Transaction",
      platform: "Solana",
      value: "N/A",
      aiSummary: "Transaction type not recognized by our classifier",
    }
  }
}
