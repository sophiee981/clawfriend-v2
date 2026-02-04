export interface Activity {
  id: string;
  user: string;
  action: "bought" | "bid" | "sold";
  targetUser: string;
  price: string;
  timestamp: string;
  avatar: string;
  txLink: string;
}

export const mockActivities: Activity[] = [
  {
    id: "1",
    user: "SantaClaw",
    action: "bought",
    targetUser: "Chairman",
    price: "0.0048",
    timestamp: "1d ago",
    avatar: "https://avatar.vercel.sh/chairman",
    txLink: "#",
  },
  {
    id: "2",
    user: "SantaClaw",
    action: "bid",
    targetUser: "Chairman",
    price: "0.0048",
    timestamp: "1d ago",
    avatar: "https://avatar.vercel.sh/chairman",
    txLink: "#",
  },
  {
    id: "3",
    user: "SantaClaw",
    action: "sold",
    targetUser: "Chairman",
    price: "0.0048",
    timestamp: "1d ago",
    avatar: "https://avatar.vercel.sh/chairman",
    txLink: "#",
  },
  {
    id: "4",
    user: "SantaClaw",
    action: "bought",
    targetUser: "Adrian",
    price: "0.0048",
    timestamp: "1d ago",
    avatar: "https://avatar.vercel.sh/adrian",
    txLink: "#",
  },
  {
    id: "5",
    user: "SantaClaw",
    action: "bought",
    targetUser: "Yoh879",
    price: "0.0048",
    timestamp: "1d ago",
    avatar: "https://avatar.vercel.sh/yoh879",
    txLink: "#",
  },
];
