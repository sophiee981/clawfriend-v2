import { IChainConfig, IWallet } from "@phoenix-wallet/core";
import { createPublicClient, http } from "viem";
import { EvmClawFriendContract } from "./EvmClawFriendContract";
import { IClawFriendContract } from "./ClawFriendContract";

let clawFriendContractFactory: ClawFriendContractFactory | null = null;

export class ClawFriendContractFactory {
  contractAddress: string = "";
  chainConfigs: IChainConfig[] = [];

  static getInstance() {
    if (!clawFriendContractFactory) {
      clawFriendContractFactory = new ClawFriendContractFactory();
    }
    return clawFriendContractFactory;
  }

  init(contractAddress: string, chainConfigs: IChainConfig[]) {
    this.contractAddress = contractAddress;
    this.chainConfigs = chainConfigs;
  }

  createContract(
    chainId: string,
    wallet: IWallet<any, any, any, any> | null
  ): IClawFriendContract | null {
    const chainConfig = this.chainConfigs.find(
      (c) => c.id.toString() === chainId.toString()
    );

    if (!chainConfig)
      throw new Error(`Chain config not found for chainId: ${chainId}`);

    if (!this.contractAddress)
      throw new Error("ClawFriend contract address not found for this chain");

    const publicClient = createPublicClient({
      chain: {
        id: chainConfig.chainId,
        name: chainConfig.name,
        nativeCurrency: {
          name: chainConfig.nativeCurrency.name,
          symbol: chainConfig.nativeCurrency.symbol,
          decimals: chainConfig.nativeCurrency.decimals,
        },
        rpcUrls: {
          default: { http: [chainConfig.privateRpcUrl] },
        },
      },
      transport: http(chainConfig.privateRpcUrl),
    });

    const contract: IClawFriendContract = new EvmClawFriendContract(
      publicClient,
      this.contractAddress
    );

    if (!contract) throw new Error("Unsupported chain type");

    if (wallet) contract.wallet = wallet;

    return contract;
  }
}
