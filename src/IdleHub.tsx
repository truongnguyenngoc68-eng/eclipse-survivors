import React, { useEffect, useState } from "react";
import {
  EVOLUTION_MILESTONES,
  PETS,
  buildQuestList,
  getNextEvolutionRequirement,
  getPetForm,
  idleRewards,
  petUpgradeCost,
  trainingCost,
  type EvolutionStage,
  type IdleProgress,
  type PetId,
} from "./game/companions";
import { GameIconId, GameSvgIcon, getGameIconUrl } from "./game/icons";
import type { InventoryItem } from "./App";
import "./idle.css";

interface GachaDropResult {
  title: string;
  subtitle: string;
  rarity: "rare" | "epic" | "legendary";
  portraitUrl?: string;
}

const PET_SKILL_ICONS: Record<PetId, GameIconId> = {
  dragon: "nova_meteor",
  fox: "nova_blizzard",
  turtle: "flying_shield_evo",
  slime: "nova_blackhole",
  owl: "nova_thunder",
  rabbit: "nova_overdrive",
};

const GACHA_GEAR_POOL: Array<Omit<InventoryItem, "id" | "level">> = [
  {
    name: "Kiếm Sắt Tân Binh",
    slot: "weapon",
    rarity: "rare",
    iconId: "broadsword",
    bonusHp: 10,
    bonusMightPct: 9,
    bonusSpeedPct: 0,
    weaponOverride: "broadsword",
    desc: "[Hiếm Gacha] Kiếm rèn tiêu chuẩn +9% Sát thương & +10 Máu",
  },
  {
    name: "Giáp Da Trinh Sát",
    slot: "armor",
    rarity: "rare",
    iconId: "armor_leather",
    bonusHp: 24,
    bonusMightPct: 4,
    bonusSpeedPct: 4,
    desc: "[Hiếm Gacha] Giáp da nhẹ +24 Máu & +4% Tốc chạy",
  },
  {
    name: "Nhẫn Đồng Hộ Mệnh",
    slot: "relic",
    rarity: "rare",
    iconId: "ring",
    bonusHp: 12,
    bonusMightPct: 6,
    bonusSpeedPct: 4,
    desc: "[Hiếm Gacha] Nhẫn đồng khắc phù văn +6% Sát thương & +12 Máu",
  },
  {
    name: "Long Nha Chiến Kiếm",
    slot: "weapon",
    rarity: "legendary",
    iconId: "broadsword_evo",
    bonusHp: 35,
    bonusMightPct: 22,
    bonusSpeedPct: 6,
    weaponOverride: "broadsword",
    desc: "[Thần Khí Gacha] Đại Kiếm Rồng Lửa +22% Sát thương & +35 Máu",
  },
  {
    name: "Thiên Lôi Thần Cung",
    slot: "weapon",
    rarity: "legendary",
    iconId: "astral_bow_evo",
    bonusHp: 25,
    bonusMightPct: 20,
    bonusSpeedPct: 10,
    weaponOverride: "astral_bow",
    desc: "[Thần Khí Gacha] Cung Tinh Quang +20% Sát thương & +10% Tốc chạy",
  },
  {
    name: "Khiên Thần Chấn Thiên",
    slot: "weapon",
    rarity: "legendary",
    iconId: "flying_shield_evo",
    bonusHp: 50,
    bonusMightPct: 18,
    bonusSpeedPct: 5,
    weaponOverride: "flying_shield",
    desc: "[Thần Khí Gacha] Vào trận cầm Khiên Bay Phản Kích +50 Máu",
  },
  {
    name: "Thần Chùy Phá Sơn",
    slot: "weapon",
    rarity: "epic",
    iconId: "quake_hammer_evo",
    bonusHp: 35,
    bonusMightPct: 16,
    bonusSpeedPct: 0,
    weaponOverride: "quake_hammer",
    desc: "[Sử Thi Gacha] Vào trận cầm Búa Chấn Động +16% Sát thương",
  },
  {
    name: "Thánh Điển Vĩnh Đông",
    slot: "weapon",
    rarity: "epic",
    iconId: "frost_tome_evo",
    bonusHp: 25,
    bonusMightPct: 15,
    bonusSpeedPct: 6,
    weaponOverride: "frost_tome",
    desc: "[Sử Thi Gacha] Vào trận cầm Sách Băng Giá +15% Sát thương",
  },
  {
    name: "Long Lân Hoàng Kim Giáp",
    slot: "armor",
    rarity: "legendary",
    iconId: "steel_armor",
    bonusHp: 85,
    bonusMightPct: 14,
    bonusSpeedPct: 6,
    desc: "[Thần Khí Gacha] Chiến giáp vảy rồng +85 Máu & +14% Sát thương",
  },
  {
    name: "Ấn Nhẫn Chúa Tể Vực Thẳm",
    slot: "relic",
    rarity: "legendary",
    iconId: "ring_prismatic",
    bonusHp: 40,
    bonusMightPct: 24,
    bonusSpeedPct: 10,
    desc: "[Thần Khí Gacha] Nhẫn cổ vực thẳm +24% Sát thương & +10% Tốc chạy",
  },
];

export function IdleHub({
  progress,
  setProgress,
  gold,
  changeGold,
  onAddInventoryItem,
  activeSection,
  sandboxMode = false,
}: {
  progress: IdleProgress;
  setProgress: React.Dispatch<React.SetStateAction<IdleProgress>>;
  gold: number;
  changeGold: (amount: number) => void;
  onAddInventoryItem?: (item: InventoryItem) => void;
  activeSection?: "beasts" | "gacha" | "quests";
  sandboxMode?: boolean;
}) {
  const [now, setNow] = useState(Date.now());
  const [internalTab, setInternalTab] = useState<"beasts" | "gacha" | "quests">(
    "beasts"
  );
  const subTab = activeSection ?? internalTab;

  const [selectedBeastId, setSelectedBeastId] = useState<PetId>("dragon");
  const [message, setMessage] = useState("");
  const [previewStages, setPreviewStages] = useState<
    Partial<Record<PetId, EvolutionStage>>
  >({});
  const [gachaResults, setGachaResults] = useState<GachaDropResult[]>([]);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const afk = idleRewards(progress, now);
  const quests = buildQuestList(progress);
  const claimableQuestCount = quests.filter(
    (q) => !q.claimed && q.current >= q.target
  ).length;

  function toggleSquad(id: PetId) {
    if (progress.squad.includes(id)) {
      setProgress((p) => ({ ...p, squad: p.squad.filter((x) => x !== id) }));
      return;
    }
    if (progress.squad.length >= 5) {
      setMessage(
        "Đội hình đã đủ 5/5 Thú! Hãy bấm vào 1 thú trên thanh Đội Hình để đổi chỗ."
      );
      return;
    }
    setProgress((p) =>
      p.squad.includes(id) || p.squad.length >= 5
        ? p
        : { ...p, squad: [...p.squad, id] }
    );
  }

  function autoFillBestSquad() {
    const nextLevels = { ...progress.levels };
    if (sandboxMode) {
      for (const pet of PETS) {
        if (nextLevels[pet.id] <= 0) {
          nextLevels[pet.id] = 1;
        }
      }
    }
    const unlockedPets = PETS.filter((pet) => nextLevels[pet.id] > 0);
    const sorted = unlockedPets
      .sort(
        (a, b) =>
          (progress.evolutions[b.id] || 0) * 100 +
          nextLevels[b.id] -
          ((progress.evolutions[a.id] || 0) * 100 + nextLevels[a.id])
      )
      .slice(0, 5)
      .map((x) => x.id);
    setProgress((p) => ({ ...p, levels: nextLevels, squad: sorted }));
    setMessage(
      sorted.length >= 5
        ? "Đã triệu tập đủ 5/5 Thú Triệu Hồi mạnh nhất vào Đội Hình Ra Trận!"
        : `Đã lắp ${sorted.length}/5 Thú đã mở khóa vào Đội Hình! Hãy mở thêm thú mới hoặc quay Gacha để đủ 5/5.`
    );
  }

  function trainBeast(id: PetId, levelsToGain = 1) {
    const lv = progress.levels[id];
    const pet = PETS.find((x) => x.id === id)!;
    const cost = lv ? petUpgradeCost(lv) * levelsToGain : pet.cost;
    if (lv >= 60) return;
    if (gold < cost) {
      setMessage(
        `Cần ${cost} Vàng (Hiện có ${gold} Vàng). Hãy vào trận chiến đấu hoặc nhận thưởng nhiệm vụ!`
      );
      return;
    }
    changeGold(-cost);
    const nextLv = Math.min(60, lv + levelsToGain);
    setProgress((p) => ({
      ...p,
      levels: { ...p.levels, [id]: nextLv },
      squad:
        lv === 0 && p.squad.length < 5 && !p.squad.includes(id)
          ? [...p.squad, id]
          : p.squad,
    }));
    setSelectedBeastId(id);
    setMessage(
      lv === 0
        ? `Đã triệu hồi ${pet.forms[0].name}!`
        : `${getPetForm(id, progress.evolutions[id]).name} tăng lên Cấp ${nextLv}! (+${levelsToGain * 18}% sức mạnh)`
    );
  }

  function evolveBeast(id: PetId) {
    const curEvo = progress.evolutions[id] || 0;
    const nextForm = getNextEvolutionRequirement(id, curEvo);
    if (!nextForm) return;

    const curLv = progress.levels[id];
    const curShards = progress.shards[id] || 0;

    if (curLv < nextForm.reqLevel) {
      setMessage(
        `Cần nâng thú đạt Cấp ${nextForm.reqLevel} (Hiện tại: Cấp ${curLv}) để mở khóa ${nextForm.title}!`
      );
      return;
    }
    if (curShards < nextForm.shardCost) {
      setMessage(
        `Cần ${nextForm.shardCost} Mảnh Hồn Thú (Hiện có: ${curShards}) để Tiến Hóa! Hãy quay Cầu Nguyện hoặc ghép mảnh.`
      );
      return;
    }
    if (gold < nextForm.goldCost) {
      setMessage(
        `Cần ${nextForm.goldCost} Vàng để đột phá ${nextForm.title}!`
      );
      return;
    }

    changeGold(-nextForm.goldCost);
    setProgress((p) => ({
      ...p,
      evolutions: { ...p.evolutions, [id]: nextForm.stage },
      shards: { ...p.shards, [id]: p.shards[id] - nextForm.shardCost },
      stats: {
        ...p.stats,
        evolutionsDone: p.stats.evolutionsDone + 1,
      },
    }));
    setPreviewStages((prev) => ({ ...prev, [id]: nextForm.stage }));
    setSelectedBeastId(id);
    setMessage(
      `ĐỘT PHÁ TIẾN HÓA BẬC ${nextForm.stage}: ${nextForm.name} (${nextForm.title})! Ngoại hình & kỹ năng đã lột xác (Uy lực ×${nextForm.powerMult})!`
    );
  }

  function instantMaxEvolutionDemo(id: PetId) {
    const curEvo = progress.evolutions[id] || 0;
    const nextStage = Math.min(3, curEvo + 1) as EvolutionStage;
    const form = getPetForm(id, nextStage);
    setProgress((p) => ({
      ...p,
      levels: { ...p.levels, [id]: Math.max(p.levels[id], form.reqLevel) },
      evolutions: { ...p.evolutions, [id]: nextStage },
      squad:
        p.squad.includes(id) || p.squad.length >= 5
          ? p.squad
          : [...p.squad, id],
      stats: {
        ...p.stats,
        evolutionsDone: p.stats.evolutionsDone + 1,
      },
    }));
    setPreviewStages((prev) => ({ ...prev, [id]: nextStage }));
    setSelectedBeastId(id);
    setMessage(
      `Đã đột phá ${form.name} lên ${form.title} (Cấp ${Math.max(progress.levels[id], form.reqLevel)})!`
    );
  }

  function claimAfkRewards() {
    if (afk.gold <= 0 && afk.essence <= 0) {
      if (!sandboxMode) {
        setMessage(
          "Đội tuần tra mới xuất phát (< 1 phút). Hãy vào trận chiến đấu để nhận vàng và mảnh thú ngay!"
        );
        return;
      }
      const bonusGold = 320;
      const bonusEssence = 45;
      const bonusStones = 6;
      changeGold(bonusGold);
      setProgress((p) => ({
        ...p,
        lastClaim: Date.now(),
        arcaneEssence: p.arcaneEssence + bonusEssence,
        summonStones: p.summonStones + bonusStones,
        shards: {
          dragon: p.shards.dragon + 8,
          fox: p.shards.fox + 8,
          turtle: p.shards.turtle + 8,
          slime: p.shards.slime + 8,
          owl: p.shards.owl + 8,
          rabbit: p.shards.rabbit + 8,
        },
      }));
      setMessage(
        `[Sandbox] Càn Quét Nhanh 2 Giờ: Nhận +${bonusGold} Vàng, +${bonusStones} Đá Triệu Hồi, +${bonusEssence} Tinh Hoa & +8 Mảnh mọi Thú!`
      );
      return;
    }
    changeGold(afk.gold);
    setProgress((p) => ({
      ...p,
      lastClaim: Date.now(),
      arcaneEssence: p.arcaneEssence + afk.essence,
      summonStones: p.summonStones + Math.max(1, afk.stones),
    }));
    setMessage(
      `Đã nhận thưởng treo máy (${afk.minutes} phút): +${afk.gold} Vàng, +${afk.essence} Tinh Hoa, +${Math.max(1, afk.stones)} Đá Triệu Hồi!`
    );
  }

  function performWishPulls(count: 1 | 10) {
    const stoneCost = count;
    const goldFallbackCost = count === 10 ? 540 : 60;
    const useStones = progress.summonStones >= stoneCost;

    if (!useStones && gold < goldFallbackCost) {
      setMessage(
        `Cần ${stoneCost} Đá Triệu Hồi hoặc ${goldFallbackCost} Vàng để Cầu Nguyện x${count}!`
      );
      return;
    }

    if (!useStones) {
      changeGold(-goldFallbackCost);
    }

    const results: GachaDropResult[] = [];
    const newItems: InventoryItem[] = [];

    let nextEpicPity = progress.epicPity;
    let nextLegPity = progress.legendaryPity;
    const nextLevels = { ...progress.levels };
    const nextShards = { ...progress.shards };
    let addedEssence = 0;

    const forceMode = (
      window as unknown as {
        __GACHA_FORCE_MODE__?: "worst_luck" | "normal" | "high_roll";
      }
    ).__GACHA_FORCE_MODE__;

    for (let i = 0; i < count; i++) {
      nextEpicPity += 1;
      nextLegPity += 1;

      const roll =
        forceMode === "worst_luck"
          ? 0.99
          : forceMode === "high_roll" && i === 0
            ? 0.01
            : Math.random();
      let rarity: "rare" | "epic" | "legendary" = "rare";
      if (nextLegPity >= 30 || roll < 0.05) {
        rarity = "legendary";
        nextLegPity = 0;
        nextEpicPity = 0;
      } else if (nextEpicPity >= 10 || roll < 0.25) {
        rarity = "epic";
        nextEpicPity = 0;
      }

      const isShardDrop =
        forceMode === "worst_luck"
          ? true
          : forceMode === "high_roll" && i === 0
            ? false
            : Math.random() < 0.58;

      if (isShardDrop) {
        const starterPool = PETS.slice(0, 3);
        const pickPet =
          forceMode === "worst_luck"
            ? starterPool[i % starterPool.length]
            : PETS[Math.floor(Math.random() * PETS.length)];
        const evoStage = progress.evolutions[pickPet.id] || 0;
        const form = getPetForm(pickPet.id, evoStage);
        const shardAmount =
          rarity === "legendary" ? 16 : rarity === "epic" ? 9 : 4;

        if (nextLevels[pickPet.id] <= 0) {
          nextLevels[pickPet.id] = 1;
          nextShards[pickPet.id] = (nextShards[pickPet.id] || 0) + shardAmount;
          results.push({
            title: `MỞ KHÓA THÚ: ${form.name}`,
            subtitle: `+${shardAmount} Mảnh Hồn Thú (${pickPet.lineageName})`,
            rarity: rarity === "rare" ? "epic" : rarity,
            portraitUrl: form.portraitUrl,
          });
        } else {
          nextShards[pickPet.id] = (nextShards[pickPet.id] || 0) + shardAmount;
          const bonusEss = rarity === "legendary" ? 16 : rarity === "epic" ? 8 : 4;
          addedEssence += bonusEss;
          results.push({
            title: `+${shardAmount} Mảnh ${form.name}`,
            subtitle: `Đồ trùng chuyển hóa → +${bonusEss} Tinh Hoa Cổ Ngữ`,
            rarity,
            portraitUrl: form.portraitUrl,
          });
        }
      } else {
        const tierPool = GACHA_GEAR_POOL.filter((g) => g.rarity === rarity);
        const pool = tierPool.length > 0 ? tierPool : GACHA_GEAR_POOL;
        const pickGear =
          forceMode === "high_roll" && i === 0
            ? pool[0]
            : pool[Math.floor(Math.random() * pool.length)];
        const item: InventoryItem = {
          ...pickGear,
          id: `wish_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 6)}`,
          level: rarity === "legendary" ? 2 : 1,
        };
        newItems.push(item);
        results.push({
          title: item.name,
          subtitle: `Đã chuyển vào Kho Đồ (+${item.bonusMightPct}% Sát thương, +${item.bonusHp} Máu)`,
          rarity: item.rarity === "common" ? "rare" : item.rarity,
          portraitUrl: getGameIconUrl(item.iconId),
        });
      }
    }

    for (const it of newItems) {
      onAddInventoryItem?.(it);
    }

    const nowTs = Date.now();
    const historyEntries = results.map((r, idx) => ({
      id: `hist_${nowTs}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
      title: r.title,
      subtitle: r.subtitle,
      rarity: r.rarity,
      portraitUrl: r.portraitUrl,
      timestamp: nowTs,
    }));

    setProgress((p) => ({
      ...p,
      summonStones: useStones ? p.summonStones - stoneCost : p.summonStones,
      arcaneEssence: p.arcaneEssence + addedEssence,
      levels: nextLevels,
      shards: nextShards,
      epicPity: nextEpicPity,
      legendaryPity: nextLegPity,
      totalPulls: p.totalPulls + count,
      gachaHistory: [...historyEntries, ...(p.gachaHistory || [])].slice(0, 30),
    }));

    setGachaResults(results);
    setMessage(
      `Cầu Nguyện x${count} hoàn tất! Nhận ${results.length} vật phẩm (Đã lưu vào Kho Đồ & Lịch Sử).`
    );
  }

  function openChest(kind: "starr" | "boss") {
    const count = kind === "starr" ? progress.starrChests : progress.bossChests;
    if (count <= 0) {
      setMessage(
        `Bạn đã hết ${kind === "starr" ? "Rương Chiến Lợi Phẩm" : "Rương Boss"}. Hãy hoàn thành Nhiệm Vụ hoặc vượt màn để nhận thêm!`
      );
      return;
    }

    const steps =
      kind === "boss"
        ? ["Sử Thi", "Thần Thoại ★"]
        : Math.random() < 0.35
          ? ["Hiếm", "Sử Thi", "Thần Thoại ★"]
          : ["Hiếm", "Sử Thi"];
    const finalRarity =
      steps[steps.length - 1] === "Thần Thoại ★" ? "legendary" : "epic";

    const pickPet = PETS[Math.floor(Math.random() * PETS.length)];
    const shardGain = finalRarity === "legendary" ? 12 : 7;
    const goldGain = finalRarity === "legendary" ? 110 : 65;
    const tierPool = GACHA_GEAR_POOL.filter((g) => g.rarity === finalRarity);
    const pool = tierPool.length > 0 ? tierPool : GACHA_GEAR_POOL;
    const gearPick = pool[Math.floor(Math.random() * pool.length)];

    const droppedGear: InventoryItem = {
      ...gearPick,
      id: `chest_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      level: finalRarity === "legendary" ? 2 : 1,
    };
    onAddInventoryItem?.(droppedGear);
    changeGold(goldGain);

    const dropResult: GachaDropResult = {
      title: `ĐỘT BIẾN RƯƠNG (${steps.join(" ➔ ")})`,
      subtitle: `Nhận: ${droppedGear.name} + ${shardGain} Mảnh ${pickPet.lineageName} + ${goldGain} Vàng!`,
      rarity: finalRarity,
      portraitUrl: getGameIconUrl(droppedGear.iconId),
    };

    const chestHistEntry = {
      id: `chest_hist_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title: dropResult.title,
      subtitle: dropResult.subtitle,
      rarity: dropResult.rarity,
      portraitUrl: dropResult.portraitUrl,
      timestamp: Date.now(),
    };

    setProgress((p) => ({
      ...p,
      starrChests: kind === "starr" ? p.starrChests - 1 : p.starrChests,
      bossChests: kind === "boss" ? p.bossChests - 1 : p.bossChests,
      shards: {
        ...p.shards,
        [pickPet.id]: (p.shards[pickPet.id] || 0) + shardGain,
      },
      stats: {
        ...p.stats,
        chestsOpened: p.stats.chestsOpened + 1,
      },
      gachaHistory: [chestHistEntry, ...(p.gachaHistory || [])].slice(0, 30),
    }));

    setGachaResults([dropResult]);
    setMessage(
      `Mở rương nổ bậc [${steps.join(" ➔ ")}]: Nhận ${droppedGear.name}, +${shardGain} Mảnh Thú & +${goldGain} Vàng!`
    );
  }

  function craftShardsWithEssence(petId: PetId) {
    const cost = 25;
    if (progress.arcaneEssence < cost) {
      setMessage(
        `Cần ${cost} Tinh Hoa Cổ Ngữ để ghép +15 Mảnh Hồn Thú (Hiện có ${progress.arcaneEssence}).`
      );
      return;
    }
    setProgress((p) => ({
      ...p,
      arcaneEssence: p.arcaneEssence - cost,
      shards: {
        ...p.shards,
        [petId]: (p.shards[petId] || 0) + 15,
      },
    }));
    setMessage(
      `Đã ghép thành công +15 Mảnh Hồn Thú cho ${PETS.find((x) => x.id === petId)?.lineageName}!`
    );
  }

  function claimQuest(qId: string) {
    const q = quests.find((x) => x.id === qId);
    if (!q || q.claimed || q.current < q.target) return;

    changeGold(q.rewardGold);
    setProgress((p) => ({
      ...p,
      summonStones: p.summonStones + q.rewardStones,
      arcaneEssence: p.arcaneEssence + q.rewardEssence,
      starrChests:
        p.starrChests + (q.rewardChest === "starr" ? 1 : 0),
      bossChests:
        p.bossChests + (q.rewardChest === "boss" ? 1 : 0),
      claimedQuests: [...p.claimedQuests, q.id],
    }));
    setMessage(
      `Đã nhận thưởng nhiệm vụ "${q.title}": +${q.rewardGold} Vàng, +${q.rewardStones} Đá Triệu Hồi, +${q.rewardEssence} Tinh Hoa!`
    );
  }

  const activeSynergies: string[] = [];
  if (
    progress.squad.includes("dragon") &&
    progress.squad.includes("fox")
  ) {
    activeSynergies.push("Bộc Phá Băng Hỏa (+45% Sát thương nổ nhiệt)");
  }
  if (
    progress.squad.includes("slime") &&
    progress.squad.includes("owl")
  ) {
    activeSynergies.push("Lôi Ngục Hư Không (+40% Sát thương Sét vùng hút)");
  }
  if (
    progress.squad.includes("turtle") &&
    progress.squad.includes("rabbit")
  ) {
    activeSynergies.push("Thánh Điện Bất Diệt (Hồi máu chuyển hóa Khiên)");
  }

  // Selected Beast for the Master Inspector
  const focusedPet = PETS.find((x) => x.id === selectedBeastId) || PETS[0];
  const focusedLv = progress.levels[focusedPet.id];
  const focusedCurEvo = progress.evolutions[focusedPet.id] || 0;
  const focusedViewedStage = previewStages[focusedPet.id] ?? focusedCurEvo;
  const focusedForm = getPetForm(focusedPet.id, focusedViewedStage);
  const focusedShards = progress.shards[focusedPet.id] || 0;

  return (
    <div className="idle-hub-wrapper">
      {/* Persistent Sticky Status, AFK & Squad Strip */}
      <div className="idle-sticky-strip">
        <div className="idle-afk-compact">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/assets/wesnoth/items/chest.png"
              alt="Rương Tuần Tra"
              width={48}
              height={48}
              className="shrink-0 object-cover rounded-lg border border-amber-400/60 bg-[#0b0e14]"
              style={{ transform: "scale(1.1)" }}
            />
            <div className="idle-afk-text">
              <strong>
                Tuần Tra AFK ({afk.minutes}p): +{afk.gold} Vàng · +{afk.essence} Tinh Hoa · +{afk.stones} Đá
              </strong>
              <span>
                Đội {progress.squad.length}/5 Thú (+{progress.squad.length * 15}% sản lượng) · {progress.summonStones} Đá · {progress.arcaneEssence} Tinh Hoa · {progress.starrChests + progress.bossChests} Rương
              </span>
            </div>
          </div>
          <button
            type="button"
            className="idle-btn-highlight"
            disabled={!sandboxMode && afk.gold <= 0 && afk.essence <= 0}
            onClick={claimAfkRewards}
          >
            {afk.gold > 0
              ? `Nhận +${afk.gold} Vàng & Quà`
              : sandboxMode
                ? "Càn Quét 2h (+320 Vàng)"
                : `Đang Tuần Tra (${afk.minutes}p)`}
          </button>
        </div>

        {message && (
          <div className="idle-message" role="status">
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              className="idle-msg-close"
            >
              ✕
            </button>
          </div>
        )}

        {/* Sticky 5-Beast Squad Bar */}
        {subTab === "beasts" && (
          <div className="idle-squad">
            <div className="idle-section-title" style={{ marginTop: 0 }}>
              <div className="idle-squad-title-left">
                <strong>
                  ĐỘI HÌNH XUẤT CHIẾN <em>{progress.squad.length}/5</em>
                </strong>
                <span className="idle-squad-subnote">
                  (Mang thêm thú giúp mạnh hơn, không tăng máu quái)
                </span>
              </div>
              <div className="idle-squad-actions">
                <button
                  type="button"
                  className="idle-btn-small"
                  disabled={
                    gold < trainingCost(progress.training) ||
                    progress.training >= 80
                  }
                  onClick={() => {
                    const cost = trainingCost(progress.training);
                    if (gold < cost) return;
                    changeGold(-cost);
                    setProgress((p) => ({ ...p, training: p.training + 1 }));
                    setMessage(
                      `Chỉ huy lên Cấp ${progress.training + 1}! (+${(progress.training + 1) * 10} Máu, +${(progress.training + 1) * 5}% Sát thương)`
                    );
                  }}
                >
                  Chỉ Huy Lv.{progress.training} ({trainingCost(progress.training)}G)
                </button>
                <button
                  type="button"
                  className="idle-btn-small"
                  onClick={autoFillBestSquad}
                >
                  Lắp Nhanh 5 Thú
                </button>
              </div>
            </div>

            <div className="idle-slots">
              {Array.from({ length: 5 }, (_, i) => {
                const id = progress.squad[i];
                const evo = id ? progress.evolutions[id] || 0 : 0;
                const form = id ? getPetForm(id, evo) : null;
                return (
                  <button
                    key={i}
                    type="button"
                    className={id ? "idle-slot filled" : "idle-slot"}
                    disabled={!id}
                    onClick={() => id && toggleSquad(id)}
                    title={
                      id && form
                        ? `${form.name} (Bấm để cho nghỉ)`
                        : "Ô thú trống — Chọn thú bên dưới để mang theo"
                    }
                  >
                    {id && form ? (
                      <>
                        <img src={form.portraitUrl} alt={form.name} />
                        <span className="slot-evo-badge">
                          {evo === 0 ? "Gốc" : `Evo.${evo}`}
                        </span>
                        <small>
                          Lv.{progress.levels[id]} · {form.name.split(" • ")[0]}
                        </small>
                      </>
                    ) : (
                      <span>＋ Ô {i + 1}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {activeSynergies.length > 0 && (
              <div className="idle-synergy-bar">
                {activeSynergies.map((s, idx) => (
                  <span key={idx} className="idle-synergy-pill">
                    ✦ {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scrollable Section Body */}
      <div className="idle-hub">
        {/* ================================================================== */}
        {/* SUB-TAB 1: MASTER BEAST INSPECTOR + 6-BEAST LINEAGE CARDS          */}
        {/* ================================================================== */}
        {subTab === "beasts" && (
          <>
            {/* MASTER SELECTED BEAST INSPECTOR PANEL */}
            <div className="beast-inspector-panel">
              <div className="beast-inspector-art">
                <img
                  src={focusedForm.portraitUrl}
                  alt={focusedForm.name}
                  className="inspector-portrait"
                />
                <img
                  src={focusedForm.spriteUrl}
                  alt={`${focusedForm.name} battle sprite`}
                  className="inspector-sprite"
                  title="Hình dáng chiến đấu thực tế trong trận"
                />
                <span className="idle-evo-top-badge">{focusedForm.title}</span>
                <span className="idle-lv-badge">
                  {focusedLv
                    ? `Lv.${focusedLv} • Evo ${focusedCurEvo}/3`
                    : "Chưa Mở"}
                </span>
              </div>

              <div className="flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span
                        className="text-xs font-extrabold uppercase tracking-wider"
                        style={{ color: focusedPet.color }}
                      >
                        {focusedPet.lineageName} · Hệ {focusedPet.element}
                      </span>
                      <h3 className="text-base font-black text-white leading-tight mt-0.5">
                        {focusedForm.name}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-[#0b0e14] border border-purple-400/60 text-xs font-bold text-purple-200">
                      Mảnh Hồn: {focusedShards}
                    </span>
                  </div>

                  <div className="idle-beast-skill-card mt-2">
                    <div className="beast-skill-icon-box">
                      <GameSvgIcon id={PET_SKILL_ICONS[focusedPet.id]} size={50} />
                    </div>
                    <div className="beast-skill-body">
                      <div className="beast-skill-meta">
                        <span className="skill-tag-pill power">
                          Uy lực ×{focusedForm.powerMult}
                        </span>
                        <span className="skill-tag-pill radius">
                          Phạm vi {focusedPet.baseRadius + focusedForm.radiusBonus}px
                        </span>
                        <span className="skill-tag-pill cd">
                          Hồi {focusedPet.cooldown}s
                        </span>
                      </div>
                      <p className="beast-skill-desc">
                        {focusedForm.formSkillDesc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="idle-combo mt-2">
                  <strong>✦ Hợp Kích Nguyên Tố:</strong> {focusedPet.combo}
                </div>
              </div>
            </div>

            <div className="idle-section-title" style={{ marginTop: 0 }}>
              <strong>
                SỔ HUYẾT MẠCH 6 THẦN THÚ (TIẾN HÓA 3 CẤP: LV.5 ➔ LV.10 ➔ LV.20)
              </strong>
              <span>Chạm vào thẻ hoặc bậc [Gốc / Evo 1 / 2 / 3] để xem chi tiết</span>
            </div>

            <div className="idle-pet-grid">
              {PETS.map((p) => {
                const lv = progress.levels[p.id];
                const curEvo = progress.evolutions[p.id] || 0;
                const viewedStage = previewStages[p.id] ?? curEvo;
                const viewedForm = getPetForm(p.id, viewedStage);
                const currentForm = getPetForm(p.id, curEvo);
                const nextEvoForm = getNextEvolutionRequirement(p.id, curEvo);
                const active = progress.squad.includes(p.id);
                const shards = progress.shards[p.id] || 0;
                const isSelected = selectedBeastId === p.id;

                return (
                  <article
                    key={p.id}
                    onClick={() => setSelectedBeastId(p.id)}
                    className={`idle-pet-card ${active ? "active" : ""} ${isSelected ? "selected-focus" : ""} evo-${curEvo}`}
                    style={{ "--pet-color": p.color } as React.CSSProperties}
                  >
                    <div className="idle-pet-art">
                      <img
                        src={viewedForm.portraitUrl}
                        alt={viewedForm.name}
                        className="idle-portrait-img"
                      />
                      <img
                        src={viewedForm.spriteUrl}
                        alt={`${viewedForm.name} sprite`}
                        className="idle-unit-sprite-preview"
                        title="Sprite chiến đấu thực tế trong trận"
                      />
                      <span className="idle-evo-top-badge">
                        {viewedForm.title}
                      </span>
                      <span className="idle-lv-badge">
                        {lv ? `CẤP ${lv} • EVO ${curEvo}/3` : "CHƯA TRIỆU HỒI"}
                      </span>
                      <span className="idle-shard-badge">
                        {shards} Mảnh
                      </span>
                    </div>

                    {/* 4-Stage Evolution Selector Strip */}
                    <div className="idle-evo-strip">
                      {EVOLUTION_MILESTONES.map((m) => {
                        const unlocked = curEvo >= m.stage && lv > 0;
                        const isViewing = viewedStage === m.stage;
                        return (
                          <button
                            key={m.stage}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBeastId(p.id);
                              setPreviewStages((prev) => ({
                                ...prev,
                                [p.id]: m.stage,
                              }));
                            }}
                            className={`evo-step-btn ${unlocked ? "unlocked" : "locked"} ${isViewing ? "viewing" : ""}`}
                          >
                            <span>{m.stage === 0 ? "Gốc" : `Evo ${m.stage}`}</span>
                            <small>Lv.{m.reqLevel}</small>
                          </button>
                        );
                      })}
                    </div>

                    <div className="idle-pet-copy">
                      <div className="pet-role-row">
                        <small className="pet-role-text">{p.role}</small>
                        <span className="pet-element-pill">
                          Hệ {p.element}
                        </span>
                      </div>

                      <div className="pet-header-row">
                        <h3 className="pet-name-line">
                          {viewedForm.name}
                        </h3>
                        <span className="skill-tag-pill power">
                          ×{viewedForm.powerMult}
                        </span>
                      </div>

                      <p className="beast-skill-desc">
                        {viewedForm.formSkillDesc}
                      </p>

                      {/* Clear Before -> After Upgrade Preview & Missing Condition Notice */}
                      <div className="mt-1 px-2 py-1 rounded bg-[#0c111b] border border-[#263248] text-[10.5px] font-bold flex flex-wrap items-center justify-between gap-1">
                        <span className="text-emerald-300">
                          {lv > 0
                            ? `⬆️ Cấp ${lv} ➔ Cấp ${Math.min(60, lv + 1)} (+18% Sát thương)`
                            : `✨ Triệu hồi khởi điểm Cấp 1 (Uy lực ×${viewedForm.powerMult})`}
                        </span>
                        {nextEvoForm && (
                          <span className="text-amber-300">
                            {lv < nextEvoForm.reqLevel
                              ? `Cần thêm ${nextEvoForm.reqLevel - lv} Cấp để Evo ${nextEvoForm.stage}`
                              : shards < nextEvoForm.shardCost
                              ? `Thiếu ${nextEvoForm.shardCost - shards} Mảnh để Evo ${nextEvoForm.stage}`
                              : `✓ Đủ điều kiện Đột Phá Evo ${nextEvoForm.stage} (×${nextEvoForm.powerMult})!`}
                          </span>
                        )}
                      </div>

                      {/* 3-Column Action Bar */}
                      <div
                        className="idle-pet-actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => lv > 0 && toggleSquad(p.id)}
                          disabled={lv <= 0 || (!active && progress.squad.length >= 5)}
                          className={active ? "btn-squad-active" : ""}
                        >
                          {lv <= 0
                            ? "Chưa Mở"
                            : active
                              ? "✓ Trong Đội"
                              : "＋ Vào Đội"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            lv >= 60 ||
                            gold < (lv ? petUpgradeCost(lv) : p.cost)
                          }
                          onClick={() => trainBeast(p.id, 1)}
                        >
                          {lv
                            ? `Nâng Cấp (${petUpgradeCost(lv)}G)`
                            : `Triệu Hồi (${p.cost}G)`}
                        </button>

                        {nextEvoForm ? (
                          <button
                            type="button"
                            className="btn-evolve"
                            onClick={() =>
                              (lv >= nextEvoForm.reqLevel &&
                                shards >= nextEvoForm.shardCost &&
                                gold >= nextEvoForm.goldCost) ||
                              !sandboxMode
                                ? evolveBeast(p.id)
                                : instantMaxEvolutionDemo(p.id)
                            }
                            title={`Yêu cầu: Cấp ${nextEvoForm.reqLevel}, ${nextEvoForm.shardCost} Mảnh, ${nextEvoForm.goldCost} Vàng`}
                          >
                            {lv >= nextEvoForm.reqLevel &&
                            shards >= nextEvoForm.shardCost
                              ? `Tiến Hóa ${nextEvoForm.stage} (${nextEvoForm.goldCost}G)`
                              : `Evo ${nextEvoForm.stage} (Lv.${nextEvoForm.reqLevel}·${nextEvoForm.shardCost}M)`}
                          </button>
                        ) : (
                          <span className="max-evo-pill">
                            ★ MAX BẬC III
                          </span>
                        )}
                      </div>

                      {viewedStage !== curEvo && (
                        <div className="idle-preview-notice">
                          Đang xem trước: <b>{viewedForm.title}</b> (Hiện tại: {currentForm.title})
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {/* ================================================================== */}
        {/* SUB-TAB 2: GACHA WISH BANNERS, STARR CHESTS & SHARD CRAFTING       */}
        {/* ================================================================== */}
        {subTab === "gacha" && (
          <div className="idle-gacha-panel">
            <div className="idle-gacha-banner">
              <div className="gacha-header-info">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  ĐIỆN CẦU NGUYỆN ASTRAL WISH (BẢO HIỂM PITY 10 & 30 LẦN)
                </span>
                <h3>Triệu Hồi Thần Thú & Thần Khí Hoàng Kim</h3>
                <p>
                  Tỉ lệ minh bạch: <b>Thần Thoại (5%)</b> · <b>Sử Thi (20%)</b> ·{" "}
                  <b>Hiếm (75%)</b>. Đồ trùng tự động chuyển thành{" "}
                  <b>Mảnh Hồn Thú</b> và <b>Tinh Hoa Cổ Ngữ</b>!
                </p>
                <div className="gacha-pity-bars">
                  <span>
                    Bảo đảm Sử Thi+: <b>{progress.epicPity}/10</b> lần quay
                  </span>
                  <span>
                    Bảo đảm Thần Thoại: <b>{progress.legendaryPity}/30</b> lần quay
                  </span>
                  <span>
                    Tổng lượt đã quay: <b>{progress.totalPulls}</b>
                  </span>
                </div>
              </div>

              <div className="gacha-pull-buttons">
                <button
                  type="button"
                  className="gacha-btn single"
                  onClick={() => performWishPulls(1)}
                >
                  <strong>Triệu Hồi ×1</strong>
                  <small>
                    {progress.summonStones >= 1
                      ? "Dùng 1 Đá Triệu Hồi"
                      : "Dùng 60 Vàng"}
                  </small>
                </button>
                <button
                  type="button"
                  className="gacha-btn multi"
                  onClick={() => performWishPulls(10)}
                >
                  <strong>Triệu Hồi ×10 (Bảo Đảm Sử Thi+)</strong>
                  <small>
                    {progress.summonStones >= 10
                      ? "Dùng 10 Đá Triệu Hồi"
                      : "Dùng 540 Vàng"}
                  </small>
                </button>
              </div>
            </div>

            {gachaResults.length > 0 && (
              <div className="gacha-results-box">
                <div className="idle-section-title">
                  <strong>KẾT QUẢ TRIỆU HỒI & MỞ RƯƠNG VỪA NHẬN</strong>
                  <button
                    type="button"
                    className="idle-btn-small"
                    onClick={() => setGachaResults([])}
                  >
                    Đóng kết quả
                  </button>
                </div>
                <div className="gacha-results-grid">
                  {gachaResults.map((r, i) => (
                    <div key={i} className={`gacha-result-item ${r.rarity}`}>
                      {r.portraitUrl && (
                        <img src={r.portraitUrl} alt={r.title} />
                      )}
                      <div className="gacha-result-copy">
                        <strong>{r.title}</strong>
                        <small>{r.subtitle}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="idle-section-title">
              <strong>KHO RƯƠNG CHIẾN LỢI PHẨM & RƯƠNG BOSS</strong>
              <span>Trang bị mở ra tự động chuyển vào Kho Đồ</span>
            </div>

            <div className="idle-chests-row">
              <div className="idle-chest-card">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src="/assets/wesnoth/items/chest-plain-closed.png"
                    alt="Rương Chiến Lợi Phẩm"
                    width={54}
                    height={54}
                    className="shrink-0 object-cover rounded-lg border border-slate-500/60 bg-[#0b0e14]"
                  />
                  <div>
                    <strong>Rương Chiến Lợi Phẩm ({progress.starrChests})</strong>
                    <p>
                      Có xác suất đột biến nâng bậc{" "}
                      <b>Hiếm ➔ Sử Thi ➔ Thần Thoại!</b>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={progress.starrChests <= 0}
                  onClick={() => openChest("starr")}
                >
                  Mở Rương ({progress.starrChests})
                </button>
              </div>

              <div className="idle-chest-card boss">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src="/assets/wesnoth/items/chest.png"
                    alt="Rương Boss Hoàng Kim"
                    width={54}
                    height={54}
                    className="shrink-0 object-cover rounded-lg border border-amber-400/80 bg-[#0b0e14]"
                  />
                  <div>
                    <strong>Rương Boss Hoàng Kim ({progress.bossChests})</strong>
                    <p>
                      Chắc chắn nhận <b>Thần Khí Sử Thi / Thần Thoại</b> + Mảnh Thú!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={progress.bossChests <= 0}
                  onClick={() => openChest("boss")}
                >
                  Mở Rương Boss ({progress.bossChests})
                </button>
              </div>
            </div>

            <div className="idle-exchange-box">
              <div className="idle-section-title">
                <strong>
                  XƯỞNG GHÉP MẢNH HỒN THÚ (Đang có: {progress.arcaneEssence} Tinh Hoa)
                </strong>
                <span>Dùng 25 Tinh Hoa để đổi +15 Mảnh Hồn Thú bất kỳ</span>
              </div>
              <div className="exchange-grid">
                {PETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="exchange-btn"
                    onClick={() => craftShardsWithEssence(p.id)}
                  >
                    <img
                      src={
                        getPetForm(p.id, progress.evolutions[p.id] || 0)
                          .portraitUrl
                      }
                      alt={p.lineageName}
                    />
                    <div className="exchange-copy">
                      <strong>
                        +15 Mảnh {p.forms[0].name}
                      </strong>
                      <small>
                        Đang có: {progress.shards[p.id]} mảnh · Giá: 25 Tinh Hoa
                      </small>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* PERSISTENT GACHA & CHEST HISTORY */}
            <div className="idle-history-box">
              <div className="idle-section-title">
                <strong>
                  LỊCH SỬ TRIỆU HỒI & MỞ RƯƠNG ({(progress.gachaHistory || []).length})
                </strong>
                <span>Lưu tự động vào bộ nhớ</span>
              </div>
              {(progress.gachaHistory || []).length === 0 ? (
                <div className="idle-history-empty">
                  Chưa có lịch sử Cầu Nguyện hoặc Mở Rương. Hãy quay thử ×1 hoặc ×10 ở trên!
                </div>
              ) : (
                <div className="gacha-results-grid">
                  {(progress.gachaHistory || []).slice(0, 10).map((item) => (
                    <div key={item.id} className={`gacha-result-item ${item.rarity}`}>
                      {item.portraitUrl && (
                        <img src={item.portraitUrl} alt={item.title} />
                      )}
                      <div className="gacha-result-copy">
                        <strong>{item.title}</strong>
                        <small>{item.subtitle}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* SUB-TAB 3: QUESTS, ACHIEVEMENTS & ASSET CREDITS                    */}
        {/* ================================================================== */}
        {subTab === "quests" && (
          <div className="idle-quests-panel">
            <div className="idle-section-title" style={{ marginTop: 0 }}>
              <strong>NHIỆM VỤ HÀNH TRÌNH & THÀNH TỰU THƯỞNG LỚN</strong>
              <span>
                Hoàn thành để nhận Vàng, Đá Triệu Hồi, Tinh Hoa & Rương Boss
              </span>
            </div>

            <div className="idle-quests-list">
              {quests.map((q) => {
                const done = q.current >= q.target;
                const pct = Math.min(
                  100,
                  Math.round((q.current / q.target) * 100)
                );
                return (
                  <div
                    key={q.id}
                    className={`idle-quest-card ${done && !q.claimed ? "ready" : ""}`}
                  >
                    <div className="quest-info">
                      <div className="quest-header">
                        <strong>{q.title}</strong>
                        <span>
                          {Math.min(q.current, q.target)}/{q.target} ({pct}%)
                        </span>
                      </div>
                      <p>{q.desc}</p>
                      <div className="quest-bar">
                        <div style={{ width: `${pct}%` }} />
                      </div>
                      <small className="quest-rewards">
                        Thưởng: +{q.rewardGold} Vàng · +{q.rewardStones} Đá Triệu Hồi · +
                        {q.rewardEssence} Tinh Hoa
                        {q.rewardChest === "boss"
                          ? " · +1 Rương Boss"
                          : q.rewardChest === "starr"
                            ? " · +1 Rương Chiến Lợi Phẩm"
                            : ""}
                      </small>
                    </div>

                    <button
                      type="button"
                      disabled={!done || q.claimed}
                      onClick={() => claimQuest(q.id)}
                    >
                      {q.claimed
                        ? "✓ Đã Nhận"
                        : done
                          ? "Nhận Thưởng"
                          : "Đang làm"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="idle-credits-box">
              <strong>
                NGUỒN TÀI NGUYÊN & GIẤY PHÉP MÃ NGUỒN MỞ (ASSET_CREDITS.md)
              </strong>
              <p>
                • <b>Giao diện, Icon Vũ Khí/Trang Bị, Chân Dung Tướng/Boss & 24 Hình Thái Thú:</b>{" "}
                Trích xuất từ dự án mã nguồn mở <i>The Battle for Wesnoth</i>{" "}
                (GPLv2+ / CC-BY-SA 4.0 — Xem đầy đủ tại <code>ASSET_CREDITS.md</code>).
                <br />• <b>Bản đồ Chiến Trường & Đơn vị Yêu Tinh:</b> Bộ{" "}
                <i>Tiny Swords</i> bởi Pixel Frog (CC0 1.0 Public Domain).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default IdleHub;
