import { EvmContract } from "@phoenix-wallet/evm";
import { PublicClient } from "viem";
import { CLAW_FRIEND_ABI } from "../abis/claw-friend-abi";
import {
  BuySharesParams,
  IClawFriendContract,
  LaunchParams,
  ResponseTransaction,
  SellSharesParams,
} from "./ClawFriendContract";

export class EvmClawFriendContract
  extends EvmContract
  implements IClawFriendContract
{
  constructor(publicClient: PublicClient, address: string) {
    super(publicClient, address, CLAW_FRIEND_ABI);
  }

  getAddress(): string {
    return this.address;
  }

  // Read functions
  async sharesSupply(sharesSubject: string): Promise<bigint> {
    return this.contract.read.sharesSupply([sharesSubject as `0x${string}`]);
  }

  async sharesBalance(
    sharesSubject: string,
    owner: string
  ): Promise<bigint> {
    return this.contract.read.sharesBalance([
      sharesSubject as `0x${string}`,
      owner as `0x${string}`,
    ]);
  }

  async getBuyPrice(
    sharesSubject: string,
    amount: string | bigint
  ): Promise<bigint> {
    const amt = typeof amount === "string" ? BigInt(amount) : amount;
    return this.contract.read.getBuyPrice([sharesSubject as `0x${string}`, amt]);
  }

  async getBuyPriceAfterFee(
    sharesSubject: string,
    amount: string | bigint
  ): Promise<bigint> {
    const amt = typeof amount === "string" ? BigInt(amount) : amount;
    return this.contract.read.getBuyPriceAfterFee([
      sharesSubject as `0x${string}`,
      amt,
    ]);
  }

  async getSellPrice(
    sharesSubject: string,
    amount: string | bigint
  ): Promise<bigint> {
    const amt = typeof amount === "string" ? BigInt(amount) : amount;
    return this.contract.read.getSellPrice([sharesSubject as `0x${string}`, amt]);
  }

  async getSellPriceAfterFee(
    sharesSubject: string,
    amount: string | bigint
  ): Promise<bigint> {
    const amt = typeof amount === "string" ? BigInt(amount) : amount;
    return this.contract.read.getSellPriceAfterFee([
      sharesSubject as `0x${string}`,
      amt,
    ]);
  }

  // Write functions
  async buyShares(params: BuySharesParams): Promise<ResponseTransaction> {
    if (!this.wallet) {
      throw new Error("Wallet not found");
    }

    const amt =
      typeof params.amount === "string" ? BigInt(params.amount) : params.amount;
    const cost = await this.getBuyPriceAfterFee(params.sharesSubject, amt);

    const { request } = await this.publicClient.simulateContract({
      account: this.wallet.address as `0x${string}`,
      abi: this.abi,
      address: this.address as `0x${string}`,
      functionName: "buyShares",
      args: [params.sharesSubject as `0x${string}`, amt],
      value: cost,
    });

    const txHash = await this.wallet.walletClient.writeContract(request);

    return {
      txHash,
      wait: async () => {
        return this.waitTransaction(txHash);
      },
    };
  }

  async sellShares(params: SellSharesParams): Promise<ResponseTransaction> {
    if (!this.wallet) {
      throw new Error("Wallet not found");
    }

    const amt =
      typeof params.amount === "string" ? BigInt(params.amount) : params.amount;

    const { request } = await this.publicClient.simulateContract({
      account: this.wallet.address as `0x${string}`,
      abi: this.abi,
      address: this.address as `0x${string}`,
      functionName: "sellShares",
      args: [params.sharesSubject as `0x${string}`, amt],
    });

    const txHash = await this.wallet.walletClient.writeContract(request);

    return {
      txHash,
      wait: async () => {
        return this.waitTransaction(txHash);
      },
    };
  }

  async launch(params: LaunchParams): Promise<ResponseTransaction> {
    if (!this.wallet) {
      throw new Error("Wallet not found");
    }

    const signature =
      typeof params.signature === "string"
        ? params.signature
        : params.signature;

    const { request } = await this.publicClient.simulateContract({
      account: this.wallet.address as `0x${string}`,
      abi: this.abi,
      address: this.address as `0x${string}`,
      functionName: "launch",
      args: [
        params.sharesSubject as `0x${string}`,
        params.agentName,
        signature as `0x${string}`,
      ],
    });

    const txHash = await this.wallet.walletClient.writeContract(request);

    return {
      txHash,
      wait: async () => {
        return this.waitTransaction(txHash);
      },
    };
  }
}
