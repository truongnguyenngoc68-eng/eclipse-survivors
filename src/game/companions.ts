export type PetId = "dragon" | "fox" | "turtle" | "slime" | "owl" | "rabbit";
export type EvolutionStage = 0 | 1 | 2 | 3;

export interface PetEvolutionForm {
  stage: EvolutionStage;
  reqLevel: number;
  shardCost: number;
  goldCost: number;
  name: string;
  title: string;
  portraitUrl: string;
  spriteUrl: string;
  powerMult: number;
  radiusBonus: number;
  scale: number;
  formSkillDesc: string;
}

export interface PetDefinition {
  id: PetId;
  lineageName: string;
  role: string;
  element: string;
  color: string;
  accentGlow: string;
  skill: string;
  comboPartner: PetId;
  comboName: string;
  combo: string;
  cost: number;
  cooldown: number;
  baseRadius: number;
  forms: [
    PetEvolutionForm,
    PetEvolutionForm,
    PetEvolutionForm,
    PetEvolutionForm,
  ];
}

export const EVOLUTION_MILESTONES: ReadonlyArray<{
  stage: EvolutionStage;
  reqLevel: number;
  label: string;
}> = [
  { stage: 0, reqLevel: 1, label: "Dạng Khởi Nguyên" },
  { stage: 1, reqLevel: 5, label: "Tiến Hóa I (Cấp 5)" },
  { stage: 2, reqLevel: 10, label: "Tiến Hóa II (Cấp 10)" },
  { stage: 3, reqLevel: 20, label: "Tiến Hóa III Thần Thoại (Cấp 20)" },
];

export const PETS: PetDefinition[] = [
  {
    id: "dragon",
    lineageName: "Huyết Mạch Hỏa Long",
    role: "Sát Thương Chủ Lực / Hỏa Pháp AOE",
    element: "Hỏa",
    color: "#ff7849",
    accentGlow: "#fbbf24",
    skill:
      "Phóng Bão Lửa & Thiên Thạch dung nham thiêu đốt diện rộng theo giây.",
    comboPartner: "fox",
    comboName: "Bộc Phá Băng Hỏa",
    combo:
      "Phối hợp Băng Lang: Kích nổ Hơi Nước Siêu Nhiệt, +45% sát thương lên mục tiêu Đóng Băng!",
    cost: 0,
    cooldown: 3.6,
    baseRadius: 155,
    forms: [
      {
        stage: 0,
        reqLevel: 1,
        shardCost: 0,
        goldCost: 0,
        name: "Ignis • Hỏa Tinh Linh",
        title: "Dạng Khởi Nguyên",
        portraitUrl: "/assets/beasts/dragon_p0.webp",
        spriteUrl: "/assets/beasts/dragon_u0.png",
        powerMult: 1.0,
        radiusBonus: 0,
        scale: 1.0,
        formSkillDesc: "Phóng vòng cầu lửa 155px thiêu đốt bầy quái xung quanh.",
      },
      {
        stage: 1,
        reqLevel: 5,
        shardCost: 10,
        goldCost: 120,
        name: "Pyros • Viêm Hồn Chiến Thần",
        title: "Tiến Hóa I • Thức Tỉnh",
        portraitUrl: "/assets/beasts/dragon_p1.webp",
        spriteUrl: "/assets/beasts/dragon_u1.png",
        powerMult: 1.48,
        radiusBonus: 25,
        scale: 1.18,
        formSkillDesc:
          "Tăng 48% uy lực, triệu hồi cột lửa kép và để lại tàn tro đốt máu.",
      },
      {
        stage: 2,
        reqLevel: 10,
        shardCost: 20,
        goldCost: 260,
        name: "Drakon • Dực Long Cuồng Nộ",
        title: "Tiến Hóa II • Hoàng Kim",
        portraitUrl: "/assets/beasts/dragon_p2.webp",
        spriteUrl: "/assets/beasts/dragon_u2.png",
        powerMult: 2.15,
        radiusBonus: 50,
        scale: 1.36,
        formSkillDesc:
          "Mọc đôi cánh rồng, quét bão lửa 205px và bắn 4 cầu dung nham.",
      },
      {
        stage: 3,
        reqLevel: 20,
        shardCost: 35,
        goldCost: 500,
        name: "Bahamut • Thượng Cổ Hỏa Long Vương",
        title: "Tiến Hóa III • Thần Thoại",
        portraitUrl: "/assets/beasts/dragon_p3.webp",
        spriteUrl: "/assets/beasts/dragon_u3.png",
        powerMult: 3.25,
        radiusBonus: 85,
        scale: 1.56,
        formSkillDesc:
          "Hóa thân Cự Long Thượng Cổ, giáng Mưa Thiên Thạch 240px hủy diệt chiến trường!",
      },
    ],
  },
  {
    id: "fox",
    lineageName: "Huyết Mạch Tuyết Thú",
    role: "Khống Chế Cứng / Hàn Băng",
    element: "Băng",
    color: "#38bdf8",
    accentGlow: "#bae6fd",
    skill:
      "Tỏa kết giới Hàn Băng đóng băng và làm chậm cứng bầy quái nguy hiểm.",
    comboPartner: "dragon",
    comboName: "Bộc Phá Băng Hỏa",
    combo:
      "Phối hợp Hỏa Long: Đóng băng mục tiêu để Hỏa Long kích nổ +45% sát thương nhiệt độ!",
    cost: 0,
    cooldown: 4.8,
    baseRadius: 170,
    forms: [
      {
        stage: 0,
        reqLevel: 1,
        shardCost: 0,
        goldCost: 0,
        name: "Fenrir • Băng Lang Sơ Khai",
        title: "Dạng Khởi Nguyên",
        portraitUrl: "/assets/beasts/fox_p0.webp",
        spriteUrl: "/assets/beasts/fox_u0.png",
        powerMult: 1.0,
        radiusBonus: 0,
        scale: 1.0,
        formSkillDesc:
          "Phóng sương giá 170px làm chậm 55% và đóng băng ngắn quái.",
      },
      {
        stage: 1,
        reqLevel: 5,
        shardCost: 10,
        goldCost: 120,
        name: "Glacies • Thiết Giáp Băng Thú",
        title: "Tiến Hóa I • Thức Tỉnh",
        portraitUrl: "/assets/beasts/fox_p1.webp",
        spriteUrl: "/assets/beasts/fox_u1.png",
        powerMult: 1.45,
        radiusBonus: 25,
        scale: 1.18,
        formSkillDesc:
          "Khoác giáp băng tinh thể, phóng 8 gai băng đóng băng cứng 1.2 giây.",
      },
      {
        stage: 2,
        reqLevel: 10,
        shardCost: 20,
        goldCost: 260,
        name: "Boreas • Cự Thú Bắc Cực",
        title: "Tiến Hóa II • Hoàng Kim",
        portraitUrl: "/assets/beasts/fox_p2.webp",
        spriteUrl: "/assets/beasts/fox_u2.png",
        powerMult: 2.1,
        radiusBonus: 55,
        scale: 1.36,
        formSkillDesc:
          "Dậm vỡ mặt băng 225px, đóng băng diện rộng và giảm giáp kẻ địch.",
      },
      {
        stage: 3,
        reqLevel: 20,
        shardCost: 35,
        goldCost: 500,
        name: "Ymir • Tuyết Sơn Thần Vương",
        title: "Tiến Hóa III • Thần Thoại",
        portraitUrl: "/assets/beasts/fox_p3.webp",
        spriteUrl: "/assets/beasts/fox_u3.png",
        powerMult: 3.2,
        radiusBonus: 90,
        scale: 1.56,
        formSkillDesc:
          "Chúa tể đỉnh tuyết triệu hồi Bão Tuyết Vĩnh Cửu 260px đóng băng toàn bộ kẻ địch!",
      },
    ],
  },
  {
    id: "turtle",
    lineageName: "Huyết Mạch Giáp Thần",
    role: "Chống Chịu / Tạo Khiên & Đẩy Lùi",
    element: "Địa",
    color: "#4ade80",
    accentGlow: "#bbf7d0",
    skill:
      "Bơm Khiên Bảo Hộ cho chủ nhân và dậm sóng địa chấn đẩy văng quái áp sát.",
    comboPartner: "rabbit",
    comboName: "Thánh Điện Bất Diệt",
    combo:
      "Phối hợp Thánh Linh: Mỗi nhịp hồi máu cộng thêm +12 Khiên Bảo Hộ và phản chấn!",
    cost: 0,
    cooldown: 6.2,
    baseRadius: 155,
    forms: [
      {
        stage: 0,
        reqLevel: 1,
        shardCost: 0,
        goldCost: 0,
        name: "Terra • Thạch Linh Hộ Vệ",
        title: "Dạng Khởi Nguyên",
        portraitUrl: "/assets/beasts/turtle_p0.webp",
        spriteUrl: "/assets/beasts/turtle_u0.png",
        powerMult: 1.0,
        radiusBonus: 0,
        scale: 1.0,
        formSkillDesc: "Tạo +14 Khiên chắn cho chủ nhân và đẩy lùi quái gần.",
      },
      {
        stage: 1,
        reqLevel: 5,
        shardCost: 10,
        goldCost: 120,
        name: "Khepri • Kim Cương Giáp Trùng",
        title: "Tiến Hóa I • Thức Tỉnh",
        portraitUrl: "/assets/beasts/turtle_p1.webp",
        spriteUrl: "/assets/beasts/turtle_u1.png",
        powerMult: 1.5,
        radiusBonus: 25,
        scale: 1.18,
        formSkillDesc:
          "Giáp kim cương +22 Khiên chắn và phóng sóng chấn động làm Choáng.",
      },
      {
        stage: 2,
        reqLevel: 10,
        shardCost: 20,
        goldCost: 260,
        name: "Scorpius • Thiết Giáp Hạt Vương",
        title: "Tiến Hóa II • Hoàng Kim",
        portraitUrl: "/assets/beasts/turtle_p2.webp",
        spriteUrl: "/assets/beasts/turtle_u2.png",
        powerMult: 2.15,
        radiusBonus: 50,
        scale: 1.36,
        formSkillDesc:
          "Tạo +32 Khiên Hoàng Kim, quét càng đá phá hủy vật cản & đẩy văng.",
      },
      {
        stage: 3,
        reqLevel: 20,
        shardCost: 35,
        goldCost: 500,
        name: "Atlas • Cự Thần Đại Địa",
        title: "Tiến Hóa III • Thần Thoại",
        portraitUrl: "/assets/beasts/turtle_p3.webp",
        spriteUrl: "/assets/beasts/turtle_u3.png",
        powerMult: 3.3,
        radiusBonus: 85,
        scale: 1.58,
        formSkillDesc:
          "Pháo đài bất diệt bơm +50 Khiên Bảo Hộ và chấn động địa cầu 240px!",
      },
    ],
  },
  {
    id: "slime",
    lineageName: "Huyết Mạch Vực Thẳm",
    role: "Hút Gom Quái / Hố Đen Hư Không",
    element: "Hư Không",
    color: "#c084fc",
    accentGlow: "#f3e8ff",
    skill:
      "Mở xoáy Hố Đen hút gom toàn bộ quái xung quanh về 1 điểm cho các chiêu AOE.",
    comboPartner: "owl",
    comboName: "Lôi Ngục Hư Không",
    combo:
      "Phối hợp Lôi Điểu: Kẻ địch bị Hố Đen hút sẽ chịu thêm +40% sát thương Sét!",
    cost: 90,
    cooldown: 5.4,
    baseRadius: 205,
    forms: [
      {
        stage: 0,
        reqLevel: 1,
        shardCost: 0,
        goldCost: 0,
        name: "Nyx • Xúc Tu Hư Không",
        title: "Dạng Khởi Nguyên",
        portraitUrl: "/assets/beasts/slime_p0.webp",
        spriteUrl: "/assets/beasts/slime_u0.png",
        powerMult: 1.0,
        radiusBonus: 0,
        scale: 1.0,
        formSkillDesc: "Tạo xoáy hút 205px kéo quái thành cụm và khắc ấn Hư Không.",
      },
      {
        stage: 1,
        reqLevel: 5,
        shardCost: 10,
        goldCost: 120,
        name: "Cetus • Ám Ảnh Thủy Quái",
        title: "Tiến Hóa I • Thức Tỉnh",
        portraitUrl: "/assets/beasts/slime_p1.webp",
        spriteUrl: "/assets/beasts/slime_u1.png",
        powerMult: 1.48,
        radiusBonus: 30,
        scale: 1.18,
        formSkillDesc:
          "Mở rộng xoáy hút 235px, làm chậm 60% và rút máu theo giây.",
      },
      {
        stage: 2,
        reqLevel: 10,
        shardCost: 20,
        goldCost: 260,
        name: "Leviathan • Hải Long Vực Thẳm",
        title: "Tiến Hóa II • Hoàng Kim",
        portraitUrl: "/assets/beasts/slime_p2.webp",
        spriteUrl: "/assets/beasts/slime_u2.png",
        powerMult: 2.15,
        radiusBonus: 60,
        scale: 1.38,
        formSkillDesc:
          "Cuộn sóng chân không 265px gom sạch đàn quái và nổ xung kích tối.",
      },
      {
        stage: 3,
        reqLevel: 20,
        shardCost: 35,
        goldCost: 500,
        name: "Charybdis • Chúa Tể Kraken",
        title: "Tiến Hóa III • Thần Thoại",
        portraitUrl: "/assets/beasts/slime_p3.webp",
        spriteUrl: "/assets/beasts/slime_u3.png",
        powerMult: 3.3,
        radiusBonus: 95,
        scale: 1.6,
        formSkillDesc:
          "Mở Hố Đen Siêu Trọng Lực 300px hút toàn màn hình và kích nổ hư không!",
      },
    ],
  },
  {
    id: "owl",
    lineageName: "Huyết Mạch Lôi Điểu",
    role: "Bùng Nổ Sát Thương / Vạn Lôi Trận",
    element: "Lôi",
    color: "#facc15",
    accentGlow: "#fef08a",
    skill:
      "Triệu hồi Lôi Trận giáng hàng loạt tia sét xuống nhiều mục tiêu cùng lúc.",
    comboPartner: "slime",
    comboName: "Lôi Ngục Hư Không",
    combo:
      "Phối hợp Vực Thẳm: Giáng Lôi Trận thẳng vào tâm Hố Đen, +40% sát thương & làm Tê Liệt!",
    cost: 110,
    cooldown: 4.3,
    baseRadius: 190,
    forms: [
      {
        stage: 0,
        reqLevel: 1,
        shardCost: 0,
        goldCost: 0,
        name: "Zephyr • Ưng Sét Trinh Sát",
        title: "Dạng Khởi Nguyên",
        portraitUrl: "/assets/beasts/owl_p0.webp",
        spriteUrl: "/assets/beasts/owl_u0.png",
        powerMult: 1.0,
        radiusBonus: 0,
        scale: 1.0,
        formSkillDesc: "Giáng chuỗi sét 190px đánh trúng nhiều kẻ địch.",
      },
      {
        stage: 1,
        reqLevel: 5,
        shardCost: 10,
        goldCost: 120,
        name: "Aquila • Cổ Vũ Lôi Ưng",
        title: "Tiến Hóa I • Thức Tỉnh",
        portraitUrl: "/assets/beasts/owl_p1.webp",
        spriteUrl: "/assets/beasts/owl_u1.png",
        powerMult: 1.5,
        radiusBonus: 25,
        scale: 1.18,
        formSkillDesc:
          "Phóng hồ quang điện nhảy qua các mục tiêu và gây Choáng 0.6s.",
      },
      {
        stage: 2,
        reqLevel: 10,
        shardCost: 20,
        goldCost: 260,
        name: "Gryphus • Thiên Lôi Điểu Sư",
        title: "Tiến Hóa II • Hoàng Kim",
        portraitUrl: "/assets/beasts/owl_p2.webp",
        spriteUrl: "/assets/beasts/owl_u2.png",
        powerMult: 2.2,
        radiusBonus: 55,
        scale: 1.38,
        formSkillDesc:
          "Vỗ cánh tạo bão điện từ 245px giáng 10 cột sét liên hoàn.",
      },
      {
        stage: 3,
        reqLevel: 20,
        shardCost: 35,
        goldCost: 500,
        name: "Garuda • Thần Điểu Giông Bão Roc",
        title: "Tiến Hóa III • Thần Thoại",
        portraitUrl: "/assets/beasts/owl_p3.webp",
        spriteUrl: "/assets/beasts/owl_u3.png",
        powerMult: 3.35,
        radiusBonus: 90,
        scale: 1.6,
        formSkillDesc:
          "Thần Điểu che kín bầu trời, giáng Vạn Lôi Thiên Phạt 280px xóa sổ đàn quái!",
      },
    ],
  },
  {
    id: "rabbit",
    lineageName: "Huyết Mạch Thánh Linh",
    role: "Hồi Máu / Cường Hóa & Pháp Trận",
    element: "Thánh Quang",
    color: "#f472b6",
    accentGlow: "#fbcfe8",
    skill:
      "Trải Pháp Trận Thánh Quang hồi máu cho chủ nhân và đốt cháy tà vật xung quanh.",
    comboPartner: "turtle",
    comboName: "Thánh Điện Bất Diệt",
    combo:
      "Phối hợp Giáp Thần: Pháp trận hồi máu đồng thời cộng dồn Khiên Bảo Hộ Hoàng Kim!",
    cost: 100,
    cooldown: 6.8,
    baseRadius: 165,
    forms: [
      {
        stage: 0,
        reqLevel: 1,
        shardCost: 0,
        goldCost: 0,
        name: "Nereid • Thủy Tinh Linh",
        title: "Dạng Khởi Nguyên",
        portraitUrl: "/assets/beasts/rabbit_p0.webp",
        spriteUrl: "/assets/beasts/rabbit_u0.png",
        powerMult: 1.0,
        radiusBonus: 0,
        scale: 1.0,
        formSkillDesc: "Hồi phục sinh lực cho chủ nhân và tỏa sóng nước thánh.",
      },
      {
        stage: 1,
        reqLevel: 5,
        shardCost: 10,
        goldCost: 120,
        name: "Sylph • Thanh Ngọc Tiên Tử",
        title: "Tiến Hóa I • Thức Tỉnh",
        portraitUrl: "/assets/beasts/rabbit_p1.webp",
        spriteUrl: "/assets/beasts/rabbit_u1.png",
        powerMult: 1.48,
        radiusBonus: 25,
        scale: 1.18,
        formSkillDesc:
          "Tăng 48% lượng hồi máu và thanh tẩy hiệu ứng làm chậm.",
      },
      {
        stage: 2,
        reqLevel: 10,
        shardCost: 20,
        goldCost: 260,
        name: "Celestia • Thần Lộc Bạch Mã",
        title: "Tiến Hóa II • Hoàng Kim",
        portraitUrl: "/assets/beasts/rabbit_p2.webp",
        spriteUrl: "/assets/beasts/rabbit_u2.png",
        powerMult: 2.15,
        radiusBonus: 50,
        scale: 1.36,
        formSkillDesc:
          "Hồi máu diện rộng, tăng tốc chạy và phóng tiễn ánh sáng.",
      },
      {
        stage: 3,
        reqLevel: 20,
        shardCost: 35,
        goldCost: 500,
        name: "Seraph • Đại Thánh Linh Jinn",
        title: "Tiến Hóa III • Thần Thoại",
        portraitUrl: "/assets/beasts/rabbit_p3.webp",
        spriteUrl: "/assets/beasts/rabbit_u3.png",
        powerMult: 3.3,
        radiusBonus: 85,
        scale: 1.58,
        formSkillDesc:
          "Thánh Linh Tối Thượng hồi phục mạnh, tạo Khiên Thánh và thiêu đốt kẻ thù!",
      },
    ],
  },
];

export interface QuestProgressItem {
  id: string;
  title: string;
  desc: string;
  target: number;
  current: number;
  claimed: boolean;
  rewardGold: number;
  rewardStones: number;
  rewardEssence: number;
  rewardChest?: "starr" | "boss";
}

export interface GachaHistoryEntry {
  id?: string;
  title: string;
  subtitle: string;
  rarity: "rare" | "epic" | "legendary";
  portraitUrl?: string;
  time?: string;
  timestamp?: number;
}

export interface IdleProgress {
  squad: PetId[];
  levels: Record<PetId, number>;
  evolutions: Record<PetId, EvolutionStage>;
  shards: Record<PetId, number>;
  training: number;
  lastClaim: number;
  auto: boolean;
  autoUpgrade: boolean;
  // Gacha, Chests & Crafting currencies
  summonStones: number;
  arcaneEssence: number;
  starrChests: number;
  bossChests: number;
  epicPity: number; // Guaranteed Epic+ every 10 pulls
  legendaryPity: number; // Guaranteed Legendary every 30 pulls
  totalPulls: number;
  gachaHistory: GachaHistoryEntry[];
  // Lifetime counters for Quests & Achievements
  stats: {
    kills: number;
    bossesKilled: number;
    objectivesDone: number;
    chestsOpened: number;
    evolutionsDone: number;
    encountersClaimed: number;
  };
  claimedQuests: string[];
}

export const PET_KEY = "eclipse_idle_companions_v2";
const LEGACY_PET_KEY = "eclipse_idle_companions_v1";

export function defaultProgress(): IdleProgress {
  return {
    squad: ["dragon", "fox", "turtle"],
    levels: {
      dragon: 1,
      fox: 1,
      turtle: 1,
      slime: 0,
      owl: 0,
      rabbit: 0,
    },
    evolutions: {
      dragon: 0,
      fox: 0,
      turtle: 0,
      slime: 0,
      owl: 0,
      rabbit: 0,
    },
    shards: {
      dragon: 5,
      fox: 5,
      turtle: 5,
      slime: 0,
      owl: 0,
      rabbit: 0,
    },
    training: 0,
    lastClaim: Date.now(), // True fresh start: 0 minutes AFK accumulated at account creation
    auto: true,
    autoUpgrade: true,
    summonStones: 10, // Starter 10x Wish pull
    arcaneEssence: 15,
    starrChests: 0,
    bossChests: 0,
    epicPity: 0,
    legendaryPity: 0,
    totalPulls: 0,
    gachaHistory: [],
    stats: {
      kills: 0,
      bossesKilled: 0,
      objectivesDone: 0,
      chestsOpened: 0,
      evolutionsDone: 0,
      encountersClaimed: 0,
    },
    claimedQuests: [],
  };
}

export function loadProgress(): IdleProgress {
  const base = defaultProgress();
  try {
    const rawStr =
      localStorage.getItem(PET_KEY) || localStorage.getItem(LEGACY_PET_KEY);
    if (!rawStr) return base;
    const raw = JSON.parse(rawStr);
    if (!raw || typeof raw !== "object") return base;

    for (const pet of PETS) {
      const id = pet.id;
      if (Number.isFinite(raw.levels?.[id])) {
        base.levels[id] = Math.max(0, Math.min(60, Math.floor(raw.levels[id])));
      }
      if (Number.isFinite(raw.evolutions?.[id])) {
        base.evolutions[id] = Math.max(
          0,
          Math.min(3, Math.floor(raw.evolutions[id]))
        ) as EvolutionStage;
      }
      if (Number.isFinite(raw.shards?.[id])) {
        base.shards[id] = Math.max(0, Math.floor(raw.shards[id]));
      }
    }

    if (Array.isArray(raw.squad)) {
      base.squad = [
        ...new Set<PetId>(
          raw.squad.filter(
            (id: PetId) => PETS.some((p) => p.id === id) && base.levels[id] > 0
          )
        ),
      ].slice(0, 5);
    }

    if (Number.isFinite(raw.training)) {
      base.training = Math.max(0, Math.min(80, Math.floor(raw.training)));
    }
    if (Number.isFinite(raw.lastClaim)) {
      base.lastClaim = Math.min(Date.now(), Math.max(0, raw.lastClaim));
    }
    base.auto = raw.auto !== false;
    base.autoUpgrade = raw.autoUpgrade !== false;

    if (Number.isFinite(raw.summonStones))
      base.summonStones = Math.max(0, Math.floor(raw.summonStones));
    if (Number.isFinite(raw.arcaneEssence))
      base.arcaneEssence = Math.max(0, Math.floor(raw.arcaneEssence));
    if (Number.isFinite(raw.starrChests))
      base.starrChests = Math.max(0, Math.floor(raw.starrChests));
    if (Number.isFinite(raw.bossChests))
      base.bossChests = Math.max(0, Math.floor(raw.bossChests));
    if (Number.isFinite(raw.epicPity))
      base.epicPity = Math.max(0, Math.floor(raw.epicPity));
    if (Number.isFinite(raw.legendaryPity))
      base.legendaryPity = Math.max(0, Math.floor(raw.legendaryPity));
    if (Number.isFinite(raw.totalPulls))
      base.totalPulls = Math.max(0, Math.floor(raw.totalPulls));

    if (raw.stats && typeof raw.stats === "object") {
      base.stats = {
        kills: Number(raw.stats.kills) || 0,
        bossesKilled: Number(raw.stats.bossesKilled) || 0,
        objectivesDone: Number(raw.stats.objectivesDone) || 0,
        chestsOpened: Number(raw.stats.chestsOpened) || 0,
        evolutionsDone: Number(raw.stats.evolutionsDone) || 0,
        encountersClaimed: Number(raw.stats.encountersClaimed) || 0,
      };
    }
    if (Array.isArray(raw.claimedQuests)) {
      base.claimedQuests = raw.claimedQuests;
    }
    if (Array.isArray(raw.gachaHistory)) {
      base.gachaHistory = raw.gachaHistory.slice(0, 30);
    }
    return base;
  } catch {
    return base;
  }
}

export function getPetForm(
  petId: PetId,
  evolutionStage: EvolutionStage
): PetEvolutionForm {
  const def = PETS.find((p) => p.id === petId) || PETS[0];
  return def.forms[evolutionStage] || def.forms[0];
}

export function getNextEvolutionRequirement(
  petId: PetId,
  currentStage: EvolutionStage
): PetEvolutionForm | null {
  if (currentStage >= 3) return null;
  const def = PETS.find((p) => p.id === petId);
  if (!def) return null;
  return def.forms[(currentStage + 1) as EvolutionStage] || null;
}

export function idleRewards(
  progress: IdleProgress,
  now = Date.now()
): {
  minutes: number;
  gold: number;
  essence: number;
  stones: number;
} {
  const elapsedSec = Math.min(
    12 * 3600,
    Math.max(0, (now - progress.lastClaim) / 1000)
  );
  const minutes = Math.floor(elapsedSec / 60);
  const squadBonus = 1 + progress.squad.length * 0.15;
  return {
    minutes,
    gold: Math.floor(minutes * 3 * squadBonus),
    essence: Math.floor(minutes * 0.8 * squadBonus),
    stones: Math.floor(minutes / 15),
  };
}

export const petUpgradeCost = (level: number) =>
  Math.round(16 + level * 16 + Math.pow(level, 1.3) * 3);
export const trainingCost = (level: number) => Math.round(45 + level * 35);

export type PetAiState = "follow" | "approach" | "cast" | "return";

export interface PetUnit {
  id: PetId;
  level: number;
  evolution: EvolutionStage;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  facingX?: number;
  aiState?: PetAiState;
  stateTimer?: number;
  targetId?: number | null;
  castX?: number;
  castY?: number;
  comboFlashTimer?: number;
  cooldown: number;
  damage: number;
  casts: number;
}

export type NovaKind =
  | "meteor"
  | "blizzard"
  | "thunder"
  | "blackhole"
  | "summon_overdrive";

export interface NovaEffect {
  kind: NovaKind | PetId;
  x: number;
  y: number;
  radius: number;
  life: number;
  maxLife: number;
  color: string;
  evolutionStage?: EvolutionStage;
}

export function buildQuestList(progress: IdleProgress): QuestProgressItem[] {
  const maxPetLv = Math.max(...Object.values(progress.levels));
  const maxEvo = Math.max(...Object.values(progress.evolutions));
  const list: Array<Omit<QuestProgressItem, "claimed">> = [
    {
      id: "q_squad_5",
      title: "Đội Hình Tinh Nhuệ (5/5 Thú)",
      desc: "Mang đủ 5 Thú Triệu Hồi vào Đội Ra Trận cùng lúc.",
      target: 5,
      current: progress.squad.length,
      rewardGold: 110,
      rewardStones: 4,
      rewardEssence: 15,
      rewardChest: "starr",
    },
    {
      id: "q_pet_lv5",
      title: "Huấn Luyện Thú Cấp 5",
      desc: "Nâng cấp bất kỳ Thú Triệu Hồi nào đạt Cấp 5 (Mở mốc Tiến Hóa I).",
      target: 5,
      current: maxPetLv,
      rewardGold: 120,
      rewardStones: 4,
      rewardEssence: 20,
    },
    {
      id: "q_evo_1",
      title: "Thức Tỉnh Huyết Mạch (Tiến Hóa I)",
      desc: "Tiến hóa bất kỳ Thú nào lên Bậc I (Cấp 5+).",
      target: 1,
      current: maxEvo,
      rewardGold: 150,
      rewardStones: 5,
      rewardEssence: 25,
      rewardChest: "starr",
    },
    {
      id: "q_evo_3",
      title: "Thần Thú Thượng Cổ (Tiến Hóa III)",
      desc: "Tiến hóa 1 Thú đạt đỉnh cao Tiến Hóa Lần 3 (Cấp 20+).",
      target: 3,
      current: maxEvo,
      rewardGold: 500,
      rewardStones: 12,
      rewardEssence: 80,
      rewardChest: "boss",
    },
    {
      id: "q_gacha_10",
      title: "Nhà Triệu Hồi Tinh Tú",
      desc: "Thực hiện 10 lần Cầu Nguyện tại Điện Triệu Hồi Gacha.",
      target: 10,
      current: progress.totalPulls,
      rewardGold: 130,
      rewardStones: 5,
      rewardEssence: 25,
      rewardChest: "starr",
    },
    {
      id: "q_kills_100",
      title: "Quét Sạch Chiến Trường",
      desc: "Hạ gục tổng cộng 100 quái vật trong các màn chơi.",
      target: 100,
      current: progress.stats.kills,
      rewardGold: 120,
      rewardStones: 4,
      rewardEssence: 20,
    },
    {
      id: "q_boss_1",
      title: "Kẻ Săn Thủ Lĩnh",
      desc: "Đánh bại Boss cuối màn hoặc hoàn thành 3 Mục tiêu bản đồ.",
      target: 1,
      current:
        progress.stats.bossesKilled +
        Math.floor(progress.stats.objectivesDone / 3),
      rewardGold: 180,
      rewardStones: 6,
      rewardEssence: 30,
      rewardChest: "boss",
    },
  ];

  return list.map((q) => ({
    ...q,
    claimed: progress.claimedQuests.includes(q.id),
  }));
}
