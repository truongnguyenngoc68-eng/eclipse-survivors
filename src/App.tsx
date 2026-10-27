import {IdleHub} from "./IdleHub";
import {PETS,PET_KEY,getPetForm,loadProgress,type NovaKind} from "./game/companions";
import React, { useEffect, useRef, useState } from "react";
import {
  HEROES,
  HeroId,
  PASSIVES,
  PassiveId,
  STAGES,
  StageId,
  WEAPONS,
  WEAPON_SYNERGIES,
  WeaponId,
} from "./game/catalog";
import {
  EclipseGameEngine,
  EngineSnapshot,
  type EquippedVisualSummary,
} from "./game/engine";
import { GameIconId, GameSvgIcon } from "./game/icons";
import { renderEclipseWorld, renderHeroPreviewStage } from "./game/renderer";
import { sfx } from "./game/sound";

export interface InventoryItem {
  id: string;
  name: string;
  slot: "weapon" | "armor" | "relic";
  rarity: "common" | "rare" | "epic" | "legendary";
  level: number;
  iconId: GameIconId;
  bonusHp: number;
  bonusMightPct: number;
  bonusSpeedPct: number;
  weaponOverride?: WeaponId;
  desc: string;
}

interface PersistentSaveData {
  gold: number;
  unlockedHeroes: HeroId[];
  unlockedStages: StageId[];
  sandboxUnlockAll: boolean;
  inventory: InventoryItem[];
  equipped: {
    weaponItemId: string | null;
    armorItemId: string | null;
    relicItemId: string | null;
  };
}

const SAVE_STORAGE_KEY = "eclipse_survivors_save_v3";
const STAGE_LIST = Object.values(STAGES).sort((a, b) => a.order - b.order);

const STARTER_INVENTORY: InventoryItem[] = [
  {
    id: "starter_sword_1",
    name: "Lam Kiếm Học Viện",
    slot: "weapon",
    rarity: "rare",
    level: 1,
    iconId: "broadsword",
    bonusHp: 0,
    bonusMightPct: 8,
    bonusSpeedPct: 0,
    desc: "+8% Sát thương toàn bộ vũ khí (Giữ vũ khí đặc trưng của Tướng)",
  },
  {
    id: "starter_shield_wep",
    name: "Khiên Phản Kích Cổ Đại",
    slot: "weapon",
    rarity: "epic",
    level: 1,
    iconId: "flying_shield",
    bonusHp: 15,
    bonusMightPct: 6,
    bonusSpeedPct: 0,
    weaponOverride: "flying_shield",
    desc: "Đổi vũ khí đầu trận thành Khiên Bay Phản Kích +15 Máu",
  },
  {
    id: "starter_armor_1",
    name: "Giáp Chiến Kỵ Sĩ Lam",
    slot: "armor",
    rarity: "rare",
    level: 1,
    iconId: "armor_leather",
    bonusHp: 20,
    bonusMightPct: 0,
    bonusSpeedPct: 4,
    desc: "Giáp hộ tâm giúp chịu đòn tốt hơn và tăng nhẹ tốc chạy",
  },
  {
    id: "starter_relic_1",
    name: "Nhẫn Lôi Quang",
    slot: "relic",
    rarity: "rare",
    level: 1,
    iconId: "ring",
    bonusHp: 10,
    bonusMightPct: 6,
    bonusSpeedPct: 5,
    desc: "Nhẫn cổ cộng thêm sát thương nguyên tố và tốc độ bước chân",
  },
];

const LOOT_POOL_TEMPLATES: Array<Omit<InventoryItem, "id" | "level">> = [
  {
    name: "Đại Búa Phá Trại",
    slot: "weapon",
    rarity: "epic",
    iconId: "quake_hammer",
    bonusHp: 20,
    bonusMightPct: 12,
    bonusSpeedPct: 0,
    weaponOverride: "quake_hammer",
    desc: "Vào trận cầm ngay Búa Chấn Động (Đập choáng & +100% phá công trình)",
  },
  {
    name: "Sách Cổ Băng Sương",
    slot: "weapon",
    rarity: "epic",
    iconId: "frost_tome",
    bonusHp: 10,
    bonusMightPct: 10,
    bonusSpeedPct: 5,
    weaponOverride: "frost_tome",
    desc: "Vào trận cầm ngay Sách Băng Giá (Đóng băng bầy quái mở đường)",
  },
  {
    name: "Lõi Nam Châm Điện Từ",
    slot: "weapon",
    rarity: "epic",
    iconId: "lightning_magnet",
    bonusHp: 10,
    bonusMightPct: 10,
    bonusSpeedPct: 6,
    weaponOverride: "lightning_magnet",
    desc: "Vào trận cầm ngay Nam Châm Sét (Hút ngọc EXP phóng tia sét)",
  },
  {
    name: "Bình Dầu Lửa Hoàng Gia",
    slot: "weapon",
    rarity: "rare",
    iconId: "oil_torch",
    bonusHp: 5,
    bonusMightPct: 9,
    bonusSpeedPct: 0,
    weaponOverride: "oil_torch",
    desc: "Vào trận cầm ngay Bình Dầu & Đuốc (Tạo thảm lửa thiêu đốt)",
  },
  {
    name: "Túi Bom Mồi Nhử Cơ Khí",
    slot: "weapon",
    rarity: "epic",
    iconId: "decoy_bomb",
    bonusHp: 15,
    bonusMightPct: 8,
    bonusSpeedPct: 4,
    weaponOverride: "decoy_bomb",
    desc: "Vào trận cầm ngay Bom Mồi Nhử (Gom quái lại một điểm rồi phát nổ)",
  },
  {
    name: "Chiến Giáp Kỵ Sĩ Đỏ",
    slot: "armor",
    rarity: "legendary",
    iconId: "breastplate",
    bonusHp: 45,
    bonusMightPct: 10,
    bonusSpeedPct: 5,
    desc: "Chiến lợi phẩm từ Boss Kỵ Sĩ Giáp Đỏ: Tăng mạnh Máu và Uy lực",
  },
  {
    name: "Giáp Vỏ Cổ Thụ Ngàn Năm",
    slot: "armor",
    rarity: "legendary",
    iconId: "armor",
    bonusHp: 60,
    bonusMightPct: 6,
    bonusSpeedPct: 0,
    desc: "Chiến lợi phẩm từ Boss Cây Cổ Thụ: Tăng cực lớn sinh lực tối đa",
  },
  {
    name: "Nhẫn Lõi Đá Tinh Thể",
    slot: "relic",
    rarity: "legendary",
    iconId: "ring_prismatic",
    bonusHp: 25,
    bonusMightPct: 16,
    bonusSpeedPct: 8,
    desc: "Chiến lợi phẩm từ Boss Người Đá: Cường hóa toàn diện sát thương & tốc chạy",
  },
  {
    name: "Dây Chuyền Rồng Lửa Nhỏ",
    slot: "relic",
    rarity: "epic",
    iconId: "necklace_amber",
    bonusHp: 15,
    bonusMightPct: 12,
    bonusSpeedPct: 6,
    desc: "Bảo vật khắc hình Rồng Con giúp tăng mạnh sát thương kỹ năng",
  },
];

LOOT_POOL_TEMPLATES.push(...([
 ["Áo Choàng Kẹo Bông","armor","epic","armor_leather",35,8,5],
 ["Giáp Vỏ Sao Băng","armor","legendary","steel_armor",55,12,0],
 ["Nhẫn Ngân Hà","relic","epic","ring_prismatic",12,18,3],
 ["Bùa Bánh Bao May Mắn","relic","rare","ankh_necklace",25,6,8],
 ["Vương Miện Sấm Chớp","relic","legendary","helmet_shiny",18,22,4],
 ["Áo Choàng Cực Quang","armor","epic","breastplate",30,10,10],
 ["Huy Hiệu Hội Triệu Hồi","relic","rare","skull_ring",20,9,6],
 ["Đại Kiếm Sao Chổi","weapon","legendary","broadsword_evo",15,24,0],
] as const).map(([name,slot,rarity,iconId,bonusHp,bonusMightPct,bonusSpeedPct])=>({name,slot,rarity,iconId,bonusHp,bonusMightPct,bonusSpeedPct,desc:`+${bonusHp} máu • +${bonusMightPct}% sát thương • +${bonusSpeedPct}% tốc chạy. Có thể cường hóa tại xưởng rèn.`})));

const ITEM_ICON_BY_NAME: Record<string, GameIconId> = Object.fromEntries(
  [...STARTER_INVENTORY, ...LOOT_POOL_TEMPLATES].map((it) => [it.name, it.iconId])
);

function loadSaveData(): PersistentSaveData {
  try {
    const raw = localStorage.getItem(SAVE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistentSaveData>;
      if (parsed && Array.isArray(parsed.inventory) && parsed.inventory.length > 0) {
        const migratedInv = parsed.inventory.map((it) => ({
          ...it,
          iconId: ITEM_ICON_BY_NAME[it.name] || it.iconId,
        }));
        const hasItem = (id: string | null | undefined) =>
          Boolean(id && migratedInv.some((i) => i.id === id));
        const eq = parsed.equipped;
        return {
          gold: typeof parsed.gold === "number" ? parsed.gold : 110,
          unlockedHeroes: Array.isArray(parsed.unlockedHeroes)
            ? parsed.unlockedHeroes
            : ["kael"],
          unlockedStages: Array.isArray(parsed.unlockedStages)
            ? parsed.unlockedStages
            : ["courtyard"],
          sandboxUnlockAll: Boolean(parsed.sandboxUnlockAll),
          inventory: migratedInv,
          equipped: {
            weaponItemId: hasItem(eq?.weaponItemId)
              ? eq!.weaponItemId
              : migratedInv.find((i) => i.slot === "weapon")?.id ?? null,
            armorItemId:
              eq && "armorItemId" in eq
                ? hasItem(eq.armorItemId)
                  ? eq.armorItemId
                  : null
                : migratedInv.find((i) => i.slot === "armor")?.id ?? null,
            relicItemId:
              eq && "relicItemId" in eq
                ? hasItem(eq.relicItemId)
                  ? eq.relicItemId
                  : null
                : migratedInv.find((i) => i.slot === "relic")?.id ?? null,
          },
        };
      }
    }
  } catch {
    // ignore storage errors
  }
  return {
    gold: 110,
    unlockedHeroes: ["kael"],
    unlockedStages: ["courtyard"],
    sandboxUnlockAll: false,
    inventory: STARTER_INVENTORY,
    equipped: {
      weaponItemId: "starter_sword_1",
      armorItemId: "starter_armor_1",
      relicItemId: "starter_relic_1",
    },
  };
}

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getRarityBadge(rarity: InventoryItem["rarity"]): {
  label: string;
  bg: string;
  border: string;
  text: string;
} {
  switch (rarity) {
    case "legendary":
      return {
        label: "Thần Thoại",
        bg: "bg-amber-950/80",
        border: "border-amber-400",
        text: "text-amber-300",
      };
    case "epic":
      return {
        label: "Sử Thi",
        bg: "bg-purple-950/80",
        border: "border-purple-400",
        text: "text-purple-300",
      };
    case "rare":
      return {
        label: "Hiếm",
        bg: "bg-sky-950/80",
        border: "border-sky-400",
        text: "text-sky-300",
      };
    default:
      return {
        label: "Thường",
        bg: "bg-slate-900",
        border: "border-slate-600",
        text: "text-slate-300",
      };
  }
}

function getDirectionArrow(dx: number, dy: number): string {
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (angle >= -22.5 && angle < 22.5) return "→";
  if (angle >= 22.5 && angle < 67.5) return "↘";
  if (angle >= 67.5 && angle < 112.5) return "↓";
  if (angle >= 112.5 && angle < 157.5) return "↙";
  if (angle >= 157.5 || angle < -157.5) return "←";
  if (angle >= -157.5 && angle < -112.5) return "↖";
  if (angle >= -112.5 && angle < -67.5) return "↑";
  return "↗";
}

function LobbyDioramaPreview({
  heroId,
  stageId,
  effectiveWeapon,
  equippedVisuals,
}: {
  heroId: HeroId;
  stageId: StageId;
  effectiveWeapon: WeaponId;
  equippedVisuals: EquippedVisualSummary;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;

    const renderPreview = (now: number) => {
      renderHeroPreviewStage(
        ctx,
        canvas.width,
        canvas.height,
        now,
        heroId,
        stageId,
        effectiveWeapon,
        equippedVisuals
      );

      rafId = requestAnimationFrame(renderPreview);
    };

    rafId = requestAnimationFrame(renderPreview);
    return () => cancelAnimationFrame(rafId);
  }, [heroId, stageId, effectiveWeapon, equippedVisuals]);

  return (
    <canvas
      ref={canvasRef}
      width={440}
      height={164}
      className="w-full h-[130px] sm:h-[152px] object-cover block border-b-2 border-[#3f2e21]"
    />
  );
}

export function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<EclipseGameEngine | null>(null);

  const [inGame, setInGame] = useState(false);
  const [idleProgress,setIdleProgress]=useState(loadProgress);
  useEffect(()=>{try{localStorage.setItem(PET_KEY,JSON.stringify(idleProgress));}catch{/* Keep the current session playable when storage is full. */}},[idleProgress]);
  const [selectedStageId, setSelectedStageId] = useState<StageId>("courtyard");
  const [selectedHeroId, setSelectedHeroId] = useState<HeroId>("kael");
  const [lobbyTab, setLobbyTab] = useState<
    "stages" | "pets" | "inventory" | "arsenal" | "gacha" | "quests"
  >("stages");
  const [saveData, setSaveData] = useState<PersistentSaveData>(() =>
    loadSaveData()
  );
  const [lastRunLoot, setLastRunLoot] = useState<{
    goldEarned: number;
    droppedItems: InventoryItem[];
  } | null>(null);
  const [forgeMessage, setForgeMessage] = useState<string | null>(null);

  const [snapshot, setSnapshot] = useState<EngineSnapshot | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [shakeEnabled, setShakeEnabled] = useState(true);
  const [showPerfHud, setShowPerfHud] = useState(false);
  const [showEvolutionGuide, setShowEvolutionGuide] = useState(false);
  const [showStyleBoard, setShowStyleBoard] = useState(false);
  const [arsenalFilter, setArsenalFilter] = useState<
    "all" | "ultimates" | "weapons" | "synergies"
  >("all");
  const [isPaused, setIsPaused] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const upgradeBtnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeRecipeBtnRef = useRef<HTMLButtonElement | null>(null);
  const rewardProcessedRef = useRef(false);

  // Persist save data whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(saveData));
    } catch {
      // ignore storage quota errors
    }
  }, [saveData]);

  // Compute total bonus stats from equipped Inventory items
  const getEquippedItems = () => {
    const wep =
      saveData.inventory.find((i) => i.id === saveData.equipped.weaponItemId) ||
      null;
    const arm =
      saveData.inventory.find((i) => i.id === saveData.equipped.armorItemId) ||
      null;
    const rel =
      saveData.inventory.find((i) => i.id === saveData.equipped.relicItemId) ||
      null;
    return { wep, arm, rel };
  };

  const getLoadoutBonuses = () => {
    const { wep, arm, rel } = getEquippedItems();
    const list = [wep, arm, rel].filter(Boolean) as InventoryItem[];
    let bonusHp = 0;
    let bonusMightPct = 0;
    let bonusSpeedPct = 0;
    let startingWeaponOverride: WeaponId | undefined = undefined;

    for (const item of list) {
      const lvMult = 1 + (item.level - 1) * 0.25;
      bonusHp += Math.round(item.bonusHp * lvMult);
      bonusMightPct += Math.round(item.bonusMightPct * lvMult);
      bonusSpeedPct += Math.round(item.bonusSpeedPct * lvMult);
      if (item.slot === "weapon" && item.weaponOverride) {
        startingWeaponOverride = item.weaponOverride;
      }
    }
    const toVisual = (it: InventoryItem | null) =>
      it
        ? {
            name: it.name,
            iconId: it.iconId,
            rarity:
              it.rarity === "legendary"
                ? ("legendary" as const)
                : it.rarity === "epic"
                  ? ("epic" as const)
                  : ("rare" as const),
            level: it.level,
          }
        : null;

    return {
      bonusHp: bonusHp + idleProgress.training * 10,
      bonusMightPct: bonusMightPct + idleProgress.training * 5,
      bonusSpeedPct,
      startingWeaponOverride,
      equippedVisuals: {
        weapon: toVisual(wep),
        armor: toVisual(arm),
        relic: toVisual(rel),
      },
    };
  };

  // Detect touch device
  useEffect(() => {
    const checkViewportAndInput = () => {
      const coarse =
        window.matchMedia?.("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        window.innerWidth < 640;
      setIsTouchDevice(Boolean(coarse));
    };
    checkViewportAndInput();
    window.addEventListener("resize", checkViewportAndInput);
    return () => window.removeEventListener("resize", checkViewportAndInput);
  }, []);

  const keysRef = useRef<{ [key: string]: boolean }>({});
  const [joyState, setJoyState] = useState<{
    active: boolean;
    startX: number;
    startY: number;
    curX: number;
    curY: number;
  }>({ active: false, startX: 0, startY: 0, curX: 0, curY: 0 });
  const joyStateRef = useRef(joyState);
  joyStateRef.current = joyState;

  const startNewRun = (
    stageOverride?: StageId,
    heroOverride?: HeroId
  ) => {
    const activeStage = stageOverride ?? selectedStageId;
    const activeHero = heroOverride ?? selectedHeroId;
    if (stageOverride) setSelectedStageId(stageOverride);
    if (heroOverride) setSelectedHeroId(heroOverride);

    setShowEvolutionGuide(false);
    setIsPaused(false);
    setLastRunLoot(null);
    rewardProcessedRef.current = false;

    const bonuses = getLoadoutBonuses();
    const engine = new EclipseGameEngine(
      (snap) => {
        setSnapshot(snap);
      },
      shakeEnabled,
      activeStage,
      activeHero,
      bonuses
    );
    engine.configureCompanions(idleProgress);
    engineRef.current = engine;
    setInGame(true);

    // Expose deterministic hooks for automated E2E audit
    (window as unknown as Record<string, unknown>).__ECLIPSE_ENGINE__ = engine;
  };

  // Process End-of-Run Loot Drops & Unlocks once when status becomes "victory" or "game_over"
  useEffect(() => {
    if (!snapshot) return;
    if (
      (snapshot.status === "victory" || snapshot.status === "game_over") &&
      !rewardProcessedRef.current
    ) {
      rewardProcessedRef.current = true;
      const isWin = snapshot.status === "victory";
      const stageOrder = STAGES[snapshot.stageId]?.order || 1;
      const goldEarned =
        snapshot.gold +
        (isWin ? 45 * stageOrder : 15) +
        snapshot.objectivesCompleted * 15;

      const droppedItems: InventoryItem[] = [];
      // Drop 1 guaranteed item if player completed at least 1 objective, killed >= 10 enemies, or won
      if (isWin || snapshot.objectivesCompleted > 0 || snapshot.kills >= 10) {
        const pool = isWin
          ? LOOT_POOL_TEMPLATES.filter(
              (t) => t.rarity === "legendary" || t.rarity === "epic"
            )
          : LOOT_POOL_TEMPLATES;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        droppedItems.push({
          ...pick,
          id: `loot_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          level: 1,
        });
      }

      // Unlock next stage & heroes if conditions met
      setSaveData((prev) => {
        const nextHeroes = new Set<HeroId>(prev.unlockedHeroes);
        const nextStages = new Set<StageId>(prev.unlockedStages);

        if (
          snapshot.newlyUnlocked.some((u) => u.includes("Lyra")) ||
          snapshot.objectivesCompleted >= 1
        ) {
          nextHeroes.add("lyra");
        }
        if (
          snapshot.newlyUnlocked.some((u) => u.includes("Ember")) ||
          snapshot.activeSynergies.length >= 1
        ) {
          nextHeroes.add("ember");
        }
        if (
          snapshot.newlyUnlocked.some((u) => u.includes("Pip")) ||
          snapshot.objectivesCompleted >= 2
        ) {
          nextHeroes.add("pip");
        }
        if (isWin && snapshot.stageId === "courtyard") {
          nextStages.add("mushroom_woods");
        }
        if (isWin && snapshot.stageId === "mushroom_woods") {
          nextStages.add("abandoned_mine");
        }
        if (isWin && snapshot.stageId === "abandoned_mine") {
          nextStages.add("ice_citadel");
        }
        if (isWin && snapshot.stageId === "ice_citadel") {
          nextStages.add("dark_fortress");
        }

        return {
          ...prev,
          gold: prev.gold + goldEarned,
          unlockedHeroes: Array.from(nextHeroes),
          unlockedStages: Array.from(nextStages),
          inventory: [...droppedItems, ...prev.inventory],
        };
      });

      setIdleProgress((prev) => ({
        ...prev,
        summonStones: prev.summonStones + (isWin ? 5 : 2),
        arcaneEssence: prev.arcaneEssence + (isWin ? 20 : 8),
        starrChests:
          prev.starrChests + (isWin || snapshot.objectivesCompleted > 0 ? 1 : 0),
        bossChests: prev.bossChests + (isWin ? 1 : 0),
        stats: {
          ...prev.stats,
          kills: prev.stats.kills + snapshot.kills,
          bossesKilled: prev.stats.bossesKilled + (isWin ? 1 : 0),
          objectivesDone:
            prev.stats.objectivesDone + snapshot.objectivesCompleted,
          encountersClaimed:
            prev.stats.encountersClaimed +
            (engineRef.current?.encounter?.claimed ? 1 : 0),
        },
      }));

      setLastRunLoot({ goldEarned, droppedItems });
    }
  }, [snapshot]);

  // Focus management for modals
  useEffect(() => {
    if (showEvolutionGuide) {
      const id = window.setTimeout(() => {
        closeRecipeBtnRef.current?.focus();
      }, 30);
      return () => window.clearTimeout(id);
    }
    if (snapshot?.status === "level_up") {
      const id = window.setTimeout(() => {
        upgradeBtnRefs.current[0]?.focus();
      }, 30);
      return () => window.clearTimeout(id);
    }
  }, [showEvolutionGuide, snapshot?.status]);

  // Main game loop & keyboard controls
  useEffect(() => {
    if (!inGame) return;

    const getMoveVec = () => {
      let mx = 0;
      let my = 0;
      const k = keysRef.current;
      if (k["KeyW"] || k["ArrowUp"]) my -= 1;
      if (k["KeyS"] || k["ArrowDown"]) my += 1;
      if (k["KeyA"] || k["ArrowLeft"]) mx -= 1;
      if (k["KeyD"] || k["ArrowRight"]) mx += 1;

      const joy = joyStateRef.current;
      if (joy.active) {
        const dx = joy.curX - joy.startX;
        const dy = joy.curY - joy.startY;
        const dist = Math.hypot(dx, dy);
        if (dist > 8) {
          mx = dx / dist;
          my = dy / dist;
        }
      }
      return { mx, my };
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.code;

      if (showEvolutionGuide) {
        if (code === "Escape") {
          e.preventDefault();
          setShowEvolutionGuide(false);
        }
        return;
      }

      if (
        (code === "Escape" || code === "KeyP") &&
        engineRef.current?.status === "playing"
      ) {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        return;
      }

      if(!isPaused&&engineRef.current?.status==="playing"){
        if(code==="KeyQ")engineRef.current.castNova("meteor");
        if(code==="KeyR")engineRef.current.castNova("blizzard");
        if(code==="KeyF")engineRef.current.castNova("thunder");
        if(code==="KeyG")engineRef.current.castNova("blackhole");
        if(code==="KeyT")engineRef.current.castNova("summon_overdrive");
        if(code==="KeyE")engineRef.current.claimEncounter();
      }
      keysRef.current[code] = true;

      if (
        code === "Space" &&
        engineRef.current?.status === "playing" &&
        !isPaused
      ) {
        e.preventDefault();
        const { mx, my } = getMoveVec();
        engineRef.current.triggerDash(mx, my);
      }
      if (code === "Backquote" || code === "F3") {
        e.preventDefault();
        setShowPerfHud((prev) => !prev);
      }

      if (engineRef.current?.status === "level_up") {
        if (code === "Digit1" || code === "Numpad1") {
          const c = engineRef.current.choices[0];
          if (c) engineRef.current.selectUpgradeChoice(c);
        } else if (code === "Digit2" || code === "Numpad2") {
          const c = engineRef.current.choices[1];
          if (c) engineRef.current.selectUpgradeChoice(c);
        } else if (code === "Digit3" || code === "Numpad3") {
          const c = engineRef.current.choices[2];
          if (c) engineRef.current.selectUpgradeChoice(c);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    const clearKeysOnBlur = () => {
      keysRef.current = {};
      setJoyState((prev) =>
        prev.active
          ? { active: false, startX: 0, startY: 0, curX: 0, curY: 0 }
          : prev
      );
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", clearKeysOnBlur);

    let rafId = 0;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const engine = engineRef.current;
      const canvas = canvasRef.current;

      if (engine && canvas) {
        const { mx, my } = getMoveVec();

        if (!showEvolutionGuide && !isPaused) {
          engine.update(dt, mx, my);
        }
        const ctx = canvas.getContext("2d");
        if (ctx) {
          renderEclipseWorld(ctx, canvas.width, canvas.height, engine, now);
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", clearKeysOnBlur);
    };
  }, [inGame, showEvolutionGuide, isPaused]);

  // Resize canvas to viewport
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [inGame]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sfx.muted = !next;
  };

  const toggleShake = () => {
    const next = !shakeEnabled;
    setShakeEnabled(next);
    if (engineRef.current) {
      engineRef.current.shakeEnabled = next;
    }
  };

  const equipItem = (item: InventoryItem) => {
    setSaveData((prev) => {
      const slotKey =
        item.slot === "weapon"
          ? "weaponItemId"
          : item.slot === "armor"
            ? "armorItemId"
            : "relicItemId";
      const currentlyEquipped = prev.equipped[slotKey] === item.id;
      return {
        ...prev,
        equipped: {
          ...prev.equipped,
          [slotKey]: currentlyEquipped ? null : item.id,
        },
      };
    });
  };

  const upgradeInventoryItem = (item: InventoryItem) => {
    const cost = item.level * 30;
    if (saveData.gold < cost) {
      setForgeMessage(
        `Cần ${cost} Vàng để cường hóa (Hiện có ${saveData.gold} Vàng)`
      );
      return;
    }
    setSaveData((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      inventory: prev.inventory.map((it) =>
        it.id === item.id ? { ...it, level: it.level + 1 } : it
      ),
    }));
    setForgeMessage(`Đã cường hóa ${item.name} lên Cấp +${item.level + 1}!`);
  };

  const forgeRandomChest = () => {
    const cost = 40;
    if (saveData.gold < cost) {
      setForgeMessage(`Cần ${cost} Vàng để mở Rương Thợ Rèn!`);
      return;
    }
    const pick =
      LOOT_POOL_TEMPLATES[
        Math.floor(Math.random() * LOOT_POOL_TEMPLATES.length)
      ];
    const newItem: InventoryItem = {
      ...pick,
      id: `forge_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      level: 1,
    };
    setSaveData((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      inventory: [newItem, ...prev.inventory],
    }));
    setForgeMessage(`Mở Rương nhận được: ${newItem.name}!`);
  };

  const selectedHero = HEROES[selectedHeroId];
  const selectedStage = STAGES[selectedStageId] || STAGES.courtyard;
  const loadoutBonuses = getLoadoutBonuses();
  const equippedItems = getEquippedItems();
  const effectiveStartWeapon =
    loadoutBonuses.startingWeaponOverride || selectedHero.startingWeapon;

  // ============================================================================
  // LOBBY SCREEN (CHỌN NHÂN VẬT -> KHO ĐỒ TRANG BỊ -> CHỌN 5 MÀN)
  // ============================================================================
  if (!inGame) {
    return (
      <div className="h-[100dvh] w-screen bg-[#110d0a] text-[#fef3c7] flex flex-col justify-between p-2 sm:p-4 select-none overflow-y-auto relative">
        <div
          className="fixed inset-0 pointer-events-none opacity-90"
          style={{
            background:
              "radial-gradient(circle at 50% 20%, rgba(56, 189, 248, 0.14), rgba(20, 14, 10, 0.96) 72%)",
          }}
        />

        {/* TOP CURRENCY & COMBAT POWER HEADER (Legend of Slime Style) */}
        <header className="relative z-10 w-full max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-[#3f2e21]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 border border-amber-300 text-[#fffbeb] text-[10px] sm:text-xs font-black uppercase tracking-wider shadow">
              ⚔️ Lực Chiến: {(Math.round(
  (selectedHero.statMods.maxHp + loadoutBonuses.bonusHp) * 12 +
    (100 + loadoutBonuses.bonusMightPct) * 35 +
    idleProgress.squad.reduce(
      (sum, id) =>
        sum +
        (idleProgress.levels[id] || 1) * 140 +
        (idleProgress.evolutions[id] || 0) * 650,
      0
    )
)).toLocaleString()}
            </span>
            <h1 className="text-sm sm:text-lg font-black tracking-tight text-[#fffbeb] drop-shadow-[0_2px_0_#000]">
              KỴ SĨ LAM KIẾM • IDLE RPG
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* Glossy Resource Capsules */}
            <button
              type="button"
              onClick={() => setLobbyTab("inventory")}
              className="px-2.5 py-1 rounded-full bg-[#141a26] border-2 border-amber-500/80 text-amber-300 text-[11px] font-black flex items-center gap-1.5 shadow cursor-pointer hover:border-amber-300"
            >
              <GameSvgIcon id="gold" size={20} />
              <span>{saveData.gold.toLocaleString()}</span>
            </button>

            <button
              type="button"
              onClick={() => setLobbyTab("gacha")}
              className="px-2.5 py-1 rounded-full bg-[#101c28] border-2 border-sky-400/80 text-sky-200 text-[11px] font-black flex items-center gap-1.5 shadow cursor-pointer hover:border-sky-300"
            >
              <span className="flex items-center gap-1">
                <GameSvgIcon id="stone" size={20} />
                {idleProgress.summonStones}
              </span>
              <span className="text-sky-500/60">|</span>
              <span className="text-purple-300 flex items-center gap-1">
                <GameSvgIcon id="essence" size={20} />
                {idleProgress.arcaneEssence}
              </span>
              <span className="text-sky-500/60">|</span>
              <span className="text-orange-300 flex items-center gap-1">
                <GameSvgIcon id="chest" size={20} />
                {idleProgress.starrChests + idleProgress.bossChests}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowStyleBoard(true)}
              className="px-2.5 py-1 rounded-full bg-[#182030] border border-amber-400/70 text-amber-200 text-[10.5px] font-black cursor-pointer hover:border-amber-300"
              title="Xem Bảng Mẫu Phong Cách & Tài Nguyên Battle for Wesnoth"
            >
              🎨 Bảng Mẫu UI
            </button>

            <button
              type="button"
              onClick={() =>
                setSaveData((prev) => ({
                  ...prev,
                  sandboxUnlockAll: !prev.sandboxUnlockAll,
                }))
              }
              className={`px-2.5 py-1 rounded-full text-[10.5px] font-black border cursor-pointer ${
                saveData.sandboxUnlockAll
                  ? "bg-emerald-950/90 border-emerald-400 text-emerald-200"
                  : "bg-[#1c140d] border-amber-500/50 text-amber-200"
              }`}
            >
              {saveData.sandboxUnlockAll ? "🔓 Mở Toàn Bộ" : "🔓 Mở Khóa"}
            </button>

            <button
              type="button"
              onClick={toggleShake}
              className="px-2 py-1 rounded-full bg-[#1c140d] border border-[#4a3525] text-[10.5px] font-bold cursor-pointer"
            >
              {shakeEnabled ? "📳" : "📴"}
            </button>
            <button
              type="button"
              onClick={toggleSound}
              className="px-2 py-1 rounded-full bg-[#1c140d] border border-[#4a3525] text-[10.5px] font-bold cursor-pointer"
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
          </div>
        </header>

        {/* COMPACT SINGLE-LINE STATUS BAR FOR SUB-TABS (NO CLUTTERED DUPLICATE LEFT COLUMN!) */}
        {lobbyTab !== "stages" && (
          <div className="relative z-10 w-full max-w-6xl mx-auto mt-1.5 px-3 py-2 rounded-xl bg-[#121826]/95 border border-[#334155] flex flex-wrap items-center justify-between gap-2 shadow">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <div className="flex items-center gap-2 pr-2 border-r border-[#334155]">
                <img
                  src={selectedHero.portraitUrl}
                  alt={selectedHero.name}
                  className="w-8 h-8 rounded-lg object-cover border border-amber-400"
                />
                <div>
                  <div className="text-[11px] font-black text-white leading-tight">
                    {selectedHero.name.split("•")[0].trim()}
                  </div>
                  <div className="text-[9.5px] font-bold text-emerald-300">
                    ❤️ {selectedHero.statMods.maxHp + loadoutBonuses.bonusHp} · ⚔️ +{loadoutBonuses.bonusMightPct}% Công
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 pr-2 border-r border-[#334155]">
                <span className="text-[10px] font-extrabold text-amber-300 mr-1">
                  Đội {idleProgress.squad.length}/5:
                </span>
                {idleProgress.squad.map((id) => {
                  const f = getPetForm(id, idleProgress.evolutions[id] || 0);
                  return (
                    <img
                      key={id}
                      src={f.portraitUrl}
                      alt={f.name}
                      className="w-7 h-7 rounded-md object-cover border border-amber-400/70 bg-[#0b0e14]"
                      title={f.name}
                    />
                  );
                })}
              </div>
              <span className="text-[10.5px] font-extrabold text-sky-200">
                🎯 Mục tiêu: <strong className="text-amber-300">{selectedStage.name}</strong> (Boss: {selectedStage.bossName})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLobbyTab("stages")}
                className="px-2.5 py-1.5 rounded-lg bg-[#1c2436] border border-slate-500 text-[10.5px] font-black text-slate-200 cursor-pointer hover:border-amber-300"
              >
                ◀ Sảnh Chiến Đấu
              </button>
              <button
                type="button"
                onClick={() => startNewRun()}
                className="px-3.5 py-1.5 rounded-lg pixel-btn-primary text-[11px] font-black uppercase cursor-pointer shadow"
              >
                ▶ Vào Trận Ngay
              </button>
            </div>
          </div>
        )}

        {/* MAIN HUB CONTAINER: DEDICATED PER-TAB VIEW (INSPIRED BY CRAZY GUNNER BOTTOM-TAB LAYOUT) */}
        <main
          className={`relative z-10 w-full max-w-6xl mx-auto my-auto py-1.5 ${
            lobbyTab === "stages"
              ? "grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch"
              : "flex flex-col"
          }`}
        >
          {/* LEFT COLUMN (ONLY SHOWN ON "stages" BATTLE HUB TAB): LIVE STAGE THEATER + 4-STEP CLEAR FLOW */}
          {lobbyTab === "stages" && (
          <section className="lg:col-span-5 slime-stage-banner p-2.5 sm:p-3 flex flex-col justify-between gap-2">
            {/* 4-STEP CLEAR FLOW SUMMARY FOR NEW PLAYERS: ĐỘI ĐANG DÙNG -> SỨC MẠNH -> MỤC TIÊU TIẾP THEO -> VÀO TRẬN */}
            <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-xl bg-[#0d121d] border border-[#334155] text-[10px]">
              <div className="px-2 py-1 rounded-lg bg-[#151c2c] border border-amber-500/40">
                <span className="text-amber-300 font-black block">1. ĐỘI ĐANG DÙNG</span>
                <span className="text-white font-bold truncate block">
                  {selectedHero.name.split("•")[0].trim()} + {idleProgress.squad.length}/5 Thú
                </span>
              </div>
              <div className="px-2 py-1 rounded-lg bg-[#151c2c] border border-emerald-500/40">
                <span className="text-emerald-300 font-black block">2. SỨC MẠNH</span>
                <span className="text-white font-bold block">
                  ❤️{selectedHero.statMods.maxHp + loadoutBonuses.bonusHp} · ⚔️+{loadoutBonuses.bonusMightPct}%
                </span>
              </div>
              <div className="px-2 py-1 rounded-lg bg-[#151c2c] border border-sky-500/40">
                <span className="text-sky-300 font-black block">3. MỤC TIÊU</span>
                <span className="text-white font-bold truncate block">
                  Màn {selectedStage.order}/5: {selectedStage.badge}
                </span>
              </div>
            </div>

            {/* 1. STAGE PROGRESS HEADER & CHAPTER STEPPER (CRAZY GUNNER STYLE) */}
            <div>
              <div
                className="p-2 rounded-xl border-2 border-[#fbbf24]/70 flex items-center justify-between gap-2 mb-2 shadow relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(16, 22, 34, 0.94) 0%, rgba(28, 22, 18, 0.85) 60%, rgba(16, 22, 34, 0.92) 100%), url(${selectedStage.bgUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    const idx = STAGE_LIST.findIndex((s) => s.id === selectedStageId);
                    const prev = STAGE_LIST[(idx - 1 + STAGE_LIST.length) % STAGE_LIST.length];
                    if (saveData.sandboxUnlockAll || prev.order === 1 || saveData.unlockedStages.includes(prev.id)) {
                      setSelectedStageId(prev.id);
                    }
                  }}
                  className="w-8 h-9 rounded-lg bg-[#111622]/95 border border-amber-400/75 text-xs font-black text-amber-300 hover:bg-[#1e2638] shrink-0 cursor-pointer"
                  title="Màn trước"
                >
                  ◀
                </button>
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <img
                    src={selectedStage.bossPortraitUrl}
                    alt={selectedStage.bossName}
                    className="w-11 h-11 rounded-lg object-cover border-2 border-rose-500/80 bg-[#0b0e14] shrink-0 shadow-md"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500 text-[#140e0a] text-[9.5px] font-black uppercase">
                        CHƯƠNG {selectedStage.order}/5
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#fffbeb] leading-tight">
                        {selectedStage.name.replace(/^Màn \d:\s*/, "")}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-rose-300 mt-0.5 leading-tight">
                      💀 Boss: {selectedStage.bossName}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const idx = STAGE_LIST.findIndex((s) => s.id === selectedStageId);
                    const next = STAGE_LIST[(idx + 1) % STAGE_LIST.length];
                    if (saveData.sandboxUnlockAll || next.order === 1 || saveData.unlockedStages.includes(next.id)) {
                      setSelectedStageId(next.id);
                    }
                  }}
                  className="w-8 h-9 rounded-lg bg-[#111622]/95 border border-amber-400/75 text-xs font-black text-amber-300 hover:bg-[#1e2638] shrink-0 cursor-pointer"
                  title="Màn tiếp theo"
                >
                  ▶
                </button>
              </div>

              {/* LIVE BATTLE DIORAMA WITH 5 COMPANIONS OVERLAY */}
              <div className="rounded-xl overflow-hidden border-2 border-[#4a3525] bg-[#140e0a]">
                <div className="relative">
                  <LobbyDioramaPreview
                    heroId={selectedHeroId}
                    stageId={selectedStageId}
                    effectiveWeapon={effectiveStartWeapon}
                    equippedVisuals={loadoutBonuses.equippedVisuals}
                  />

                  {/* Top-Left Floating Auto Pills & Top-Right Live Loadout Visual Strip */}
                  <div className="slime-stage-overlay-top justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setIdleProgress((p) => ({ ...p, auto: !p.auto }))
                        }
                        className={`slime-auto-chip ${
                          idleProgress.auto ? "on-green" : ""
                        }`}
                      >
                        🤖 AUTO: {idleProgress.auto ? "BẬT" : "TẮT"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setIdleProgress((p) => ({
                            ...p,
                            autoUpgrade: !p.autoUpgrade,
                          }))
                        }
                        className={`slime-auto-chip ${
                          idleProgress.autoUpgrade ? "on-amber" : ""
                        }`}
                      >
                        ⚡ AUTO SKILL: {idleProgress.autoUpgrade ? "BẬT" : "TẮT"}
                      </button>
                    </div>

                    {/* Live Hero & 3 Equipped Gear Mini Visual Strip */}
                    <div
                      onClick={() => setLobbyTab("inventory")}
                      title="Nhấn để đổi Trang Bị"
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#0b0e14]/90 border border-amber-400/70 cursor-pointer shadow"
                    >
                      <img
                        src={selectedHero.unitUrl}
                        alt={selectedHero.name}
                        className="w-5 h-5 object-contain"
                      />
                      <GameSvgIcon
                        id={
                          equippedItems.wep
                            ? equippedItems.wep.iconId
                            : WEAPONS[effectiveStartWeapon].icon
                        }
                        size={18}
                      />
                      {equippedItems.arm && (
                        <GameSvgIcon id={equippedItems.arm.iconId} size={18} />
                      )}
                      {equippedItems.rel && (
                        <GameSvgIcon id={equippedItems.rel.iconId} size={18} />
                      )}
                    </div>
                  </div>

                  {/* 5 Equipped Companion Sprites Accompanying Hero on Stage */}
                  <div className="slime-stage-companions">
                    <div className="slime-companion-group">
                      {idleProgress.squad.slice(0, 3).map((id) => {
                        const evo = idleProgress.evolutions[id] || 0;
                        const form = getPetForm(id, evo);
                        return (
                          <img
                            key={id}
                            src={form.spriteUrl}
                            alt={form.name}
                            className="slime-companion-sprite"
                          />
                        );
                      })}
                    </div>
                    <div className="slime-companion-group">
                      {idleProgress.squad.slice(3, 5).map((id) => {
                        const evo = idleProgress.evolutions[id] || 0;
                        const form = getPetForm(id, evo);
                        return (
                          <img
                            key={id}
                            src={form.spriteUrl}
                            alt={form.name}
                            className="slime-companion-sprite"
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Hero Portrait & Starting Weapon Bar */}
                <div className="px-2.5 py-2 bg-[#121722]/98 border-t border-[#3f2e21] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={selectedHero.portraitUrl}
                      alt={selectedHero.name}
                      className="w-12 h-12 rounded-lg object-cover border-2 border-amber-400/80 bg-[#0b0e14] shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[9.5px] font-black uppercase text-amber-400 block leading-tight">
                        {selectedHero.roleTag}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#fffbeb] block leading-tight mt-0.5">
                        {selectedHero.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[#0d121c] border border-sky-400/60 shrink-0 whitespace-nowrap">
                    <div className="w-8 h-8 rounded-md overflow-hidden border border-sky-400/80 shrink-0">
                      <GameSvgIcon
                        id={WEAPONS[effectiveStartWeapon].icon}
                        size={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-extrabold text-sky-200">
                      {WEAPONS[effectiveStartWeapon].name}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 HERO SELECTOR TILES WITH FULL-BLEED WESNOTH PORTRAITS */}
              <div className="mt-2">
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <span className="text-[10.5px] font-black uppercase tracking-wider text-amber-300">
                    👑 CHỌN TƯỚNG XUẤT CHIẾN (4 HỆ)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-300 shrink-0 whitespace-nowrap">
                    ❤️ {selectedHero.statMods.maxHp + loadoutBonuses.bonusHp} Máu · ⚔️ +{loadoutBonuses.bonusMightPct}% Công
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(Object.keys(HEROES) as HeroId[]).map((hId) => {
                    const h = HEROES[hId];
                    const isSelected = selectedHeroId === hId;
                    const parts = h.name.split("•").map((s) => s.trim());
                    return (
                      <button
                        key={hId}
                        type="button"
                        onClick={() => setSelectedHeroId(hId)}
                        className={`hero-select-tile ${isSelected ? "selected" : ""}`}
                        title={`${h.name} — ${WEAPONS[h.startingWeapon].name}`}
                      >
                        <img
                          src={h.portraitUrl}
                          alt={h.name}
                          className="hero-tile-portrait"
                        />
                        <div className="hero-select-wep-badge">
                          <GameSvgIcon
                            id={WEAPONS[h.startingWeapon].icon}
                            size={22}
                          />
                        </div>
                        <div className="hero-select-label">
                          <strong>{parts[0]}</strong>
                          <small>{parts[1] || h.title}</small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. 5 FULL-BLEED ULTIMATE SKILL SLOTS + 3 FULL-BLEED EQUIPPED GEAR SLOTS */}
            <div className="p-2 rounded-xl bg-[#111622] border border-[#334155] space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10.5px] font-black uppercase text-amber-300">
                    ⚡ 5 Ô ĐẠI TUYỆT KỸ TRANG BỊ ([Q] [R] [F] [G] [T])
                  </span>
                  <button
                    type="button"
                    onClick={() => setLobbyTab("arsenal")}
                    className="text-[10px] font-extrabold text-sky-300 underline cursor-pointer"
                  >
                    Chi tiết Kỹ Năng →
                  </button>
                </div>
                <div className="slime-5-grid">
                  {(
                    [
                      {
                        icon: "nova_meteor" as GameIconId,
                        name: "Thiên Thạch",
                        key: "Q",
                        border: "#f97316",
                      },
                      {
                        icon: "nova_blizzard" as GameIconId,
                        name: "Bão Băng",
                        key: "R",
                        border: "#38bdf8",
                      },
                      {
                        icon: "nova_thunder" as GameIconId,
                        name: "Vạn Lôi",
                        key: "F",
                        border: "#facc15",
                      },
                      {
                        icon: "nova_blackhole" as GameIconId,
                        name: "Hố Đen",
                        key: "G",
                        border: "#c084fc",
                      },
                      {
                        icon: "nova_overdrive" as GameIconId,
                        name: "Đồng Kích",
                        key: "T",
                        border: "#fbbf24",
                      },
                    ] as const
                  ).map((sk, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLobbyTab("arsenal")}
                      style={{
                        borderColor: sk.border,
                      }}
                      className="slime-mini-ult-tile"
                      title={`${sk.name} (Phím [${sk.key}])`}
                    >
                      <span
                        className="slime-mini-ult-key"
                        style={{ borderColor: sk.border }}
                      >
                        {sk.key}
                      </span>
                      <GameSvgIcon id={sk.icon} size={76} />
                      <span className="slime-mini-ult-label">
                        {sk.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Equipped Gear Tiles with 46x46 Full-Bleed Icons */}
              <div className="pt-1.5 border-t border-[#263147] grid grid-cols-3 gap-1.5">
                {(
                  [
                    {
                      label: "Vũ Khí",
                      item: equippedItems.wep,
                      fallbackIcon: WEAPONS[selectedHero.startingWeapon].icon,
                    },
                    {
                      label: "Giáp Chiến",
                      item: equippedItems.arm,
                      fallbackIcon: "armor" as GameIconId,
                    },
                    {
                      label: "Bảo Vật",
                      item: equippedItems.rel,
                      fallbackIcon: "ring" as GameIconId,
                    },
                  ] as const
                ).map((slot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLobbyTab("inventory")}
                    className={`p-1.5 rounded-lg text-left flex items-center gap-2 cursor-pointer border ${
                      slot.item
                        ? "border-amber-400/80 bg-[#1c2333]"
                        : "border-[#334155] bg-[#131824] opacity-85"
                    }`}
                  >
                    <div className="w-11 h-11 rounded-lg bg-[#0b0e14] overflow-hidden shrink-0 border-2 border-amber-400/75 p-0">
                      <GameSvgIcon
                        id={slot.item ? slot.item.iconId : slot.fallbackIcon}
                        size={44}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] uppercase text-amber-300/90 font-extrabold">
                        {slot.label}
                      </div>
                      <div className="text-[10px] font-black text-[#fffbeb] leading-tight mt-0.5">
                        {slot.item
                          ? `+${slot.item.level} ${slot.item.name}`
                          : "Trống"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. BIG GLOSSY BOSS CHALLENGE / LAUNCH CTA BUTTON */}
            <button
              type="button"
              onClick={() => startNewRun()}
              className="w-full py-3 rounded-xl pixel-btn-primary font-black text-sm sm:text-base tracking-wide uppercase cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              <span>▶ BẮT ĐẦU CHIẾN ĐẤU ({selectedStage.name.toUpperCase()})</span>
            </button>
          </section>
          )}

          {/* RIGHT / FULL-WIDTH PANEL: FOCUSED CONTENT FOR THE SELECTED BOTTOM TAB */}
          <section
            className={`${
              lobbyTab === "stages" ? "lg:col-span-7" : "w-full"
            } slime-stage-banner p-3 sm:p-3.5 flex flex-col justify-between gap-2`}
          >
            <div className="flex-1">
              {/* TAB 1, 2, 6: COMPANION DECK (5/5), GACHA SUMMON SHOP & QUESTS */}
              {(lobbyTab === "pets" ||
                lobbyTab === "gacha" ||
                lobbyTab === "quests") && (
                <IdleHub
                  progress={idleProgress}
                  setProgress={setIdleProgress}
                  gold={saveData.gold}
                  changeGold={(amount) =>
                    setSaveData((p) => ({
                      ...p,
                      gold: Math.max(0, p.gold + amount),
                    }))
                  }
                  onAddInventoryItem={(item) =>
                    setSaveData((p) => ({
                      ...p,
                      inventory: [item, ...p.inventory],
                    }))
                  }
                  activeSection={
                    lobbyTab === "pets"
                      ? "beasts"
                      : lobbyTab === "gacha"
                        ? "gacha"
                        : "quests"
                  }
                  sandboxMode={saveData.sandboxUnlockAll}
                />
              )}

              {/* TAB 3: 5 STAGES CAMPAIGN MAP WITH WESNOTH LANDSCAPES & BOSS PORTRAITS */}
              {lobbyTab === "stages" && (
                <div className="space-y-2.5 slime-scroll-area">
                  <div className="flex items-center justify-between text-xs font-black uppercase text-amber-300 pb-1 border-b border-[#334155]">
                    <span>🗺️ BẢN ĐỒ 5 CHƯƠNG CHIẾN DỊCH (CHỌN MÀN & KHIÊU CHIẾN BOSS)</span>
                    <span className="text-[10.5px] text-emerald-300">
                      Đã mở khóa {saveData.sandboxUnlockAll ? 5 : saveData.unlockedStages.length}/5 Màn
                    </span>
                  </div>
                  {STAGE_LIST.map((st, idx) => {
                    const isUnlocked =
                      st.playable &&
                      (saveData.sandboxUnlockAll ||
                        idx === 0 ||
                        saveData.unlockedStages.includes(st.id));
                    const isSelected = selectedStageId === st.id;

                    return (
                      <div
                        key={st.id}
                        data-stage-id={st.id}
                        onClick={() => {
                          if (st.playable && isUnlocked) {
                            setSelectedStageId(st.id);
                          }
                        }}
                        className={`p-2.5 rounded-xl transition-all border-2 flex items-center gap-3 ${
                          !isUnlocked
                            ? "border-[#263147] bg-[#111622] opacity-65 cursor-not-allowed"
                            : isSelected
                              ? "border-[#fde047] bg-gradient-to-r from-[#2c2112] via-[#1c2334] to-[#141a26] shadow-md cursor-pointer"
                              : "border-[#334155] bg-[#141a26] hover:border-amber-400/70 cursor-pointer"
                        }`}
                      >
                        <div className="stage-card-thumb">
                          <img
                            src={st.bgUrl}
                            alt={st.name}
                          />
                          <span
                            className="slime-icon-badge"
                            style={{
                              color: st.color,
                              borderColor: st.color,
                              left: 4,
                              right: "auto",
                            }}
                          >
                            {!isUnlocked
                              ? `🔒 Màn ${st.order}`
                              : isSelected
                                ? "✓ Đang Chọn"
                                : `Màn ${st.order}`}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <span className="text-xs sm:text-sm font-black text-[#fffbeb]">
                              {st.name}
                            </span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-950/90 border border-rose-500/60 text-rose-200">
                              💀 {st.bossName}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#cbd5e1] mt-1 leading-snug">
                            • <strong className="text-amber-300">{st.badge}:</strong>{" "}
                            {st.mechanicDesc}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0b0e14] border border-slate-600 text-[9.5px] font-bold text-slate-200">
                              <img src={st.mobMeleeUrl} alt={st.mobMeleeName} className="w-4 h-4 object-contain" />
                              {st.mobMeleeName}
                            </span>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0b0e14] border border-slate-600 text-[9.5px] font-bold text-slate-200">
                              <img src={st.mobRangedUrl} alt={st.mobRangedName} className="w-4 h-4 object-contain" />
                              {st.mobRangedName}
                            </span>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0b0e14] border border-amber-500/60 text-[9.5px] font-bold text-amber-200">
                              <img src={st.mobEliteUrl} alt={st.mobEliteName} className="w-4 h-4 object-contain" />
                              ★ {st.mobEliteName}
                            </span>
                          </div>
                        </div>

                        <div className="stage-card-boss-frame">
                          <img
                            src={st.bossPortraitUrl}
                            alt={st.bossName}
                            title={`Boss: ${st.bossName}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 4: GEAR COLLECTION & BLACKSMITH WITH 58x58 FULL-BLEED ICONS */}
              {lobbyTab === "inventory" && (
                <div className="space-y-2.5">
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#1c2333] to-[#131824] border-2 border-amber-500/65 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-amber-400 bg-[#0b0e14] shrink-0 p-0">
                        <GameSvgIcon id="chest_ornate" size={48} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-amber-300">
                          KHO THẦN KHÍ & XƯỞNG RÈN TRANG BỊ ({saveData.inventory.length} Món)
                        </div>
                        <p className="text-[10.5px] text-[#cbd5e1]">
                          Mặc Vũ Khí, Giáp Chiến, Bảo Vật và cường hóa +Cấp để tăng mạnh Lực Chiến.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={forgeRandomChest}
                      className="px-3.5 py-2 min-h-[42px] rounded-xl pixel-btn-primary text-xs font-black flex items-center gap-2 shrink-0 cursor-pointer shadow"
                    >
                      <GameSvgIcon id="chest" size={22} />
                      <span>🔨 Rèn Đồ Mới (40 Vàng)</span>
                    </button>
                  </div>

                  {forgeMessage && (
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center justify-between">
                      <span>✨ {forgeMessage}</span>
                      <button
                        type="button"
                        onClick={() => setForgeMessage(null)}
                        className="text-[10px] underline ml-2 cursor-pointer"
                      >
                        Đóng
                      </button>
                    </div>
                  )}

                  {/* 3 EQUIPPED SLOTS SUMMARY STRIP AT TOP OF INVENTORY */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(
                      [
                        {
                          label: "Ô VŨ KHÍ ĐANG MẶC",
                          item: equippedItems.wep,
                          fallbackIcon: WEAPONS[selectedHero.startingWeapon].icon,
                        },
                        {
                          label: "Ô GIÁP CHIẾN ĐANG MẶC",
                          item: equippedItems.arm,
                          fallbackIcon: "armor" as GameIconId,
                        },
                        {
                          label: "Ô BẢO VẬT ĐANG MẶC",
                          item: equippedItems.rel,
                          fallbackIcon: "ring" as GameIconId,
                        },
                      ] as const
                    ).map((slot, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl flex items-center justify-between gap-2 border-2 ${
                          slot.item
                            ? "border-amber-400/80 bg-[#172030]"
                            : "border-[#334155] bg-[#111622] opacity-85"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-12 h-12 rounded-lg bg-[#0b0e14] overflow-hidden shrink-0 border-2 border-amber-400/75 p-0">
                            <GameSvgIcon
                              id={slot.item ? slot.item.iconId : slot.fallbackIcon}
                              size={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[9.5px] uppercase text-amber-300 font-black">
                              {slot.label}
                            </div>
                            <div className="text-xs font-black text-white truncate">
                              {slot.item ? `+${slot.item.level} ${slot.item.name}` : "Chưa Trang Bị"}
                            </div>
                            {slot.item && (
                              <div className="text-[10px] font-bold text-emerald-300">
                                ❤️+{Math.round(slot.item.bonusHp * (1 + (slot.item.level - 1) * 0.25))} · ⚔️+{Math.round(slot.item.bonusMightPct * (1 + (slot.item.level - 1) * 0.25))}%
                              </div>
                            )}
                          </div>
                        </div>
                        {slot.item && (
                          <button
                            type="button"
                            onClick={() => equipItem(slot.item!)}
                            className="px-2 py-1 rounded bg-rose-950/90 border border-rose-400/70 text-[10px] font-black text-rose-200 cursor-pointer shrink-0"
                          >
                            Tháo
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 slime-scroll-area">
                    {saveData.inventory.map((item) => {
                      const isEquipped =
                        saveData.equipped.weaponItemId === item.id ||
                        saveData.equipped.armorItemId === item.id ||
                        saveData.equipped.relicItemId === item.id;
                      const badge = getRarityBadge(item.rarity);
                      const lvMult = 1 + (item.level - 1) * 0.25;
                      const nextLvMult = 1 + item.level * 0.25;
                      const hpStat = Math.round(item.bonusHp * lvMult);
                      const mightStat = Math.round(item.bonusMightPct * lvMult);
                      const spdStat = Math.round(item.bonusSpeedPct * lvMult);
                      const nextHpStat = Math.round(item.bonusHp * nextLvMult);
                      const nextMightStat = Math.round(item.bonusMightPct * nextLvMult);
                      const upgCost = item.level * 30;
                      const canAffordUpg = saveData.gold >= upgCost;

                      // Compare against currently equipped item in the same slot
                      const curSlotItem =
                        item.slot === "weapon"
                          ? equippedItems.wep
                          : item.slot === "armor"
                          ? equippedItems.arm
                          : equippedItems.rel;
                      const curSlotMult = curSlotItem ? 1 + (curSlotItem.level - 1) * 0.25 : 0;
                      const diffHp = hpStat - (curSlotItem ? Math.round(curSlotItem.bonusHp * curSlotMult) : 0);
                      const diffMight = mightStat - (curSlotItem ? Math.round(curSlotItem.bonusMightPct * curSlotMult) : 0);

                      const borderCol =
                        item.rarity === "legendary"
                          ? "#f59e0b"
                          : item.rarity === "epic"
                            ? "#c084fc"
                            : "#38bdf8";

                      return (
                        <div
                          key={item.id}
                          style={{ "--tile-border": borderCol } as React.CSSProperties}
                          className={`slime-skill-tile flex flex-col justify-between gap-2 ${
                            isEquipped ? "ring-2 ring-[#fde047]" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="slime-icon-frame">
                              <GameSvgIcon id={item.iconId} size={58} />
                              <span className="slime-icon-badge">
                                +{item.level}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <span className="text-xs font-black text-[#fffbeb] leading-tight">
                                  {item.name}
                                </span>
                                <span
                                  className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full border shrink-0 ${badge.bg} ${badge.border} ${badge.text}`}
                                >
                                  {badge.label}
                                </span>
                              </div>
                              <p className="text-[10.5px] text-[#cbd5e1] mt-1 leading-snug">
                                {item.desc}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-1 text-[10.5px] font-extrabold text-emerald-300">
                                {hpStat > 0 && (
                                  <span>
                                    ❤️ +{hpStat} ➔ +{nextHpStat} Máu
                                  </span>
                                )}
                                {mightStat > 0 && (
                                  <span>
                                    ⚔️ +{mightStat}% ➔ +{nextMightStat}% Công
                                  </span>
                                )}
                                {spdStat > 0 && <span>👟 +{spdStat}% Tốc</span>}
                              </div>
                              {!isEquipped && (
                                <div className="text-[10px] font-bold mt-0.5 text-sky-300">
                                  So với đồ đang mặc:{" "}
                                  <span className={diffHp >= 0 ? "text-emerald-300" : "text-rose-300"}>
                                    {diffHp >= 0 ? `+${diffHp}` : diffHp} Máu
                                  </span>{" "}
                                  ·{" "}
                                  <span className={diffMight >= 0 ? "text-emerald-300" : "text-rose-300"}>
                                    {diffMight >= 0 ? `+${diffMight}%` : `${diffMight}%`} Công
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 pt-1.5 border-t border-[#263147]">
                            <button
                              type="button"
                              onClick={() => equipItem(item)}
                              className={`flex-1 py-2 min-h-[40px] rounded-lg text-[11px] font-black cursor-pointer ${
                                isEquipped
                                  ? "pixel-btn text-amber-300"
                                  : "pixel-btn-primary"
                              }`}
                            >
                              {isEquipped ? "✓ Đang Mặc (Tháo)" : "Trang Bị Ngay"}
                            </button>
                            <button
                              type="button"
                              onClick={() => upgradeInventoryItem(item)}
                              className="px-2.5 py-2 min-h-[40px] rounded-lg pixel-btn text-[10.5px] font-black text-amber-200 cursor-pointer flex items-center gap-1"
                              title={
                                canAffordUpg
                                  ? `Cường hóa +${item.level} ➔ +${item.level + 1}`
                                  : `Còn thiếu ${upgCost - saveData.gold} Vàng`
                              }
                            >
                              <span>
                                {canAffordUpg
                                  ? `⬆️ +${item.level}➔+${item.level + 1} (${upgCost}G)`
                                  : `Thiếu ${upgCost - saveData.gold}G`}
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: SKILL COLLECTION & SYNERGIES WITH 58x58 FULL-BLEED ICONS */}
              {lobbyTab === "arsenal" && (
                <div className="space-y-3 slime-scroll-area">
                  {/* Sub-Category Filter Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1.5 border-b border-[#263147]">
                    <div className="flex flex-wrap gap-1.5">
                      {(
                        [
                          { id: "all", label: "Tất Cả Kỹ Năng" },
                          { id: "ultimates", label: "☄️ 5 Đại Tuyệt Kỹ" },
                          { id: "weapons", label: "⚔️ 8 Vũ Khí Tiến Hóa" },
                          { id: "synergies", label: "✦ 5 Hợp Kích" },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setArsenalFilter(tab.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black cursor-pointer border ${
                            arsenalFilter === tab.id
                              ? "bg-amber-600/90 border-amber-300 text-white"
                              : "bg-[#131924] border-[#334155] text-slate-300 hover:border-amber-400/60"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10.5px] font-bold text-emerald-300">
                      Tự động xả chiêu hoặc bấm phím [Q]-[T]
                    </span>
                  </div>

                  {/* PHẦN A: 5 ĐẠI TUYỆT KỸ CHỦ ĐỘNG */}
                  {(arsenalFilter === "all" || arsenalFilter === "ultimates") && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                          ☄️ MỤC A · 5 ĐẠI TUYỆT KỸ CHỦ ĐỘNG (TRANG BỊ 5/5 Ô)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(
                          [
                            {
                              icon: "nova_meteor" as GameIconId,
                              name: "Thiên Thạch Hủy Diệt",
                              key: "Phím [Q]",
                              cd: "18s",
                              radius: "320px",
                              element: "Hỏa Diệm",
                              border: "#f97316",
                              glow: "rgba(249, 115, 22, 0.45)",
                              desc: "Mưa thiên thạch nổ 320px quanh tâm, gây sát thương cực đại và thiêu đốt 4 giây.",
                            },
                            {
                              icon: "nova_blizzard" as GameIconId,
                              name: "Bão Băng Vĩnh Cửu",
                              key: "Phím [R]",
                              cd: "20s",
                              radius: "340px",
                              element: "Hàn Băng",
                              border: "#38bdf8",
                              glow: "rgba(56, 189, 248, 0.45)",
                              desc: "Bão tuyết 340px đóng băng cứng 1.8 giây và làm chậm 70% toàn bộ đàn quái.",
                            },
                            {
                              icon: "nova_thunder" as GameIconId,
                              name: "Vạn Lôi Thiên Ngục",
                              key: "Phím [F]",
                              cd: "17s",
                              radius: "360px",
                              element: "Lôi Điện",
                              border: "#facc15",
                              glow: "rgba(250, 204, 21, 0.45)",
                              desc: "Giáng hàng chục cột sét liên hoàn 360px, gây choáng 1.4 giây và kích hoạt từ trường.",
                            },
                            {
                              icon: "nova_blackhole" as GameIconId,
                              name: "Hố Đen Hư Không",
                              key: "Phím [G]",
                              cd: "22s",
                              radius: "340px",
                              element: "Hư Không",
                              border: "#c084fc",
                              glow: "rgba(192, 132, 252, 0.45)",
                              desc: "Xoáy trọng lực kéo tuột mọi kẻ địch trong 340px về tâm rồi phát nổ chân không.",
                            },
                            {
                              icon: "nova_overdrive" as GameIconId,
                              name: "Thánh Quang Triệu Hồi",
                              key: "Phím [T]",
                              cd: "24s",
                              radius: "Toàn Đội 5 Thú",
                              element: "Thánh Quang",
                              border: "#fbbf24",
                              glow: "rgba(251, 191, 36, 0.55)",
                              desc: "Cả 5 Thú đồng loạt xả Tuyệt Kỹ Tiến Hóa ngay lập tức, tặng +35 Khiên & Cuồng Nộ 8s!",
                            },
                          ] as const
                        ).map((ult, idx) => (
                          <div
                            key={idx}
                            style={
                              {
                                "--tile-border": ult.border,
                                "--tile-glow": ult.glow,
                              } as React.CSSProperties
                            }
                            className={`slime-skill-tile flex items-start gap-3 ${
                              idx === 4 ? "sm:col-span-2" : ""
                            }`}
                          >
                            <div className="slime-icon-frame">
                              <GameSvgIcon id={ult.icon} size={58} />
                              <span className="slime-icon-badge">
                                ★
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-black text-[#fffbeb]">
                                  {ult.name}
                                </span>
                                <span className="text-[9.5px] font-black px-1.5 py-0.5 rounded-full bg-[#090d14] border border-amber-400 text-amber-300 shrink-0 whitespace-nowrap">
                                  {ult.key}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="skill-tag-pill power">
                                  Hệ {ult.element}
                                </span>
                                <span className="skill-tag-pill radius">
                                  ◎ {ult.radius}
                                </span>
                                <span className="skill-tag-pill cd">
                                  ⏱ Hồi {ult.cd}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#cbd5e1] leading-snug mt-1">
                                {ult.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PHẦN B: 8 VŨ KHÍ CHỦ ĐỘNG & TIẾN HÓA */}
                  {(arsenalFilter === "all" || arsenalFilter === "weapons") && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black uppercase tracking-wider text-sky-300">
                          ⚔️ MỤC B · 8 KỸ NĂNG VŨ KHÍ CHIẾN ĐẤU & TIẾN HÓA THẦN KHÍ ★
                        </span>
                        <span className="text-[10.5px] text-[#cbd5e1]">
                          Cấp 1 ➔ Cấp 5 (Đột Phá Thần Khí)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(Object.keys(WEAPONS) as WeaponId[]).map((wId) => {
                          const w = WEAPONS[wId];
                          return (
                            <div
                              key={wId}
                              style={
                                {
                                  "--tile-border": "#38bdf8",
                                  "--tile-glow": "rgba(56, 189, 248, 0.32)",
                                } as React.CSSProperties
                              }
                              className="slime-skill-tile flex flex-col justify-between gap-2"
                            >
                              <div className="flex items-start gap-2.5">
                                {/* Base -> Evolved Dual Full-Bleed Tile */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <div className="slime-icon-frame">
                                    <GameSvgIcon id={w.icon} size={58} />
                                    <span className="slime-icon-badge" style={{ borderColor: "#38bdf8", color: "#bae6fd" }}>
                                      Lv.1
                                    </span>
                                  </div>
                                  <span className="text-xs font-black text-amber-400">
                                    ➔
                                  </span>
                                  <div
                                    className="slime-icon-frame"
                                    style={
                                      {
                                        "--tile-border": "#fbbf24",
                                        "--tile-glow": "rgba(251, 191, 36, 0.45)",
                                      } as React.CSSProperties
                                    }
                                  >
                                    <GameSvgIcon id={w.evolvedIcon} size={58} />
                                    <span className="slime-icon-badge">
                                      ★ EVO
                                    </span>
                                  </div>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-black text-[#fffbeb] leading-tight">
                                    {w.name}
                                  </div>
                                  <div className="text-[10.5px] font-extrabold text-amber-300 leading-tight mt-0.5">
                                    ★ {w.evolvedName}
                                  </div>
                                  <div className="slime-progress-bar mt-1.5">
                                    <div
                                      className="slime-progress-fill max"
                                      style={{ width: "100%" }}
                                    />
                                    <span className="slime-progress-label">
                                      MAX CẤP 5/5 ★
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-[10.5px] text-[#cbd5e1] leading-snug bg-[#0d121c] p-2 rounded-lg border border-[#263147]">
                                <div>
                                  <strong className="text-sky-300">• Kỹ năng:</strong>{" "}
                                  {w.descByLevel[0]}
                                </div>
                                <div className="mt-0.5 text-amber-200">
                                  <strong>• ★ Tiến hóa:</strong> {w.evolvedDesc}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* PHẦN C: 5 COMBO HỢP NHẤT VŨ KHÍ */}
                  {(arsenalFilter === "all" || arsenalFilter === "synergies") && (
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider text-purple-300 mb-1.5">
                        ✦ MỤC C · 5 CÔNG THỨC HỢP NHẤT KỸ NĂNG (COMBO ĐỘT BIẾN)
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.values(WEAPON_SYNERGIES).map((syn) => {
                          const iconA: GameIconId = syn.weapons
                            ? WEAPONS[syn.weapons[0]].icon
                            : syn.weaponAndPassive
                              ? WEAPONS[syn.weaponAndPassive[0]].icon
                              : "broadsword";
                          const iconB: GameIconId = syn.weapons
                            ? WEAPONS[syn.weapons[1]].icon
                            : syn.weaponAndPassive
                              ? PASSIVES[syn.weaponAndPassive[1]].icon
                              : "synergy";
                          return (
                            <div
                              key={syn.id}
                              style={
                                {
                                  "--tile-border": "#c084fc",
                                } as React.CSSProperties
                              }
                              className="slime-skill-tile flex flex-wrap sm:flex-nowrap items-center gap-3"
                            >
                              <div className="flex items-center gap-1.5 shrink-0">
                                <div className="w-12 h-12 rounded-lg bg-[#0b0e14] border-2 border-amber-400/80 overflow-hidden p-0">
                                  <GameSvgIcon id={iconA} size={48} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-xs font-black text-amber-300">
                                  +
                                </span>
                                <div className="w-12 h-12 rounded-lg bg-[#0b0e14] border-2 border-sky-400/80 overflow-hidden p-0">
                                  <GameSvgIcon id={iconB} size={48} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-xs font-black text-purple-300">
                                  ➔
                                </span>
                                <div className="w-12 h-12 rounded-lg bg-purple-950 border-2 border-purple-300 overflow-hidden p-0 shadow">
                                  <GameSvgIcon id="synergy" size={48} className="w-full h-full object-cover" />
                                </div>
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-xs font-black text-purple-200">
                                    {syn.name}
                                  </span>
                                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-950 border border-purple-400/60 text-amber-300">
                                    {syn.reqDesc}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#cbd5e1] mt-0.5">
                                  {syn.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </main>

        {/* BOTTOM 6-TAB NAVIGATION DOCK WITH 38x38 FULL-BLEED ICONS */}
        <footer className="relative z-10 w-full max-w-6xl mx-auto pt-1">
          <nav className="slime-bottom-dock" aria-label="Menu chính">
            {(
              [
                {
                  id: "stages",
                  iconId: "map" as GameIconId,
                  label: "Chiến Đấu",
                  sub: `Màn ${selectedStage.order}/5`,
                  badge: "CHÍNH",
                },
                {
                  id: "pets",
                  iconId: "dragon_emblem" as GameIconId,
                  label: "Đội Thú",
                  sub: `${idleProgress.squad.length}/5 Thú`,
                  badge: "",
                },
                {
                  id: "inventory",
                  iconId: "armor" as GameIconId,
                  label: "Trang Bị",
                  sub: `${saveData.inventory.length} Món`,
                  badge: "",
                },
                {
                  id: "arsenal",
                  iconId: "nova_thunder" as GameIconId,
                  label: "Kỹ Năng",
                  sub: "5 Tuyệt Kỹ",
                  badge: "",
                },
                {
                  id: "gacha",
                  iconId: "gacha_star" as GameIconId,
                  label: "Triệu Hồi",
                  sub: "Gacha & Rương",
                  badge:
                    idleProgress.starrChests + idleProgress.bossChests > 0
                      ? `${idleProgress.starrChests + idleProgress.bossChests}`
                      : "",
                },
                {
                  id: "quests",
                  iconId: "scroll" as GameIconId,
                  label: "Nhiệm Vụ",
                  sub: "Thưởng Lớn",
                  badge: "!",
                },
              ] as const
            ).map((t) => {
              const active = lobbyTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setLobbyTab(t.id)}
                  className={`slime-dock-tab ${active ? "active" : ""}`}
                >
                  {t.badge && (
                    <span className="slime-dock-badge">{t.badge}</span>
                  )}
                  <GameSvgIcon id={t.iconId} size={38} />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-black leading-tight block">
                      {t.label}
                    </span>
                    <span className="text-[10px] opacity-90 font-bold block mt-0.5">
                      {t.sub}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </footer>

        {/* UNIFIED VISUAL STYLE & ASSET SAMPLE SHEET MODAL (BẢNG MẪU TRỰC QUAN WESNOTH) */}
        {showStyleBoard && (
          <div
            className="fixed inset-0 flex items-center justify-center p-2 sm:p-4"
            style={{ zIndex: 100, backgroundColor: "rgba(5, 8, 14, 0.92)" }}
          >
            <div
              role="dialog"
              aria-modal="true"
              className="w-full max-w-5xl max-h-[92dvh] pixel-panel flex flex-col overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-[#334155] flex items-center justify-between bg-[#111622] shrink-0">
                <div>
                  <h2 className="text-sm sm:text-base font-black text-amber-300 uppercase">
                    🎨 BẢNG MẪU PHONG CÁCH & TÀI NGUYÊN BATTLE FOR WESNOTH (100% OPEN-SOURCE ASSETS)
                  </h2>
                  <p className="text-[11px] text-slate-300">
                    Toàn bộ Nền, Khung, Nút, Icon 60×60, 4 Tướng, 5 Boss & 24 Hình Thái Thú từ Battle for Wesnoth (GPLv2+/CC-BY-SA-4.0) & Tiny Swords (CC0).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStyleBoard(false)}
                  className="px-3 py-1.5 pixel-btn text-xs font-black cursor-pointer"
                >
                  Đóng ✕
                </button>
              </div>

              <div className="p-4 overflow-y-auto space-y-4 text-xs">
                {/* 1. 4 Playable Heroes & 5 Stage Bosses */}
                <div>
                  <h3 className="font-black text-amber-300 uppercase mb-2">
                    1. 4 Tướng Xuất Chiến & 5 Boss Thủ Lĩnh (Chân Dung & Sprite Wesnoth)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {Object.values(HEROES).map((h) => (
                      <div key={h.id} className="p-2 rounded-lg bg-[#141a26] border border-amber-400/50 flex items-center gap-2">
                        <img src={h.portraitUrl} alt={h.name} className="w-12 h-12 rounded-lg object-cover border border-amber-300 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-black text-white truncate">{h.name}</div>
                          <div className="text-[10px] text-amber-300">{h.title}</div>
                        </div>
                      </div>
                    ))}
                    {STAGE_LIST.map((st) => (
                      <div key={st.id} className="p-2 rounded-lg bg-[#141a26] border border-rose-500/50 flex items-center gap-2">
                        <img src={st.bossPortraitUrl} alt={st.bossName} className="w-12 h-12 rounded-lg object-cover border border-rose-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-black text-rose-200 truncate">{st.bossName}</div>
                          <div className="text-[10px] text-slate-300">Màn {st.order}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. 6 Beast Lineages x 4 Evolution Forms = 24 Authentic Portraits & Sprites */}
                <div>
                  <h3 className="font-black text-sky-300 uppercase mb-2">
                    2. 6 Huyết Mạch Thần Thú × 4 Bậc Tiến Hóa (24 Chân Dung + 24 Sprite Chiến Đấu)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {PETS.map((p) => (
                      <div key={p.id} className="p-2 rounded-lg bg-[#141a26] border border-slate-600/60 space-y-1.5">
                        <div className="font-black text-amber-300 text-[11px]">{p.lineageName}</div>
                        <div className="grid grid-cols-2 gap-1">
                          {p.forms.map((f) => (
                            <div key={f.stage} className="relative rounded overflow-hidden border border-slate-600 bg-[#0b0e14] aspect-square">
                              <img src={f.portraitUrl} alt={f.name} className="w-full h-full object-cover" />
                              <span className="absolute bottom-0 left-0 right-0 bg-black/80 text-[8.5px] font-black text-center text-amber-200">
                                {f.stage === 0 ? "Gốc" : `Evo ${f.stage}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Full-Bleed 60x60 Wesnoth Weapon, Skill & Equipment Icons */}
                <div>
                  <h3 className="font-black text-emerald-300 uppercase mb-2">
                    3. Bộ Icon Kỹ Năng, Vũ Khí Tiến Hóa & Trang Bị 60×60 Full-Bleed (Battle for Wesnoth)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        "nova_meteor",
                        "nova_blizzard",
                        "nova_thunder",
                        "nova_blackhole",
                        "nova_overdrive",
                        "broadsword",
                        "broadsword_evo",
                        "astral_bow",
                        "astral_bow_evo",
                        "flying_shield",
                        "flying_shield_evo",
                        "quake_hammer",
                        "quake_hammer_evo",
                        "frost_tome",
                        "frost_tome_evo",
                        "oil_torch",
                        "oil_torch_evo",
                        "lightning_magnet",
                        "lightning_magnet_evo",
                        "decoy_bomb",
                        "decoy_bomb_evo",
                        "armor",
                        "armor_leather",
                        "steel_armor",
                        "ring",
                        "ring_prismatic",
                        "ankh_necklace",
                        "skull_ring",
                      ] as GameIconId[]
                    ).map((ic) => (
                      <div key={ic} className="slime-icon-frame" title={ic}>
                        <GameSvgIcon id={ic} size={58} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. 5 Distinct Stages: Environment Scenery, Stage Monsters & Boss Phase 2 */}
                <div>
                  <h3 className="font-black text-purple-300 uppercase mb-2">
                    4. Bảng Mẫu 5 Màn Chiến Dịch Khác Nhau Rõ Rệt (Quái Riêng + Cảnh Vật Riêng + Boss 2 Giai Đoạn)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {STAGE_LIST.map((st) => (
                      <div key={st.id} className="p-2 rounded-lg bg-[#141a26] border border-purple-500/40 space-y-1.5">
                        <div className="font-black text-amber-300 text-[11px] truncate">{st.name}</div>
                        <div className="text-[10px] text-slate-300">{st.badge}</div>
                        <div className="flex items-center justify-between gap-1 bg-[#0b0e14] p-1.5 rounded border border-slate-700">
                          <img src={st.mobMeleeUrl} alt={st.mobMeleeName} title={st.mobMeleeName} className="w-9 h-9 object-contain" />
                          <img src={st.mobRangedUrl} alt={st.mobRangedName} title={st.mobRangedName} className="w-9 h-9 object-contain" />
                          <img src={st.mobEliteUrl} alt={st.mobEliteName} title={st.mobEliteName} className="w-9 h-9 object-contain" />
                          <img src={st.bossPhase2UnitUrl || st.bossUnitUrl} alt={st.bossName} title={st.bossPhase2Name || st.bossName} className="w-10 h-10 object-contain border border-rose-500/60 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Reference Study Summary (7 Reference Repos Applied) */}
                <div className="p-3 rounded-lg bg-[#111726] border border-sky-400/50 space-y-1">
                  <h3 className="font-black text-sky-300 uppercase">
                    5. Kết Quả Nghiên Cứu Kho Mẫu (`samples-2026-10-25` & `references`) Đã Áp Dụng
                  </h3>
                  <p className="text-[11px] text-slate-200">
                    • <strong>GDQuest Steering AI (`GSAIArrive`, `GSAIPursue`, `GSAISeparation`):</strong> Đội 5 thú di chuyển theo 4 trạng thái (`follow ➔ approach ➔ cast ➔ return`) với lực đẩy tách biệt nghịch đảo bình phương giúp 5 thú không chồng lên nhau.
                  </p>
                  <p className="text-[11px] text-slate-200">
                    • <strong>OpenDuelyst (CC0) & Ancient Beast (CC-BY-SA 4.0):</strong> FX kỹ năng, bẫy đầm độc (`trap_mud_bath`), dây leo (`trap_poison_vine`), tường tinh thể (`object_crystal_wall`), trụ lửa (`trap_bonfire_spring`) và quái nấm.
                  </p>
                  <p className="text-[11px] text-slate-200">
                    • <strong>Open RPG & Godot Official Demos & Crazy Gunner UI:</strong> Tách bố cục Sảnh theo thanh điều hướng dưới đáy đơn giản, hiển thị rõ `Trước ➔ Sau` khi nâng cấp và thiết kế 5 màn có địa hình/cơ chế riêng biệt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // IN-GAME SCREEN & HUD
  // ============================================================================
  const snap = snapshot;
  const hpRatio = snap ? Math.max(0, snap.hp / Math.max(1, snap.maxHp)) : 1;
  const expRatio = snap ? Math.min(1, snap.exp / Math.max(1, snap.expToNext)) : 0;

  // Find nearest uncompleted Map Objective for HUD directional tracker
  const activeObjectives = snap
    ? snap.objectives.filter((o) => !o.completed)
    : [];
  const playerX = engineRef.current?.px ?? 0;
  const playerY = engineRef.current?.py ?? 0;
  const nearestObjective =
    activeObjectives.length > 0
      ? [...activeObjectives].sort(
          (a, b) =>
            Math.hypot(a.x - playerX, a.y - playerY) -
            Math.hypot(b.x - playerX, b.y - playerY)
        )[0]
      : null;

  return (
    <div
      className="relative w-screen h-[100dvh] overflow-hidden bg-[#1e2f1d] select-none"
      onTouchStart={(e) => {
        if (
          snap?.status !== "playing" ||
          showEvolutionGuide ||
          isPaused ||
          e.touches.length === 0
        )
          return;
        const touch = e.touches[0];
        if (touch.clientX < window.innerWidth * 0.65) {
          setJoyState({
            active: true,
            startX: touch.clientX,
            startY: touch.clientY,
            curX: touch.clientX,
            curY: touch.clientY,
          });
        }
      }}
      onTouchMove={(e) => {
        if (!joyState.active || e.touches.length === 0) return;
        const touch = e.touches[0];
        setJoyState((prev) => ({
          ...prev,
          curX: touch.clientX,
          curY: touch.clientY,
        }));
      }}
      onTouchEnd={() => {
        setJoyState({ active: false, startX: 0, startY: 0, curX: 0, curY: 0 });
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />

      <div className="idle-battle-controls" onTouchStart={e=>e.stopPropagation()}>
        {/* Top Strip: 5 Evolved Beast Avatars + Auto Toggles + Map Encounter */}
        <div className="idle-battle-party">
          {idleProgress.squad.map(id => {
            const lv = idleProgress.levels[id] ?? 1;
            const evo = idleProgress.evolutions[id] ?? 0;
            const form = getPetForm(id, evo);
            return (
              <div
                key={id}
                className="battle-pet-avatar"
                title={`${form.name} (Lv.${lv} • Tiến hóa ${evo}/3)`}
              >
                <img src={form.portraitUrl} alt={form.name} />
                <span className="battle-pet-stars">
                  {evo > 0 ? "★".repeat(evo) : `L${lv}`}
                </span>
              </div>
            );
          })}
          <span className="px-1 text-[10px] font-black text-amber-300">
            {engineRef.current?.pets.length || 0}/5 Thú
          </span>
          <button
            type="button"
            className={`battle-toggle-pill ${engineRef.current?.autoExplore ? "on" : ""}`}
            onClick={() => {
              const e = engineRef.current;
              if (e) {
                const next = !e.autoExplore;
                e.autoExplore = next;
                setIdleProgress((p) => ({ ...p, auto: next }));
                e.emitSnapshot();
              }
            }}
          >
            🤖 Auto Đánh: {engineRef.current?.autoExplore ? "BẬT" : "TẮT"}
          </button>
          <button
            type="button"
            className={`battle-toggle-pill ${engineRef.current?.autoUpgrade ? "on" : ""}`}
            onClick={() => {
              const e = engineRef.current;
              if (e) {
                const next = !e.autoUpgrade;
                e.autoUpgrade = next;
                setIdleProgress((p) => ({ ...p, autoUpgrade: next }));
                e.emitSnapshot();
              }
            }}
          >
            ⚡ Auto Skill: {engineRef.current?.autoUpgrade ? "BẬT" : "TẮT"}
          </button>

          {engineRef.current?.encounter && !engineRef.current.encounter.claimed && (
            <button
              type="button"
              className="battle-toggle-pill on"
              disabled={
                isPaused ||
                showEvolutionGuide ||
                Math.hypot(
                  engineRef.current.encounter.x - engineRef.current.px,
                  engineRef.current.encounter.y - engineRef.current.py
                ) > 125
              }
              onClick={() => engineRef.current?.claimEncounter()}
            >
              [E]{" "}
              {engineRef.current.encounter.kind === "feast"
                ? "Tiệc Hồi Phục"
                : engineRef.current.encounter.kind === "merchant"
                  ? "Rương Thương Nhân"
                  : "Đài Cổ Ngữ"}
            </button>
          )}
        </div>

        {/* Bottom Row: 5 Ornate Elemental Ultimate Skill Cards */}
        <div className="idle-battle-skills">
          {(
            [
              {
                kind: "meteor" as NovaKind,
                icon: "nova_meteor" as GameIconId,
                name: "Thiên Thạch",
                sub: "320px Nổ Lửa",
                key: "Q",
                accent: "#f97316",
                glow: "rgba(249, 115, 22, 0.35)",
              },
              {
                kind: "blizzard" as NovaKind,
                icon: "nova_blizzard" as GameIconId,
                name: "Bão Băng",
                sub: "340px Đóng Băng",
                key: "R",
                accent: "#38bdf8",
                glow: "rgba(56, 189, 248, 0.35)",
              },
              {
                kind: "thunder" as NovaKind,
                icon: "nova_thunder" as GameIconId,
                name: "Vạn Lôi",
                sub: "360px Sét Lan",
                key: "F",
                accent: "#facc15",
                glow: "rgba(250, 204, 21, 0.35)",
              },
              {
                kind: "blackhole" as NovaKind,
                icon: "nova_blackhole" as GameIconId,
                name: "Hố Đen",
                sub: "340px Hút Quái",
                key: "G",
                accent: "#c084fc",
                glow: "rgba(192, 132, 252, 0.38)",
              },
              {
                kind: "summon_overdrive" as NovaKind,
                icon: "nova_overdrive" as GameIconId,
                name: "Thú Đồng Kích",
                sub: "5 Thú Xả Chiêu",
                key: "T",
                accent: "#fbbf24",
                glow: "rgba(251, 191, 36, 0.42)",
              },
            ]
          ).map((sk) => {
            const cd = Math.ceil(engineRef.current?.novaCooldowns[sk.kind] || 0);
            return (
              <button
                key={sk.kind}
                type="button"
                className="skill-slot-btn"
                style={
                  {
                    "--skill-accent": sk.accent,
                    "--skill-glow": sk.glow,
                  } as React.CSSProperties
                }
                disabled={
                  cd > 0 ||
                  isPaused ||
                  showEvolutionGuide ||
                  snap?.status !== "playing"
                }
                onClick={() => engineRef.current?.castNova(sk.kind)}
              >
                <div className="skill-slot-emblem">
                  <GameSvgIcon id={sk.icon} size={46} />
                  {cd > 0 && (
                    <div className="skill-slot-cd-overlay">{cd}s</div>
                  )}
                </div>
                <div className="skill-slot-info">
                  <span className="skill-slot-name">{sk.name}</span>
                  <span className="skill-slot-sub">{sk.sub}</span>
                </div>
                <span className="skill-slot-key">{sk.key}</span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Top HUD Overlay */}
      {snap && (
        <div className="fixed top-0 left-0 right-0 pt-2 px-2 pb-1.5 sm:p-3 pointer-events-none z-20">
          <div className="max-w-6xl mx-auto flex flex-col gap-1.5">
            {/* EXP Bar */}
            <div className="w-full h-4 sm:h-5 pixel-inset p-0.5 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2563eb] via-[#38bdf8] to-[#facc15] transition-all duration-150"
                style={{ width: `${expRatio * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-2.5 text-[10px] sm:text-[11px] font-black text-white drop-shadow">
                <span>
                  CẤP {snap.level} • {snap.hero.name.split("•")[0].trim()}
                </span>
                <span>
                  {showPerfHud ? (
                    <span className="text-emerald-300 mr-2">
                      {snap.fps} FPS ({snap.frameMs}ms) ·
                    </span>
                  ) : null}
                  {STAGES[snap.stageId]?.name.replace(/^Màn \d:\s*/, "")}
                </span>
              </div>
            </div>

            {/* Stats & Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              {/* Left: Hero Portrait + HP + Full-Bleed Weapon/Passive Icons */}
              <div className="flex items-center gap-2.5 pixel-hud-box px-2.5 py-1.5 pointer-events-auto">
                <img
                  src={snap.hero.portraitUrl}
                  alt={snap.hero.name}
                  className="w-10 h-10 rounded-lg object-cover border-2 border-amber-400/80 bg-[#0b0e14] shrink-0"
                />
                <div className="min-w-[100px] sm:min-w-[140px]">
                  <div className="flex justify-between text-[10px] sm:text-xs font-extrabold text-[#fef3c7] mb-0.5">
                    <span>❤️ MÁU</span>
                    <span>
                      {Math.ceil(snap.hp)}/{snap.maxHp}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#0b0e14] border border-[#475569] rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#dc2626] to-[#f87171] transition-all duration-150"
                      style={{ width: `${hpRatio * 100}%` }}
                    />
                  </div>
                </div>

                {/* Equipped Active Weapons & Passives with Full-Bleed Icons */}
                <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-[#334155]">
                  {(Object.keys(WEAPONS) as WeaponId[])
                    .filter((id) => snap.weapons[id].level > 0)
                    .map((id) => {
                      const st = snap.weapons[id];
                      const w = WEAPONS[id];
                      return (
                        <div
                          key={id}
                          title={`${w.name} (Cấp ${st.level})`}
                          className={`w-9 h-9 rounded-lg overflow-hidden p-0 relative border-2 ${
                            st.evolved
                              ? "bg-[#451a03] border-[#fbbf24]"
                              : "bg-[#0b0e14] border-sky-400/75"
                          }`}
                        >
                          <GameSvgIcon
                            id={st.evolved ? w.evolvedIcon : w.icon}
                            size={36}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 right-0 text-[9px] font-black bg-[#090d14]/95 px-1 rounded-tl text-[#fbbf24] border-t border-l border-amber-400/60">
                            {st.evolved ? "★" : st.level}
                          </span>
                        </div>
                      );
                    })}

                  {(Object.keys(PASSIVES) as PassiveId[])
                    .filter((id) => snap.passives[id] > 0)
                    .map((id) => (
                      <div
                        key={id}
                        title={`${PASSIVES[id].name} (Cấp ${snap.passives[id]})`}
                        className="w-8 h-8 rounded-lg overflow-hidden p-0 relative bg-[#0b0e14] border border-emerald-400/70"
                      >
                        <GameSvgIcon
                          id={PASSIVES[id].icon}
                          size={32}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 text-[8.5px] font-black bg-[#090d14]/95 px-1 rounded-tl text-emerald-300">
                          {snap.passives[id]}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Center: Clock, Kills, Gold */}
              <div className="flex items-center gap-2.5 pixel-hud-box px-3 py-1">
                <div className="text-center">
                  <div className="text-sm sm:text-lg font-black text-[#fffbeb] tracking-wider leading-tight">
                    {formatTime(snap.elapsedSec)}
                  </div>
                </div>
                <div className="h-5 w-px bg-[#475569]" />
                <div className="text-[11px] sm:text-xs font-extrabold text-[#fde68a]">
                  💀 {snap.kills}
                </div>
                <div className="text-[11px] sm:text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                  <GameSvgIcon id="gold" size={18} />
                  <span>{snap.gold}</span>
                </div>
              </div>

              {/* Right: Combo Book & Pause Button */}
              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setShowEvolutionGuide(true)}
                  className="px-2.5 py-1.5 pixel-btn text-[11px] sm:text-xs font-extrabold text-[#fde68a] cursor-pointer"
                >
                  📖 Sổ Combo
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaused(true)}
                  className="px-2.5 py-1.5 pixel-btn text-[11px] sm:text-xs font-extrabold text-[#fca5a5] cursor-pointer"
                  title="Tạm dừng hoặc Thoát ra Sảnh (ESC / P)"
                >
                  ⏸ Tạm dừng
                </button>
              </div>
            </div>

            {/* Stage Objectives Directional Tracker Bar */}
            {nearestObjective && (
              <div className="self-start pixel-hud-box px-2.5 py-1 flex items-center gap-2 text-[11px] border-l-4 border-l-amber-400">
                <span className="font-black text-amber-300">
                  🎯 MỤC TIÊU ({snap.objectivesCompleted}/{snap.objectives.length}):
                </span>
                <span className="font-bold text-[#fffbeb]">
                  {nearestObjective.title}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-950/90 border border-amber-400/60 text-amber-200 font-black">
                  {getDirectionArrow(
                    nearestObjective.x - playerX,
                    nearestObjective.y - playerY
                  )}{" "}
                  {Math.round(
                    Math.hypot(
                      nearestObjective.x - playerX,
                      nearestObjective.y - playerY
                    ) / 10
                  )}
                  m
                </span>
                <span className="hidden sm:inline text-[10px] text-[#d6c2a8]">
                  — {nearestObjective.subtitle}
                </span>
              </div>
            )}

            {/* Active Synergies Row */}
            {snap.activeSynergies.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {snap.activeSynergies.map((sId) => {
                  const syn = WEAPON_SYNERGIES[sId];
                  return (
                    <span
                      key={sId}
                      className="px-2 py-0.5 rounded bg-purple-950/90 border border-purple-400 text-purple-200 text-[10px] font-black flex items-center gap-1"
                    >
                      <GameSvgIcon id="synergy" size={12} />
                      <span>COMBO: {syn.name}</span>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Boss HP Bar with Boss Portrait */}
            {snap.eliteActive && (
              <div className="max-w-lg mx-auto w-full pixel-hud-box px-3 py-1.5 border-2 border-[#ef4444] flex items-center gap-2.5">
                <img
                  src={STAGES[snap.stageId]?.bossPortraitUrl || STAGES.courtyard.bossPortraitUrl}
                  alt={snap.eliteActive.name}
                  className="w-11 h-11 rounded-lg object-cover border-2 border-rose-400 bg-[#0b0e14] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-[11px] font-black text-[#fecaca] mb-1">
                    <span className="truncate">⚠️ BOSS: {snap.eliteActive.name}</span>
                    <span className="shrink-0 ml-2">
                      {Math.ceil(snap.eliteActive.hp)} / {snap.eliteActive.maxHp}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#090d14] rounded overflow-hidden border border-[#7f1d1d]">
                    <div
                      className="h-full bg-gradient-to-r from-[#dc2626] via-[#ef4444] to-[#f59e0b]"
                      style={{
                        width: `${
                          (snap.eliteActive.hp /
                            Math.max(1, snap.eliteActive.maxHp)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Toast Banner */}
            {snap.bannerText && (
              <div className="mx-auto mt-0.5 px-3.5 py-1 pixel-hud-box border-2 border-[#fbbf24] text-[#fef3c7] font-black text-xs sm:text-sm tracking-wide shadow-md">
                {snap.bannerText}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Touch Joystick Visual */}
      {joyState.active && (
        <div
          className="fixed w-24 h-24 rounded-full border-2 border-[#fbbf24]/50 bg-[#1c140d]/40 pointer-events-none z-20"
          style={{
            left: joyState.startX - 48,
            top: joyState.startY - 48,
          }}
        >
          <div
            className="w-10 h-10 rounded-full bg-[#fbbf24]/80 absolute"
            style={{
              left:
                48 -
                20 +
                Math.max(-32, Math.min(32, joyState.curX - joyState.startX)),
              top:
                48 -
                20 +
                Math.max(-32, Math.min(32, joyState.curY - joyState.startY)),
            }}
          />
        </div>
      )}

      {/* Bottom Right Dash Button (dashCooldownRatio === 0 means READY!) */}
      {snap && snap.status === "playing" && !isPaused && (
        <div className="fixed bottom-28 right-3 sm:bottom-4 sm:right-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => engineRef.current?.triggerDash(0, 0)}
            disabled={snap.dashCooldownRatio > 0}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl font-black text-[11px] sm:text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${
              snap.dashCooldownRatio <= 0
                ? "pixel-btn-primary text-[#fffbeb]"
                : "pixel-hud-box text-[#a89078] opacity-75"
            }`}
          >
            <span>💨 LƯỚT</span>
            <span className="text-[9px] mt-0.5">
              {snap.dashCooldownRatio <= 0
                ? isTouchDevice
                  ? "CHẠM"
                  : "SPACE"
                : `${(
                    snap.dashCooldownRatio *
                    Math.max(1.2, 2.3 - (snap.passives.phantom_boots || 0) * 0.22)
                  ).toFixed(1)}s`}
            </span>
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: COMBO & WEAPON GUIDE                                        */}
      {/* ==================================================================== */}
      {showEvolutionGuide && (
        <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center p-2 sm:p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg max-h-[90dvh] pixel-panel flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3 border-b-2 border-[#3f2e21] flex items-center justify-between bg-[#1c140d] shrink-0">
              <div>
                <h2 className="text-sm sm:text-base font-black text-[#fbbf24] uppercase">
                  📖 Sổ Tay 5 Combo Vũ Khí & Tiến Hóa
                </h2>
                <p className="text-[11px] text-[#d6c2a8]">
                  Ghép đúng 2 món trong trận sẽ tự động thay đổi hành vi chiến đấu!
                </p>
              </div>
              <button
                ref={closeRecipeBtnRef}
                type="button"
                onClick={() => setShowEvolutionGuide(false)}
                className="px-3 py-1 pixel-btn text-xs font-black cursor-pointer"
              >
                Đóng ✕
              </button>
            </div>

            <div className="p-3 overflow-y-auto space-y-2 flex-1">
              {Object.values(WEAPON_SYNERGIES).map((syn) => (
                <div
                  key={syn.id}
                  className="p-2.5 pixel-inset flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden p-0 bg-[#0b0e14] border-2 border-purple-400 shrink-0">
                    <GameSvgIcon id="synergy" size={48} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-purple-300">
                      {syn.name}
                    </div>
                    <div className="text-[11px] font-bold text-amber-300">
                      Công thức: {syn.reqDesc}
                    </div>
                    <div className="text-[11px] text-[#d6c2a8]">
                      {syn.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: PAUSE MENU                                                  */}
      {/* ==================================================================== */}
      {isPaused && snap && snap.status === "playing" && (
        <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center p-3">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm pixel-panel p-4 flex flex-col gap-3 text-center"
          >
            <h2 className="text-lg font-black text-[#fffbeb] uppercase">
              ⏸ TẠM DỪNG TRẬN ĐẤU
            </h2>
            <div className="pixel-inset p-2.5 text-xs text-[#d6c2a8] space-y-1">
              <div>
                Nhân vật:{" "}
                <strong className="text-white">{snap.hero.name}</strong>
              </div>
              <div>
                Thời gian:{" "}
                <strong className="text-amber-300">
                  {formatTime(snap.elapsedSec)}
                </strong>{" "}
                • Hạ gục: <strong>{snap.kills}</strong>
              </div>
              <div>
                Mục tiêu hoàn thành:{" "}
                <strong className="text-emerald-300">
                  {snap.objectivesCompleted}/{snap.objectives.length}
                </strong>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsPaused(false)}
                className="w-full py-2.5 pixel-btn-primary font-black text-sm uppercase cursor-pointer"
              >
                ▶️ Tiếp tục chiến đấu
              </button>
              <button
                type="button"
                onClick={() => startNewRun()}
                className="w-full py-2 pixel-btn font-black text-xs text-[#fde68a] uppercase cursor-pointer"
              >
                🔄 Chơi lại từ đầu
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPaused(false);
                  setInGame(false);
                }}
                className="w-full py-2 pixel-btn font-black text-xs text-[#fca5a5] uppercase cursor-pointer"
              >
                🏠 Thoát ra Sảnh & Kho Đồ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: LEVEL UP UPGRADE PICKER                                     */}
      {/* ==================================================================== */}
      {snap && snap.status === "level_up" && (
        <div className="fixed inset-0 bg-black/75 z-30 flex items-center justify-center p-2 sm:p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg max-h-[92dvh] pixel-panel p-3 sm:p-5 flex flex-col overflow-hidden"
          >
            <div className="text-center pb-2 border-b-2 border-[#3f2e21] shrink-0">
              <span className="px-2.5 py-0.5 pixel-Badge text-[#fbbf24] text-[10px] font-black uppercase">
                Lên Cấp {snap.level}
              </span>
              <h2 className="text-base sm:text-xl font-black text-[#fffbeb] mt-1">
                CHỌN NÂNG CẤP HOẶC ĐỒ CHƠI MỚI
              </h2>
            </div>

            <div className="my-2.5 space-y-2.5 overflow-y-auto pr-1 flex-1">
              {snap.choices.map((choice, idx) => {
                const isWeapon = choice.kind === "weapon";
                return (
                  <button
                    key={choice.uid}
                    ref={(el) => {
                      upgradeBtnRefs.current[idx] = el;
                    }}
                    type="button"
                    onClick={() => engineRef.current?.selectUpgradeChoice(choice)}
                    className={`w-full text-left p-3 transition-all cursor-pointer flex items-center gap-3.5 pixel-inset relative overflow-hidden ${
                      choice.isEvolution
                        ? "border-2 border-[#fbbf24] bg-gradient-to-r from-[#451a03] via-[#2e1205] to-[#1c1008]"
                        : isWeapon
                          ? "border border-amber-500/60 bg-gradient-to-r from-[#241911] to-[#16100b] hover:border-[#fbbf24]"
                          : "border border-sky-500/50 bg-gradient-to-r from-[#13202b] to-[#11161d] hover:border-sky-300"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-lg overflow-hidden p-0 shrink-0 shadow-md ${
                        choice.isEvolution
                          ? "bg-[#1c0d04] border-2 border-[#fde047]"
                          : isWeapon
                            ? "bg-[#140e0a] border-2 border-amber-400"
                            : "bg-[#0d151d] border-2 border-sky-400"
                      }`}
                    >
                      <GameSvgIcon id={choice.icon} size={56} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-black/50 text-amber-300 border border-amber-500/40 shrink-0">
                            Phím [{idx + 1}]
                          </span>
                          <span className="font-black text-xs sm:text-sm text-[#fffbeb] truncate">
                            {choice.title}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded border shrink-0 ${
                            choice.isEvolution
                              ? "bg-amber-950 text-[#fde047] border-[#fde047]"
                              : isWeapon
                                ? "bg-[#140e0a] text-amber-300 border-amber-500/50"
                                : "bg-sky-950 text-sky-200 border-sky-400/50"
                          }`}
                        >
                          {choice.badgeText}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-[#fde68a] font-bold mt-1 leading-snug">
                        {choice.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: POST-RUN SUMMARY (LOOT DROPS + DAMAGE BREAKDOWN)            */}
      {/* ==================================================================== */}
      {snap &&
        (snap.status === "game_over" || snap.status === "victory") && (
          <div className="fixed inset-0 bg-black/85 z-30 flex items-center justify-center p-3">
            <div className="w-full max-w-lg max-h-[92dvh] pixel-panel p-4 sm:p-5 flex flex-col justify-between overflow-y-auto gap-3">
              <div className="text-center">
                <div className="text-xs font-black uppercase tracking-widest text-amber-300">
                  {snap.status === "victory"
                    ? "🏆 CHIẾN THẮNG MÀN CHƠI!"
                    : "💀 KẾT THÚC HÀNH TRÌNH"}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#fffbeb] mt-0.5">
                  {snap.status === "victory"
                    ? "ĐÃ HẠ GỤC BOSS THỦ LĨNH!"
                    : "BẠN ĐÃ NGÃ XUỐNG"}
                </h2>
              </div>

              {/* Run Core Stats */}
              <div className="grid grid-cols-4 gap-1.5 pixel-inset p-2.5 text-center">
                <div>
                  <div className="text-[10px] text-[#a89078] font-bold">
                    Thời gian
                  </div>
                  <div className="text-sm font-black text-[#fffbeb]">
                    {formatTime(snap.elapsedSec)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#a89078] font-bold">
                    Quái hạ
                  </div>
                  <div className="text-sm font-black text-amber-300">
                    {snap.kills}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#a89078] font-bold">
                    Mục tiêu
                  </div>
                  <div className="text-sm font-black text-emerald-300">
                    {snap.objectivesCompleted}/{snap.objectives.length}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#a89078] font-bold">
                    Vàng nhận
                  </div>
                  <div className="text-sm font-black text-yellow-300">
                    +{lastRunLoot?.goldEarned ?? snap.gold}
                  </div>
                </div>
              </div>

              {/* Loot Dropped into Inventory */}
              <div className="pixel-inset p-2.5 bg-[#1c140d]">
                <div className="text-xs font-black text-amber-300 uppercase mb-1.5 flex items-center justify-between">
                  <span>🎒 Chiến Lợi Phẩm Chuyển Vào Kho Đồ</span>
                  <span className="text-[10px] text-emerald-300">
                    Tổng Vàng: {saveData.gold}
                  </span>
                </div>
                {lastRunLoot && lastRunLoot.droppedItems.length > 0 ? (
                  <div className="space-y-1.5">
                    {lastRunLoot.droppedItems.map((it) => {
                      const badge = getRarityBadge(it.rarity);
                      return (
                        <div
                          key={it.id}
                          className="p-2 rounded bg-[#2b1e14] border border-amber-400/60 flex items-center gap-2.5"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden p-0 bg-[#0b0e14] border border-amber-400/70 shrink-0">
                            <GameSvgIcon id={it.iconId} size={48} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-[#fffbeb]">
                                {it.name}
                              </span>
                              <span
                                className={`text-[9px] font-black px-1.5 rounded border ${badge.bg} ${badge.border} ${badge.text}`}
                              >
                                {badge.label}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#d6c2a8]">
                              {it.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-[#d6c2a8]">
                    Đã cộng{" "}
                    <strong className="text-amber-300">
                      +{lastRunLoot?.goldEarned ?? snap.gold} Vàng
                    </strong>{" "}
                    vào Kho Đồ! (Hạ ít nhất 10 quái hoặc phá 1 Mục tiêu để rớt thêm
                    Trang bị).
                  </div>
                )}
              </div>

              <div className="pixel-inset p-2.5 text-xs text-amber-200"><strong>✦ Đội Thú Triệu Hồi Trợ Chiến</strong><div className="flex flex-wrap gap-2 mt-2">{engineRef.current?.pets.map(p=><span key={p.id}>{getPetForm(p.id, p.evolution).name} {"★".repeat(p.evolution)}: {Math.round(p.damage).toLocaleString()} sát thương · {p.casts} tuyệt kỹ</span>)}</div><p className="mt-1">Đã nhận {engineRef.current?.encountersClaimed||0} sự kiện tuần tra + thưởng Đá Triệu Hồi & Rương Chiến Lợi Phẩm.</p></div>
              {/* Per-Weapon Damage Breakdown */}
              <div className="pixel-inset p-2.5 bg-[#1c140d]">
                <div className="text-xs font-black text-sky-300 uppercase mb-1.5">
                  📊 Thống Kê Sát Thương Theo Vũ Khí
                </div>
                <div className="space-y-1.5">
                  {(() => {
                    const entries = (Object.keys(WEAPONS) as WeaponId[])
                      .map((wId) => ({
                        id: wId,
                        dmg: Math.round(snap.weaponDamage[wId] || 0),
                      }))
                      .filter(
                        (e) => e.dmg > 0 || snap.weapons[e.id].level > 0
                      )
                      .sort((a, b) => b.dmg - a.dmg);
                    const totalDmg = Math.max(
                      1,
                      entries.reduce((acc, cur) => acc + cur.dmg, 0)
                    );
                    return entries.map((e) => {
                      const pct = Math.round((e.dmg / totalDmg) * 100);
                      const w = WEAPONS[e.id];
                      return (
                        <div key={e.id} className="text-[11px]">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="inline-flex items-center gap-2 font-bold text-[#fffbeb]">
                              <GameSvgIcon id={w.icon} size={22} />
                              {w.name}
                            </span>
                            <span className="font-black text-amber-300">
                              {e.dmg.toLocaleString()} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-[#140e0a] rounded overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-sky-400"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => startNewRun()}
                  className="py-2.5 pixel-btn-primary font-black text-xs uppercase cursor-pointer"
                >
                  🔄 Chơi Lại Ngay
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLobbyTab("inventory");
                    setInGame(false);
                  }}
                  className="py-2.5 pixel-btn font-black text-xs text-amber-300 uppercase cursor-pointer"
                >
                  🎒 Mở Kho Đồ ({saveData.inventory.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLobbyTab("stages");
                    setInGame(false);
                  }}
                  className="py-2.5 pixel-btn font-black text-xs uppercase cursor-pointer"
                >
                  🗺️ Chọn Màn Khác
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
export default App;
