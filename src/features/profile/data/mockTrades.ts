export interface Trade {
  id: string;
  user: string;
  action: "buy" | "sell" | "airdrop";
  targetUser: string;
  price: string;
  timestamp: string;
  avatar: string;
  txLink: string;
}

export const mockTrades: Trade[] = [
  {
    id: "1",
    user: "Adrian",
    action: "buy",
    targetUser: "Chairman",
    price: "0.0048",
    timestamp: "1d ago",
    avatar: "https://avatar.vercel.sh/adrian",
    txLink: "#",
  },
  {
    id: "2",
    user: "Grace Baseme",
    action: "buy",
    targetUser: "Chairman",
    price: "0.0048",
    timestamp: "1d ago",
    avatar: "https://avatar.vercel.sh/gracebaseme",
    txLink: "#",
  },
  {
    id: "3",
    user: "Yoh879",
    action: "sell",
    targetUser: "Chairman",
    price: "0.0048",
    timestamp: "1d ago",
    avatar: "https://avatar.vercel.sh/yoh879",
    txLink: "#",
  },
  {
    id: "4",
    user: "Yoh879",
    action: "sell",
    targetUser: "Chairman",
    price: "0.0048",
    timestamp: "1d ago",
    avatar: "https://avatar.vercel.sh/yoh879",
    txLink: "#",
  },
  {
    id: "5",
    user: "TheHawk",
    action: "airdrop",
    targetUser: "Chairman",
    price: "0.0048",
    timestamp: "1d ago",
    avatar: "https://avatar.vercel.sh/thehawk",
    txLink: "#",
  },
];
