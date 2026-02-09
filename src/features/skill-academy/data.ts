export type AcademyItemType = "skill" | "prompt";

export interface AcademyItem {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
  };
  type: AcademyItemType;
  tags: string[];
  likes: number;
  uses: number;
  createdAt: string;
}

export const MOCK_SKILLS: AcademyItem[] = [
  {
    id: "1",
    title: "Auto-reply to Crypto Influencers",
    description:
      "Automatically replies to top crypto influencers with relevant market sentiment analysis.",
    author: {
      name: "CryptoWhale",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoWhale",
      handle: "@cryptowhale",
    },
    type: "skill",
    tags: ["Comment", "Market Analysis", "Auto-Reply"],
    likes: 1240,
    uses: 543,
    createdAt: "2024-02-10T10:00:00Z",
  },
  {
    id: "2",
    title: "Sniper Bot Strategy",
    description:
      "A high-frequency trading strategy for new token launches on DEXs.",
    author: {
      name: "AlphaHunter",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlphaHunter",
      handle: "@alpha_hunter",
    },
    type: "skill",
    tags: ["Buy/Sell", "Trading", "High Risk"],
    likes: 89,
    uses: 12,
    createdAt: "2024-02-09T14:30:00Z",
  },
  {
    id: "3",
    title: "Daily GM/GN Poster",
    description:
      "Schedules GM and GN posts with random inspirational quotes and images.",
    author: {
      name: "CommunityMgr",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CommunityMgr",
      handle: "@comm_mgr",
    },
    type: "skill",
    tags: ["Post", "Engagement", "Lifestyle"],
    likes: 450,
    uses: 1200,
    createdAt: "2024-02-08T09:15:00Z",
  },
];

export const MOCK_PROMPTS: AcademyItem[] = [
  {
    id: "101",
    title: "Crypto Market Analyst Persona",
    description:
      "A prompt that makes your bot act like a seasoned specialized crypto market analyst.",
    author: {
      name: "SatoshiFan",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SatoshiFan",
      handle: "@satoshi_fan",
    },
    type: "prompt",
    tags: ["Persona", "Analysis"],
    likes: 2300,
    uses: 890,
    createdAt: "2024-02-10T11:00:00Z",
  },
  {
    id: "102",
    title: "Maximize Engagement Tone",
    description:
      "Rewrites your tweets to be more engaging, using questions and controversial hooks.",
    author: {
      name: "GrowthGuru",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GrowthGuru",
      handle: "@growth_guru",
    },
    type: "prompt",
    tags: ["Writing Style", "Engagement"],
    likes: 765,
    uses: 340,
    createdAt: "2024-02-09T16:45:00Z",
  },
  {
    id: "103",
    title: "Degen Slang Translator",
    description:
      "Translates normal English into crypto-twitter native slang (WAGMI, LFG, etc.).",
    author: {
      name: "DegenKing",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DegenKing",
      handle: "@degen_king",
    },
    type: "prompt",
    tags: ["Translation", "Humor"],
    likes: 567,
    uses: 123,
    createdAt: "2024-02-07T08:20:00Z",
  },
];
