export interface TrendingProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isVerified: boolean;
  followers: string;
  price: string;
  volume: string;
}

export const mockProfiles: TrendingProfile[] = [
  {
    id: "1",
    name: "fan.tech",
    username: "@joinfantech",
    avatar: "https://avatar.vercel.sh/fantech",
    isVerified: false,
    followers: "5.1K",
    price: "0.0048",
    volume: "431.9K",
  },
  {
    id: "2",
    name: "Defi_Maestro ✺",
    username: "@Defi_Maestro",
    avatar: "https://avatar.vercel.sh/defimaestro",
    isVerified: true,
    followers: "46.8K",
    price: "0.0048",
    volume: "325.6K",
  },
  {
    id: "3",
    name: "Herro",
    username: "@HerroCrypto",
    avatar: "https://avatar.vercel.sh/herro",
    isVerified: false,
    followers: "84K",
    price: "0.0048",
    volume: "105.5K",
  },
  {
    id: "4",
    name: "🉐 Crypto Linn",
    username: "@crypto_linn",
    avatar: "https://avatar.vercel.sh/cryptolinn",
    isVerified: false,
    followers: "46.2K",
    price: "0.0048",
    volume: "71.2K",
  },
  {
    id: "5",
    name: "Jordi Alexander",
    username: "@gametheorizing",
    avatar: "https://avatar.vercel.sh/jordi",
    isVerified: true,
    followers: "84.7K",
    price: "0.0048",
    volume: "57.3K",
  },
  {
    id: "6",
    name: "Dr. B",
    username: "@fantechceo",
    avatar: "https://avatar.vercel.sh/drb",
    isVerified: false,
    followers: "1,324",
    price: "0.0048",
    volume: "54.2K",
  },
  {
    id: "7",
    name: "Chairman",
    username: "@WSBChairman",
    avatar: "https://avatar.vercel.sh/chairman",
    isVerified: true,
    followers: "32.4K",
    price: "0.0048",
    volume: "45.6K",
  },
  {
    id: "8",
    name: "Gracie Hartie ONLYF",
    username: "@graciehartie",
    avatar: "https://avatar.vercel.sh/gracie",
    isVerified: true,
    followers: "92.6K",
    price: "0.0048",
    volume: "49.3K",
  },
  {
    id: "9",
    name: "andrew",
    username: "@andrewpixelrd",
    avatar: "https://avatar.vercel.sh/andrew",
    isVerified: false,
    followers: "9k",
    price: "0.0048",
    volume: "42.4K",
  },
  {
    id: "10",
    name: "Ignas | DeFi Research",
    username: "@DefiIgnas",
    avatar: "https://avatar.vercel.sh/ignas",
    isVerified: true,
    followers: "66.5K",
    price: "0.0048",
    volume: "36.6K",
  },
];
