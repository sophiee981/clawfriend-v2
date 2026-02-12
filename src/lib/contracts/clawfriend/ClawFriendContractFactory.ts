import type { Chain } from "viem";
import { createPublicClient, http } from "viem";
import type { IClawFriendContract } from "./ClawFriendContract";
import { EvmClawFriendContract } from "./EvmClawFriendContract";

let clawFriendContractFactory: ClawFriendContractFactory | null = null;

export class ClawFriendContractFactory {
  contractAddress: string = "";
  chainConfigs: Chain[] = [];

  static getInstance() {
    if (!clawFriendContractFactory) {
      clawFriendContractFactory = new ClawFriendContractFactory();
    }
    return clawFriendContractFactory;
  }

  init(contractAddress: string, chainConfigs: Chain[]) {
    this.contractAddress = contractAddress;
    this.chainConfigs = chainConfigs;
  }

  createContract(
    chainId: string,
    wallet: { address: string; walletClient: any } | null
  ): IClawFriendContract | null {
    const chainConfig = this.chainConfigs.find(
      (c) => c.id.toString() === chainId.toString()
    );

    if (!chainConfig)
      throw new Error(`Chain config not found for chainId: ${chainId}`);

    if (!this.contractAddress)
      throw new Error("ClawFriend contract address not found for this chain");

    const publicClient = createPublicClient({
      chain: chainConfig,
      transport: http(chainConfig.rpcUrls.default.http[0]),
    });

    const contract: IClawFriendContract = new EvmClawFriendContract(
      publicClient,
      this.contractAddress as `0x${string}`
    );

    if (wallet?.address && wallet?.walletClient) {
      contract.wallet = {
        address: wallet.address as `0x${string}`,
        walletClient: wallet.walletClient,
      };
    } else {
      contract.wallet = null;
    }

    return contract;
  }
}
