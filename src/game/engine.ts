import {
  PETS,
  getPetForm,
  type EvolutionStage,
  type PetId,
  type PetUnit,
  type NovaKind,
  type NovaEffect,
  type IdleProgress,
} from "./companions";
import {
  HEROES,
  PASSIVES,
  STAGES,
  WEAPONS,
  WEAPON_SYNERGIES,
  type EnemyArch,
  type HeroDefinition,
  type HeroId,
  type MapObjectiveKind,
  type PassiveId,
  type StageId,
  type SynergyId,
  type UpgradeChoice,
  type WeaponId,
} from "./catalog";
import type { GameIconId } from "./icons";
import { sfx } from "./sound";

export interface EnemyEntity {
  id: number;
  arch: EnemyArch;
  x: number;
  y: number;
  vx: number;
  vy: number;
  facingX: number;
  radius: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  expValue: number;
  isElite: boolean;
  isBoss?: boolean;
  bossPhase?: 1 | 2;
  title?: string;
  hitFlash: number;
  knockVx: number;
  knockVy: number;
  animState: "run" | "attack";
  animDir: "side" | "down" | "up";
  animFrame: number;
  animTimer: number;
  attackTriggered: boolean;
  attackCooldown: number;
  specialTimer: number;
  // Status effects
  burnTimer: number;
  burnDps: number;
  burnTickTimer: number;
  frostTimer: number;
  shockTimer: number;
  stunTimer: number;
}

export interface PlayerProjectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  radius: number;
  damage: number;
  pierce: number;
  life: number;
  maxLife: number;
  kind: "arrow" | "sword_wave" | "ice_shard" | "shield" | "turret_bolt";
  sourceWeapon: WeaponId;
  isEvolved: boolean;
  bouncesLeft?: number;
  returning?: boolean;
  hitIds: Set<number>;
}

export interface DecoyBombEntity {
  x: number;
  y: number;
  pullRadius: number;
  damage: number;
  timer: number;
  maxTimer: number;
  isFlamethrower: boolean;
  flameTick: number;
}

export interface TurretEntity {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  fireCooldown: number;
  isFlamethrower: boolean;
  isRescuedAlly?: boolean;
}

export interface MapObjectiveEntity {
  id: number;
  kind: MapObjectiveKind;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  radius: number;
  hp: number;
  maxHp: number;
  completed: boolean;
  poisonRadius?: number;
  progress: number;
}

export interface MinecartHazard {
  y: number;
  x: number;
  vx: number;
  warnTimer: number;
  active: boolean;
}

export interface BossTelegraph {
  kind:
    | "line_charge"
    | "circle_slam"
    | "cone_cleave"
    | "root_snare"
    | "quake_safezone";
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  elapsed: number;
  duration: number;
  damage: number;
  bossId: number;
}

export interface EnemyBomb {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  x: number;
  y: number;
  zHeight: number;
  elapsed: number;
  duration: number;
  blastRadius: number;
  damage: number;
  frame: number;
}

export interface SlashArcEffect {
  x: number;
  y: number;
  angle: number;
  radius: number;
  arcSpan: number;
  life: number;
  maxLife: number;
  color: string;
  isEvolved: boolean;
}

export interface LightningBoltSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface FrostRingEffect {
  x: number;
  y: number;
  maxRadius: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface FireTrailPatch {
  x: number;
  y: number;
  radius: number;
  dps: number;
  life: number;
  maxLife: number;
  tickTimer: number;
  sourceWeapon: WeaponId;
}

export interface SpriteAnimEffect {
  kind: "dead_skull" | "explosion";
  x: number;
  y: number;
  frame: number;
  maxFrames: number;
  frameDuration: number;
  timer: number;
  scale: number;
}

export interface DashAfterimage {
  x: number;
  y: number;
  facingX: number;
  row: number;
  col: number;
  life: number;
  maxLife: number;
  isPhantomStrike?: boolean;
}

export type GemTier =
  | "azure"
  | "gold"
  | "chest"
  | "meat"
  | "rune_frenzy"
  | "rune_aegis"
  | "rune_magnet";

export interface ExpGemEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  value: number;
  tier: GemTier;
  magnetized: boolean;
  magnetTime: number;
  bobSeed: number;
}

export interface DamagePopup {
  x: number;
  y: number;
  vy: number;
  text: string;
  color: string;
  isCrit: boolean;
  life: number;
  maxLife: number;
}

export interface ParticleDot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface EngineSnapshot {
  status: "playing" | "level_up" | "game_over" | "victory";
  stageId: StageId;
  hero: HeroDefinition;
  elapsedSec: number;
  hp: number;
  maxHp: number;
  level: number;
  exp: number;
  expToNext: number;
  kills: number;
  gold: number;
  dashCooldownRatio: number;
  weapons: Record<WeaponId, { level: number; evolved: boolean }>;
  passives: Record<PassiveId, number>;
  activeSynergies: SynergyId[];
  weaponDamage: Record<WeaponId, number>;
  aegisShield: number;
  frenzyTimer: number;
  collectedRunes: number;
  objectives: Array<{
    id: number;
    kind: MapObjectiveKind;
    title: string;
    subtitle: string;
    x: number;
    y: number;
    hp: number;
    maxHp: number;
    completed: boolean;
  }>;
  objectivesCompleted: number;
  bossDefeated: boolean;
  newlyUnlocked: string[];
  choices: UpgradeChoice[];
  eliteActive: { name: string; hp: number; maxHp: number } | null;
  bannerText: string | null;
  fps: number;
  frameMs: number;
  updateMs: number;
  renderMs: number;
  slowFrames: number;
  enemyCount: number;
  projectileCount: number;
  shakeEnabled: boolean;
}

export interface EquippedVisualItem {
  name: string;
  iconId: GameIconId;
  rarity: "rare" | "epic" | "legendary";
  level: number;
}

export interface EquippedVisualSummary {
  weapon?: EquippedVisualItem | null;
  armor?: EquippedVisualItem | null;
  relic?: EquippedVisualItem | null;
}

export class EclipseGameEngine {
  public hero: HeroDefinition = HEROES.kael;
  public stageId: StageId = "courtyard";
  public status: "playing" | "level_up" | "game_over" | "victory" = "playing";
  public equippedVisuals: EquippedVisualSummary = {};
  public weaponSwingTimer = 0;
  public weaponSwingAlt = false;

  private triggerWeaponSwing(): void {
    this.weaponSwingTimer = 0.28;
    this.weaponSwingAlt = !this.weaponSwingAlt;
  }

  public pets: PetUnit[] = [];
  public autoExplore = false;
  public autoUpgrade = true;
  public novas: NovaEffect[] = [];
  public novaCooldowns: Record<NovaKind, number> = {
    meteor: 0,
    blizzard: 0,
    thunder: 0,
    blackhole: 0,
    summon_overdrive: 0,
  };
  public petDamage = 0;
  public encounter: {
    x: number;
    y: number;
    expires: number;
    kind: "feast" | "rune" | "merchant";
    claimed: boolean;
  } | null = null;
  public encountersClaimed = 0;
  private encounterMilestone = 0;
  private snapshotClock = 0;
  private autoChoiceClock = 0;
  private autoNovaClock = 8.5;

  public configureCompanions(progress: IdleProgress): void {
    this.autoExplore = progress.auto;
    this.autoUpgrade = progress.autoUpgrade !== false;
    this.pets = [...new Set(progress.squad)]
      .filter((id) => PETS.some((p) => p.id === id) && progress.levels[id] > 0)
      .slice(0, 5)
      .map((id, i) => ({
        id,
        level: progress.levels[id],
        evolution: (progress.evolutions?.[id] ?? 0) as EvolutionStage,
        x: this.px + Math.cos(i * 1.256) * 136,
        y: this.py + Math.sin(i * 1.256) * 92,
        vx: 0,
        vy: 0,
        facingX: 1,
        aiState: "follow",
        stateTimer: 0,
        targetId: null,
        castX: this.px,
        castY: this.py,
        comboFlashTimer: 0,
        cooldown: 0.65 + i * 0.38,
        damage: 0,
        casts: 0,
      }));
  }

  private getPetFormationSlot(index: number, total: number, petId: PetId): [number, number] {
    // Role-based tactical formation around Hero (Front Vanguard, Mid Wings, Rear Support)
    const roleOffsets: Record<PetId, [number, number]> = {
      turtle: [108, -42],
      dragon: [112, 46],
      fox: [-18, -96],
      slime: [-18, 96],
      owl: [-118, -48],
      rabbit: [-118, 48],
    };
    const base = roleOffsets[petId];
    if (base) {
      const flip = this.facingX >= 0 ? 1 : -1;
      const swayX = Math.cos(this.elapsedSec * 1.4 + index * 1.3) * 10;
      const swayY = Math.sin(this.elapsedSec * 1.6 + index * 1.3) * 8;
      return [this.px + base[0] * flip + swayX, this.py + base[1] + swayY];
    }
    const angle = (index * Math.PI * 2) / Math.max(1, total) + this.elapsedSec * 0.32;
    return [this.px + Math.cos(angle) * 132, this.py + Math.sin(angle) * 92];
  }

  public claimEncounter(): boolean {
    const e = this.encounter;
    if (
      this.status !== "playing" ||
      !e ||
      e.claimed ||
      Math.hypot(e.x - this.px, e.y - this.py) > 120
    )
      return false;
    e.claimed = true;
    this.encountersClaimed++;
    this.gold += 30;
    if (e.kind === "feast") {
      this.hp = Math.min(this.maxHp, this.hp + this.maxHp * 0.35);
      this.showBanner("TIỆC LINH THÚ! +35% Máu • +30 Vàng", 2.5);
    } else if (e.kind === "merchant") {
      this.aegisShield = Math.min(120, this.aegisShield + 45);
      this.exp += Math.round(this.expToNext * 0.45);
      this.showBanner(
        "THƯƠNG NHÂN BÍ ẨN! +45 Khiên Hoàng Kim • +EXP • +30 Vàng",
        2.5
      );
    } else {
      this.frenzyTimer = 12;
      this.showBanner("CỔ NGỮ CUỒNG NỘ! Cường hóa 12 giây • +30 Vàng", 2.5);
    }
    this.emitSnapshot();
    return true;
  }

  private idleDirection(): [number, number] {
    let tx = this.px,
      ty = this.py;
    const encounter = this.encounter;
    let nearestObj: MapObjectiveEntity | null = null;
    let bestObjD2 = Infinity;
    for (let i = 0; i < this.mapObjectives.length; i++) {
      const o = this.mapObjectives[i];
      if (o.completed || o.kind === "blood_altar") continue;
      const d2 = (o.x - this.px) ** 2 + (o.y - this.py) ** 2;
      if (d2 < bestObjD2) {
        bestObjD2 = d2;
        nearestObj = o;
      }
    }

    let nearestGem: ExpGemEntity | null = null;
    let bestGemD2 = 190 * 190;
    const allowMeat = this.hp < this.maxHp * 0.75;
    for (let i = 0; i < this.gems.length; i++) {
      const g = this.gems[i];
      if (g.tier === "meat" && !allowMeat) continue;
      const d2 = (g.x - this.px) ** 2 + (g.y - this.py) ** 2;
      if (d2 < bestGemD2) {
        bestGemD2 = d2;
        nearestGem = g;
      }
    }

    if (encounter && !encounter.claimed) {
      tx = encounter.x;
      ty = encounter.y;
      if (Math.hypot(tx - this.px, ty - this.py) < 100) this.claimEncounter();
    } else if (nearestGem) {
      tx = nearestGem.x;
      ty = nearestGem.y;
    } else if (nearestObj) {
      tx = nearestObj.x;
      ty = nearestObj.y;
    } else {
      tx = Math.cos(this.elapsedSec * 0.18) * 240;
      ty = Math.sin(this.elapsedSec * 0.18) * 170;
    }
    let dx = tx - this.px,
      dy = ty - this.py;
    const d = Math.hypot(dx, dy);
    if (d > 15) {
      dx /= d;
      dy /= d;
    } else {
      dx = 0;
      dy = 0;
    }
    for (const enemy of this.enemies) {
      if (enemy.hp <= 0) continue;
      const ex = this.px - enemy.x,
        ey = this.py - enemy.y,
        dist = Math.hypot(ex, ey);
      if (dist < 85 && dist > 0) {
        dx += ((ex / dist) * (85 - dist)) / 35;
        dy += ((ey / dist) * (85 - dist)) / 35;
      }
    }
    return [dx, dy];
  }

  public castNova(kind: NovaKind): boolean {
    if (this.status !== "playing" || this.novaCooldowns[kind] > 0) return false;
    const radius =
      kind === "meteor"
        ? 320
        : kind === "blizzard"
          ? 340
          : kind === "blackhole"
            ? 340
            : kind === "summon_overdrive"
              ? 350
              : 360;
    const color =
      kind === "meteor"
        ? "#ff7849"
        : kind === "blizzard"
          ? "#38bdf8"
          : kind === "blackhole"
            ? "#c084fc"
            : kind === "summon_overdrive"
              ? "#fbbf24"
              : "#facc15";
    let nearest: EnemyEntity | null = null;
    let bestD2 = Infinity;
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      if (e.hp <= 0) continue;
      const d2 = (e.x - this.px) ** 2 + (e.y - this.py) ** 2;
      if (d2 < bestD2) {
        bestD2 = d2;
        nearest = e;
      }
    }
    const x =
      kind === "summon_overdrive"
        ? this.px
        : nearest
          ? this.px + (nearest.x - this.px) * 0.45
          : this.px;
    const y =
      kind === "summon_overdrive"
        ? this.py
        : nearest
          ? this.py + (nearest.y - this.py) * 0.45
          : this.py;

    this.novaCooldowns[kind] =
      kind === "meteor"
        ? 18
        : kind === "blizzard"
          ? 20
          : kind === "blackhole"
            ? 22
            : kind === "summon_overdrive"
              ? 24
              : 17;
    if (this.novas.length >= 4) {
      this.novas.shift();
    }
    this.novas.push({ kind, x, y, radius, life: 1.9, maxLife: 1.9, color });
    this.damageObjectivesInRadius(
      x,
      y,
      radius,
      115 * this.getMightMultiplier(),
      this.hero.startingWeapon
    );

    if (kind === "summon_overdrive") {
      this.frenzyTimer = Math.max(this.frenzyTimer, 8);
      this.aegisShield = Math.min(120, this.aegisShield + 35);
      for (const pet of this.pets) {
        pet.cooldown = 0.05;
      }
    }

    for (const e of this.enemies) {
      if (e.hp <= 0 || Math.hypot(e.x - x, e.y - y) > radius) continue;
      if (kind === "blackhole") {
        e.x += (x - e.x) * 0.68;
        e.y += (y - e.y) * 0.68;
        e.shockTimer = 4.5;
        e.stunTimer = Math.max(e.stunTimer, e.isBoss ? 0.5 : 1.4);
      }
      const baseDmg =
        kind === "meteor"
          ? 135
          : kind === "thunder"
            ? 115
            : kind === "blackhole"
              ? 110
              : kind === "summon_overdrive"
                ? 95
                : 80;
      this.damageEnemy(
        e,
        baseDmg * this.getMightMultiplier(),
        kind === "blackhole" ? x - e.x : e.x - x,
        kind === "blackhole" ? y - e.y : e.y - y,
        kind === "blackhole" ? 40 : 180
      );
      if (kind === "blizzard") {
        e.frostTimer = 5.5;
        e.stunTimer = Math.max(e.stunTimer, e.isBoss ? 0.6 : 1.8);
      }
      if (kind === "meteor") {
        e.burnTimer = 4.5;
        e.burnDps = 18 * this.getMightMultiplier();
      }
      if (kind === "thunder") {
        e.shockTimer = 4.5;
        e.stunTimer = Math.max(e.stunTimer, e.isBoss ? 0.4 : 1.0);
      }
    }
    const bannerMap: Record<NovaKind, string> = {
      meteor: "☄️ THIÊN THẠCH HỦY DIỆT!",
      blizzard: "❄️ BÃO BĂNG VĨNH CỬU!",
      thunder: "⚡ VẠN LÔI THIÊN NGỤC!",
      blackhole: "🌌 HỐ ĐEN HƯ KHÔNG!",
      summon_overdrive: "👑 THÁNH QUANG TRIỆU HỒI — 5 THÚ ĐỒNG KÍCH!",
    };
    this.showBanner(bannerMap[kind], 2.0);
    this.addShake(9, 0.32);
    this.triggerWeaponSwing();
    return true;
  }

  private updateSummons(dt: number): void {
    this.weaponSwingTimer = Math.max(0, this.weaponSwingTimer - dt);
    for (const key of [
      "meteor",
      "blizzard",
      "thunder",
      "blackhole",
      "summon_overdrive",
    ] as NovaKind[]) {
      this.novaCooldowns[key] = Math.max(0, this.novaCooldowns[key] - dt);
    }
    for (let n = this.novas.length - 1; n >= 0; n--) {
      this.novas[n].life -= dt;
      if (this.novas[n].life <= 0) {
        this.novas.splice(n, 1);
      }
    }
    const milestone = Math.floor(this.elapsedSec / 28);
    if (milestone > this.encounterMilestone) {
      this.encounterMilestone = milestone;
      const kinds: Array<"feast" | "rune" | "merchant"> = [
        "feast",
        "rune",
        "merchant",
      ];
      const kind = kinds[milestone % 3];
      this.encounter = {
        x: Math.max(-500, Math.min(500, this.px + Math.cos(milestone * 2) * 180)),
        y: Math.max(-220, Math.min(350, this.py + Math.sin(milestone * 2) * 150)),
        expires: this.elapsedSec + 24,
        kind,
        claimed: false,
      };
      this.showBanner(
        kind === "feast"
          ? "🍖 TIỆC LINH THÚ XUẤT HIỆN! Đến gần nhận quà (E)"
          : kind === "merchant"
            ? "⛺ THƯƠNG NHÂN BÍ ẨN! Đến gần nhận Khiên & EXP (E)"
            : "✦ CỔ NGỮ CUỒNG NỘ! Đến gần kích hoạt (E)",
        3
      );
    }
    if (this.encounter && this.elapsedSec > this.encounter.expires)
      this.encounter = null;
    this.autoNovaClock -= dt;
    if (this.autoExplore && this.autoNovaClock <= 0) {
      this.autoNovaClock = 7.5;
      const kind = (
        [
          "meteor",
          "blackhole",
          "thunder",
          "blizzard",
          "summon_overdrive",
        ] as NovaKind[]
      ).find((k) => this.novaCooldowns[k] <= 0);
      if (kind && this.enemies.length > 2) this.castNova(kind);
    }

    for (let i = 0; i < this.pets.length; i++) {
      const pet = this.pets[i],
        def = PETS.find((p) => p.id === pet.id)!;
      const form = getPetForm(pet.id, pet.evolution);
      if (pet.vx === undefined) pet.vx = 0;
      if (pet.vy === undefined) pet.vy = 0;
      if (!pet.aiState) pet.aiState = "follow";
      if (pet.stateTimer === undefined) pet.stateTimer = 0;
      if (pet.comboFlashTimer && pet.comboFlashTimer > 0) {
        pet.comboFlashTimer = Math.max(0, pet.comboFlashTimer - dt);
      }

      const [slotX, slotY] = this.getPetFormationSlot(i, this.pets.length, pet.id);
      pet.cooldown = Math.max(0, pet.cooldown - dt);
      pet.stateTimer = Math.max(0, pet.stateTimer - dt);

      // Find best enemy target within 460px of Hero
      let target: EnemyEntity | null = null;
      let bestPetD2 = Infinity;
      const maxRange2 = 460 * 460;
      for (let j = 0; j < this.enemies.length; j++) {
        const e = this.enemies[j];
        if (e.hp <= 0) continue;
        const playerD2 = (e.x - this.px) ** 2 + (e.y - this.py) ** 2;
        if (playerD2 > maxRange2) continue;
        const petD2 = (e.x - pet.x) ** 2 + (e.y - pet.y) ** 2 - (e.isBoss ? 18000 : e.isElite ? 8000 : 0);
        if (petD2 < bestPetD2) {
          bestPetD2 = petD2;
          target = e;
        }
      }
      const isSupport = pet.id === "rabbit" || pet.id === "turtle";

      // 4-State Machine: follow -> approach -> cast -> return (ported from GDQuest Steering AI + Open-RPG)
      let goalX = slotX;
      let goalY = slotY;
      let maxSpeed = 295;
      let decelRadius = 90;

      if (pet.aiState === "follow") {
        if (pet.cooldown <= 0.38 && (target || isSupport)) {
          pet.aiState = "approach";
          pet.stateTimer = 0.52;
          pet.targetId = target?.id ?? null;
        }
      }

      if (pet.aiState === "approach") {
        maxSpeed = 385;
        decelRadius = 45;
        if (target && !isSupport) {
          // GSAIPursue: lead target velocity by up to 0.32s
          const distToTarget = Math.hypot(target.x - pet.x, target.y - pet.y);
          const predictT = Math.min(0.32, distToTarget / Math.max(120, maxSpeed));
          const aimX = target.x + target.vx * predictT;
          const aimY = target.y + target.vy * predictT;
          // Stop slightly short of enemy center (standoff distance 55px..95px)
          const standoff = pet.id === "owl" || pet.id === "dragon" ? 88 : 52;
          const dx = pet.x - aimX;
          const dy = pet.y - aimY;
          const d = Math.max(1, Math.hypot(dx, dy));
          goalX = aimX + (dx / d) * standoff;
          goalY = aimY + (dy / d) * standoff;
          if (distToTarget <= standoff + 36 || pet.stateTimer <= 0) {
            pet.aiState = "cast";
            pet.stateTimer = 0.24;
            pet.castX = target.x;
            pet.castY = target.y;
          }
        } else {
          // Support pets (rabbit / turtle) approach close to Hero to bless/shield
          goalX = this.px + (i % 2 === 0 ? -48 : 48);
          goalY = this.py + 22;
          if (Math.hypot(goalX - pet.x, goalY - pet.y) <= 44 || pet.stateTimer <= 0) {
            pet.aiState = "cast";
            pet.stateTimer = 0.22;
            pet.castX = this.px;
            pet.castY = this.py;
          }
        }
      }

      if (pet.aiState === "cast") {
        // Braking during windup telegraph
        pet.vx *= Math.pow(0.08, dt);
        pet.vy *= Math.pow(0.08, dt);
        if (target && !isSupport) {
          pet.castX = target.x;
          pet.castY = target.y;
        } else if (isSupport) {
          pet.castX = this.px;
          pet.castY = this.py;
        }

        if (pet.stateTimer <= 0 && pet.cooldown <= 0) {
          // Execute Beast Skill Impact!
          const cdFactor = pet.evolution >= 2 ? 0.85 : 1.0;
          pet.cooldown = def.cooldown * cdFactor;
          pet.casts++;

          const x = pet.castX ?? (isSupport ? this.px : (target?.x ?? pet.x));
          const y = pet.castY ?? (isSupport ? this.py : (target?.y ?? pet.y));
          const radius = def.baseRadius + form.radiusBonus;
          const mult = (1 + (pet.level - 1) * 0.18) * form.powerMult;

          if (this.novas.length >= 5) {
            this.novas.shift();
          }
          this.novas.push({
            kind: pet.id,
            x,
            y,
            radius,
            life: 1.05,
            maxLife: 1.05,
            color: def.color,
            evolutionStage: pet.evolution,
          });

          if (pet.id === "rabbit") {
            this.hp = Math.min(this.maxHp, this.hp + 10 * mult);
            if (this.pets.some((p) => p.id === "turtle")) {
              this.aegisShield = Math.min(120, this.aegisShield + 10 * mult);
              pet.comboFlashTimer = 1.1;
              this.spawnPopup(this.px, this.py - 36, "✨ THÁNH ĐIỆN BẤT DIỆT!", "#4ADE80", true);
            }
          }
          if (pet.id === "turtle") {
            this.aegisShield = Math.min(120, this.aegisShield + 14 * mult);
          }

          let comboPopped = false;
          const r2 = radius * radius;
          for (let j = 0; j < this.enemies.length; j++) {
            const e = this.enemies[j];
            if (e.hp <= 0) continue;
            if ((e.x - x) ** 2 + (e.y - y) ** 2 > r2) continue;
            let damage =
              (pet.id === "dragon"
                ? 24
                : pet.id === "owl"
                  ? 26
                  : pet.id === "turtle"
                    ? 14
                    : pet.id === "rabbit"
                      ? 11
                      : 18) * mult;
            if (pet.id === "dragon") {
              if (e.frostTimer > 0 && this.pets.some((p) => p.id === "fox")) {
                damage *= 1.45;
                if (!comboPopped) {
                  comboPopped = true;
                  pet.comboFlashTimer = 1.1;
                  this.spawnPopup(e.x, e.y - 34, "🔥❄️ BỘC PHÁ BĂNG HỎA! +45%", "#FB923C", true);
                }
              }
              e.burnTimer = Math.max(e.burnTimer, 2.5);
              e.burnDps = Math.max(e.burnDps, 7 * mult);
            }
            if (pet.id === "fox") {
              e.frostTimer = Math.max(e.frostTimer, 2.8 + pet.evolution * 0.5);
              e.stunTimer = Math.max(
                e.stunTimer,
                e.isBoss ? 0.2 : 0.7 + pet.evolution * 0.2
              );
            }
            if (pet.id === "slime") {
              e.x += (x - e.x) * (0.42 + pet.evolution * 0.08);
              e.y += (y - e.y) * (0.42 + pet.evolution * 0.08);
              e.shockTimer = Math.max(e.shockTimer, 3.0);
            }
            if (
              pet.id === "owl" &&
              e.shockTimer > 0 &&
              this.pets.some((p) => p.id === "slime")
            ) {
              damage *= 1.4;
              if (!comboPopped) {
                comboPopped = true;
                pet.comboFlashTimer = 1.1;
                this.spawnPopup(e.x, e.y - 34, "🌌⚡ LÔI NGỤC HƯ KHÔNG! +40%", "#FACC15", true);
              }
            }
            const before = e.hp;
            this.damageEnemy(
              e,
              damage,
              e.x - this.px,
              e.y - this.py,
              pet.id === "turtle" ? 240 : 25
            );
            pet.damage += Math.max(0, before - e.hp);
            this.petDamage += Math.max(0, before - e.hp);
          }

          pet.aiState = "return";
          pet.stateTimer = 0.55;
        }
      } else {
        if (pet.aiState === "return") {
          maxSpeed = 350;
          decelRadius = 105;
          goalX = slotX;
          goalY = slotY;
          if (Math.hypot(slotX - pet.x, slotY - pet.y) <= 34 || pet.stateTimer <= 0) {
            pet.aiState = "follow";
          }
        }

        // GSAIArrive steering toward (goalX, goalY)
        const toX = goalX - pet.x;
        const toY = goalY - pet.y;
        const dist = Math.hypot(toX, toY);
        let desiredVx = 0;
        let desiredVy = 0;
        if (dist > 6) {
          const rampedSpeed =
            dist <= decelRadius ? maxSpeed * (dist / decelRadius) : maxSpeed;
          desiredVx = (toX / dist) * rampedSpeed;
          desiredVy = (toY / dist) * rampedSpeed;
        }

        // GSAISeparation: inverse-square repulsion from other squad beasts & Hero spotlight
        let sepAx = 0;
        let sepAy = 0;
        const heroDx = pet.x - this.px;
        const heroDy = pet.y - this.py;
        const heroDist2 = heroDx * heroDx + heroDy * heroDy;
        if (heroDist2 < 56 * 56 && heroDist2 > 1) {
          const hd = Math.sqrt(heroDist2);
          const push = Math.min(480, 2600 / heroDist2) * 85;
          sepAx += (heroDx / hd) * push;
          sepAy += (heroDy / hd) * push;
        }
        for (let k = 0; k < this.pets.length; k++) {
          if (k === i) continue;
          const other = this.pets[k];
          const sdx = pet.x - other.x;
          const sdy = pet.y - other.y;
          const d2 = sdx * sdx + sdy * sdy;
          if (d2 < 74 * 74 && d2 > 1) {
            const sd = Math.sqrt(d2);
            const strength = Math.min(520, 2400 / d2) * 95;
            sepAx += (sdx / sd) * strength;
            sepAy += (sdy / sd) * strength;
          }
        }

        const steerFactor = Math.min(1, dt * 9.5);
        pet.vx += (desiredVx - pet.vx) * steerFactor + sepAx * dt;
        pet.vy += (desiredVy - pet.vy) * steerFactor + sepAy * dt;
        pet.x = Math.max(-620, Math.min(620, pet.x + pet.vx * dt));
        pet.y = Math.max(-305, Math.min(435, pet.y + pet.vy * dt));
      }

      if (Math.abs(pet.vx) > 12) {
        pet.facingX = pet.vx >= 0 ? 1 : -1;
      } else if (target && pet.aiState === "cast") {
        pet.facingX = target.x >= pet.x ? 1 : -1;
      } else {
        pet.facingX = this.facingX;
      }
    }
  }

  // Player state
  public px = 0;
  public py = 0;
  public pvx = 0;
  public pvy = 0;
  public facingX = 1;
  public aimAngle = 0;
  public hp = 140;
  public maxHp = 140;
  public bonusMightPct = 0;
  public bonusSpeedPct = 0;
  public invulnTimer = 0;
  public playerHitFlash = 0;
  public dashTimer = 0;
  public dashCooldown = 0;
  public dashMaxCooldown = 2.3;
  public afterimageTimer = 0;

  // Collectible Buffs & Hero-Specific Timers
  public aegisShield = 0;
  public frenzyTimer = 0;
  public collectedRunes = 0;
  public playerRootTimer = 0;
  public inWarmthZone = false;
  public chillStacks = 0;
  public safeZone: { x: number; y: number; radius: number; timer: number } | null = null;
  public portalCooldown = 0;
  public readonly heaterBraziers: ReadonlyArray<readonly [number, number]> = [
    [-185, -95],
    [185, -95],
    [-185, 125],
    [185, 125],
  ];
  public readonly voidPortals: ReadonlyArray<readonly [number, number]> = [
    [-225, 10],
    [225, 10],
  ];
  private runeSpawnTimer = 26;
  private heroTraitTimer = 4.5;
  private dragonBreathTimer = 1.4;
  private poisonTickTimer = 0;
  private minecartSpawnTimer = 9.0;

  public heroAnimState: "idle" | "run" | "attack_1" | "attack_2" = "idle";
  public heroAttackDir: "side" | "down" | "up" = "side";
  public heroAnimFrame = 0;
  public heroAnimTimer = 0;
  private heroStrikeDelivered = false;
  private hitStopTimer = 0;

  // Progression & Stats
  public level = 1;
  public exp = 0;
  public expToNext = 40;
  public kills = 0;
  public gold = 0;
  public elapsedSec = 0;
  public totalDamageTaken = 0;
  public gemCombo = 0;
  public gemComboTimer = 0;
  public objectivesCompleted = 0;
  public bossDefeated = false;
  public newlyUnlocked: string[] = [];

  // Inventory (8 Weapons + 5 Passives)
  public weapons: Record<WeaponId, { level: number; evolved: boolean }> = {
    broadsword: { level: 0, evolved: false },
    astral_bow: { level: 0, evolved: false },
    flying_shield: { level: 0, evolved: false },
    quake_hammer: { level: 0, evolved: false },
    frost_tome: { level: 0, evolved: false },
    oil_torch: { level: 0, evolved: false },
    lightning_magnet: { level: 0, evolved: false },
    decoy_bomb: { level: 0, evolved: false },
  };
  public passives: Record<PassiveId, number> = {
    might: 0,
    haste: 0,
    phantom_boots: 0,
    baby_dragon: 0,
    crit_tome: 0,
  };
  public weaponDamage: Record<WeaponId, number> = {
    broadsword: 0,
    astral_bow: 0,
    flying_shield: 0,
    quake_hammer: 0,
    frost_tome: 0,
    oil_torch: 0,
    lightning_magnet: 0,
    decoy_bomb: 0,
  };
  private weaponTimers: Record<WeaponId, number> = {
    broadsword: 0.25,
    astral_bow: 0.35,
    flying_shield: 0.8,
    quake_hammer: 1.1,
    frost_tome: 0.9,
    oil_torch: 1.2,
    lightning_magnet: 0.9,
    decoy_bomb: 1.3,
  };

  // Entities & Interactive Map Objects
  public enemies: EnemyEntity[] = [];
  public projectiles: PlayerProjectile[] = [];
  public decoyBombs: DecoyBombEntity[] = [];
  public turrets: TurretEntity[] = [];
  public mapObjectives: MapObjectiveEntity[] = [];
  public minecarts: MinecartHazard[] = [];
  public bossTelegraphs: BossTelegraph[] = [];
  public enemyBombs: EnemyBomb[] = [];
  public slashes: SlashArcEffect[] = [];
  public lightningBolts: LightningBoltSegment[] = [];
  public frostRings: FrostRingEffect[] = [];
  public fireTrails: FireTrailPatch[] = [];
  public spriteEffects: SpriteAnimEffect[] = [];
  public afterimages: DashAfterimage[] = [];
  public gems: ExpGemEntity[] = [];
  public popups: DamagePopup[] = [];
  public particles: ParticleDot[] = [];

  // Camera & Feel
  public shakeEnabled = true;
  public shakeTime = 0;
  public shakeIntensity = 0;
  public bannerText: string | null = null;
  public bannerTimer = 0;
  public choices: UpgradeChoice[] = [];

  private nextEnemyId = 1;
  private spawnAccumulator = 0;
  private eliteMilestones = new Set<number>();
  private bossSpawned = false;
  private dashHitIds = new Set<number>();
  private onSnapshot: (snap: EngineSnapshot) => void;
  public measuredFps = 60;
  public measuredFrameMs = 16.6;
  public measuredUpdateMs = 0.25;
  public measuredRenderMs = 0.65;
  public slowFrames = 0;

  constructor(
    onSnapshot: (snap: EngineSnapshot) => void,
    initialShakeEnabled = true,
    stageId: StageId = "courtyard",
    heroId: HeroId = "kael",
    bonusStats?: {
      bonusHp?: number;
      bonusMightPct?: number;
      bonusSpeedPct?: number;
      startingWeaponOverride?: WeaponId;
      equippedVisuals?: EquippedVisualSummary;
    }
  ) {
    this.onSnapshot = onSnapshot;
    this.shakeEnabled = initialShakeEnabled;
    this.stageId = stageId;
    this.hero = HEROES[heroId] || HEROES.kael;
    this.equippedVisuals = bonusStats?.equippedVisuals ?? {};
    this.bonusMightPct = bonusStats?.bonusMightPct ?? 0;
    this.bonusSpeedPct = bonusStats?.bonusSpeedPct ?? 0;
    this.maxHp = this.hero.statMods.maxHp + (bonusStats?.bonusHp ?? 0);
    this.hp = this.maxHp;

    // Equip Hero's signature starting weapon (or equipped Inventory weapon override) at Level 1
    const startWep =
      bonusStats?.startingWeaponOverride || this.hero.startingWeapon;
    this.weapons[startWep].level = 1;

    // Seed Stage-Specific Interactive Map Objectives (2-4 objectives per stage)
    this.initStageObjectives();

    // Seed 4 scouting Goblins at the Courtyard Entrances
    const gateSpawns: Array<[EnemyArch, number, number]> = [
      ["goblin_torch", 85, 345],
      ["goblin_torch", -365, -125],
      ["goblin_torch", 365, -35],
      ["goblin_torch", 125, -295],
    ];
    for (const [arch, gx, gy] of gateSpawns) {
      this.spawnEnemyAt(arch, gx, gy);
    }
    this.emitSnapshot();
  }

  private initStageObjectives(): void {
    this.mapObjectives = [];
    if (this.stageId === "courtyard") {
      this.mapObjectives.push(
        {
          id: 1,
          kind: "monster_camp",
          title: "Trại Yêu Tinh Tây Bắc",
          subtitle: "Phá hủy để giảm 20% tốc độ sinh quái & rớt Rương",
          x: -290,
          y: -155,
          radius: 42,
          hp: 260,
          maxHp: 260,
          completed: false,
          progress: 0,
        },
        {
          id: 2,
          kind: "captive_ally",
          title: "Cung Thủ Lyra Bị Vây",
          subtitle: "Đứng gần 2 giây để giải cứu → Mở khóa Lyra & Nhận trợ chiến!",
          x: 245,
          y: -145,
          radius: 52,
          hp: 100,
          maxHp: 100,
          completed: false,
          progress: 0,
        },
        {
          id: 3,
          kind: "monster_camp",
          title: "Trại Yêu Tinh Đông Nam",
          subtitle: "Phá hủy để giảm 20% tốc độ sinh quái & rớt Rương",
          x: 295,
          y: 195,
          radius: 42,
          hp: 300,
          maxHp: 300,
          completed: false,
          progress: 0,
        },
        {
          id: 4,
          kind: "blood_altar",
          title: "Bàn Thờ Cổ Đại",
          subtitle: "Chạm vào để hiến 20% Máu đổi lấy 1 Nâng cấp ngay lập tức!",
          x: -250,
          y: 205,
          radius: 40,
          hp: 100,
          maxHp: 100,
          completed: false,
          progress: 0,
        }
      );
    } else if (this.stageId === "mushroom_woods") {
      this.mapObjectives.push(
        {
          id: 1,
          kind: "monster_camp",
          title: "Tổ Nấm Độc Tây Bắc",
          subtitle: "Đang phát tán Đầm Độc! Phá hủy để xóa vùng độc",
          x: -260,
          y: -130,
          radius: 44,
          hp: 290,
          maxHp: 290,
          completed: false,
          poisonRadius: 115,
          progress: 0,
        },
        {
          id: 2,
          kind: "monster_camp",
          title: "Tổ Nấm Độc Đông Bắc",
          subtitle: "Đang phát tán Đầm Độc! Phá hủy để xóa vùng độc",
          x: 270,
          y: -120,
          radius: 44,
          hp: 310,
          maxHp: 310,
          completed: false,
          poisonRadius: 115,
          progress: 0,
        },
        {
          id: 3,
          kind: "monster_camp",
          title: "Tổ Nấm Độc Nam",
          subtitle: "Đang phát tán Đầm Độc! Phá hủy để xóa vùng độc",
          x: 20,
          y: 230,
          radius: 44,
          hp: 340,
          maxHp: 340,
          completed: false,
          poisonRadius: 120,
          progress: 0,
        },
        {
          id: 4,
          kind: "challenge_gate",
          title: "Cổng Thử Thách Rừng Sâu",
          subtitle: "Chạm vào để triệu hồi Tinh Anh giữ kho báu!",
          x: -240,
          y: 195,
          radius: 44,
          hp: 100,
          maxHp: 100,
          completed: false,
          progress: 0,
        }
      );
    } else if (this.stageId === "abandoned_mine") {
      // Stage 3: Hầm Mỏ Bỏ Hoang (abandoned_mine)
      this.mapObjectives.push(
        {
          id: 1,
          kind: "monster_camp",
          title: "Trạm Khai Thác Yêu Tinh",
          subtitle: "Phá hủy để giảm quái & mở khóa Pip Thợ Máy!",
          x: -275,
          y: -155,
          radius: 44,
          hp: 320,
          maxHp: 320,
          completed: false,
          progress: 0,
        },
        {
          id: 2,
          kind: "explosive_barrel",
          title: "Cụm Thùng Thuốc Nổ Bắc",
          subtitle: "Đánh nổ để quét sạch đàn quái xung quanh!",
          x: 155,
          y: -120,
          radius: 30,
          hp: 45,
          maxHp: 45,
          completed: false,
          progress: 0,
        },
        {
          id: 3,
          kind: "explosive_barrel",
          title: "Cụm Thùng Thuốc Nổ Nam",
          subtitle: "Đánh nổ để quét sạch đàn quái xung quanh!",
          x: -145,
          y: 145,
          radius: 30,
          hp: 45,
          maxHp: 45,
          completed: false,
          progress: 0,
        },
        {
          id: 4,
          kind: "locked_chest",
          title: "Rương Kho Báu Mỏ Cổ",
          subtitle: "Phá khóa để nhận ngay Rương Kỹ Năng Hoàng Kim!",
          x: 280,
          y: 175,
          radius: 38,
          hp: 220,
          maxHp: 220,
          completed: false,
          progress: 0,
        }
      );
    } else if (this.stageId === "ice_citadel") {
      this.mapObjectives.push(
        {
          id: 1,
          kind: "monster_camp",
          title: "Cột Băng Hắc Ám Tây",
          subtitle: "Phá hủy để làm suy yếu Bão Tuyết & rớt Rương",
          x: -265,
          y: -140,
          radius: 44,
          hp: 340,
          maxHp: 340,
          completed: false,
          poisonRadius: 115,
          progress: 0,
        },
        {
          id: 2,
          kind: "monster_camp",
          title: "Cột Băng Hắc Ám Đông",
          subtitle: "Phá hủy để làm suy yếu Bão Tuyết & rớt Rương",
          x: 265,
          y: -135,
          radius: 44,
          hp: 340,
          maxHp: 340,
          completed: false,
          poisonRadius: 115,
          progress: 0,
        },
        {
          id: 3,
          kind: "locked_chest",
          title: "Rương Băng Phong Cổ Đại",
          subtitle: "Phá băng để nhận ngay Rương Hoàng Kim!",
          x: 0,
          y: 215,
          radius: 40,
          hp: 250,
          maxHp: 250,
          completed: false,
          progress: 0,
        }
      );
    } else if (this.stageId === "dark_fortress") {
      this.mapObjectives.push(
        {
          id: 1,
          kind: "monster_camp",
          title: "Lõi Hư Không [1] — Sơ Cấp",
          subtitle: "Phá Lõi [1] trước để gỡ Khiên Chắn cho Lõi [2]!",
          x: -280,
          y: -150,
          radius: 46,
          hp: 360,
          maxHp: 360,
          completed: false,
          progress: 0,
        },
        {
          id: 2,
          kind: "monster_camp",
          title: "Lõi Hư Không [2] — Thứ Cấp",
          subtitle: "Đang được Lõi [1] bảo vệ (Giảm 75% sát thương nhận vào)!",
          x: 280,
          y: 185,
          radius: 46,
          hp: 380,
          maxHp: 380,
          completed: false,
          progress: 0,
        },
        {
          id: 3,
          kind: "blood_altar",
          title: "Pháp Trận Huyết Nguyệt",
          subtitle: "Chạm vào hiến 20% Máu nhận ngay 1 Nâng Cấp!",
          x: -240,
          y: 195,
          radius: 42,
          hp: 100,
          maxHp: 100,
          completed: false,
          progress: 0,
        },
        {
          id: 4,
          kind: "challenge_gate",
          title: "Cổng Hắc Ám Thử Thách",
          subtitle: "Phá vỡ để nhận 120 Vàng & Rương Kỹ Năng!",
          x: 250,
          y: -145,
          radius: 44,
          hp: 360,
          maxHp: 360,
          completed: false,
          progress: 0,
        }
      );
    }
  }

  public recordRenderDuration(ms: number): void {
    this.measuredRenderMs = Number(
      (this.measuredRenderMs * 0.85 + ms * 0.15).toFixed(2)
    );
    if (this.measuredUpdateMs + ms > 16.67) {
      this.slowFrames += 1;
    }
  }

  public showBanner(text: string, duration = 2.4): void {
    this.bannerText = text;
    this.bannerTimer = duration;
  }

  public addShake(intensity: number, duration = 0.14): void {
    if (!this.shakeEnabled) return;
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
    this.shakeTime = Math.max(this.shakeTime, duration);
  }

  public getMightMultiplier(): number {
    return (
      this.hero.statMods.mightMult *
      (1 + this.passives.might * 0.16 + this.bonusMightPct / 100)
    );
  }

  public getAreaMultiplier(): number {
    return (
      (this.hero.id === "ember" ? 1.25 : 1.0) *
      (1 + this.passives.might * 0.06)
    );
  }

  public getCritChance(): number {
    return 0.14 + this.passives.crit_tome * 0.08;
  }

  public getCooldownMultiplier(): number {
    const frenzyFactor = this.frenzyTimer > 0 ? 0.72 : 1.0;
    const warmthFactor =
      this.stageId === "ice_citadel" && this.inWarmthZone ? 0.85 : 1.0;
    return (
      this.hero.statMods.cooldownMult *
      Math.pow(0.9, this.passives.haste) *
      frenzyFactor *
      warmthFactor
    );
  }

  public getMoveSpeed(): number {
    if (this.playerRootTimer > 0) {
      return this.dashTimer > 0 ? 180 : 52;
    }
    let slowFactor = 1.0;
    // Check if inside Mushroom Woods poison spore cloud or Ice Citadel blizzard
    for (const obj of this.mapObjectives) {
      if (
        !obj.completed &&
        obj.poisonRadius &&
        Math.hypot(this.px - obj.x, this.py - obj.y) <= obj.poisonRadius
      ) {
        slowFactor = 0.76;
        break;
      }
    }
    if (this.stageId === "ice_citadel" && !this.inWarmthZone && this.chillStacks > 0) {
      slowFactor *= 0.8;
    }
    const base =
      this.hero.statMods.moveSpeed *
      (1 + this.passives.phantom_boots * 0.1 + this.bonusSpeedPct / 100) *
      slowFactor;
    return this.dashTimer > 0 ? base * 2.65 : base;
  }

  public getMagnetRadius(): number {
    const magWeaponLv = this.weapons.lightning_magnet.level;
    return (
      this.hero.statMods.magnetRadius *
      (1 + this.passives.crit_tome * 0.18 + magWeaponLv * 0.15)
    );
  }

  public getActiveSynergies(): SynergyId[] {
    const list: SynergyId[] = [];
    for (const sId of Object.keys(WEAPON_SYNERGIES) as SynergyId[]) {
      if (this.hasSynergy(sId)) {
        list.push(sId);
      }
    }
    return list;
  }

  public hasSynergy(sId: SynergyId): boolean {
    const def = WEAPON_SYNERGIES[sId];
    if (def.weapons) {
      const [w1, w2] = def.weapons;
      if (
        this.weapons[w1].level >= def.minLevel &&
        this.weapons[w2].level >= def.minLevel
      ) {
        return true;
      }
    }
    if (def.weaponAndPassive) {
      const [w, p] = def.weaponAndPassive;
      if (this.weapons[w].level >= def.minLevel && this.passives[p] >= 1) {
        return true;
      }
    }
    if (sId === "phantom_echo_strike" && this.passives.phantom_boots >= 1) {
      return Object.values(this.weapons).some((w) => w.level >= 2);
    }
    return false;
  }

  public getHeroSheetRow(): number {
    if (this.heroAnimState === "idle") return 0;
    if (this.heroAnimState === "run") return 1;
    const isSecondSwing = this.heroAnimState === "attack_2";
    if (this.heroAttackDir === "down") return isSecondSwing ? 5 : 4;
    if (this.heroAttackDir === "up") return isSecondSwing ? 7 : 6;
    return isSecondSwing ? 3 : 2;
  }

  public getEffectiveDashCooldown(): number {
    return Math.max(
      1.0,
      this.dashMaxCooldown - this.passives.phantom_boots * 0.22
    );
  }

  public triggerDash(inputX: number, inputY: number): void {
    if (this.status !== "playing" || this.dashCooldown > 0) return;
    const startX = this.px;
    const startY = this.py;

    this.dashTimer = 0.22;
    this.invulnTimer = Math.max(this.invulnTimer, 0.3);
    this.dashCooldown = this.getEffectiveDashCooldown();
    this.afterimageTimer = 0;
    this.dashHitIds.clear();

    if (inputX !== 0 || inputY !== 0) {
      this.aimAngle = Math.atan2(inputY, inputX);
      if (Math.abs(inputX) > 0.05) this.facingX = inputX > 0 ? 1 : -1;
    }

    sfx.playDash();

    // HERO TRAIT 2: Lyra drops an explosive spike trap on Dash!
    if (this.hero.id === "lyra") {
      this.decoyBombs.push({
        x: startX,
        y: startY,
        pullRadius: 85,
        damage: 32 * this.getMightMultiplier(),
        timer: 1.0,
        maxTimer: 1.0,
        isFlamethrower: this.hasSynergy("flamethrower_turret"),
        flameTick: 0,
      });
    }

    // HERO TRAIT 3: Ember unleashes a Frost-Fire ring on Dash!
    if (this.hero.id === "ember") {
      this.frostRings.push({
        x: startX,
        y: startY,
        maxRadius: 95,
        color: "#A855F7",
        life: 0.3,
        maxLife: 0.3,
      });
      for (const e of this.enemies) {
        if (Math.hypot(e.x - startX, e.y - startY) <= 95 + e.radius) {
          this.damageEnemy(
            e,
            22 * this.getMightMultiplier(),
            e.x - startX,
            e.y - startY,
            160,
            "frost_tome"
          );
          e.frostTimer = Math.max(e.frostTimer, 2.2);
        }
      }
    }

    // PASSIVE TOY: Ủng Bóng Ma (phantom_boots) leaves a Phantom Clone that strikes!
    if (this.passives.phantom_boots > 0) {
      this.afterimages.push({
        x: startX,
        y: startY,
        facingX: this.facingX,
        row: 2,
        col: 3,
        life: 0.55,
        maxLife: 0.55,
        isPhantomStrike: true,
      });
      const strikeDmg =
        (26 + this.passives.phantom_boots * 10) * this.getMightMultiplier();
      this.slashes.push({
        x: startX + this.facingX * 14,
        y: startY - 6,
        angle: this.aimAngle,
        radius: 96,
        arcSpan: Math.PI * 1.2,
        life: 0.22,
        maxLife: 0.22,
        color: "#818CF8",
        isEvolved: true,
      });
      for (const e of this.enemies) {
        if (Math.hypot(e.x - startX, e.y - startY) <= 98 + e.radius) {
          this.damageEnemy(
            e,
            strikeDmg,
            e.x - startX,
            e.y - startY,
            200,
            this.hero.startingWeapon
          );
        }
      }
    }

    for (let i = 0; i < 10; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 45 + Math.random() * 90;
      this.spawnParticle(
        this.px + (Math.random() - 0.5) * 14,
        this.py + 18,
        Math.cos(a) * spd,
        Math.sin(a) * spd * 0.6,
        i % 2 === 0 ? 5 : 4,
        i % 2 === 0 ? "#E2E8F0" : "#CBD5E1",
        0.28
      );
    }
  }

  public triggerEliteNowForTest(): void {
    this.spawnEliteKnight(STAGES[this.stageId].bossName, true);
  }

  public update(dt: number, inputX: number, inputY: number): void {
    const t0 = performance.now();
    if (dt > 0.001 && dt < 0.25) {
      this.measuredFrameMs = Number(
        (this.measuredFrameMs * 0.88 + dt * 1000 * 0.12).toFixed(1)
      );
      this.measuredFps = Math.min(
        240,
        Math.max(1, Math.round(1000 / Math.max(1, this.measuredFrameMs)))
      );
      if (dt * 1000 > 34) this.slowFrames += 1;
    }
    dt=Math.min(.05,Math.max(0,dt));
    if(this.status==="level_up"&&(this.autoExplore||this.autoUpgrade)){this.autoChoiceClock+=dt;if(this.autoChoiceClock>=1.1){this.autoChoiceClock=0;const choice=this.choices.find(c=>c.kind==="evolution")||this.choices.find(c=>c.kind==="weapon")||this.choices[0];if(choice)this.selectUpgradeChoice(choice);}}
    if (this.status !== "playing") return;
    this.snapshotClock+=dt;if(this.snapshotClock>=.24){this.snapshotClock=0;this.emitSnapshot();}
    if(this.autoExplore&&Math.hypot(inputX,inputY)<.05)[inputX,inputY]=this.idleDirection();

    if (this.bannerTimer > 0) {
      this.bannerTimer -= dt;
      if (this.bannerTimer <= 0) this.bannerText = null;
    }
    if (this.shakeTime > 0) {
      this.shakeTime -= dt;
      if (this.shakeTime <= 0) this.shakeIntensity = 0;
    }

    if (this.invulnTimer > 0) this.invulnTimer -= dt;
    if (this.playerHitFlash > 0) this.playerHitFlash -= dt;
    if (this.frenzyTimer > 0) this.frenzyTimer = Math.max(0, this.frenzyTimer - dt);
    if (this.dashCooldown > 0) {
      this.dashCooldown = Math.max(0, this.dashCooldown - dt);
    }

    if (this.hitStopTimer > 0) {
      this.hitStopTimer -= dt;
      this.updateEffects(dt);
      this.measuredUpdateMs = Number(
        (this.measuredUpdateMs * 0.85 + (performance.now() - t0) * 0.15).toFixed(2)
      );
      return;
    }

    this.elapsedSec += dt;
    if (this.gemComboTimer > 0) {
      this.gemComboTimer -= dt;
      if (this.gemComboTimer <= 0) this.gemCombo = 0;
    }

    this.runeSpawnTimer -= dt;
    if (this.runeSpawnTimer <= 0) {
      this.runeSpawnTimer = 28;
      this.spawnCollectibleRune();
    }

    // Dash timer, Kael Stun-Dash impact & afterimages
    if (this.dashTimer > 0) {
      this.dashTimer -= dt;
      this.afterimageTimer -= dt;
      if (this.afterimageTimer <= 0) {
        this.afterimageTimer = 0.045;
        this.afterimages.push({
          x: this.px,
          y: this.py,
          facingX: this.facingX,
          row: this.getHeroSheetRow(),
          col: this.heroAnimFrame,
          life: 0.22,
          maxLife: 0.22,
        });
      }

      // HERO TRAIT 1: Kael's Dash rams through enemies dealing damage & Stunning for 1.2s!
      if (this.hero.id === "kael") {
        for (const e of this.enemies) {
          if (this.dashHitIds.has(e.id)) continue;
          if (Math.hypot(e.x - this.px, e.y - this.py) <= e.radius + 28) {
            this.dashHitIds.add(e.id);
            this.damageEnemy(
              e,
              24 * this.getMightMultiplier(),
              Math.cos(this.aimAngle),
              Math.sin(this.aimAngle),
              240,
              "broadsword"
            );
            e.stunTimer = Math.max(e.stunTimer, 1.2);
            this.spawnPopup(e.x, e.y - 28, "CHOÁNG!", "#38BDF8", true);
          }
        }
      }
    }

    // 1. Player Movement
    let mvX = inputX;
    let mvY = inputY;
    const len = Math.hypot(mvX, mvY);
    const isMoving = len > 0.01 || this.dashTimer > 0;

    if (len > 0.01) {
      mvX /= len;
      mvY /= len;
      this.aimAngle = Math.atan2(mvY, mvX);
      if (Math.abs(mvX) > 0.05) {
        this.facingX = mvX > 0 ? 1 : -1;
      }
    } else if (this.dashTimer > 0) {
      mvX = Math.cos(this.aimAngle);
      mvY = Math.sin(this.aimAngle);
    }

    const spd = this.getMoveSpeed();
    this.pvx = mvX * spd;
    this.pvy = mvY * spd;
    this.px = Math.max(-640, Math.min(640, this.px + this.pvx * dt));
    this.py = Math.max(-312, Math.min(450, this.py + this.pvy * dt));

    this.updateHeroAnimation(dt, isMoving);

    // 2. Hero Passives & Companion (Pip Turret, Lyra Auto-Trap, Baby Dragon)
    this.updateHeroAndCompanions(dt);
    this.updateSummons(dt);

    // 3. Stage Mechanics & Map Objectives (Camps, Captive Ally, Altar, Poison Spores, Minecarts)
    this.updateStageMechanics(dt);

    // 4. Spawner & Boss Telegraphs
    this.updateEnemySpawner(dt);
    this.updateBossTelegraphs(dt);

    // 5. Weapons (8 Active Toys + 5 Combos)
    this.updateWeapons(dt);

    // 6. Projectiles, Decoy Bombs, Turrets, Fire Trails & Enemy Bombs
    this.updateProjectiles(dt);
    this.updateDecoyBombs(dt);
    this.updateTurrets(dt);
    this.updateFireTrails(dt);
    this.updateEnemyBombs(dt);

    // 7. Enemies AI
    this.updateEnemies(dt);

    // 8. EXP Gems & Runes
    this.updateGems(dt);

    // 9. FX
    this.updateEffects(dt);

    this.measuredUpdateMs = Number(
      (this.measuredUpdateMs * 0.85 + (performance.now() - t0) * 0.15).toFixed(2)
    );
  }

  private updateHeroAndCompanions(dt: number): void {
    // HERO TRAIT 4: Pip automatically builds a Crystal Turret every 8s (or Lyra drops a trap)
    this.heroTraitTimer -= dt;
    if (this.heroTraitTimer <= 0) {
      if (this.hero.id === "pip") {
        this.heroTraitTimer = 8.0;
        if (this.turrets.length >= 3) {
          this.turrets.shift();
        }
        this.turrets.push({
          x: this.px + this.facingX * 28,
          y: this.py + 12,
          life: 14.0,
          maxLife: 14.0,
          fireCooldown: 0.25,
          isFlamethrower: this.hasSynergy("flamethrower_turret"),
        });
        this.spawnPopup(this.px, this.py - 28, "DỰNG Ụ SÚNG!", "#FACC15", false);
      } else if (this.hero.id === "lyra") {
        this.heroTraitTimer = 6.5;
        this.decoyBombs.push({
          x: this.px,
          y: this.py + 8,
          pullRadius: 80,
          damage: 28 * this.getMightMultiplier(),
          timer: 1.1,
          maxTimer: 1.1,
          isFlamethrower: false,
          flameTick: 0,
        });
      } else {
        this.heroTraitTimer = 6.0;
      }
    }

    // COMPANION TOY: Rồng Con Đồng Hành (baby_dragon) breathes fire in player direction!
    if (this.passives.baby_dragon > 0) {
      this.dragonBreathTimer -= dt;
      if (this.dragonBreathTimer <= 0 && this.enemies.length > 0) {
        this.dragonBreathTimer = Math.max(
          0.9,
          1.75 - this.passives.baby_dragon * 0.15
        );
        const dragonX = this.px - this.facingX * 22;
        const dragonY = this.py - 26;
        const breathDmg =
          (18 + this.passives.baby_dragon * 8) * this.getMightMultiplier();

        // Spawn a burning fire patch along the dragon's breath cone
        const targetX = dragonX + Math.cos(this.aimAngle) * 75;
        const targetY = dragonY + Math.sin(this.aimAngle) * 75;
        this.fireTrails.push({
          x: targetX,
          y: targetY,
          radius: 42,
          dps: breathDmg,
          life: 2.2,
          maxLife: 2.2,
          tickTimer: 0,
          sourceWeapon: "oil_torch",
        });

        // SYNERGY: Bình Dầu Rồng Lửa (inferno_oil_sea) erupts oil pools into Fire Pillars!
        if (this.hasSynergy("inferno_oil_sea")) {
          this.detonateNearbyOilPools(targetX, targetY, 95);
        }
      }
    }
  }

  private detonateNearbyOilPools(x: number, y: number, radius: number): void {
    for (const ft of this.fireTrails) {
      if (Math.hypot(ft.x - x, ft.y - y) <= radius + ft.radius) {
        ft.radius = Math.min(72, ft.radius * 1.25);
        this.spawnSpriteEffect({
          kind: "explosion",
          x: ft.x,
          y: ft.y,
          frame: 0,
          maxFrames: 9,
          frameDuration: 0.05,
          timer: 0,
          scale: 0.9,
        });
        for (const e of this.enemies) {
          if (Math.hypot(e.x - ft.x, e.y - ft.y) <= ft.radius + e.radius + 20) {
            this.damageEnemy(
              e,
              24 * this.getMightMultiplier(),
              e.x - ft.x,
              e.y - ft.y,
              150,
              "oil_torch"
            );
          }
        }
        break;
      }
    }
  }

  private updateStageMechanics(dt: number): void {
    if (this.playerRootTimer > 0) {
      this.playerRootTimer = Math.max(0, this.playerRootTimer - dt);
    }
    if (this.portalCooldown > 0) {
      this.portalCooldown = Math.max(0, this.portalCooldown - dt);
    }
    if (this.safeZone) {
      this.safeZone.timer -= dt;
      if (this.safeZone.timer <= 0) {
        this.safeZone = null;
      }
    }

    // 1. Mushroom Woods expanding poison clouds & poison tick
    if (this.stageId === "mushroom_woods") {
      let inPoison = false;
      for (const obj of this.mapObjectives) {
        if (!obj.completed && obj.poisonRadius !== undefined) {
          obj.poisonRadius = Math.min(185, obj.poisonRadius + 2.2 * dt);
          if (Math.hypot(this.px - obj.x, this.py - obj.y) <= obj.poisonRadius) {
            inPoison = true;
          }
        }
      }
      if (inPoison) {
        this.poisonTickTimer -= dt;
        if (this.poisonTickTimer <= 0) {
          this.poisonTickTimer = 1.1;
          this.hp = Math.max(1, this.hp - 4);
          this.spawnPopup(this.px, this.py - 26, "-4 ĐỘC", "#A855F7", false);
        }
      }
    }

    // 1b. Stage 4 Ice Citadel: Warmth Heater Braziers vs Freezing Blizzard
    if (this.stageId === "ice_citadel") {
      let nearHeater = false;
      for (const [hx, hy] of this.heaterBraziers) {
        if (Math.hypot(this.px - hx, this.py - hy) <= 135) {
          nearHeater = true;
          break;
        }
      }
      this.inWarmthZone = nearHeater;
      const activeIcePillars = this.mapObjectives.filter(
        (o) => o.kind === "monster_camp" && !o.completed
      ).length;

      this.poisonTickTimer -= dt;
      if (nearHeater) {
        this.chillStacks = 0;
        if (this.poisonTickTimer <= 0) {
          this.poisonTickTimer = 1.6;
          if (this.hp < this.maxHp) {
            this.hp = Math.min(this.maxHp, this.hp + 3);
            this.spawnPopup(this.px, this.py - 26, "+3 TRỤ SƯỞI", "#FB923C", false);
          }
        }
      } else if (activeIcePillars > 0) {
        this.chillStacks = Math.min(3, this.chillStacks + dt * 0.6);
        if (this.poisonTickTimer <= 0) {
          this.poisonTickTimer = 2.2;
          this.hp = Math.max(1, this.hp - 3);
          this.spawnPopup(this.px, this.py - 26, "-3 LẠNH CÓNG", "#38BDF8", false);
        }
      } else {
        this.chillStacks = 0;
      }
    }

    // 1c. Stage 5 Void Fortress: Two-way Void Portals across the central abyss
    if (this.stageId === "dark_fortress" && this.portalCooldown <= 0) {
      const [p0, p1] = this.voidPortals;
      if (Math.hypot(this.px - p0[0], this.py - p0[1]) <= 34) {
        this.px = p1[0] - 38;
        this.py = p1[1];
        this.portalCooldown = 3.2;
        this.invulnTimer = Math.max(this.invulnTimer, 0.5);
        this.spawnPopup(this.px, this.py - 28, "🌌 DỊCH CHUYỂN HƯ KHÔNG!", "#C084FC", true);
      } else if (Math.hypot(this.px - p1[0], this.py - p1[1]) <= 34) {
        this.px = p0[0] + 38;
        this.py = p0[1];
        this.portalCooldown = 3.2;
        this.invulnTimer = Math.max(this.invulnTimer, 0.5);
        this.spawnPopup(this.px, this.py - 28, "🌌 DỊCH CHUYỂN HƯ KHÔNG!", "#C084FC", true);
      }
    }

    // 2. Abandoned Mine hurtling Minecarts along railway tracks (y = -95 and y = 115)
    if (this.stageId === "abandoned_mine") {
      this.minecartSpawnTimer -= dt;
      if (this.minecartSpawnTimer <= 0) {
        this.minecartSpawnTimer = 8.5;
        const trackY = Math.random() < 0.5 ? -95 : 115;
        const fromLeft = Math.random() < 0.5;
        this.minecarts.push({
          y: trackY,
          x: fromLeft ? -680 : 680,
          vx: fromLeft ? 520 : -520,
          warnTimer: 1.1,
          active: true,
        });
        this.showBanner("Cảnh báo: Xe Goòng đang lao tới trên đường ray!", 1.8);
      }

      for (let i = this.minecarts.length - 1; i >= 0; i--) {
        const mc = this.minecarts[i];
        if (mc.warnTimer > 0) {
          mc.warnTimer -= dt;
          continue;
        }
        mc.x += mc.vx * dt;
        // Crush enemies on track
        for (const e of this.enemies) {
          if (Math.abs(e.x - mc.x) < 38 && Math.abs(e.y - mc.y) < 32) {
            this.damageEnemy(e, 95, mc.vx, 0, 320, this.hero.startingWeapon);
          }
        }
        // Check player hit
        if (
          Math.abs(this.px - mc.x) < 32 &&
          Math.abs(this.py - mc.y) < 26 &&
          this.invulnTimer <= 0 &&
          this.dashTimer <= 0
        ) {
          this.applyDamageToPlayer(18);
        }
        if (Math.abs(mc.x) > 740) {
          this.minecarts.splice(i, 1);
        }
      }
    }

    // 3. Interactive Proximity Objectives (Captive Ally, Blood Altar, Challenge Gate)
    for (const obj of this.mapObjectives) {
      if (obj.completed) continue;
      const dist = Math.hypot(this.px - obj.x, this.py - obj.y);

      if (obj.kind === "captive_ally" && dist <= obj.radius + 28) {
        obj.progress = Math.min(100, obj.progress + dt * 55);
        if (obj.progress >= 100) {
          obj.completed = true;
          this.objectivesCompleted += 1;
          if (!this.newlyUnlocked.includes("Lyra • Cung Thủ")) {
            this.newlyUnlocked.push("Lyra • Cung Thủ");
          }
          // Spawn permanent allied archer turret at rescue spot!
          this.turrets.push({
            x: obj.x,
            y: obj.y,
            life: 999,
            maxLife: 999,
            fireCooldown: 0.3,
            isFlamethrower: false,
            isRescuedAlly: true,
          });
          this.showBanner(
            "Đã giải cứu Cung Thủ Lyra! Lyra tham chiến & Mở khóa nhân vật!",
            3.2
          );
          this.triggerLevelUpModal(true);
        }
      } else if (obj.kind === "blood_altar" && dist <= obj.radius + 16) {
        obj.completed = true;
        this.objectivesCompleted += 1;
        const sacrifice = Math.max(10, Math.round(this.hp * 0.2));
        this.hp = Math.max(1, this.hp - sacrifice);
        this.spawnPopup(
          this.px,
          this.py - 28,
          `-${sacrifice} HIẾN TẾ`,
          "#F43F5E",
          true
        );
        this.showBanner("Bàn Thờ Cổ Đại ban phước: Nhận 1 Nâng Cấp Hiếm!", 2.6);
        this.triggerLevelUpModal(true);
      } else if (obj.kind === "challenge_gate" && dist <= obj.radius + 16) {
        obj.completed = true;
        this.objectivesCompleted += 1;
        this.gold += 120;
        this.spawnGem({
          x: obj.x,
          y: obj.y,
          vx: 0,
          vy: 0,
          value: 25,
          tier: "chest",
          magnetized: false,
          magnetTime: 0,
          bobSeed: 1.2,
        });
        this.spawnEliteKnight("Tinh Anh Cổng Thử Thách", false);
        this.spawnCollectibleRune(obj.x, obj.y + 24);
        this.showBanner(
          "Đã phá Cổng Thử Thách! +120 Vàng, Rương Kỹ Năng & Tinh Anh xuất hiện!",
          2.8
        );
      }
    }
  }

  public damageObjectivesInRadius(
    cx: number,
    cy: number,
    radius: number,
    baseDamage: number,
    sourceWeapon: WeaponId
  ): void {
    const structMult =
      (sourceWeapon === "quake_hammer" ? 2.0 : 1.0) *
      (this.hero.id === "pip" ? 1.6 : 1.0);

    for (const obj of this.mapObjectives) {
      if (obj.completed) continue;
      if (
        obj.kind !== "monster_camp" &&
        obj.kind !== "locked_chest" &&
        obj.kind !== "explosive_barrel" &&
        obj.kind !== "challenge_gate"
      ) {
        continue;
      }
      const d = Math.hypot(obj.x - cx, obj.y - cy);
      if (d <= radius + obj.radius) {
        let dmg = Math.max(1, Math.round(baseDamage * structMult));
        // Stage 5 Strategic Core Order: Core [2] is shielded by Core [1] until Core [1] is destroyed!
        if (this.stageId === "dark_fortress" && obj.id === 2) {
          const core1 = this.mapObjectives.find((o) => o.id === 1);
          if (core1 && !core1.completed) {
            dmg = Math.max(1, Math.round(dmg * 0.25));
            if (this.popups.length < 8) {
              this.spawnPopup(obj.x, obj.y - 38, "KHIÊN LÕI [1] CHẶN!", "#C084FC", false);
            }
          }
        }
        obj.hp = Math.max(0, obj.hp - dmg);
        this.spawnPopup(obj.x, obj.y - 24, `-${dmg}`, "#FACC15", false);

        if (obj.hp <= 0) {
          obj.completed = true;
          this.objectivesCompleted += 1;
          if (this.stageId === "dark_fortress" && obj.id === 1) {
            const core2 = this.mapObjectives.find((o) => o.id === 2);
            if (core2) {
              core2.subtitle = "Khiên chắn đã vỡ! Hãy phá hủy Lõi [2] ngay!";
            }
          }
          this.spawnSpriteEffect({
            kind: "explosion",
            x: obj.x,
            y: obj.y,
            frame: 0,
            maxFrames: 9,
            frameDuration: 0.05,
            timer: 0,
            scale: 1.25,
          });
          this.addShake(7, 0.22);

          if (obj.kind === "explosive_barrel") {
            // Detonate barrel for massive AoE damage to nearby enemies!
            for (const e of this.enemies) {
              if (Math.hypot(e.x - obj.x, e.y - obj.y) <= 135 + e.radius) {
                this.damageEnemy(
                  e,
                  110 * this.getMightMultiplier(),
                  e.x - obj.x,
                  e.y - obj.y,
                  280,
                  sourceWeapon
                );
              }
            }
            this.showBanner("Thùng Thuốc Nổ phát nổ quét sạch quái!", 2.0);
          } else {
            // Camp, Locked Chest or Challenge Gate destroyed: drop Evolution/Skill Chest & unlock Pip!
            if (obj.kind === "challenge_gate") {
              this.gold += 120;
            }
            if (!this.newlyUnlocked.includes("Pip • Thợ Máy")) {
              this.newlyUnlocked.push("Pip • Thợ Máy");
            }
            this.spawnGem({
              x: obj.x,
              y: obj.y,
              vx: 0,
              vy: 0,
              value: 45,
              tier: "chest",
              magnetized: false,
              magnetTime: 0,
              bobSeed: 0,
            });
            this.showBanner(
              `Đã phá hủy ${obj.title}! Giảm tốc độ sinh quái & rơi Rương!`,
              2.8
            );
          }
        }
      }
    }
  }

  private spawnCollectibleRune(atX?: number, atY?: number): void {
    const kinds: Array<"rune_frenzy" | "rune_aegis" | "rune_magnet"> = [
      "rune_frenzy",
      "rune_aegis",
      "rune_magnet",
    ];
    const tier = kinds[Math.floor(Math.random() * kinds.length)];
    const rx =
      atX !== undefined
        ? atX
        : Math.max(-460, Math.min(460, this.px + (Math.random() - 0.5) * 420));
    const ry =
      atY !== undefined
        ? atY
        : Math.max(-240, Math.min(340, this.py + (Math.random() - 0.5) * 320));
    this.spawnGem({
      x: rx,
      y: ry,
      vx: 0,
      vy: 0,
      value: 15,
      tier,
      magnetized: false,
      magnetTime: 0,
      bobSeed: Math.random() * 6,
    });
  }

  private updateHeroAnimation(dt: number, isMoving: boolean): void {
    if (
      this.heroAnimState === "attack_1" ||
      this.heroAnimState === "attack_2"
    ) {
      const frameDur = Math.max(0.038, 0.058 * this.getCooldownMultiplier());
      this.heroAnimTimer += dt;
      if (this.heroAnimTimer >= frameDur) {
        this.heroAnimTimer -= frameDur;
        this.heroAnimFrame += 1;

        if (this.heroAnimFrame === 3 && !this.heroStrikeDelivered) {
          this.heroStrikeDelivered = true;
          this.executeBroadswordImpact();
        }

        if (this.heroAnimFrame >= 6) {
          const swState = this.weapons.broadsword;
          if (
            this.heroAnimState === "attack_1" &&
            (swState.level >= 3 || swState.evolved)
          ) {
            this.heroAnimState = "attack_2";
            this.heroAnimFrame = 0;
            this.heroAnimTimer = 0;
            this.heroStrikeDelivered = false;
          } else {
            this.heroAnimState = isMoving ? "run" : "idle";
            this.heroAnimFrame = 0;
            this.heroAnimTimer = 0;
          }
        }
      }
      return;
    }

    this.heroAnimState = isMoving ? "run" : "idle";
    const frameDur = isMoving ? 0.085 : 0.12;
    this.heroAnimTimer += dt;
    if (this.heroAnimTimer >= frameDur) {
      this.heroAnimTimer -= frameDur;
      this.heroAnimFrame = (this.heroAnimFrame + 1) % 6;
    }
  }

  private updateWeapons(dt: number): void {
    const cdMult = this.getCooldownMultiplier();

    // 1. Đại Kiếm Phong Lôi (broadsword)
    const swState = this.weapons.broadsword;
    if (
      swState.level > 0 &&
      this.heroAnimState !== "attack_1" &&
      this.heroAnimState !== "attack_2"
    ) {
      this.weaponTimers.broadsword -= dt;
      if (this.weaponTimers.broadsword <= 0) {
        const baseCd =
          WEAPONS.broadsword.baseCooldown *
          (swState.level >= 4 ? 0.88 : 1) *
          (swState.evolved ? 0.74 : 1);
        this.weaponTimers.broadsword = Math.max(0.42, baseCd * cdMult);

        let targetAngle = this.aimAngle;
        let nearestDist = 230;
        for (const e of this.enemies) {
          const d = Math.hypot(e.x - this.px, e.y - this.py);
          if (d < nearestDist) {
            nearestDist = d;
            targetAngle = Math.atan2(e.y - this.py, e.x - this.px);
          }
        }
        this.aimAngle = targetAngle;
        if (Math.abs(Math.cos(targetAngle)) > 0.2) {
          this.facingX = Math.cos(targetAngle) >= 0 ? 1 : -1;
        }

        const sinA = Math.sin(targetAngle);
        const cosA = Math.cos(targetAngle);
        if (Math.abs(sinA) > Math.abs(cosA) * 1.35) {
          this.heroAttackDir = sinA > 0 ? "down" : "up";
        } else {
          this.heroAttackDir = "side";
        }

        this.heroAnimState = "attack_1";
        this.heroAnimFrame = 0;
        this.heroAnimTimer = 0;
        this.heroStrikeDelivered = false;
      }
    }

    // 2. Cung Tên Tinh Quang (astral_bow)
    const bowState = this.weapons.astral_bow;
    if (bowState.level > 0) {
      this.weaponTimers.astral_bow -= dt;
      if (this.weaponTimers.astral_bow <= 0 && this.enemies.length > 0) {
        const baseCd =
          WEAPONS.astral_bow.baseCooldown *
          (bowState.level >= 5 ? 0.85 : 1) *
          (bowState.evolved ? 0.68 : 1);
        this.weaponTimers.astral_bow = Math.max(0.38, baseCd * cdMult);
        this.triggerWeaponSwing();

        const arrowCount = bowState.evolved
          ? 3
          : bowState.level >= 4
          ? 3
          : bowState.level >= 2
          ? 2
          : 1;
        const pierce = bowState.evolved ? 3 : bowState.level >= 2 ? 2 : 1;
        const dmg =
          WEAPONS.astral_bow.baseDamage *
          (1 + (bowState.level - 1) * 0.24) *
          (bowState.evolved ? 1.32 : 1) *
          this.getMightMultiplier();

        let nearest = this.enemies[0];
        let bestD = Infinity;
        for (const e of this.enemies) {
          const d = Math.hypot(e.x - this.px, e.y - this.py);
          if (d < bestD) {
            bestD = d;
            nearest = e;
          }
        }

        const baseAng = nearest
          ? Math.atan2(nearest.y - this.py, nearest.x - this.px)
          : this.aimAngle;
        const speed = bowState.evolved || bowState.level >= 3 ? 540 : 450;

        for (let i = 0; i < arrowCount; i++) {
          const spread = (i - (arrowCount - 1) / 2) * 0.15;
          const ang = baseAng + spread;
          this.projectiles.push({
            x: this.px,
            y: this.py - 6,
            vx: Math.cos(ang) * speed,
            vy: Math.sin(ang) * speed,
            angle: ang,
            radius: 10,
            damage: dmg,
            pierce,
            life: 1.45,
            maxLife: 1.45,
            kind: "arrow",
            sourceWeapon: "astral_bow",
            isEvolved: bowState.evolved,
            hitIds: new Set(),
          });
        }
      }
    }

    // 3. Khiên Bay Phản Kích (flying_shield — bounces between enemies then returns!)
    const shieldState = this.weapons.flying_shield;
    if (shieldState.level > 0) {
      this.weaponTimers.flying_shield -= dt;
      if (this.weaponTimers.flying_shield <= 0 && this.enemies.length > 0) {
        const baseCd =
          WEAPONS.flying_shield.baseCooldown *
          (shieldState.evolved ? 0.72 : 1);
        this.weaponTimers.flying_shield = Math.max(0.65, baseCd * cdMult);
        this.triggerWeaponSwing();

        const count =
          shieldState.evolved || shieldState.level >= 4 ? 2 : 1;
        const bounces = shieldState.evolved
          ? 6
          : shieldState.level >= 4
          ? 5
          : shieldState.level >= 2
          ? 4
          : 3;
        const dmg =
          WEAPONS.flying_shield.baseDamage *
          (1 + (shieldState.level - 1) * 0.25) *
          (shieldState.evolved ? 1.35 : 1) *
          this.getMightMultiplier();

        const target = this.enemies[0];
        const baseAng = target
          ? Math.atan2(target.y - this.py, target.x - this.px)
          : this.aimAngle;

        for (let s = 0; s < count; s++) {
          const ang = baseAng + (s === 1 ? Math.PI * 0.35 : 0);
          this.projectiles.push({
            x: this.px,
            y: this.py - 6,
            vx: Math.cos(ang) * 410,
            vy: Math.sin(ang) * 410,
            angle: ang,
            radius: 15,
            damage: dmg,
            pierce: 99,
            bouncesLeft: bounces,
            returning: false,
            life: 2.6,
            maxLife: 2.6,
            kind: "shield",
            sourceWeapon: "flying_shield",
            isEvolved: shieldState.evolved,
            hitIds: new Set(),
          });
        }
      }
    }

    // 4. Búa Chấn Động (quake_hammer — Heavy AoE slam, knockback, stun & structure breaker!)
    const hammerState = this.weapons.quake_hammer;
    if (hammerState.level > 0) {
      this.weaponTimers.quake_hammer -= dt;
      if (this.weaponTimers.quake_hammer <= 0) {
        const baseCd =
          WEAPONS.quake_hammer.baseCooldown *
          (hammerState.level >= 4 ? 0.85 : 1) *
          (hammerState.evolved ? 0.75 : 1);
        this.weaponTimers.quake_hammer = Math.max(0.85, baseCd * cdMult);
        this.triggerWeaponSwing();

        const slamX = this.px + this.facingX * 26;
        const slamY = this.py + 6;
        const slamR =
          (hammerState.evolved ? 155 : hammerState.level >= 2 ? 128 : 104) *
          this.getAreaMultiplier();
        const dmg =
          WEAPONS.quake_hammer.baseDamage *
          (1 + (hammerState.level - 1) * 0.26) *
          (hammerState.evolved ? 1.4 : 1) *
          this.getMightMultiplier();
        const hasShatterCombo = this.hasSynergy("shatter_quake_hammer");

        this.frostRings.push({
          x: slamX,
          y: slamY,
          maxRadius: slamR,
          color: hammerState.evolved ? "#38BDF8" : "#F97316",
          life: 0.32,
          maxLife: 0.32,
        });
        this.addShake(5.5, 0.16);
        this.damageObjectivesInRadius(slamX, slamY, slamR, dmg, "quake_hammer");

        for (const e of this.enemies) {
          const dx = e.x - slamX;
          const dy = e.y - slamY;
          const d = Math.hypot(dx, dy);
          if (d <= slamR + e.radius) {
            let finalDmg = dmg;
            // COMBO: Búa Đập Vỡ Băng (shatter_quake_hammer) shatters frozen enemies!
            if (hasShatterCombo && e.frostTimer > 0) {
              finalDmg *= 1.5;
              this.spawnPopup(e.x, e.y - 32, "ĐẬP VỠ BĂNG!", "#38BDF8", true);
              for (let k = 0; k < 6; k++) {
                const a = (k * Math.PI) / 3;
                this.projectiles.push({
                  x: e.x,
                  y: e.y - 6,
                  vx: Math.cos(a) * 440,
                  vy: Math.sin(a) * 440,
                  angle: a,
                  radius: 9,
                  damage: dmg * 0.45,
                  pierce: 2,
                  life: 0.55,
                  maxLife: 0.55,
                  kind: "ice_shard",
                  sourceWeapon: "quake_hammer",
                  isEvolved: true,
                  hitIds: new Set([e.id]),
                });
              }
            }
            this.damageEnemy(e, finalDmg, dx, dy, 310, "quake_hammer");
            if (hammerState.level >= 2 || hammerState.evolved) {
              e.stunTimer = Math.max(e.stunTimer, 0.9);
            }
          }
        }
      }
    }

    // 5. Sách Băng Giá (frost_tome)
    const frostState = this.weapons.frost_tome;
    if (frostState.level > 0) {
      this.weaponTimers.frost_tome -= dt;
      if (this.weaponTimers.frost_tome <= 0 && this.enemies.length > 0) {
        const baseCd =
          WEAPONS.frost_tome.baseCooldown *
          (frostState.level >= 4 ? 0.82 : 1) *
          (frostState.evolved ? 0.68 : 1);
        this.weaponTimers.frost_tome = Math.max(0.75, baseCd * cdMult);
        this.triggerWeaponSwing();

        const maxR =
          (frostState.evolved ? 165 : frostState.level >= 2 ? 138 : 112) *
          this.getAreaMultiplier();
        const dmg =
          WEAPONS.frost_tome.baseDamage *
          (1 + (frostState.level - 1) * 0.24) *
          (frostState.evolved ? 1.35 : 1) *
          this.getMightMultiplier();
        const freezeDur = frostState.evolved
          ? 3.4
          : frostState.level >= 3
          ? 2.8
          : 2.0;

        this.frostRings.push({
          x: this.px,
          y: this.py,
          maxRadius: maxR,
          color: frostState.evolved ? "#A855F7" : "#38BDF8",
          life: 0.34,
          maxLife: 0.34,
        });

        for (const e of this.enemies) {
          const dx = e.x - this.px;
          const dy = e.y - this.py;
          const d = Math.hypot(dx, dy);
          if (d <= maxR + e.radius) {
            this.damageEnemy(e, dmg, dx, dy, 165, "frost_tome");
            e.frostTimer = Math.max(e.frostTimer, freezeDur);
          }
        }
      }
    }

    // 6. Bình Dầu & Đuốc (oil_torch — throws burning oil pools on the battlefield)
    const oilState = this.weapons.oil_torch;
    if (oilState.level > 0) {
      this.weaponTimers.oil_torch -= dt;
      if (this.weaponTimers.oil_torch <= 0 && this.enemies.length > 0) {
        const baseCd =
          WEAPONS.oil_torch.baseCooldown * (oilState.evolved ? 0.72 : 1);
        this.weaponTimers.oil_torch = Math.max(0.85, baseCd * cdMult);
        this.triggerWeaponSwing();

        const count = oilState.evolved
          ? 3
          : oilState.level >= 5
          ? 3
          : oilState.level >= 2
          ? 2
          : 1;
        const dps =
          WEAPONS.oil_torch.baseDamage *
          (1 + (oilState.level - 1) * 0.28) *
          (oilState.evolved ? 1.45 : 1) *
          this.getMightMultiplier();
        const poolR =
          (oilState.evolved ? 64 : oilState.level >= 2 ? 52 : 42) *
          this.getAreaMultiplier();

        for (let i = 0; i < count; i++) {
          const target = this.enemies[i % this.enemies.length];
          const tx = target
            ? target.x
            : this.px + Math.cos(this.aimAngle + i) * 110;
          const ty = target
            ? target.y
            : this.py + Math.sin(this.aimAngle + i) * 110;
          this.fireTrails.push({
            x: tx,
            y: ty,
            radius: poolR,
            dps,
            life: oilState.level >= 4 || oilState.evolved ? 4.2 : 3.2,
            maxLife: 4.2,
            tickTimer: 0,
            sourceWeapon: "oil_torch",
          });
        }
      }
    }

    // 7. Nam Châm Sét (lightning_magnet — zaps chain lightning & charges faster on gem pickup)
    const magState = this.weapons.lightning_magnet;
    if (magState.level > 0) {
      this.weaponTimers.lightning_magnet -= dt;
      if (this.weaponTimers.lightning_magnet <= 0 && this.enemies.length > 0) {
        const baseCd =
          WEAPONS.lightning_magnet.baseCooldown *
          (magState.level >= 3 ? 0.88 : 1) *
          (magState.evolved ? 0.7 : 1);
        this.weaponTimers.lightning_magnet = Math.max(0.5, baseCd * cdMult);
        this.triggerWeaponSwing();

        const bounces = magState.evolved
          ? 6
          : magState.level >= 4
          ? 5
          : magState.level >= 2
          ? 4
          : 3;
        const boltCount = magState.evolved || magState.level >= 5 ? 2 : 1;
        const dmg =
          WEAPONS.lightning_magnet.baseDamage *
          (1 + (magState.level - 1) * 0.25) *
          (magState.evolved ? 1.35 : 1) *
          this.getMightMultiplier();

        for (let b = 0; b < boltCount; b++) {
          this.triggerChainLightning(
            this.px,
            this.py - 12,
            bounces,
            dmg,
            magState.evolved ? "#A855F7" : "#FACC15",
            "lightning_magnet"
          );
        }
      }
    }

    // 8. Bom Mồi Nhử (decoy_bomb — pulls enemies into a cluster then explodes!)
    const bombState = this.weapons.decoy_bomb;
    if (bombState.level > 0) {
      this.weaponTimers.decoy_bomb -= dt;
      if (this.weaponTimers.decoy_bomb <= 0 && this.enemies.length > 0) {
        const baseCd =
          WEAPONS.decoy_bomb.baseCooldown *
          (bombState.level >= 3 ? 0.82 : 1) *
          (bombState.evolved ? 0.72 : 1);
        this.weaponTimers.decoy_bomb = Math.max(1.0, baseCd * cdMult);
        this.triggerWeaponSwing();

        const count = bombState.evolved || bombState.level >= 4 ? 2 : 1;
        const dmg =
          WEAPONS.decoy_bomb.baseDamage *
          (1 + (bombState.level - 1) * 0.28) *
          (bombState.evolved ? 1.45 : 1) *
          this.getMightMultiplier();
        const pullR =
          (bombState.evolved ? 145 : bombState.level >= 2 ? 120 : 95) *
          this.getAreaMultiplier();

        for (let i = 0; i < count; i++) {
          const target = this.enemies[(i * 2) % this.enemies.length];
          const bx = target
            ? target.x
            : this.px + Math.cos(this.aimAngle + i * 2) * 115;
          const by = target
            ? target.y
            : this.py + Math.sin(this.aimAngle + i * 2) * 115;
          this.decoyBombs.push({
            x: bx,
            y: by,
            pullRadius: pullR,
            damage: dmg,
            timer: 1.25,
            maxTimer: 1.25,
            isFlamethrower: this.hasSynergy("flamethrower_turret"),
            flameTick: 0,
          });
        }
      }
    }
  }

  private triggerChainLightning(
    originX: number,
    originY: number,
    maxTargets: number,
    baseDamage: number,
    color: string,
    sourceWeapon: WeaponId
  ): void {
    const visited = new Set<number>();
    let curX = originX;
    let curY = originY;

    for (let step = 0; step < maxTargets; step++) {
      let bestEnemy: EnemyEntity | null = null;
      let bestScore = -Infinity;

      for (const e of this.enemies) {
        if (visited.has(e.id)) continue;
        const d = Math.hypot(e.x - curX, e.y - curY);
        if (d > (step === 0 ? 320 : 210)) continue;
        const score = (e.isElite ? 400 : 0) + e.hp * 0.4 - d;
        if (score > bestScore) {
          bestScore = score;
          bestEnemy = e;
        }
      }

      if (!bestEnemy) break;
      visited.add(bestEnemy.id);

      this.lightningBolts.push({
        x1: curX,
        y1: curY,
        x2: bestEnemy.x,
        y2: bestEnemy.y - 8,
        color,
        life: 0.2,
        maxLife: 0.2,
      });

      const hitDmg = baseDamage * Math.pow(0.88, step);
      this.damageEnemy(
        bestEnemy,
        hitDmg,
        bestEnemy.x - curX,
        bestEnemy.y - curY,
        95,
        sourceWeapon
      );
      bestEnemy.shockTimer = Math.max(bestEnemy.shockTimer, 1.8);

      curX = bestEnemy.x;
      curY = bestEnemy.y - 8;
    }
  }

  private executeBroadswordImpact(): void {
    const swState = this.weapons.broadsword;
    const might = this.getMightMultiplier();
    const dmg =
      WEAPONS.broadsword.baseDamage *
      (1 + (swState.level - 1) * 0.25) *
      (swState.evolved ? 1.38 : 1) *
      might;
    const cleaveRadius =
      (swState.evolved ? 136 : 96 + swState.level * 7) *
      this.getAreaMultiplier();
    const dirAngle = this.aimAngle;
    const arcSpan = Math.PI * 1.15;

    this.slashes.push({
      x: this.px + Math.cos(dirAngle) * 14,
      y: this.py - 6 + Math.sin(dirAngle) * 14,
      angle: dirAngle,
      radius: cleaveRadius,
      arcSpan,
      life: 0.18,
      maxLife: 0.18,
      color: swState.evolved ? "#FACC15" : "#38BDF8",
      isEvolved: swState.evolved,
    });

    this.damageObjectivesInRadius(
      this.px + Math.cos(dirAngle) * 28,
      this.py + Math.sin(dirAngle) * 28,
      cleaveRadius,
      dmg,
      "broadsword"
    );

    if (swState.level >= 5 || swState.evolved) {
      const waveSpd = 470;
      this.projectiles.push({
        x: this.px + Math.cos(dirAngle) * 24,
        y: this.py - 6 + Math.sin(dirAngle) * 24,
        vx: Math.cos(dirAngle) * waveSpd,
        vy: Math.sin(dirAngle) * waveSpd,
        angle: dirAngle,
        radius: 20,
        damage: dmg * 0.65,
        pierce: 4,
        life: 0.78,
        maxLife: 0.78,
        kind: "sword_wave",
        sourceWeapon: "broadsword",
        isEvolved: swState.evolved,
        hitIds: new Set(),
      });
    }

    if (this.hasSynergy("inferno_oil_sea")) {
      this.detonateNearbyOilPools(
        this.px + Math.cos(dirAngle) * 45,
        this.py + Math.sin(dirAngle) * 45,
        cleaveRadius
      );
    }

    let hitCount = 0;
    for (const e of this.enemies) {
      const dx = e.x - this.px;
      const dy = e.y - this.py;
      const dist = Math.hypot(dx, dy);
      if (dist <= cleaveRadius + e.radius) {
        const angToE = Math.atan2(dy, dx);
        const diff = Math.atan2(
          Math.sin(angToE - dirAngle),
          Math.cos(angToE - dirAngle)
        );
        if (Math.abs(diff) <= arcSpan * 0.58 || dist < 44) {
          this.damageEnemy(e, dmg, dx, dy, 235, "broadsword");
          hitCount += 1;
        }
      }
    }

    if (swState.evolved && hitCount >= 3 && this.hp < this.maxHp) {
      this.hp = Math.min(this.maxHp, this.hp + 1.0);
    }

    if (hitCount > 0) {
      this.hitStopTimer = 0.022;
      this.addShake(hitCount >= 3 ? 4.5 : 2.5, 0.1);
    }
  }

  private updateDecoyBombs(dt: number): void {
    for (let i = this.decoyBombs.length - 1; i >= 0; i--) {
      const b = this.decoyBombs[i];
      b.timer -= dt;

      // Pull surrounding enemies inward toward the decoy bomb!
      for (const e of this.enemies) {
        if (e.isBoss) continue;
        const dx = b.x - e.x;
        const dy = b.y - e.y;
        const d = Math.hypot(dx, dy);
        if (d > 8 && d <= b.pullRadius) {
          const pullSpd = e.isElite ? 65 : 155;
          e.x += (dx / d) * pullSpd * dt;
          e.y += (dy / d) * pullSpd * dt;
        }
      }

      // COMBO: Pháo Đài & Bom Phun Lửa (flamethrower_turret) sprays fire while ticking!
      if (b.isFlamethrower) {
        b.flameTick -= dt;
        if (b.flameTick <= 0) {
          b.flameTick = 0.35;
          for (const e of this.enemies) {
            if (Math.hypot(e.x - b.x, e.y - b.y) <= b.pullRadius * 0.85) {
              this.damageEnemy(
                e,
                b.damage * 0.25,
                e.x - b.x,
                e.y - b.y,
                20,
                "decoy_bomb"
              );
              e.burnTimer = Math.max(e.burnTimer, 2.2);
              e.burnDps = Math.max(e.burnDps, b.damage * 0.35);
            }
          }
        }
      }

      if (b.timer <= 0) {
        this.spawnSpriteEffect({
          kind: "explosion",
          x: b.x,
          y: b.y,
          frame: 0,
          maxFrames: 9,
          frameDuration: 0.05,
          timer: 0,
          scale: 1.15,
        });
        this.addShake(5, 0.16);
        this.damageObjectivesInRadius(
          b.x,
          b.y,
          b.pullRadius,
          b.damage,
          "decoy_bomb"
        );

        for (const e of this.enemies) {
          const dx = e.x - b.x;
          const dy = e.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d <= b.pullRadius + e.radius) {
            this.damageEnemy(e, b.damage, dx, dy, 240, "decoy_bomb");
            if (this.weapons.decoy_bomb.level >= 5 || this.weapons.decoy_bomb.evolved) {
              e.stunTimer = Math.max(e.stunTimer, 0.9);
            }
          }
        }

        if (b.isFlamethrower) {
          this.fireTrails.push({
            x: b.x,
            y: b.y,
            radius: 58,
            dps: b.damage * 0.45,
            life: 3.2,
            maxLife: 3.2,
            tickTimer: 0,
            sourceWeapon: "oil_torch",
          });
        }

        this.decoyBombs.splice(i, 1);
      }
    }
  }

  private updateTurrets(dt: number): void {
    for (let i = this.turrets.length - 1; i >= 0; i--) {
      const t = this.turrets[i];
      t.life -= dt;
      if (t.life <= 0) {
        this.turrets.splice(i, 1);
        continue;
      }

      t.fireCooldown -= dt;
      if (t.fireCooldown <= 0 && this.enemies.length > 0) {
        t.fireCooldown = t.isFlamethrower ? 0.38 : 0.62;
        let nearest = this.enemies[0];
        let bestD = Infinity;
        for (const e of this.enemies) {
          const d = Math.hypot(e.x - t.x, e.y - t.y);
          if (d < bestD) {
            bestD = d;
            nearest = e;
          }
        }
        if (nearest && bestD <= 310) {
          const ang = Math.atan2(nearest.y - t.y, nearest.x - t.x);
          const spd = 490;
          this.projectiles.push({
            x: t.x,
            y: t.y - 8,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            angle: ang,
            radius: 9,
            damage: 18 * this.getMightMultiplier(),
            pierce: t.isRescuedAlly ? 2 : 1,
            life: 1.1,
            maxLife: 1.1,
            kind: t.isRescuedAlly ? "arrow" : "turret_bolt",
            sourceWeapon: t.isRescuedAlly ? "astral_bow" : "decoy_bomb",
            isEvolved: t.isFlamethrower,
            hitIds: new Set(),
          });
        }
      }
    }
  }

  private updateEnemySpawner(dt: number): void {
    const stage = STAGES[this.stageId];

    if (this.elapsedSec >= stage.durationSec && this.bossDefeated) {
      this.status = "victory";
      if (!this.newlyUnlocked.includes("Ember • Pháp Sư")) {
        this.newlyUnlocked.push("Ember • Pháp Sư");
      }
      this.emitSnapshot();
      return;
    }

    // Active monster camps increase spawn rate; destroying them rewards player with calmer waves!
    const activeCamps = this.mapObjectives.filter(
      (o) => o.kind === "monster_camp" && !o.completed
    ).length;
    const campSpawnFactor = 0.8 + activeCamps * 0.16;

    const minutes = this.elapsedSec / 60;
    const maxEnemies = Math.min(
      65,
      Math.floor((18 + this.elapsedSec * 0.56) * stage.spawnRateMult)
    );
    const spawnRatePerSec =
      ((this.elapsedSec < 15 ? 1.35 : 1.9) + minutes * 2.85) *
      stage.spawnRateMult *
      campSpawnFactor;

    this.spawnAccumulator += spawnRatePerSec * dt;
    while (this.spawnAccumulator >= 1 && this.enemies.length < maxEnemies) {
      this.spawnAccumulator -= 1;
      const angle = Math.random() * Math.PI * 2;
      const dist = 340 + Math.random() * 85;
      const sx = Math.max(-620, Math.min(620, this.px + Math.cos(angle) * dist));
      const sy = Math.max(-305, Math.min(435, this.py + Math.sin(angle) * dist));

      const r = Math.random();
      const tntChance = Math.min(0.36, 0.22 + minutes * 0.06);
      const arch: EnemyArch =
        this.elapsedSec > 8 && r < tntChance ? "goblin_tnt" : "goblin_torch";
      this.spawnEnemyAt(arch, sx, sy);
    }

    // Spawn Mid-Run Elite every 28s
    const milestone = Math.floor(this.elapsedSec / 28);
    if (milestone >= 1 && !this.eliteMilestones.has(milestone)) {
      this.eliteMilestones.add(milestone);
      this.spawnEliteKnight(stage.mobEliteName || "Đội Trưởng Tinh Anh", false);
    }

    // Spawn Stage Final Boss at stage.bossSpawnSec (130s)
    if (this.elapsedSec >= stage.bossSpawnSec && !this.bossSpawned) {
      this.bossSpawned = true;
      this.spawnEliteKnight(stage.bossName, true);
    }
  }

  public spawnEliteKnight(title: string, isBoss = false): void {
    const stage = STAGES[this.stageId];
    const angle = Math.random() * Math.PI * 2;
    const sx = Math.max(-580, Math.min(580, this.px + Math.cos(angle) * 280));
    const sy = Math.max(-290, Math.min(410, this.py + Math.sin(angle) * 280));
    const minutes = this.elapsedSec / 60;
    const scaleMult =
      (1 +
        minutes * 0.9 +
        Math.pow(Math.max(0, minutes - 0.5), 1.45) * 0.8) *
      stage.enemyHpMult *
      (isBoss ? 2.3 : 1.0);
    const maxHp = Math.round((isBoss ? 640 : 480) * scaleMult);

    this.enemies.push({
      id: this.nextEnemyId++,
      arch: "elite_knight",
      x: sx,
      y: sy,
      vx: 0,
      vy: 0,
      facingX: this.px >= sx ? 1 : -1,
      radius: isBoss ? 30 : 26,
      hp: maxHp,
      maxHp,
      speed: Math.round(
        (isBoss ? 116 : 110) *
          (1 + Math.min(0.4, minutes * 0.14)) *
          stage.enemySpdMult
      ),
      damage: Math.round((isBoss ? 26 : 19) * stage.enemyDmgMult),
      expValue: isBoss ? 110 : 48,
      isElite: true,
      isBoss,
      bossPhase: 1,
      title,
      hitFlash: 0,
      knockVx: 0,
      knockVy: 0,
      animState: "run",
      animDir: "side",
      animFrame: 0,
      animTimer: 0,
      attackTriggered: false,
      attackCooldown: 0.75,
      specialTimer: isBoss ? 3.2 : 5.5,
      burnTimer: 0,
      burnDps: 0,
      burnTickTimer: 0,
      frostTimer: 0,
      shockTimer: 0,
      stunTimer: 0,
    });

    sfx.playBossWarning();
    this.addShake(isBoss ? 9 : 6, 0.25);
    this.showBanner(
      isBoss ? `BOSS XUẤT HIỆN: ${title}!` : `Tinh Anh xuất hiện: ${title}`,
      2.8
    );
    this.emitSnapshot();
  }

  private updateBossTelegraphs(dt: number): void {
    for (let i = this.bossTelegraphs.length - 1; i >= 0; i--) {
      const bt = this.bossTelegraphs[i];
      bt.elapsed += dt;
      if (bt.elapsed >= bt.duration) {
        const boss = this.enemies.find((e) => e.id === bt.bossId);
        if (boss) {
          if (bt.kind === "line_charge") {
            // Execute high-speed Cavalry Charge to target point!
            boss.x = Math.max(-620, Math.min(620, bt.targetX));
            boss.y = Math.max(-300, Math.min(435, bt.targetY));
            this.addShake(7, 0.2);
            if (
              Math.hypot(this.px - boss.x, this.py - boss.y) <=
                bt.radius + 22 &&
              this.invulnTimer <= 0
            ) {
              this.applyDamageToPlayer(bt.damage);
            }
          } else if (bt.kind === "cone_cleave") {
            // Stage 1 Boss wide sword cleave in front of boss
            this.slashes.push({
              x: boss.x,
              y: boss.y - 6,
              angle: Math.atan2(bt.targetY - boss.y, bt.targetX - boss.x),
              radius: bt.radius,
              arcSpan: Math.PI * 0.95,
              life: 0.24,
              maxLife: 0.24,
              color: "#EF4444",
              isEvolved: true,
            });
            this.addShake(6.5, 0.18);
            if (
              Math.hypot(this.px - bt.targetX, this.py - bt.targetY) <=
                bt.radius * 0.85 &&
              this.invulnTimer <= 0
            ) {
              this.applyDamageToPlayer(bt.damage);
            }
          } else if (bt.kind === "root_snare") {
            // Stage 2 Ancient Wose Root Snare — immobilizes/slows player if inside telegraph!
            this.addShake(6, 0.18);
            if (
              Math.hypot(this.px - bt.targetX, this.py - bt.targetY) <=
              bt.radius
            ) {
              this.playerRootTimer = 1.65;
              this.spawnPopup(
                this.px,
                this.py - 32,
                "🌿 RỄ CÂY TRÓI CHÂN!",
                "#4ADE80",
                true
              );
              if (this.invulnTimer <= 0) {
                this.applyDamageToPlayer(Math.round(bt.damage * 0.7));
              }
            }
          } else if (bt.kind === "quake_safezone") {
            // Stage 3 Rock Golem Safe-Zone Quake — shifts safe zone to targetX/targetY; damages outside!
            this.safeZone = {
              x: bt.targetX,
              y: bt.targetY,
              radius: bt.radius,
              timer: 4.5,
            };
            this.addShake(9, 0.28);
            const distToSafe = Math.hypot(
              this.px - bt.targetX,
              this.py - bt.targetY
            );
            if (distToSafe > bt.radius && this.invulnTimer <= 0) {
              this.applyDamageToPlayer(Math.round(bt.damage * 0.8));
              this.spawnPopup(
                this.px,
                this.py - 32,
                "🪨 SẬP HẦM! VÀO VÙNG AN TOÀN!",
                "#F59E0B",
                true
              );
            } else {
              this.spawnPopup(
                this.px,
                this.py - 32,
                "✨ ĐỨNG TRONG VÙNG AN TOÀN!",
                "#4ADE80",
                true
              );
            }
          } else {
            // Execute AoE Circle Slam / Poison Spore Nova!
            this.spawnSpriteEffect({
              kind: "explosion",
              x: bt.targetX,
              y: bt.targetY,
              frame: 0,
              maxFrames: 9,
              frameDuration: 0.05,
              timer: 0,
              scale: 1.4,
            });
            this.addShake(8, 0.22);
            if (
              Math.hypot(this.px - bt.targetX, this.py - bt.targetY) <=
                bt.radius &&
              this.invulnTimer <= 0
            ) {
              this.applyDamageToPlayer(bt.damage);
            }
          }
        }
        this.bossTelegraphs.splice(i, 1);
      }
    }
  }

  public spawnEnemyAt(arch: EnemyArch, x: number, y: number): void {
    const stage = STAGES[this.stageId];
    const minutes = this.elapsedSec / 60;
    const hpMult =
      (1 +
        minutes * 0.8 +
        Math.pow(Math.max(0, minutes - 0.45), 1.5) * 1.0) *
      stage.enemyHpMult;
    const spdMult =
      (1 + Math.min(0.45, minutes * 0.16)) * stage.enemySpdMult;
    const dmgMult =
      (1 + Math.floor(minutes) * 0.22) * stage.enemyDmgMult;

    const configs: Record<
      EnemyArch,
      { r: number; hp: number; spd: number; dmg: number; exp: number }
    > = {
      goblin_torch: { r: 17, hp: 27, spd: 82, dmg: 6, exp: 4 },
      goblin_tnt: { r: 17, hp: 37, spd: 76, dmg: 12, exp: 5 },
      elite_knight: { r: 26, hp: 440, spd: 110, dmg: 19, exp: 48 },
    };

    const cfg = configs[arch];
    const maxHp = Math.round(cfg.hp * hpMult);
    this.enemies.push({
      id: this.nextEnemyId++,
      arch,
      x,
      y,
      vx: 0,
      vy: 0,
      facingX: this.px >= x ? 1 : -1,
      radius: cfg.r,
      hp: maxHp,
      maxHp,
      speed: Math.round(cfg.spd * spdMult),
      damage: Math.round(cfg.dmg * dmgMult),
      expValue: cfg.exp,
      isElite: arch === "elite_knight",
      hitFlash: 0,
      knockVx: 0,
      knockVy: 0,
      animState: "run",
      animDir: "side",
      animFrame: Math.floor(Math.random() * 6),
      animTimer: Math.random() * 0.08,
      attackTriggered: false,
      attackCooldown: 0.45 + Math.random() * 0.7,
      specialTimer: 5.0,
      burnTimer: 0,
      burnDps: 0,
      burnTickTimer: 0,
      frostTimer: 0,
      shockTimer: 0,
      stunTimer: 0,
    });
  }

  private updateFireTrails(dt: number): void {
    for (let i = this.fireTrails.length - 1; i >= 0; i--) {
      const ft = this.fireTrails[i];
      ft.life -= dt;
      if (ft.life <= 0) {
        this.fireTrails[i] = this.fireTrails[this.fireTrails.length - 1];
        this.fireTrails.pop();
        continue;
      }
      ft.tickTimer -= dt;
      if (ft.tickTimer <= 0) {
        ft.tickTimer = 0.4;
        for (const e of this.enemies) {
          if (Math.hypot(e.x - ft.x, e.y - ft.y) <= ft.radius + e.radius) {
            this.damageEnemy(
              e,
              ft.dps * 0.42,
              0,
              -1,
              30,
              ft.sourceWeapon
            );
            e.burnTimer = Math.max(e.burnTimer, 2.0);
            e.burnDps = Math.max(e.burnDps, ft.dps * 0.5);
          }
        }
      }
    }
  }

  private updateProjectiles(dt: number): void {
    const hasElectricShield = this.hasSynergy("electric_tether_shield");

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.projectiles[i] = this.projectiles[this.projectiles.length - 1];
        this.projectiles.pop();
        continue;
      }

      // Returning Flying Shield steers back to the Hero!
      if (p.kind === "shield" && p.returning) {
        const dx = this.px - p.x;
        const dy = this.py - p.y;
        const d = Math.hypot(dx, dy);
        if (d <= 26) {
          this.projectiles[i] = this.projectiles[this.projectiles.length - 1];
          this.projectiles.pop();
          continue;
        }
        p.vx = (dx / d) * 460;
        p.vy = (dy / d) * 460;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Also allow projectiles to chip Map Objectives!
      this.damageObjectivesInRadius(
        p.x,
        p.y,
        p.radius,
        p.damage * 0.35,
        p.sourceWeapon
      );

      for (const e of this.enemies) {
        if (p.hitIds.has(e.id)) continue;
        const dist = Math.hypot(e.x - p.x, e.y - p.y);
        if (dist <= e.radius + p.radius) {
          p.hitIds.add(e.id);
          this.damageEnemy(e, p.damage, p.vx, p.vy, 135, p.sourceWeapon);

          if (p.kind === "ice_shard") {
            e.frostTimer = Math.max(e.frostTimer, 1.5);
          }

          if (p.kind === "turret_bolt" && p.isEvolved) {
            e.burnTimer = Math.max(e.burnTimer, 2.2);
            e.burnDps = Math.max(e.burnDps, p.damage * 0.4);
          }

          // Flying Shield Ricochet Logic!
          if (p.kind === "shield") {
            if (
              this.weapons.flying_shield.level >= 3 ||
              this.weapons.flying_shield.evolved
            ) {
              e.stunTimer = Math.max(e.stunTimer, 0.45);
            }
            if ((p.bouncesLeft ?? 0) > 0) {
              p.bouncesLeft = (p.bouncesLeft ?? 1) - 1;
              // Find next closest unhit enemy to bounce toward
              let nextTarget: EnemyEntity | null = null;
              let bestD = 250;
              for (const other of this.enemies) {
                if (p.hitIds.has(other.id)) continue;
                const od = Math.hypot(other.x - e.x, other.y - e.y);
                if (od < bestD) {
                  bestD = od;
                  nextTarget = other;
                }
              }
              if (nextTarget) {
                const ang = Math.atan2(
                  nextTarget.y - p.y,
                  nextTarget.x - p.x
                );
                p.vx = Math.cos(ang) * 430;
                p.vy = Math.sin(ang) * 430;

                // COMBO: Khiên Nối Điện (electric_tether_shield) zaps electric arc on bounce!
                if (hasElectricShield) {
                  this.lightningBolts.push({
                    x1: e.x,
                    y1: e.y - 6,
                    x2: nextTarget.x,
                    y2: nextTarget.y - 6,
                    color: "#FACC15",
                    life: 0.24,
                    maxLife: 0.24,
                  });
                  this.damageEnemy(
                    nextTarget,
                    p.damage * 0.6,
                    nextTarget.x - e.x,
                    nextTarget.y - e.y,
                    80,
                    "lightning_magnet"
                  );
                }
              } else {
                p.returning = true;
                p.hitIds.clear();
              }
            } else {
              p.returning = true;
              p.hitIds.clear();
            }
            break;
          }

          p.pierce -= 1;
          if (p.pierce <= 0) {
            p.life = 0;
            break;
          }
        }
      }
    }
  }

  private spawnSpriteEffect(fx: SpriteAnimEffect): void {
    if (this.spriteEffects.length >= 40) {
      this.spriteEffects[0] = this.spriteEffects[this.spriteEffects.length - 1];
      this.spriteEffects.pop();
    }
    this.spriteEffects.push(fx);
  }

  private updateEnemyBombs(dt: number): void {
    for (let i = this.enemyBombs.length - 1; i >= 0; i--) {
      const b = this.enemyBombs[i];
      b.elapsed += dt;
      const t = Math.min(1, b.elapsed / b.duration);
      b.x = b.startX + (b.targetX - b.startX) * t;
      b.y = b.startY + (b.targetY - b.startY) * t;
      b.zHeight = Math.sin(t * Math.PI) * 68;
      b.frame = Math.floor(b.elapsed * 18) % 6;

      if (t >= 1) {
        this.spawnSpriteEffect({
          kind: "explosion",
          x: b.targetX,
          y: b.targetY,
          frame: 0,
          maxFrames: 9,
          frameDuration: 0.055,
          timer: 0,
          scale: 1.0,
        });
        this.addShake(4, 0.14);

        const distToPlayer = Math.hypot(
          this.px - b.targetX,
          this.py - b.targetY
        );
        if (distToPlayer <= b.blastRadius && this.invulnTimer <= 0) {
          this.applyDamageToPlayer(b.damage);
        }

        this.enemyBombs[i] = this.enemyBombs[this.enemyBombs.length - 1];
        this.enemyBombs.pop();
      }
    }
  }

  private applyDamageToPlayer(dmg: number): void {
    if (this.aegisShield > 0) {
      this.aegisShield -= 1;
      this.invulnTimer = 0.75;
      this.addShake(5, 0.15);
      this.spawnPopup(this.px, this.py - 32, "KHIÊN BĂNG CHẶN!", "#38BDF8", true);
      for (const e of this.enemies) {
        if (Math.hypot(e.x - this.px, e.y - this.py) <= 130) {
          e.frostTimer = Math.max(e.frostTimer, 2.5);
        }
      }
      this.emitSnapshot();
      return;
    }

    this.hp = Math.max(0, this.hp - dmg);
    this.totalDamageTaken += dmg;
    this.invulnTimer = 0.65;
    this.playerHitFlash = 0.18;
    this.addShake(7, 0.2);
    this.spawnPopup(this.px, this.py - 28, `-${dmg}`, "#EF4444", true);

    if (this.hp <= 0) {
      this.status = "game_over";
      this.emitSnapshot();
    }
  }

  private damageEnemy(
    e: EnemyEntity,
    rawDamage: number,
    dirX: number,
    dirY: number,
    knockback: number,
    sourceWeapon: WeaponId = this.hero.startingWeapon
  ): void {
    const isCrit = Math.random() < this.getCritChance();
    const finalDmg = Math.max(1, Math.round(rawDamage * (isCrit ? 1.65 : 1)));
    e.hp -= finalDmg;
    e.hitFlash = 0.12;
    this.weaponDamage[sourceWeapon] =
      (this.weaponDamage[sourceWeapon] || 0) + finalDmg;

    const len = Math.max(1, Math.hypot(dirX, dirY));
    const kbMult = (1 + this.passives.might * 0.15) * (e.isElite ? 0.3 : 1);
    e.knockVx = (dirX / len) * knockback * kbMult;
    e.knockVy = (dirY / len) * knockback * kbMult;

    if (isCrit || this.popups.length < 10) {
      this.spawnPopup(
        e.x + (Math.random() - 0.5) * 14,
        e.y - e.radius - 8,
        isCrit ? `${finalDmg}!` : `${finalDmg}`,
        isCrit ? "#FACC15" : "#F8FAFC",
        isCrit
      );
    }

    sfx.playHit(isCrit);

    const pCount = isCrit ? 3 : this.particles.length < 36 ? 2 : 1;
    for (let i = 0; i < pCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 70 + Math.random() * 130;
      this.spawnParticle(
        e.x,
        e.y - 6,
        Math.cos(a) * spd,
        Math.sin(a) * spd,
        isCrit ? 5 : 4,
        isCrit ? "#FACC15" : "#38BDF8",
        0.22
      );
    }
  }

  private updateEnemies(dt: number): void {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];

      if (e.burnTimer > 0) {
        e.burnTimer -= dt;
        e.burnTickTimer -= dt;
        if (e.burnTickTimer <= 0) {
          e.burnTickTimer = 0.45;
          const bDmg = Math.max(2, Math.round(e.burnDps * 0.45));
          e.hp -= bDmg;
          this.weaponDamage.oil_torch += bDmg;
          this.spawnPopup(e.x, e.y - e.radius - 4, `${bDmg}`, "#FB923C", false);
        }
      }
      if (e.frostTimer > 0) e.frostTimer = Math.max(0, e.frostTimer - dt);
      if (e.shockTimer > 0) e.shockTimer = Math.max(0, e.shockTimer - dt);
      if (e.stunTimer > 0) {
        e.stunTimer = Math.max(0, e.stunTimer - dt);
        e.x = Math.max(-640, Math.min(640, e.x + e.knockVx * dt));
        e.y = Math.max(-312, Math.min(450, e.y + e.knockVy * dt));
        e.knockVx *= Math.pow(0.03, dt);
        e.knockVy *= Math.pow(0.03, dt);
        continue;
      }

      if (e.hp <= 0) {
        this.handleEnemyDeath(e);
        this.enemies[i] = this.enemies[this.enemies.length - 1];
        this.enemies.pop();
        continue;
      }

      if (e.hitFlash > 0) e.hitFlash -= dt;
      if (e.attackCooldown > 0) e.attackCooldown -= dt;

      const dx = this.px - e.x;
      const dy = this.py - e.y;
      const dist = Math.hypot(dx, dy);
      if (Math.abs(dx) > 4) {
        e.facingX = dx > 0 ? 1 : -1;
      }

      // Stage 5 Boss Phase 2 Transformation at < 50% HP!
      if (
        e.isBoss &&
        this.stageId === "dark_fortress" &&
        (e.bossPhase ?? 1) === 1 &&
        e.hp > 0 &&
        e.hp <= e.maxHp * 0.5
      ) {
        e.bossPhase = 2;
        e.title =
          STAGES.dark_fortress.bossPhase2Name ||
          "Đế Vương Hư Không Thức Tỉnh (GĐ 2)";
        e.hp = Math.min(e.maxHp, e.hp + Math.round(e.maxHp * 0.3));
        e.speed = Math.round(e.speed * 1.18);
        this.addShake(11, 0.38);
        this.showBanner(
          "🌌 GIAI ĐOẠN 2: VUA SA NGÃ HÓA THÂN ĐẾ VƯƠNG HƯ KHÔNG!",
          3.6
        );
        this.spawnPopup(e.x, e.y - 44, "⚡ HÓA THÂN GIAI ĐOẠN 2!", "#F43F5E", true);
        // Summon 2 Void Stalker guards & unleash Triple Void Rift Telegraphs
        this.spawnEnemyAt("goblin_tnt", e.x - 90, e.y + 40);
        this.spawnEnemyAt("goblin_tnt", e.x + 90, e.y - 40);
        for (let k = -1; k <= 1; k++) {
          this.bossTelegraphs.push({
            kind: "circle_slam",
            x: e.x,
            y: e.y,
            targetX: this.px + k * 95,
            targetY: this.py + (k === 0 ? 0 : 55),
            radius: 82,
            elapsed: 0,
            duration: 1.05,
            damage: Math.round(e.damage * 1.4),
            bossId: e.id,
          });
        }
        this.emitSnapshot();
      }

      // Boss & Elite Telegraphed Special Attacks!
      if (e.isElite && dist <= 290) {
        e.specialTimer -= dt;
        if (e.specialTimer <= 0) {
          e.specialTimer = e.isBoss ? (e.bossPhase === 2 ? 3.1 : 4.0) : 6.2;
          if (this.stageId === "courtyard") {
            const useCleave = Math.random() < 0.45;
            this.bossTelegraphs.push({
              kind: useCleave ? "cone_cleave" : "line_charge",
              x: e.x,
              y: e.y,
              targetX: this.px,
              targetY: this.py,
              radius: useCleave ? 98 : 48,
              elapsed: 0,
              duration: 0.92,
              damage: Math.round(e.damage * 1.35),
              bossId: e.id,
            });
          } else if (this.stageId === "mushroom_woods") {
            const useRoot = Math.random() < 0.55;
            this.bossTelegraphs.push({
              kind: useRoot ? "root_snare" : "circle_slam",
              x: e.x,
              y: e.y,
              targetX: this.px,
              targetY: this.py,
              radius: useRoot ? 86 : 102,
              elapsed: 0,
              duration: 0.95,
              damage: Math.round(e.damage * 1.3),
              bossId: e.id,
            });
          } else if (this.stageId === "abandoned_mine" && e.isBoss) {
            const safeX = Math.max(-320, Math.min(320, this.px + (Math.random() - 0.5) * 210));
            const safeY = Math.max(-180, Math.min(220, this.py + (Math.random() - 0.5) * 160));
            this.bossTelegraphs.push({
              kind: "quake_safezone",
              x: e.x,
              y: e.y,
              targetX: safeX,
              targetY: safeY,
              radius: 112,
              elapsed: 0,
              duration: 1.15,
              damage: Math.round(e.damage * 1.35),
              bossId: e.id,
            });
          } else if (this.stageId === "ice_citadel" && e.isBoss) {
            this.bossTelegraphs.push(
              {
                kind: "line_charge",
                x: e.x,
                y: e.y,
                targetX: this.px,
                targetY: this.py,
                radius: 44,
                elapsed: 0,
                duration: 0.9,
                damage: Math.round(e.damage * 1.3),
                bossId: e.id,
              },
              {
                kind: "circle_slam",
                x: e.x,
                y: e.y,
                targetX: this.px,
                targetY: this.py,
                radius: 92,
                elapsed: 0,
                duration: 1.0,
                damage: Math.round(e.damage * 1.3),
                bossId: e.id,
              }
            );
          } else {
            const count = e.bossPhase === 2 ? 2 : 1;
            for (let c = 0; c < count; c++) {
              this.bossTelegraphs.push({
                kind: c === 1 ? "line_charge" : "circle_slam",
                x: e.x,
                y: e.y,
                targetX: this.px + c * 65,
                targetY: this.py - c * 45,
                radius: c === 1 ? 46 : 94,
                elapsed: 0,
                duration: 0.92,
                damage: Math.round(e.damage * 1.35),
                bossId: e.id,
              });
            }
          }
        }
      }

      if (e.animState === "attack") {
        const totalFrames = e.arch === "goblin_tnt" ? 7 : 6;
        const frameDur = e.arch === "goblin_tnt" ? 0.072 : 0.064;
        e.animTimer += dt;
        if (e.animTimer >= frameDur) {
          e.animTimer -= frameDur;
          e.animFrame += 1;

          if (e.animFrame === 3 && !e.attackTriggered) {
            e.attackTriggered = true;
            if (e.arch === "goblin_tnt") {
              this.enemyBombs.push({
                startX: e.x,
                startY: e.y - 10,
                targetX: Math.max(
                  -630,
                  Math.min(630, this.px + (Math.random() - 0.5) * 26)
                ),
                targetY: Math.max(
                  -305,
                  Math.min(440, this.py + (Math.random() - 0.5) * 26)
                ),
                x: e.x,
                y: e.y - 10,
                zHeight: 0,
                elapsed: 0,
                duration: 0.9,
                blastRadius: 48,
                damage: e.damage,
                frame: 0,
              });
            } else {
              const reach = e.isElite ? 68 : 44;
              if (dist <= reach + 12 && this.invulnTimer <= 0) {
                this.applyDamageToPlayer(e.damage);
              }
            }
          }

          if (e.animFrame >= totalFrames) {
            e.animState = "run";
            e.animFrame = 0;
            e.animTimer = 0;
            e.attackCooldown = e.arch === "goblin_tnt" ? 2.1 : 1.05;
          }
        }

        e.x = Math.max(-640, Math.min(640, e.x + e.knockVx * dt));
        e.y = Math.max(-312, Math.min(450, e.y + e.knockVy * dt));
        e.knockVx *= Math.pow(0.03, dt);
        e.knockVy *= Math.pow(0.03, dt);
        continue;
      }

      const triggerRange =
        e.arch === "goblin_tnt" ? 250 : e.isElite ? 64 : 44;
      if (dist <= triggerRange && e.attackCooldown <= 0) {
        e.animState = "attack";
        e.animFrame = 0;
        e.animTimer = 0;
        e.attackTriggered = false;
        const sinA = dy / Math.max(1, dist);
        const cosA = dx / Math.max(1, dist);
        if (Math.abs(sinA) > Math.abs(cosA) * 1.35) {
          e.animDir = sinA > 0 ? "down" : "up";
        } else {
          e.animDir = "side";
        }
        continue;
      }

      e.animTimer += dt;
      if (e.animTimer >= 0.085) {
        e.animTimer -= 0.085;
        e.animFrame = (e.animFrame + 1) % 6;
      }

      const nx = dist > 0.01 ? dx / dist : 0;
      const ny = dist > 0.01 ? dy / dist : 0;
      const moveFactor =
        e.arch === "goblin_tnt" && dist < 150 ? -0.35 : 1.0;

      const slowMult =
        (e.frostTimer > 0 ? 0.45 : 1.0) * (e.shockTimer > 0 ? 0.62 : 1.0);

      e.vx = nx * e.speed * moveFactor * slowMult + e.knockVx;
      e.vy = ny * e.speed * moveFactor * slowMult + e.knockVy;
      e.knockVx *= Math.pow(0.03, dt);
      e.knockVy *= Math.pow(0.03, dt);

      e.x += e.vx * dt;
      e.y += e.vy * dt;

      for (let j = i - 1; j >= 0; j--) {
        const other = this.enemies[j];
        const sdx = e.x - other.x;
        const sdy = e.y - other.y;
        const minSep = e.radius + other.radius;
        if (Math.abs(sdx) >= minSep || Math.abs(sdy) >= minSep) continue;
        const sdist = Math.hypot(sdx, sdy);
        if (sdist > 0.1 && sdist < minSep) {
          const push = (minSep - sdist) * 0.35;
          const px = (sdx / sdist) * push;
          const py = (sdy / sdist) * push;
          e.x += px;
          e.y += py;
          other.x -= px;
          other.y -= py;
        }
      }

      e.x = Math.max(-640, Math.min(640, e.x));
      e.y = Math.max(-312, Math.min(450, e.y));

      if (dist <= e.radius + 14 && this.invulnTimer <= 0) {
        this.applyDamageToPlayer(e.damage);
      }
    }
  }

  private spawnGem(gem: ExpGemEntity): void {
    if (this.gems.length >= 120 && gem.tier !== "chest") {
      const idx = this.gems.findIndex(
        (g) => !g.magnetized && (g.tier === "azure" || g.tier === "gold")
      );
      if (idx !== -1) {
        gem.value += this.gems[idx].value;
        this.gems[idx] = this.gems[this.gems.length - 1];
        this.gems.pop();
      }
    }
    this.gems.push(gem);
  }

  private handleEnemyDeath(e: EnemyEntity): void {
    this.kills += 1;
    const stageOrder = STAGES[this.stageId]?.order || 1;
    const mobGold =
      stageOrder === 1
        ? 1 + (this.kills % 5 === 0 ? 1 : 0)
        : stageOrder === 2
          ? 1 + (this.kills % 2)
          : stageOrder;
    this.gold += e.isElite ? 16 * stageOrder : mobGold;

    if (e.isBoss) {
      this.bossDefeated = true;
      this.gold += 45 * stageOrder;
      if (!this.newlyUnlocked.includes("Ember • Pháp Sư")) {
        this.newlyUnlocked.push("Ember • Pháp Sư");
      }
      this.status = "victory";
      this.showBanner("🏆 CHIẾN THẮNG! ĐÃ HẠ GỤC THỦ LĨNH MÀN CHƠI!", 4.0);
      this.emitSnapshot();
    }

    const frostState = this.weapons.frost_tome;
    if (
      e.frostTimer > 0 &&
      (frostState.level >= 5 || frostState.evolved)
    ) {
      const shardDmg = 20 * this.getMightMultiplier();
      for (let k = 0; k < 4; k++) {
        const ang = (k * Math.PI) / 2 + Math.PI / 4;
        this.projectiles.push({
          x: e.x,
          y: e.y - 6,
          vx: Math.cos(ang) * 420,
          vy: Math.sin(ang) * 420,
          angle: ang,
          radius: 9,
          damage: shardDmg,
          pierce: 2,
          life: 0.55,
          maxLife: 0.55,
          kind: "ice_shard",
          sourceWeapon: "frost_tome",
          isEvolved: frostState.evolved,
          hitIds: new Set([e.id]),
        });
      }
    }

    this.spawnSpriteEffect({
      kind: "dead_skull",
      x: e.x,
      y: e.y,
      frame: 1,
      maxFrames: 14,
      frameDuration: 0.06,
      timer: 0,
      scale: e.isElite ? 1.15 : 0.85,
    });

    if (e.isElite) {
      this.spawnSpriteEffect({
        kind: "explosion",
        x: e.x,
        y: e.y,
        frame: 0,
        maxFrames: 9,
        frameDuration: 0.05,
        timer: 0,
        scale: 1.1,
      });
      this.addShake(8, 0.25);
      this.showBanner(
        e.isBoss
          ? `ĐÃ HẠ BOSS ${e.title}! Nhặt Rương Hoàng Kim!`
          : "Đã hạ Tinh Anh — Nhặt Túi Vàng & Cổ Ngữ!",
        2.6
      );
      this.spawnCollectibleRune(e.x + 28, e.y);
    }

    if (e.isElite) {
      this.spawnGem({
        x: e.x,
        y: e.y,
        vx: 0,
        vy: 0,
        value: e.expValue,
        tier: "chest",
        magnetized: false,
        magnetTime: 0,
        bobSeed: Math.random() * 6,
      });
    } else {
      this.spawnGem({
        x: e.x,
        y: e.y,
        vx: 0,
        vy: 0,
        value: e.expValue,
        tier: e.expValue >= 8 ? "gold" : "azure",
        magnetized: false,
        magnetTime: 0,
        bobSeed: Math.random() * 6,
      });

      if (this.kills % 14 === 0 && this.hp < this.maxHp * 0.82) {
        this.spawnGem({
          x: e.x + 14,
          y: e.y + 8,
          vx: 0,
          vy: 0,
          value: 22,
          tier: "meat",
          magnetized: false,
          magnetTime: 0,
          bobSeed: Math.random() * 6,
        });
      }
    }
  }

  private updateGems(dt: number): void {
    const magnetR = this.getMagnetRadius();

    for (let i = this.gems.length - 1; i >= 0; i--) {
      const g = this.gems[i];
      const dx = this.px - g.x;
      const dy = this.py - g.y;
      const dist = Math.hypot(dx, dy);

      if (!g.magnetized && dist <= magnetR) {
        g.magnetized = true;
        g.magnetTime = 0;
        const nx = dist > 1 ? dx / dist : 1;
        const ny = dist > 1 ? dy / dist : 0;
        g.vx = -nx * 145;
        g.vy = -ny * 145;
      } else if (!g.magnetized && dist <= 375 && dist > 1) {
        g.x += (dx / dist) * 32 * dt;
        g.y += (dy / dist) * 32 * dt;
      }

      if (g.magnetized) {
        g.magnetTime += dt;
        const nx = dist > 1 ? dx / dist : 0;
        const ny = dist > 1 ? dy / dist : 0;
        const pullAccel = 1850 + g.magnetTime * 2400;
        g.vx += nx * pullAccel * dt;
        g.vy += ny * pullAccel * dt;
        g.vx *= Math.pow(0.18, dt);
        g.vy *= Math.pow(0.18, dt);
        g.x += g.vx * dt;
        g.y += g.vy * dt;
      }

      if (dist <= 24) {
        this.gems[i] = this.gems[this.gems.length - 1];
        this.gems.pop();

        // Nam Châm Sét (lightning_magnet) charges faster every time you pick up a gem!
        if (this.weapons.lightning_magnet.level > 0) {
          this.weaponTimers.lightning_magnet = Math.max(
            0,
            this.weaponTimers.lightning_magnet - 0.22
          );
        }

        if (g.tier === "meat") {
          this.hp = Math.min(this.maxHp, this.hp + 22);
          this.spawnPopup(this.px, this.py - 24, "+22 HP", "#22C55E", true);
          sfx.playGemPickup(8);
          continue;
        }

        if (g.tier === "rune_frenzy") {
          this.frenzyTimer = 9.0;
          this.collectedRunes += 1;
          this.spawnPopup(this.px, this.py - 28, "ẤN CUỒNG LÔI!", "#FACC15", true);
          this.showBanner("Sưu tầm Ấn Cuồng Lôi: +35% Tốc Đánh trong 9s!", 2.0);
          sfx.playEvolutionChest();
          continue;
        }

        if (g.tier === "rune_aegis") {
          this.aegisShield = Math.min(2, this.aegisShield + 1);
          this.collectedRunes += 1;
          this.spawnPopup(this.px, this.py - 28, "ẤN KHIÊN BĂNG!", "#38BDF8", true);
          this.showBanner("Sưu tầm Ấn Khiên Băng: Chặn 1 đòn & Đóng Băng!", 2.0);
          sfx.playEvolutionChest();
          continue;
        }

        if (g.tier === "rune_magnet") {
          this.collectedRunes += 1;
          for (const otherGem of this.gems) {
            if (otherGem.tier === "azure" || otherGem.tier === "gold") {
              otherGem.magnetized = true;
            }
          }
          this.spawnPopup(this.px, this.py - 28, "ẤN HÚT TINH HOA!", "#4ADE80", true);
          this.showBanner("Sưu tầm Ấn Tinh Hoa: Hút toàn bộ ngọc EXP!", 2.0);
          sfx.playEvolutionChest();
          continue;
        }

        if (g.tier === "chest") {
          sfx.playEvolutionChest();
          this.triggerLevelUpModal(true);
          return;
        }

        this.exp += g.value;
        this.gemCombo += 1;
        this.gemComboTimer = 0.65;
        sfx.playGemPickup(this.gemCombo);

        if (this.exp >= this.expToNext) {
          this.exp -= this.expToNext;
          this.level += 1;
          this.expToNext = Math.round(
            28 + this.level * 22 + Math.pow(this.level, 1.55) * 8
          );
          this.triggerLevelUpModal(false);
          return;
        }
      }
    }
  }

  public triggerLevelUpModal(fromChest = false): void {
    sfx.playLevelUp();
    this.choices = this.generateUpgradeChoices(fromChest);
    if (this.autoUpgrade && this.choices.length > 0) {
      this.selectUpgradeChoice(this.choices[0], true);
      return;
    }
    this.status = "level_up";
    this.emitSnapshot();
  }

  private generateUpgradeChoices(fromChest = false): UpgradeChoice[] {
    const pool: UpgradeChoice[] = [];
    const minLvForEvo = fromChest ? 3 : 4;

    // 1. Check Weapon Evolutions
    for (const wId of Object.keys(WEAPONS) as WeaponId[]) {
      const st = this.weapons[wId];
      const def = WEAPONS[wId];
      if (
        st.level >= minLvForEvo &&
        !st.evolved &&
        this.passives[def.evolutionPassive] >= 1
      ) {
        pool.push({
          uid: `evo_${wId}`,
          kind: "evolution",
          id: wId,
          title: def.evolvedName,
          badgeText: "Tiến hóa ★",
          desc: def.evolvedDesc,
          icon: def.evolvedIcon,
          nextLevel: 6,
          isEvolution: true,
        });
      }
    }

    // 2. Weapon Upgrades (Cap active weapons at 4 per run so choices stay focused, or allow all if unlocked)
    const ownedWeaponsCount = Object.values(this.weapons).filter(
      (w) => w.level > 0
    ).length;

    for (const wId of Object.keys(WEAPONS) as WeaponId[]) {
      const st = this.weapons[wId];
      const def = WEAPONS[wId];
      if (st.level === 0 && ownedWeaponsCount >= 4) continue;
      if (st.level < 5 && !st.evolved) {
        const nextLv = st.level + 1;
        pool.push({
          uid: `wpn_${wId}_${nextLv}`,
          kind: "weapon",
          id: wId,
          title: def.name,
          badgeText: st.level === 0 ? "Đồ chơi mới" : `Cấp ${nextLv}/5`,
          desc: def.descByLevel[nextLv - 1] || def.descByLevel[0],
          icon: def.icon,
          nextLevel: nextLv,
        });
      }
    }

    // 3. Passive Upgrades
    for (const pId of Object.keys(PASSIVES) as PassiveId[]) {
      const curLv = this.passives[pId];
      const def = PASSIVES[pId];
      if (curLv < def.maxLevel) {
        const nextLv = curLv + 1;
        pool.push({
          uid: `pas_${pId}_${nextLv}`,
          kind: "passive",
          id: pId,
          title: def.name,
          badgeText: curLv === 0 ? "Phụ kiện mới" : `Cấp ${nextLv}/${def.maxLevel}`,
          desc: def.shortDesc,
          icon: def.icon,
          nextLevel: nextLv,
        });
      }
    }

    const evos = pool.filter((c) => c.isEvolution);
    const others = pool.filter((c) => !c.isEvolution);
    for (let i = others.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = others[i];
      others[i] = others[j];
      others[j] = tmp;
    }

    const picked = [...evos, ...others].slice(0, 3);

    while (picked.length < 3) {
      picked.push({
        uid: `heal_${picked.length}`,
        kind: "heal_gold",
        id: "heal",
        title: "Thịt Nướng Thảo Nguyên",
        badgeText: "Hồi phục",
        desc: "Hồi ngay 35 Máu và nhận +35 Vàng.",
        icon: "heart",
        nextLevel: 1,
      });
    }

    return picked;
  }

  public selectUpgradeChoice(choice: UpgradeChoice, emit = true): void {
    const prevSynergies = new Set(this.getActiveSynergies());

    if (choice.kind === "evolution") {
      const wId = choice.id as WeaponId;
      this.weapons[wId].level = 5;
      this.weapons[wId].evolved = true;
      if (!this.newlyUnlocked.includes("Ember • Pháp Sư")) {
        this.newlyUnlocked.push("Ember • Pháp Sư");
      }
      this.showBanner(`Đã tiến hóa: ${choice.title}`, 2.5);
    } else if (choice.kind === "weapon") {
      const wId = choice.id as WeaponId;
      this.weapons[wId].level = choice.nextLevel;
    } else if (choice.kind === "passive") {
      const pId = choice.id as PassiveId;
      this.passives[pId] = choice.nextLevel;
    } else {
      this.hp = Math.min(this.maxHp, this.hp + 35);
      this.gold += 35;
    }

    const nextSynergies = this.getActiveSynergies();
    for (const synId of nextSynergies) {
      if (!prevSynergies.has(synId)) {
        const synDef = WEAPON_SYNERGIES[synId];
        if (!this.newlyUnlocked.includes("Ember • Pháp Sư")) {
          this.newlyUnlocked.push("Ember • Pháp Sư");
        }
        this.showBanner(`KÍCH HOẠT COMBO: ${synDef.name}!`, 2.8);
      }
    }

    this.choices = [];
    this.status = "playing";
    if (emit) {
      this.emitSnapshot();
    }
  }

  private spawnPopup(
    x: number,
    y: number,
    text: string,
    color: string,
    isCrit: boolean
  ): void {
    if (this.popups.length >= 16) {
      this.popups[0] = this.popups[this.popups.length - 1];
      this.popups.pop();
    }
    this.popups.push({
      x,
      y,
      vy: -48,
      text,
      color,
      isCrit,
      life: 0.45,
      maxLife: 0.45,
    });
  }

  private spawnParticle(
    x: number,
    y: number,
    vx: number,
    vy: number,
    size: number,
    color: string,
    life: number
  ): void {
    if (this.particles.length >= 55) {
      this.particles[0] = this.particles[this.particles.length - 1];
      this.particles.pop();
    }
    this.particles.push({
      x,
      y,
      vx,
      vy,
      size,
      color,
      life,
      maxLife: life,
    });
  }

  private updateEffects(dt: number): void {
    for (let i = this.slashes.length - 1; i >= 0; i--) {
      this.slashes[i].life -= dt;
      if (this.slashes[i].life <= 0) {
        this.slashes[i] = this.slashes[this.slashes.length - 1];
        this.slashes.pop();
      }
    }
    for (let i = this.lightningBolts.length - 1; i >= 0; i--) {
      this.lightningBolts[i].life -= dt;
      if (this.lightningBolts[i].life <= 0) {
        this.lightningBolts[i] =
          this.lightningBolts[this.lightningBolts.length - 1];
        this.lightningBolts.pop();
      }
    }
    for (let i = this.frostRings.length - 1; i >= 0; i--) {
      this.frostRings[i].life -= dt;
      if (this.frostRings[i].life <= 0) {
        this.frostRings[i] = this.frostRings[this.frostRings.length - 1];
        this.frostRings.pop();
      }
    }
    for (let i = this.afterimages.length - 1; i >= 0; i--) {
      this.afterimages[i].life -= dt;
      if (this.afterimages[i].life <= 0) {
        this.afterimages[i] = this.afterimages[this.afterimages.length - 1];
        this.afterimages.pop();
      }
    }
    for (let i = this.spriteEffects.length - 1; i >= 0; i--) {
      const fx = this.spriteEffects[i];
      fx.timer += dt;
      if (fx.timer >= fx.frameDuration) {
        fx.timer -= fx.frameDuration;
        fx.frame += 1;
        if (fx.frame >= fx.maxFrames) {
          this.spriteEffects[i] =
            this.spriteEffects[this.spriteEffects.length - 1];
          this.spriteEffects.pop();
        }
      }
    }
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const p = this.popups[i];
      p.life -= dt;
      p.y += p.vy * dt;
      if (p.life <= 0) {
        this.popups[i] = this.popups[this.popups.length - 1];
        this.popups.pop();
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life -= dt;
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      if (pt.life <= 0) {
        this.particles[i] = this.particles[this.particles.length - 1];
        this.particles.pop();
      }
    }
  }

  public emitSnapshot(): void {
    const activeElite = this.enemies.find((e) => e.isElite);
    const maxDashCd = this.getEffectiveDashCooldown();
    this.onSnapshot({
      status: this.status,
      stageId: this.stageId,
      hero: this.hero,
      elapsedSec: this.elapsedSec,
      hp: Math.ceil(this.hp),
      maxHp: Math.ceil(this.maxHp),
      level: this.level,
      exp: this.exp,
      expToNext: this.expToNext,
      kills: this.kills,
      gold: this.gold,
      dashCooldownRatio:
        this.dashCooldown <= 0
          ? 0
          : Math.min(1, this.dashCooldown / maxDashCd),
      weapons: { ...this.weapons },
      passives: { ...this.passives },
      activeSynergies: this.getActiveSynergies(),
      weaponDamage: { ...this.weaponDamage },
      aegisShield: this.aegisShield,
      frenzyTimer: Number(this.frenzyTimer.toFixed(1)),
      collectedRunes: this.collectedRunes,
      objectives: this.mapObjectives.map((o) => ({
        id: o.id,
        kind: o.kind,
        title: o.title,
        subtitle: o.subtitle,
        x: o.x,
        y: o.y,
        hp: o.hp,
        maxHp: o.maxHp,
        completed: o.completed,
      })),
      objectivesCompleted: this.objectivesCompleted,
      bossDefeated: this.bossDefeated,
      newlyUnlocked: [...this.newlyUnlocked],
      choices: [...this.choices],
      eliteActive: activeElite
        ? {
            name: activeElite.title || STAGES[this.stageId].bossName,
            hp: Math.max(0, Math.ceil(activeElite.hp)),
            maxHp: activeElite.maxHp,
          }
        : null,
      bannerText: this.bannerText,
      fps: this.measuredFps,
      frameMs: this.measuredFrameMs,
      updateMs: this.measuredUpdateMs,
      renderMs: this.measuredRenderMs,
      slowFrames: this.slowFrames,
      enemyCount: this.enemies.length,
      projectileCount: this.projectiles.length + this.enemyBombs.length,
      shakeEnabled: this.shakeEnabled,
    });
  }
}
