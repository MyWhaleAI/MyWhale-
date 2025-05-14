export interface WhaleEvent {
  wallet: string
  signature: string
  action: string
  platform: string
  value: string
  ai_summary?: string
  timestamp: string
}

export interface TransactionClassification {
  action: string
  platform: string
  value: string
  aiSummary?: string
}

export interface ProgramInfo {
  name: string
  address: string
}

export interface TokenInfo {
  symbol: string
  decimals: number
  address: string
}
