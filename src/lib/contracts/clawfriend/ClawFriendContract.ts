import { IWallet } from "@phoenix-wallet/core";

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
  sharesSubject: string; // address of shares subject (agent)
  amount: string | bigint; // uint256
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

export interface IClawFriendContract {
  set wallet(wallet: IWallet<any, any, any, any> | undefined);

  getAddress(): string;

  // Read functions
  sharesSupply(sharesSubject: string): Promise<bigint>;
  sharesBalance(sharesSubject: string, owner: string): Promise<bigint>;
  getBuyPrice(sharesSubject: string, amount: string | bigint): Promise<bigint>;
  getBuyPriceAfterFee(sharesSubject: string, amount: string | bigint): Promise<bigint>;
  getSellPrice(sharesSubject: string, amount: string | bigint): Promise<bigint>;
  getSellPriceAfterFee(sharesSubject: string, amount: string | bigint): Promise<bigint>;

  // Write functions
  buyShares(params: BuySharesParams): Promise<ResponseTransaction>;
  sellShares(params: SellSharesParams): Promise<ResponseTransaction>;
  launch(params: LaunchParams): Promise<ResponseTransaction>;
}
