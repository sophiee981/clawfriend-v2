import type { WalletClient } from "viem";

export interface ResponseTransaction {
  txHash: string;
  wait(): Promise<void>;
}

/** Raw and UI-formatted amount (used by token contract allowance, etc.) */
export interface AmountOutput {
  rawAmount: string;
  uiAmount: string;
}

export interface BuySharesParams {
  sharesSubject: string;
  amount: string | bigint;
}

export interface SellSharesParams {
  sharesSubject: string;
  amount: string | bigint;
}

export interface LaunchParams {
  sharesSubject: string;
  agentName: string;
  signature: `0x${string}` | Uint8Array | string;
}

export interface TransferSharesParams {
  sharesSubject: string;
  to: string;
  amount: string | bigint;
}

export interface WalletInfo {
  address: `0x${string}`;
  walletClient: WalletClient;
}

export interface IClawFriendContract {
  set wallet(wallet: WalletInfo | null);

  getAddress(): string;

  sharesSupply(sharesSubject: string): Promise<bigint>;
  sharesBalance(sharesSubject: string, owner: string): Promise<bigint>;
  getBuyPrice(sharesSubject: string, amount: string | bigint): Promise<bigint>;
  getBuyPriceAfterFee(
    sharesSubject: string,
    amount: string | bigint
  ): Promise<bigint>;
  getSellPrice(sharesSubject: string, amount: string | bigint): Promise<bigint>;
  getSellPriceAfterFee(
    sharesSubject: string,
    amount: string | bigint
  ): Promise<bigint>;

  buyShares(params: BuySharesParams): Promise<ResponseTransaction>;
  sellShares(params: SellSharesParams): Promise<ResponseTransaction>;
  launch(params: LaunchParams): Promise<ResponseTransaction>;
  transferShares(params: TransferSharesParams): Promise<ResponseTransaction>;
}
