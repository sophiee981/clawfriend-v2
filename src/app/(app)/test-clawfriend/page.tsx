"use client";

import { Button } from "@/components/ui/button";
import { chains } from "@/configs/wallet.config";
import { CLAW_FRIEND_CONTRACT_ADDRESS } from "@/constants";
import { ClawFriendContractFactory } from "@/lib/contracts/clawfriend";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "@/utils/toast";
import { getBalanceForChain } from "@/utils/web3";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { formatEther } from "viem";

const contractAddress = CLAW_FRIEND_CONTRACT_ADDRESS ?? "";
export default function TestClawFriendPage() {
  const { wallet, chainId, isConnected } = useAuth();
  const [subjectAddress, setSubjectAddress] = useState("");
  const [amount, setAmount] = useState("1");
  const [loading, setLoading] = useState(false);

  const effectiveChainId = chainId ?? chains[0]?.id ?? "56";

  const factory = useMemo(() => ClawFriendContractFactory.getInstance(), []);

  const { data: bnbBalance } = useQuery({
    queryKey: ["bnbBalance", effectiveChainId, wallet?.address ?? ""],
    queryFn: async () =>
      getBalanceForChain(effectiveChainId, wallet?.address as `0x${string}`),
    enabled: !!wallet?.address,
  });

  const { data: sharesBalance } = useQuery({
    queryKey: [
      "sharesBalance",
      effectiveChainId,
      subjectAddress,
      wallet?.address ?? "",
    ],
    queryFn: async () => {
      const contract = factory.createContract(chainId ?? "56", wallet);
      if (!contract || !subjectAddress || !wallet?.address) return null;
      const balance = await contract.sharesBalance(
        subjectAddress,
        wallet.address
      );
      return balance.toString();
    },
    enabled: !!subjectAddress && !!wallet?.address && !!factory.contractAddress,
  });

  const { data: buyPrice } = useQuery({
    queryKey: ["buyPrice", effectiveChainId, subjectAddress, amount],
    queryFn: async () => {
      const contract = factory.createContract(chainId ?? "56", wallet);
      if (!contract || !subjectAddress) return null;
      const amountBigInt =
        amount && !isNaN(Number(amount)) && Number(amount) > 0
          ? BigInt(amount)
          : BigInt(1);
      const price = await contract.getBuyPriceAfterFee(
        subjectAddress,
        amountBigInt
      );
      return formatEther(price);
    },
    enabled:
      !!subjectAddress &&
      !!factory.contractAddress &&
      (amount ? !isNaN(Number(amount)) && Number(amount) > 0 : true),
  });

  const { data: sellPrice } = useQuery({
    queryKey: ["sellPrice", effectiveChainId, subjectAddress, amount],
    queryFn: async () => {
      const contract = factory.createContract(chainId ?? "56", wallet);
      if (!contract || !subjectAddress) return null;
      const amountBigInt =
        amount && !isNaN(Number(amount)) && Number(amount) > 0
          ? BigInt(amount)
          : BigInt(1);
      const price = await contract.getSellPriceAfterFee(
        subjectAddress,
        amountBigInt
      );
      return formatEther(price);
    },
    enabled:
      !!subjectAddress &&
      !!factory.contractAddress &&
      (amount ? !isNaN(Number(amount)) && Number(amount) > 0 : true),
  });

  const handleBuy = async () => {
    const contract = factory.createContract(chainId ?? "56", wallet);
    if (!contract || !subjectAddress || !amount) {
      toast.error("Subject and amount required");
      return;
    }
    if (!isConnected || !wallet) {
      toast.error("Connect wallet to buy shares");
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.buyShares({
        sharesSubject: subjectAddress,
        amount: amount,
      });
      toast.success(`Tx sent: ${tx.txHash}`);
      await tx.wait();
      toast.success("Tx confirmed");
    } catch (e: any) {
      toast.error(e?.message ?? "Buy failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async () => {
    const contract = factory.createContract(chainId ?? "56", wallet);
    if (!contract || !subjectAddress || !amount) {
      toast.error("Subject and amount required");
      return;
    }
    if (!isConnected || !wallet) {
      toast.error("Connect wallet to sell shares");
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.sellShares({
        sharesSubject: subjectAddress,
        amount: amount,
      });
      toast.success(`Tx sent: ${tx.txHash}`);
      await tx.wait();
      toast.success("Tx confirmed");
    } catch (e: any) {
      toast.error(e?.message ?? "Sell failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">ClawFriend Contract Test</h1>

      <div className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
        <p className="text-body-sm text-neutral-tertiary">
          Wallet: {isConnected ? "Connected" : "Not connected"}
        </p>
        <p className="text-body-sm text-neutral-tertiary">
          Chain: {effectiveChainId} | Contract: {contractAddress?.slice(0, 10)}
          ...
        </p>
        <p className="text-body-sm text-neutral-tertiary">
          Factory contract: {factory.contractAddress ? "Ready" : "Not ready"}
        </p>
        {bnbBalance != null && (
          <p className="text-body-sm text-neutral-tertiary">
            BNB Balance:{" "}
            <span className="font-mono text-neutral-primary">
              {bnbBalance} BNB
            </span>
          </p>
        )}
        {sharesBalance != null && (
          <p className="text-body-sm text-neutral-tertiary">
            Shares Balance:{" "}
            <span className="font-mono text-neutral-primary">
              {sharesBalance}
            </span>
          </p>
        )}
        {buyPrice != null && (
          <p className="text-body-sm text-neutral-tertiary">
            Est. buy ({amount} shares):{" "}
            <span className="font-mono text-neutral-primary">
              {buyPrice} BNB
            </span>
          </p>
        )}
        {sellPrice != null && (
          <p className="text-body-sm text-neutral-tertiary">
            Est. sell ({amount} shares):{" "}
            <span className="font-mono text-neutral-primary">
              {sellPrice} BNB
            </span>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-label-sm text-neutral-primary">
          Subject address (shares subject)
        </label>
        <input
          type="text"
          value={subjectAddress}
          onChange={(e) => setSubjectAddress(e.target.value)}
          placeholder="0x..."
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-body-sm text-neutral-primary placeholder:text-neutral-500 focus:border-primary focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-label-sm text-neutral-primary">
          Amount (shares)
        </label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-body-sm text-neutral-primary placeholder:text-neutral-500 focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="success"
          buttonType="filled"
          size="md"
          onClick={handleBuy}
          disabled={loading || !subjectAddress || !amount || !isConnected}
        >
          Buy shares
        </Button>
        <Button
          variant="danger"
          buttonType="filled"
          size="md"
          onClick={handleSell}
          disabled={loading || !subjectAddress || !amount || !isConnected}
        >
          Sell shares
        </Button>
      </div>
    </div>
  );
}
