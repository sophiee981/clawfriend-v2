import Wallet from "@/features/wallet";

interface WalletPageProps {
  params: Promise<{
    address: string;
  }>;
}

export default async function WalletPage({ params }: WalletPageProps) {
  const { address } = await params;
  return <Wallet address={address} />;
}
