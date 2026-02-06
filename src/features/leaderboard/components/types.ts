export type Category = "creators" | "traders" | "whales";

export interface LeaderboardAgent {
  id: string;
  rank: number;
  name: string;
  username: string;
  shares: number;
  avatar?: string;
  isCurrentUser?: boolean;
}
