import type { GameIconId } from "./icons";

export type HeroId = "kael" | "lyra" | "ember" | "pip";

export type StageId =
  | "courtyard"
  | "mushroom_woods"
  | "abandoned_mine"
  | "ice_citadel"
  | "dark_fortress";

export type PlayableStageId = "courtyard" | "mushroom_woods" | "abandoned_mine";

export type WeaponId =
  | "broadsword"
  | "astral_bow"
  | "flying_shield"
  | "quake_hammer"
  | "frost_tome"
  | "oil_torch"
  | "lightning_magnet"
  | "decoy_bomb";

export type PassiveId =
  | "might"
  | "haste"
  | "phantom_boots"
  | "baby_dragon"
  | "crit_tome";

export type SynergyId =
  | "electric_tether_shield"
  | "shatter_quake_hammer"
  | "inferno_oil_sea"
  | "flamethrower_turret"
  | "phantom_echo_strike";

export type MapObjectiveKind =
  | "monster_camp"
  | "locked_chest"
  | "captive_ally"
  | "blood_altar"
  | "challenge_gate"
  | "explosive_barrel";

export type EnemyArch = "goblin_torch" | "goblin_tnt" | "elite_knight";

export interface StageDefinition {
  id: StageId;
  order: number;
  name: string;
  badge: string;
  mechanicDesc: string;
  bossName: string;
  bossSubtitle: string;
  bgUrl: string;
  bossPortraitUrl: string;
  bossUnitUrl: string;
  bossPhase2UnitUrl?: string;
  bossPhase2Name?: string;
  mobMeleeUrl: string;
  mobMeleeName: string;
  mobRangedUrl: string;
  mobRangedName: string;
  mobEliteUrl: string;
  mobEliteName: string;
  durationSec: number;
  bossSpawnSec: number;
  color: string;
  playable: boolean;
  unlockHint?: string;
  enemyHpMult: number;
  enemySpdMult: number;
  enemyDmgMult: number;
  spawnRateMult: number;
}

export const STAGES: Record<StageId, StageDefinition> = {
  courtyard: {
    id: "courtyard",
    order: 1,
    name: "Màn 1: Thành Trì Bị Vây",
    badge: "Sân Thành & Doanh Trại • Cứu Đồng Minh & Giữ Cổng",
    mechanicDesc:
      "Phá 2 Doanh Trại Vây Thành để giảm 40% quân tiếp viện; giải cứu Cung Thủ Lyra bị giam và giữ vững Cổng Thành Nam trước đợt công kích.",
    bossName: "Kỵ Sĩ Giáp Đỏ Cưỡi Thú",
    bossSubtitle: "Thống Lĩnh Công Thành • Đòn Húc & Chém Quét Báo Trước",
    bgUrl: "/assets/wesnoth/stages/stage1_bg.webp",
    bossPortraitUrl: "/assets/wesnoth/stages/boss1_portrait.webp",
    bossUnitUrl: "/assets/wesnoth/stages/boss1_unit.png",
    mobMeleeUrl: "/assets/tinyswords/goblin_torch.png",
    mobMeleeName: "Xung Kích Đuốc Lửa",
    mobRangedUrl: "/assets/tinyswords/goblin_tnt.png",
    mobRangedName: "Công Binh Thuốc Nổ",
    mobEliteUrl: "/assets/tinyswords/warrior_red.png",
    mobEliteName: "Thiết Kỵ Tiên Phong",
    durationSec: 120,
    bossSpawnSec: 65,
    color: "#38BDF8",
    playable: true,
    enemyHpMult: 1.0,
    enemySpdMult: 1.0,
    enemyDmgMult: 1.0,
    spawnRateMult: 1.0,
  },
  mushroom_woods: {
    id: "mushroom_woods",
    order: 2,
    name: "Màn 2: Rừng Nấm Độc",
    badge: "Đầm Độc Phát Sáng • Quái Nấm, Nhện & Cây Ăn Thịt",
    mechanicDesc:
      "Đường mòn quanh đầm lầy độc, nấm phát sáng và rễ cây chằng chịt; phá 3 Tổ Nấm Độc để mở đường. Boss Cổ Thụ phóng rễ trói và nổ bào tử.",
    bossName: "Cây Cổ Thụ Nhiễm Độc",
    bossSubtitle: "Thần Mộc Rừng Sâu • Rễ Trói Chân & Vòng Nổ Bào Tử",
    bgUrl: "/assets/wesnoth/stages/stage2_bg.webp",
    bossPortraitUrl: "/assets/wesnoth/stages/boss2_portrait.png",
    bossUnitUrl: "/assets/wesnoth/stages/boss2_unit.png",
    mobMeleeUrl: "/assets/wesnoth/monsters/s2_fungus_ab.png",
    mobMeleeName: "Quái Nấm Bào Tử",
    mobRangedUrl: "/assets/wesnoth/monsters/s2_spider.png",
    mobRangedName: "Nhện Độc Phun Tơ",
    mobEliteUrl: "/assets/wesnoth/monsters/s2_carnivore_tree.png",
    mobEliteName: "Cây Ăn Thịt Khổng Lồ",
    durationSec: 135,
    bossSpawnSec: 70,
    color: "#A855F7",
    playable: true,
    enemyHpMult: 1.45,
    enemySpdMult: 1.08,
    enemyDmgMult: 1.25,
    spawnRateMult: 1.2,
  },
  abandoned_mine: {
    id: "abandoned_mine",
    order: 3,
    name: "Màn 3: Hầm Mỏ Tinh Thể",
    badge: "Ray Xe Goòng & Cầu Hẹp • Nổ Thùng Phá Khối Tinh Thể",
    mechanicDesc:
      "Hành lang mỏ, cầu đá hẹp và 2 đường ray xe goòng tốc độ cao; đánh nổ Thùng Thuốc Nổ để phá rào chắn tinh thể mở lối. Boss Người Đá đập đất đổi vùng an toàn.",
    bossName: "Người Đá Giữ Mỏ",
    bossSubtitle: "Khổng Lồ Khoáng Thạch • Đập Đất Đổi Vùng An Toàn",
    bgUrl: "/assets/wesnoth/stages/stage3_bg.webp",
    bossPortraitUrl: "/assets/wesnoth/stages/boss3_portrait.webp",
    bossUnitUrl: "/assets/wesnoth/stages/boss3_unit.png",
    mobMeleeUrl: "/assets/wesnoth/monsters/s3_troll_whelp.png",
    mobMeleeName: "Quái Đá Hầm Mỏ",
    mobRangedUrl: "/assets/wesnoth/monsters/s3_rock_lobber.png",
    mobRangedName: "Quỷ Ném Đá Tảng",
    mobEliteUrl: "/assets/wesnoth/monsters/s3_crystal_golem.png",
    mobEliteName: "Người Đá Tinh Thể",
    durationSec: 150,
    bossSpawnSec: 75,
    color: "#F59E0B",
    playable: true,
    enemyHpMult: 1.95,
    enemySpdMult: 1.15,
    enemyDmgMult: 1.45,
    spawnRateMult: 1.32,
  },
  ice_citadel: {
    id: "ice_citadel",
    order: 4,
    name: "Màn 4: Thành Băng Vĩnh Cửu",
    badge: "Hồ Băng & Trụ Sưởi • Chọn Đường Giữa Bão Tuyết & Nơi Trú",
    mechanicDesc:
      "Hồ băng trơn, phế tích phủ tuyết và 4 Trụ Sưởi Cổ Đại: đứng gần Trụ Sưởi được hồi máu & tăng tốc đánh, rời xa bị Bão Tuyết làm cóng chân. Hạ Nữ Hoàng Băng Giá.",
    bossName: "Nữ Hoàng Băng Giá",
    bossSubtitle: "Chúa Tể Vĩnh Đông • Bão Tuyết & Thương Băng Xoay Vòng",
    bgUrl: "/assets/wesnoth/stages/stage4_bg.webp",
    bossPortraitUrl: "/assets/wesnoth/stages/boss4_portrait.webp",
    bossUnitUrl: "/assets/wesnoth/stages/boss4_unit.png",
    mobMeleeUrl: "/assets/wesnoth/monsters/s4_frost_wraith.png",
    mobMeleeName: "Oán Hồn Băng Giá",
    mobRangedUrl: "/assets/wesnoth/monsters/s4_ice_archer.png",
    mobRangedName: "Xạ Thủ Xương Hàn Băng",
    mobEliteUrl: "/assets/wesnoth/monsters/s4_ice_beast.png",
    mobEliteName: "Cự Thú Tuyết Yeti",
    durationSec: 165,
    bossSpawnSec: 90,
    color: "#7DD3FC",
    playable: true,
    enemyHpMult: 2.55,
    enemySpdMult: 1.18,
    enemyDmgMult: 1.65,
    spawnRateMult: 1.42,
  },
  dark_fortress: {
    id: "dark_fortress",
    order: 5,
    name: "Màn 5: Pháo Đài Hư Không",
    badge: "Cổng Dịch Chuyển & Pháp Trận • Phá Lõi Theo Thứ Tự & Boss 2 Giai Đoạn",
    mechanicDesc:
      "Các đảo đá nối bằng cầu pháp trận và cổng dịch chuyển; phải phá Lõi Năng Lượng [1] trước để gỡ khiên chắn cho Lõi [2]. Boss Vua Sa Ngã biến hình 2 giai đoạn!",
    bossName: "Vua Sa Ngã (Giai Đoạn 1)",
    bossSubtitle: "Đế Vương Hắc Ám • Biến Hình 2 Giai Đoạn Ở 50% Máu",
    bgUrl: "/assets/wesnoth/stages/stage5_bg.webp",
    bossPortraitUrl: "/assets/wesnoth/stages/boss5_portrait.webp",
    bossUnitUrl: "/assets/wesnoth/stages/boss5_unit.png",
    bossPhase2UnitUrl: "/assets/wesnoth/stages/boss5_phase2_unit.png",
    bossPhase2Name: "Đế Vương Hư Không Thức Tỉnh (GĐ 2)",
    mobMeleeUrl: "/assets/wesnoth/monsters/s5_void_blade.png",
    mobMeleeName: "Kiếm Khách Hư Không",
    mobRangedUrl: "/assets/wesnoth/monsters/s5_void_mage.png",
    mobRangedName: "Pháp Sư Hắc Ám",
    mobEliteUrl: "/assets/wesnoth/monsters/s5_void_stalker.png",
    mobEliteName: "Ám Ảnh Sát Thủ Hư Không",
    durationSec: 180,
    bossSpawnSec: 105,
    color: "#F43F5E",
    playable: true,
    enemyHpMult: 3.3,
    enemySpdMult: 1.24,
    enemyDmgMult: 1.9,
    spawnRateMult: 1.52,
  },
};

export interface HeroDefinition {
  id: HeroId;
  name: string;
  title: string;
  roleTag: string;
  desc: string;
  traitDesc: string;
  unlockCondition: string;
  startingWeapon: WeaponId;
  accentColor: string;
  portraitUrl: string;
  unitUrl: string;
  statMods: {
    maxHp: number;
    moveSpeed: number;
    mightMult: number;
    cooldownMult: number;
    magnetRadius: number;
  };
}

export const HEROES: Record<HeroId, HeroDefinition> = {
  kael: {
    id: "kael",
    name: "Kael • Kỵ Sĩ",
    title: "Đội Trưởng Tiên Phong",
    roleTag: "Cận Chiến • Đỡ Đòn & Lướt Choáng",
    desc: "Kiếm quét rộng đẩy lùi mạnh; khi Lướt xuyên qua kẻ địch sẽ gây sát thương và làm Choáng 1.2 giây.",
    traitDesc: "Giáp Kỵ Sĩ (140 Máu) • Lướt xuyên địch gây Choáng",
    unlockCondition: "Mở sẵn từ đầu",
    startingWeapon: "broadsword",
    accentColor: "#38BDF8",
    portraitUrl: "/assets/wesnoth/heroes/kael_portrait.webp",
    unitUrl: "/assets/wesnoth/heroes/kael_unit.png",
    statMods: {
      maxHp: 140,
      moveSpeed: 210,
      mightMult: 1.0,
      cooldownMult: 1.0,
      magnetRadius: 155,
    },
  },
  lyra: {
    id: "lyra",
    name: "Lyra • Cung Thủ",
    title: "Tiễn Thủ Rừng Xanh",
    roleTag: "Tốc Độ Cao • Bắn Xuyên & Đặt Bẫy",
    desc: "Ít máu nhưng chạy rất nhanh; bắn tên xuyên táo và tự động đặt Bẫy Gai Nổ mỗi khi Lướt hoặc mỗi 6 giây.",
    traitDesc: "Tốc chạy 242 • Lướt đặt Bẫy Gai giữ chân & nổ quái",
    unlockCondition: "Giải cứu Cung Thủ bị vây trong trận hoặc thắng Màn 1",
    startingWeapon: "astral_bow",
    accentColor: "#4ADE80",
    portraitUrl: "/assets/wesnoth/heroes/lyra_portrait.webp",
    unitUrl: "/assets/wesnoth/heroes/lyra_unit.png",
    statMods: {
      maxHp: 95,
      moveSpeed: 242,
      mightMult: 1.05,
      cooldownMult: 0.9,
      magnetRadius: 170,
    },
  },
  ember: {
    id: "ember",
    name: "Ember • Pháp Sư",
    title: "Học Giả Nguyên Tố",
    roleTag: "Diện Rộng • Lửa, Băng & Sét",
    desc: "Bậc thầy kết hợp Lửa, Băng và Sét (+25% phạm vi nổ nguyên tố). Khi Lướt phát xung kích đóng băng kẻ địch áp sát.",
    traitDesc: "+25% Phạm vi nổ • Lướt tỏa hàn khí đóng băng",
    unlockCondition: "Thắng 1 trận hoặc kích hoạt 1 Vũ khí Tiến hóa / Combo",
    startingWeapon: "frost_tome",
    accentColor: "#A855F7",
    portraitUrl: "/assets/wesnoth/heroes/ember_portrait.webp",
    unitUrl: "/assets/wesnoth/heroes/ember_unit.png",
    statMods: {
      maxHp: 105,
      moveSpeed: 216,
      mightMult: 1.12,
      cooldownMult: 0.88,
      magnetRadius: 165,
    },
  },
  pip: {
    id: "pip",
    name: "Pip • Thợ Máy",
    title: "Cổ Ngữ Lôi Sư",
    roleTag: "Công Nghệ • Dựng Ụ Súng & Thả Bom",
    desc: "Tự động dựng Ụ Súng Tinh Thể mỗi 8 giây trên chiến trường để bắn yểm trợ và thả Bom Mồi Nhử gom quái!",
    traitDesc: "Tự dựng Ụ Súng mỗi 8s • +60% Sát thương phá công trình",
    unlockCondition: "Phá hủy Trại Quái / Tổ Nấm hoặc hạ Boss Hầm Mỏ",
    startingWeapon: "decoy_bomb",
    accentColor: "#FACC15",
    portraitUrl: "/assets/wesnoth/heroes/pip_portrait.webp",
    unitUrl: "/assets/wesnoth/heroes/pip_unit.png",
    statMods: {
      maxHp: 115,
      moveSpeed: 218,
      mightMult: 1.0,
      cooldownMult: 0.94,
      magnetRadius: 165,
    },
  },
};

// Backwards-compatible default hero export
export const HERO: HeroDefinition = HEROES.kael;

export interface WeaponDefinition {
  id: WeaponId;
  name: string;
  evolvedName: string;
  evolutionPassive: PassiveId;
  icon: GameIconId;
  evolvedIcon: GameIconId;
  color: string;
  evolvedColor: string;
  baseDamage: number;
  baseCooldown: number;
  descByLevel: string[];
  evolvedDesc: string;
}

export const WEAPONS: Record<WeaponId, WeaponDefinition> = {
  broadsword: {
    id: "broadsword",
    name: "Đại Kiếm Phong Lôi",
    evolvedName: "Thánh Kiếm Bão Tố ★",
    evolutionPassive: "might",
    icon: "broadsword",
    evolvedIcon: "broadsword_evo",
    color: "#38BDF8",
    evolvedColor: "#FACC15",
    baseDamage: 30,
    baseCooldown: 0.92,
    descByLevel: [
      "Chém vòng cung rộng phía trước, đẩy lùi quái.",
      "Tăng 25% sát thương và mở rộng tầm chém.",
      "Mở khóa đòn chém bồi thứ 2 liên hoàn.",
      "Tăng 25% sát thương và giảm 12% hồi chiêu.",
      "Phóng thêm sóng kiếm khí xuyên thấu diện rộng.",
    ],
    evolvedDesc:
      "Chém liên hoàn 2 nhịp, phóng kiếm khí hoàng kim và hồi nhẹ máu khi chém trúng từ 3 mục tiêu!",
  },
  astral_bow: {
    id: "astral_bow",
    name: "Cung Tên Tinh Quang",
    evolvedName: "Mưa Tên Thiên Hà ★",
    evolutionPassive: "haste",
    icon: "astral_bow",
    evolvedIcon: "astral_bow_evo",
    color: "#F59E0B",
    evolvedColor: "#38BDF8",
    baseDamage: 20,
    baseCooldown: 0.8,
    descByLevel: [
      "Bắn tên xuyên thấu vào kẻ địch gần nhất.",
      "Bắn 2 mũi tên cùng lúc và xuyên 2 mục tiêu.",
      "Tăng 25% sát thương và tốc độ tên bay.",
      "Bắn 3 mũi tên hình quạt, xuyên 2 mục tiêu.",
      "Giảm 15% hồi chiêu và tăng sát thương chí mạng.",
    ],
    evolvedDesc:
      "Bắn loạt 3 mũi tên ánh sáng liên thanh tốc độ cao xuyên thấu hàng ngũ địch!",
  },
  flying_shield: {
    id: "flying_shield",
    name: "Khiên Bay Phản Kích",
    evolvedName: "Khiên Thần Chấn Thiên ★",
    evolutionPassive: "might",
    icon: "flying_shield",
    evolvedIcon: "flying_shield_evo",
    color: "#60A5FA",
    evolvedColor: "#FACC15",
    baseDamage: 22,
    baseCooldown: 1.55,
    descByLevel: [
      "Ném khiên nảy qua 3 kẻ địch rồi bay quay về tay nhân vật.",
      "Tăng số lần nảy lên 4 mục tiêu và tăng 25% sát thương.",
      "Khiên bay nhanh hơn và làm Choáng nhẹ mục tiêu trúng đòn.",
      "Ném 2 chiếc khiên cùng lúc, nảy 5 mục tiêu.",
      "Khiên quay về tạo vòng xung kích đẩy lùi quái áp sát.",
    ],
    evolvedDesc:
      "Phóng 2 Khiên Thần nảy 6 lần siêu tốc, làm Choáng và nghiền nát cả đường đi lẫn đường về!",
  },
  quake_hammer: {
    id: "quake_hammer",
    name: "Búa Chấn Động",
    evolvedName: "Thần Chùy Phá Sơn ★",
    evolutionPassive: "might",
    icon: "quake_hammer",
    evolvedIcon: "quake_hammer_evo",
    color: "#F97316",
    evolvedColor: "#38BDF8",
    baseDamage: 42,
    baseCooldown: 1.85,
    descByLevel: [
      "Đập đất gây sóng chấn động, đẩy lùi cực mạnh & +100% sát thương phá vật cản/trại.",
      "Mở rộng 25% bán kính chấn động và làm Choáng 0.9 giây.",
      "Tăng 30% sát thương và nứt mặt đất gây sát thương dư chấn.",
      "Giảm 15% hồi chiêu và tăng lực hất văng.",
      "Đập 2 nhịp liên tiếp tạo sóng địa chấn kép.",
    ],
    evolvedDesc:
      "Đập nát chiến trường với sóng địa chấn khổng lồ, làm Choáng diện rộng và phá tan mọi vật cản!",
  },
  frost_tome: {
    id: "frost_tome",
    name: "Sách Băng Giá",
    evolvedName: "Thánh Điển Vĩnh Đông ★",
    evolutionPassive: "phantom_boots",
    icon: "frost_tome",
    evolvedIcon: "frost_tome_evo",
    color: "#38BDF8",
    evolvedColor: "#A855F7",
    baseDamage: 18,
    baseCooldown: 2.0,
    descByLevel: [
      "Tỏa xung kích băng giá đóng băng địch (chậm 55%), mở đường thoát thân.",
      "Mở rộng 25% bán kính vòng băng và tăng sát thương.",
      "Kéo dài thời gian Đóng Băng lên 3.0 giây.",
      "Giảm 18% hồi chiêu và đẩy lùi quái áp sát.",
      "Quái bị hạ khi đang Đóng Băng nổ tung thành mảnh băng xuyên thấu.",
    ],
    evolvedDesc:
      "Bão tuyết Vĩnh Đông đóng băng cứng toàn bộ quái quanh thân và kích nổ mảnh băng dây chuyền!",
  },
  oil_torch: {
    id: "oil_torch",
    name: "Bình Dầu & Đuốc",
    evolvedName: "Biển Lửa Địa Ngục ★",
    evolutionPassive: "baby_dragon",
    icon: "oil_torch",
    evolvedIcon: "oil_torch_evo",
    color: "#FB923C",
    evolvedColor: "#EC4899",
    baseDamage: 14,
    baseCooldown: 2.2,
    descByLevel: [
      "Ném bình dầu kết hợp đuốc tạo vùng đất cháy rút máu và làm chậm quái.",
      "Ném 2 bình dầu tạo thảm lửa rộng hơn 25%.",
      "Tăng 35% sát thương đốt cháy mỗi giây.",
      "Vùng cháy tồn tại lâu hơn và phát nổ khi mới chạm đất.",
      "Ném 3 bình dầu liên hoàn bao vây quanh thân.",
    ],
    evolvedDesc:
      "Phủ thảm lửa Địa Ngục rực cháy khắp sân, tự động bùng nổ cột lửa khi có đòn đánh đi qua!",
  },
  lightning_magnet: {
    id: "lightning_magnet",
    name: "Nam Châm Sét",
    evolvedName: "Lõi Từ Trường Lôi Điện ★",
    evolutionPassive: "crit_tome",
    icon: "lightning_magnet",
    evolvedIcon: "lightning_magnet_evo",
    color: "#FACC15",
    evolvedColor: "#A855F7",
    baseDamage: 26,
    baseCooldown: 1.4,
    descByLevel: [
      "Tăng tầm hút ngọc; mỗi khi tích đủ điện hoặc mỗi 1.4s phóng sét giật 3 địch.",
      "Nhặt ngọc EXP giúp giảm ngay 0.25s hồi sét; giật lan 4 mục tiêu.",
      "Tăng 30% sát thương sét và làm Tê Liệt (chậm 40%).",
      "Chuỗi sét nhảy qua 5 mục tiêu kèm từ trường hút ngọc toàn sân.",
      "Giáng 2 luồng sét cùng lúc mỗi khi tích đầy điện.",
    ],
    evolvedDesc:
      "Biến mọi viên ngọc EXP thành trạm phát sét liên hoàn, giật 6 mục tiêu và hút sạch chiến lợi phẩm!",
  },
  decoy_bomb: {
    id: "decoy_bomb",
    name: "Bom Mồi Nhử",
    evolvedName: "Siêu Bom Hút Chân Không ★",
    evolutionPassive: "haste",
    icon: "decoy_bomb",
    evolvedIcon: "decoy_bomb_evo",
    color: "#F43F5E",
    evolvedColor: "#FACC15",
    baseDamage: 38,
    baseCooldown: 2.6,
    descByLevel: [
      "Ném bom mồi nhử thu hút và kéo quái xung quanh về 1 điểm rồi phát nổ.",
      "Tăng 30% bán kính gom quái và sát thương vụ nổ.",
      "Giảm 18% hồi chiêu và để lại mảnh đinh làm chậm.",
      "Ném 2 quả Bom Mồi Nhử cùng lúc.",
      "Vụ nổ tạo sóng xung kích đẩy văng và làm Choáng quái sống sót.",
    ],
    evolvedDesc:
      "Hố đen cơ giới hút chặt cả đàn quái về tâm rồi kích nổ liên hoàn 2 tầng hủy diệt!",
  },
};

export interface PassiveDefinition {
  id: PassiveId;
  name: string;
  icon: GameIconId;
  maxLevel: number;
  shortDesc: string;
}

export const PASSIVES: Record<PassiveId, PassiveDefinition> = {
  might: {
    id: "might",
    name: "Ấn Chiến Lực",
    icon: "might",
    maxLevel: 5,
    shortDesc: "+16% Sát thương & phá vật cản (Ghép Kiếm / Khiên / Búa)",
  },
  haste: {
    id: "haste",
    name: "Phù Hiệu Tốc Chiến",
    icon: "haste",
    maxLevel: 5,
    shortDesc: "-10% Hồi chiêu vũ khí (Ghép Cung Tên / Bom Mồi Nhử)",
  },
  phantom_boots: {
    id: "phantom_boots",
    name: "Ủng Bóng Ma",
    icon: "phantom_boots",
    maxLevel: 5,
    shortDesc:
      "+10% Tốc chạy; Lướt để lại Bóng Ma đánh thêm 1 đòn! (Ghép Sách Băng)",
  },
  baby_dragon: {
    id: "baby_dragon",
    name: "Rồng Con Đồng Hành",
    icon: "baby_dragon",
    maxLevel: 5,
    shortDesc:
      "Rồng con bay theo phun lửa theo hướng nhìn & đốt cháy dầu! (Ghép Bình Dầu)",
  },
  crit_tome: {
    id: "crit_tome",
    name: "La Bàn Sét & Chí Mạng",
    icon: "crit_tome",
    maxLevel: 5,
    shortDesc:
      "+8% Chí mạng, +20% tầm hút ngọc & nạp điện nhanh (Ghép Nam Châm Sét)",
  },
};

export interface SynergyDefinition {
  id: SynergyId;
  name: string;
  reqDesc: string;
  weapons?: [WeaponId, WeaponId];
  weaponAndPassive?: [WeaponId, PassiveId];
  minLevel: number;
  color: string;
  desc: string;
}

export const WEAPON_SYNERGIES: Record<SynergyId, SynergyDefinition> = {
  electric_tether_shield: {
    id: "electric_tether_shield",
    name: "Khiên Nối Điện Cao Thế",
    reqDesc: "Khiên Bay + Nam Châm Sét (Cấp 2+)",
    weapons: ["flying_shield", "lightning_magnet"],
    minLevel: 2,
    color: "#FACC15",
    desc: "Thay đổi hành vi: Mỗi lần Khiên Bay nảy giữa các quái sẽ phóng hồ quang điện giật thêm các mục tiêu lân cận!",
  },
  shatter_quake_hammer: {
    id: "shatter_quake_hammer",
    name: "Búa Đập Vỡ Băng",
    reqDesc: "Búa Chấn Động + Sách Băng Giá (Cấp 2+)",
    weapons: ["quake_hammer", "frost_tome"],
    minLevel: 2,
    color: "#38BDF8",
    desc: "Thay đổi hành vi: Búa đập trúng kẻ địch đang Đóng Băng khiến chúng vỡ tung thành 6 mảnh băng sắc nhọn (+50% sát thương)!",
  },
  inferno_oil_sea: {
    id: "inferno_oil_sea",
    name: "Bình Dầu Rồng Lửa",
    reqDesc: "Bình Dầu Cấp 2+ & Rồng Con (hoặc Đại Kiếm Cấp 2+)",
    weapons: ["oil_torch", "broadsword"],
    weaponAndPassive: ["oil_torch", "baby_dragon"],
    minLevel: 2,
    color: "#F97316",
    desc: "Thay đổi hành vi: Đòn lửa của Rồng Con hoặc Đại Kiếm chạm vào vùng Bình Dầu sẽ kích nổ Cột Lửa Bộc Phá!",
  },
  flamethrower_turret: {
    id: "flamethrower_turret",
    name: "Pháo Đài & Bom Phun Lửa",
    reqDesc: "Bom Mồi Nhử + Bình Dầu (Cấp 2+)",
    weapons: ["decoy_bomb", "oil_torch"],
    minLevel: 2,
    color: "#FB7185",
    desc: "Thay đổi hành vi: Bom Mồi Nhử và Ụ Súng của Pip biến thành Súng Phun Lửa, vừa gom quái vừa trải thảm lửa đốt cháy!",
  },
  phantom_echo_strike: {
    id: "phantom_echo_strike",
    name: "Bóng Ma Liên Kích",
    reqDesc: "Ủng Bóng Ma Cấp 1+ & Vũ khí chính Cấp 2+",
    weaponAndPassive: ["broadsword", "phantom_boots"],
    minLevel: 1,
    color: "#818CF8",
    desc: "Thay đổi hành vi: Mỗi lần Lướt (Dash) để lại Bóng Ma Chiến Binh đứng lại vung kiếm chém và nổ xung kích!",
  },
};

export interface UpgradeChoice {
  uid: string;
  kind: "weapon" | "passive" | "evolution" | "heal_gold";
  id: string;
  title: string;
  badgeText: string;
  desc: string;
  icon: GameIconId;
  nextLevel: number;
  isEvolution?: boolean;
}
