export interface Post {
    id: string;
    author: {
        name: string;
        username: string;
        avatar: string;
        isVerified: boolean;
    };
    price: string;
    timestamp: string;
    content: string;
    image?: string;
    stats: {
        comments: number;
        reposts: number;
        likes: number;
    };
}

export const mockPosts: Post[] = [
    {
        id: "1",
        author: {
            name: "Finish",
            username: "@0xFinish",
            avatar: "https://i.pravatar.cc/150?img=1",
            isVerified: true,
        },
        price: "0.0048",
        timestamp: "2m",
        content: `The most active VC is finally awake 🔥
@a16zcrypto is betting huge and you don't want to miss it!
Let's explore the huge move 🧵👇`,
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
        stats: {
            comments: 24,
            reposts: 5,
            likes: 8,
        },
    },
    {
        id: "2",
        author: {
            name: "Finish",
            username: "@0xFinish",
            avatar: "https://i.pravatar.cc/150?img=1",
            isVerified: true,
        },
        price: "0.0048",
        timestamp: "2m",
        content:
            "The top 100 members of Congress are getting richer 3,090.18% faster than the average US Citizen.",
        stats: {
            comments: 24,
            reposts: 5,
            likes: 8,
        },
    },
    {
        id: "3",
        author: {
            name: "Chairman",
            username: "@WSBChairman",
            avatar: "https://i.pravatar.cc/150?img=3",
            isVerified: true,
        },
        price: "0.0048",
        timestamp: "2m",
        content:
            "The top 100 members of Congress are getting richer 3,090.18% faster than the average US Citizen.",
        stats: {
            comments: 24,
            reposts: 5,
            likes: 8,
        },
    },
    {
        id: "4",
        author: {
            name: "CryptoWhale",
            username: "@CryptoWhale",
            avatar: "https://i.pravatar.cc/150?img=5",
            isVerified: true,
        },
        price: "0.0125",
        timestamp: "5m",
        content: `Just discovered an incredible DeFi protocol that's about to change everything 🚀
This is not financial advice, but you might want to check this out!`,
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
        stats: {
            comments: 42,
            reposts: 18,
            likes: 156,
        },
    },
    {
        id: "5",
        author: {
            name: "NFT Collector",
            username: "@NFTCollector",
            avatar: "https://i.pravatar.cc/150?img=7",
            isVerified: false,
        },
        price: "0.0089",
        timestamp: "15m",
        content:
            "The NFT market is heating up again! Just saw some incredible pieces drop today. The art community is thriving! 🎨",
        stats: {
            comments: 12,
            reposts: 3,
            likes: 45,
        },
    },
    {
        id: "6",
        author: {
            name: "Web3 Builder",
            username: "@Web3Builder",
            avatar: "https://i.pravatar.cc/150?img=9",
            isVerified: true,
        },
        price: "0.0234",
        timestamp: "1h",
        content: `Building in public is the best way to grow 💪
Here's what I learned after 6 months of shipping web3 products:
1. Community first
2. Ship fast, iterate faster
3. Listen to your users`,
        stats: {
            comments: 67,
            reposts: 34,
            likes: 289,
        },
    },
    {
        id: "7",
        author: {
            name: "DeFi Degen",
            username: "@DeFiDegen",
            avatar: "https://i.pravatar.cc/150?img=11",
            isVerified: true,
        },
        price: "0.0156",
        timestamp: "2h",
        content:
            "APY farming strategies for 2026 📊\nDon't sleep on these protocols. DYOR as always!",
        image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=600&fit=crop",
        stats: {
            comments: 89,
            reposts: 45,
            likes: 234,
        },
    },
    {
        id: "8",
        author: {
            name: "Crypto News",
            username: "@CryptoNews",
            avatar: "https://i.pravatar.cc/150?img=13",
            isVerified: true,
        },
        price: "0.0067",
        timestamp: "3h",
        content:
            "BREAKING: Major exchange announces support for new layer 2 solution. This could be huge for scalability! 🔥",
        stats: {
            comments: 156,
            reposts: 89,
            likes: 567,
        },
    },
    {
        id: "9",
        author: {
            name: "Blockchain Dev",
            username: "@BlockchainDev",
            avatar: "https://i.pravatar.cc/150?img=15",
            isVerified: true,
        },
        price: "0.0198",
        timestamp: "4h",
        content: `New smart contract audit tools are game changers! 🛡️
Just saved our team 2 weeks of manual review.
Security should always be the top priority in web3.`,
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
        stats: {
            comments: 45,
            reposts: 23,
            likes: 178,
        },
    },
    {
        id: "10",
        author: {
            name: "Metaverse Explorer",
            username: "@MetaverseExplorer",
            avatar: "https://i.pravatar.cc/150?img=17",
            isVerified: false,
        },
        price: "0.0045",
        timestamp: "5h",
        content:
            "Virtual real estate prices are stabilizing. Now might be the perfect time to invest in prime metaverse locations 🏗️",
        stats: {
            comments: 34,
            reposts: 12,
            likes: 89,
        },
    },
    {
        id: "11",
        author: {
            name: "DAO Governance",
            username: "@DAOGovernance",
            avatar: "https://i.pravatar.cc/150?img=19",
            isVerified: true,
        },
        price: "0.0312",
        timestamp: "6h",
        content: `Proposal #42 is now live for voting! 🗳️
This could reshape how we handle treasury management.
Every vote counts - make your voice heard!`,
        image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop",
        stats: {
            comments: 203,
            reposts: 156,
            likes: 892,
        },
    },
    {
        id: "12",
        author: {
            name: "Token Analyst",
            username: "@TokenAnalyst",
            avatar: "https://i.pravatar.cc/150?img=21",
            isVerified: true,
        },
        price: "0.0278",
        timestamp: "8h",
        content: `Market analysis thread 🧵
1. Bitcoin dominance at 52%
2. Alt season indicators showing strength
3. On-chain metrics looking bullish
Full breakdown below 👇`,
        stats: {
            comments: 178,
            reposts: 234,
            likes: 1203,
        },
    },
    {
        id: "13",
        author: {
            name: "GameFi Hunter",
            username: "@GameFiHunter",
            avatar: "https://i.pravatar.cc/150?img=23",
            isVerified: false,
        },
        price: "0.0089",
        timestamp: "10h",
        content: `Just tried the new play-to-earn game and WOW! 🎮
Graphics are insane, gameplay is smooth, and the tokenomics actually make sense.
This is what web3 gaming should be!`,
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop",
        stats: {
            comments: 67,
            reposts: 45,
            likes: 234,
        },
    },
];
