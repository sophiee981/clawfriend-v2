export type AcademyItemType = "skill" | "prompt";

export interface AcademyItem {
  id: string;
  title: string;
  description: string;
  content: string; // The full prompt or skill config JSON
  author: {
    name: string;
    avatar: string;
    handle: string;
  };
  type: AcademyItemType;
  tags: string[];
  likes: number;
  uses: number;
  is_liked: boolean;
  createdAt: string;
}

export const MOCK_SKILLS: AcademyItem[] = [
  {
    id: "1",
    title: "Auto-reply to Crypto Influencers",
    description:
      "Automatically replies to top crypto influencers with relevant market sentiment analysis.",
    content: `{
  "name": "Auto-reply to Crypto Influencers",
  "trigger": "new_tweet_from_list",
  "list_id": "crypto-influencers",
  "action": "reply",
  "model": "gpt-4",
  "prompt_template": "Analyze the sentiment of this tweet: {{tweet.text}}. Draft a helpful and insightful reply that adds value to the conversation. Keep it under 280 characters."
}`,
    author: {
      name: "CryptoWhale",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoWhale",
      handle: "@cryptowhale",
    },
    type: "skill",
    tags: ["Comment", "Market Analysis", "Auto-Reply"],
    likes: 1240,
    uses: 543,
    is_liked: false,
    createdAt: "2024-02-10T10:00:00Z",
  },
  {
    id: "2",
    title: "Sniper Bot Strategy",
    description:
      "A high-frequency trading strategy for new token launches on DEXs.",
    content: `{
  "strategy": "sniper",
  "dex": "uniswap_v3",
  "max_slippage": 0.5,
  "gas_limit": 500000,
  "buy_amount_eth": 0.1,
  "stop_loss": 0.1,
  "take_profit": 2.0
}`,
    author: {
      name: "AlphaHunter",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlphaHunter",
      handle: "@alpha_hunter",
    },
    type: "skill",
    tags: ["Buy/Sell", "Trading", "High Risk"],
    likes: 89,
    uses: 12,
    is_liked: false,
    createdAt: "2024-02-09T14:30:00Z",
  },
  {
    id: "3",
    title: "Daily GM/GN Poster",
    description:
      "Schedules GM and GN posts with random inspirational quotes and images.",
    content: `{
  "schedule": ["08:00 UTC", "22:00 UTC"],
  "tasks": [
    { "time": "08:00 UTC", "action": "post_tweet", "template": "GM! {{quote}}" },
    { "time": "22:00 UTC", "action": "post_tweet", "template": "GN! Rest well. {{image}}" }
  ]
}`,
    author: {
      name: "CommunityMgr",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CommunityMgr",
      handle: "@comm_mgr",
    },
    type: "skill",
    tags: ["Post", "Engagement", "Lifestyle"],
    likes: 450,
    uses: 1200,
    is_liked: false,
    createdAt: "2024-02-08T09:15:00Z",
  },
];

export const MOCK_PROMPTS: AcademyItem[] = [
  {
    id: "101",
    title: "Crypto Market Analyst Persona",
    description:
      "A prompt that makes your bot act like a seasoned specialized crypto market analyst.",
    content:
      "You are an expert crypto market analyst with 10 years of experience. You analyze market trends using technical analysis (RSI, MACD, Bollinger Bands) and fundamental analysis. Your tone is professional, objective, and insightful. Always cite your sources or reasoning. When asked about a token, provide a balanced view of risks and opportunities.",
    author: {
      name: "SatoshiFan",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SatoshiFan",
      handle: "@satoshi_fan",
    },
    type: "prompt",
    tags: ["Persona", "Analysis"],
    likes: 2300,
    uses: 890,
    is_liked: false,
    createdAt: "2024-02-10T11:00:00Z",
  },
  {
    id: "102",
    title: "Maximize Engagement Tone",
    description:
      "Rewrites your tweets to be more engaging, using questions and controversial hooks.",
    content:
      "Rewrite the following text to maximize engagement on Twitter. Use short sentences, line breaks for readability, and a strong hook at the beginning. Include a call to action or a question at the end to encourage replies. Use 1-2 relevant emojis but don't overdo it. The tone should be provocative but not offensive.",
    author: {
      name: "GrowthGuru",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GrowthGuru",
      handle: "@growth_guru",
    },
    type: "prompt",
    tags: ["Writing Style", "Engagement"],
    likes: 765,
    uses: 340,
    is_liked: false,
    createdAt: "2024-02-09T16:45:00Z",
  },
  {
    id: "103",
    title: "Degen Slang Translator",
    description:
      "Translates normal English into crypto-twitter native slang (WAGMI, LFG, etc.).",
    content:
      "Translate the user's input into 'Crypto Twitter Degen' slang. Use terms like WAGMI, LFG, NGMI, ser, fren, bagholder, moon, rekt, etc. appropriately. Keep it humorous and slightly chaotic. If the input is formal, make it completely informal and slang-heavy.",
    author: {
      name: "DegenKing",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DegenKing",
      handle: "@degen_king",
    },
    type: "prompt",
    tags: ["Translation", "Humor"],
    likes: 567,
    uses: 123,
    is_liked: false,
    createdAt: "2024-02-07T08:20:00Z",
  },
];
