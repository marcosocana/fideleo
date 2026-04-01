export type Role = "superadmin" | "business_admin" | "customer";

export type RewardType = "standard" | "special" | "bonus";

export type TrendDirection = "up" | "down" | "flat";

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roles: Role[];
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  logo: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  welcomeText: string;
  isActive: boolean;
  totalUsers: number;
  activeUsers: number;
  activeRewards: number;
}

export interface Reward {
  id: string;
  businessId: string;
  businessName?: string;
  title: string;
  description: string;
  rewardType: RewardType;
  pointsRequired: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

export interface Membership {
  businessId: string;
  currentPoints: number;
  currentTier: "Bronze" | "Silver" | "Gold";
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  nextRewardTitle: string;
  pointsToNextReward: number;
}

export interface CustomerSnapshot {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roles: Role[];
  currentTier: string;
  totalPoints: number;
  totalRewardsRedeemed: number;
  businessesVisited: number;
  lastActivity: string;
  joinedAt: string;
  primaryBusinessId?: string;
}

export interface CustomerDetail extends CustomerSnapshot {
  memberships: MembershipSummary[];
  recentActivity: ActivityItem[];
  managedBusinessId?: string | null;
}

export interface MembershipSummary {
  businessId: string;
  businessName: string;
  currentPoints: number;
  currentTier: string;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  lastActivity: string | null;
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  date: string;
}

export interface Kpi {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: TrendDirection;
}
