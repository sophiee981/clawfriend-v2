import type { PublicClient } from "viem";
import { CLAW_FRIEND_ABI } from "../abis/claw-friend-abi";
import type {
  BuySharesParams,
  IClawFriendContract,
  LaunchParams,
  ResponseTransaction,
  SellSharesParams,
  TransferSharesParams,
  WalletInfo,
} from "./ClawFriendContract";

export class EvmClawFriendContract implements IClawFriendContract {
  #wallet: WalletInfo | null = null;

  constructor(
    private publicClient: PublicClient,
    public address: `0x${string}`,
    private abi: readonly unknown[] = CLAW_FRIEND_ABI
  ) {}

  set wallet(wallet: WalletInfo | null) {
    this.#wallet = wallet;
  }

  getAddress(): string {
    return this.address;
  }

  async sharesSupply(sharesSubject: string): Promise<bigint> {
    return this.publicClient.readContract({
      address: this.address,
      abi: this.abi,
      functionName: "sharesSupply",
      args: [sharesSubject as `0x${string}`],
    }) as Promise<bigint>;
  }

  async sharesBalance(sharesSubject: string, owner: string): Promise<bigint> {
    return this.publicClient.readContract({
      address: this.address,
      abi: this.abi,
      functionName: "sharesBalance",
      args: [sharesSubject as `0x${string}`, owner as `0x${string}`],
    }) as Promise<bigint>;
  }

  async getBuyPrice(
    sharesSubject: string,
    amount: string | bigint
  ): Promise<bigint> {
    const amt = typeof amount === "string" ? BigInt(amount) : amount;
    return this.publicClient.readContract({
      address: this.address,
      abi: this.abi,
      functionName: "getBuyPrice",
      args: [sharesSubject as `0x${string}`, amt],
    }) as Promise<bigint>;
  }

  async getBuyPriceAfterFee(
    sharesSubject: string,
    amount: string | bigint
  ): Promise<bigint> {
    const amt = typeof amount === "string" ? BigInt(amount) : amount;
    return this.publicClient.readContract({
      address: this.address,
      abi: this.abi,
      functionName: "getBuyPriceAfterFee",
      args: [sharesSubject as `0x${string}`, amt],
    }) as Promise<bigint>;
  }

  async getSellPrice(
    sharesSubject: string,
    amount: string | bigint
  ): Promise<bigint> {
    const amt = typeof amount === "string" ? BigInt(amount) : amount;
    return this.publicClient.readContract({
      address: this.address,
      abi: this.abi,
      functionName: "getSellPrice",
      args: [sharesSubject as `0x${string}`, amt],
    }) as Promise<bigint>;
  }

  async getSellPriceAfterFee(
    sharesSubject: string,
    amount: string | bigint
  ): Promise<bigint> {
    const amt = typeof amount === "string" ? BigInt(amount) : amount;
    return this.publicClient.readContract({
      address: this.address,
      abi: this.abi,
      functionName: "getSellPriceAfterFee",
      args: [sharesSubject as `0x${string}`, amt],
    }) as Promise<bigint>;
  }

  private async waitTransaction(txHash: `0x${string}`): Promise<void> {
    await this.publicClient.waitForTransactionReceipt({ hash: txHash });
  }

  async buyShares(params: BuySharesParams): Promise<ResponseTransaction> {
    if (!this.#wallet) throw new Error("Wallet not found");

    const amt =
      typeof params.amount === "string" ? BigInt(params.amount) : params.amount;
    const cost = await this.getBuyPriceAfterFee(params.sharesSubject, amt);

    const { request } = await this.publicClient.simulateContract({
      account: this.#wallet.address,
      abi: this.abi,
      address: this.address,
      functionName: "buyShares",
      args: [params.sharesSubject as `0x${string}`, amt],
      value: cost,
    } as any);

    const hash = await this.#wallet.walletClient.writeContract(request as any);

    return {
      txHash: hash as string,
      wait: () => this.waitTransaction(hash as `0x${string}`),
    };
  }

  async sellShares(params: SellSharesParams): Promise<ResponseTransaction> {
    if (!this.#wallet) throw new Error("Wallet not found");

    const amt =
      typeof params.amount === "string" ? BigInt(params.amount) : params.amount;

    const { request } = await this.publicClient.simulateContract({
      account: this.#wallet.address,
      abi: this.abi,
      address: this.address,
      functionName: "sellShares",
      args: [params.sharesSubject as `0x${string}`, amt],
    });

    const hash = await this.#wallet.walletClient.writeContract(request as any);

    return {
      txHash: hash as string,
      wait: () => this.waitTransaction(hash as `0x${string}`),
    };
  }

  async launch(params: LaunchParams): Promise<ResponseTransaction> {
    if (!this.#wallet) throw new Error("Wallet not found");

    const signature =
      typeof params.signature === "string"
        ? params.signature
        : params.signature;

    const { request } = await this.publicClient.simulateContract({
      account: this.#wallet.address,
      abi: this.abi,
      address: this.address,
      functionName: "launch",
      args: [
        params.sharesSubject as `0x${string}`,
        params.agentName,
        signature as `0x${string}`,
      ],
    });

    const hash = await this.#wallet.walletClient.writeContract(request as any);

    return {
      txHash: hash as string,
      wait: () => this.waitTransaction(hash as `0x${string}`),
    };
  }

  async transferShares(params: TransferSharesParams): Promise<ResponseTransaction> {
    if (!this.#wallet) throw new Error("Wallet not found");

    const amt =
      typeof params.amount === "string" ? BigInt(params.amount) : params.amount;

    const { request } = await this.publicClient.simulateContract({
      account: this.#wallet.address,
      abi: this.abi,
      address: this.address,
      functionName: "transferShares",
      args: [
        params.sharesSubject as `0x${string}`,
        params.to as `0x${string}`,
        amt,
      ],
    });

    const hash = await this.#wallet.walletClient.writeContract(request as any);

    return {
      txHash: hash as string,
      wait: () => this.waitTransaction(hash as `0x${string}`),
    };
  }
}
