import type { Business, CustomerSnapshot, Kpi, Membership, Profile, Reward } from "@/lib/types/domain";

export const viewer: Profile = {
  id: "user-superadmin-1",
  firstName: "Marcos",
  lastName: "Ocaña",
  email: "admin@laprospect.com",
  roles: ["superadmin"]
};

export const businesses: Business[] = [
  {
    id: "biz-casa-luma",
    name: "Casa Luma",
    slug: "casa-luma",
    logo: "CL",
    ownerName: "Lucia Romero",
    ownerEmail: "lucia@casaluma.com",
    primaryColor: "#163B33",
    secondaryColor: "#F7F2E8",
    accentColor: "#C8873F",
    fontFamily: "Inter",
    welcomeText: "Tu club de fidelización para cenas memorables.",
    isActive: true,
    totalUsers: 1240,
    activeUsers: 874,
    activeRewards: 6
  },
  {
    id: "biz-brasa-norte",
    name: "Brasa Norte",
    slug: "brasa-norte",
    logo: "BN",
    ownerName: "Jorge Vidal",
    ownerEmail: "jorge@brasanorte.com",
    primaryColor: "#23211F",
    secondaryColor: "#F6F1EA",
    accentColor: "#C55A11",
    fontFamily: "Inter",
    welcomeText: "Puntos, premios y experiencias para clientes recurrentes.",
    isActive: true,
    totalUsers: 890,
    activeUsers: 512,
    activeRewards: 4
  }
];

export const superadminKpis: Kpi[] = [
  { label: "Negocios activos", value: "2", trend: "+1 este mes", trendDirection: "up" },
  { label: "Usuarios totales", value: "2.130", trend: "+12.4%", trendDirection: "up" },
  { label: "Canjes realizados", value: "386", trend: "+8.2%", trendDirection: "up" },
  { label: "Puntos emitidos", value: "14.280", trend: "Abril", trendDirection: "flat" }
];

export const businessKpis: Kpi[] = [
  { label: "Usuarios registrados", value: "1.240", trend: "+64 este mes", trendDirection: "up" },
  { label: "Usuarios activos", value: "874", trend: "+7.1%", trendDirection: "up" },
  { label: "Puntos emitidos", value: "8.920", trend: "Últimos 30 días", trendDirection: "flat" },
  { label: "Premio top", value: "Postre gratis", trend: "89 canjes", trendDirection: "up" }
];

export const customers: CustomerSnapshot[] = [
  {
    id: "cus-1",
    firstName: "Ana",
    lastName: "Ruiz",
    email: "ana@correo.com",
    phone: "+34 600 111 222",
    roles: ["customer"],
    currentTier: "Gold",
    totalPoints: 148,
    totalRewardsRedeemed: 8,
    businessesVisited: 2,
    lastActivity: "2026-03-28",
    joinedAt: "2025-09-14"
  },
  {
    id: "cus-2",
    firstName: "Pablo",
    lastName: "Soto",
    email: "pablo@correo.com",
    phone: "+34 600 333 444",
    roles: ["customer"],
    currentTier: "Silver",
    totalPoints: 62,
    totalRewardsRedeemed: 3,
    businessesVisited: 1,
    lastActivity: "2026-03-26",
    joinedAt: "2025-11-04"
  },
  {
    id: "cus-3",
    firstName: "Ines",
    lastName: "Mora",
    email: "ines@correo.com",
    phone: "+34 600 555 666",
    roles: ["customer"],
    currentTier: "Bronze",
    totalPoints: 24,
    totalRewardsRedeemed: 1,
    businessesVisited: 1,
    lastActivity: "2026-03-30",
    joinedAt: "2026-01-19"
  }
];

export const rewards: Reward[] = [
  {
    id: "rew-1",
    businessId: "biz-casa-luma",
    title: "Copa de bienvenida",
    description: "Una copa de vino de la casa en tu próxima visita.",
    rewardType: "standard",
    pointsRequired: 20,
    startsAt: "2026-01-01",
    endsAt: "2026-12-31",
    isActive: true
  },
  {
    id: "rew-2",
    businessId: "biz-casa-luma",
    title: "Postre artesanal",
    description: "Elige uno de los postres del menú degustación.",
    rewardType: "special",
    pointsRequired: 45,
    startsAt: "2026-01-01",
    endsAt: "2026-12-31",
    isActive: true
  },
  {
    id: "rew-3",
    businessId: "biz-brasa-norte",
    title: "Upgrade a menú premium",
    description: "Mejora tu menú con una selección premium.",
    rewardType: "bonus",
    pointsRequired: 60,
    startsAt: "2026-01-01",
    endsAt: "2026-12-31",
    isActive: true
  }
];

export const customerMembership: Membership = {
  businessId: "biz-casa-luma",
  currentPoints: 38,
  currentTier: "Silver",
  totalPointsEarned: 142,
  totalPointsRedeemed: 104,
  nextRewardTitle: "Postre artesanal",
  pointsToNextReward: 7
};

export const activityTimeline = [
  { title: "Canje realizado", detail: "Postre artesanal entregado", date: "2026-03-28" },
  { title: "Puntos añadidos", detail: "+6 puntos por ticket de 62€", date: "2026-03-28" },
  { title: "Misión completada", detail: "2 visitas esta semana", date: "2026-03-21" }
];
