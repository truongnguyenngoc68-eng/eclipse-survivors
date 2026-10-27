import {
  HEROES,
  STAGES,
  WEAPONS,
  type HeroId,
  type StageId,
  type WeaponId,
} from "./catalog";
import { PETS, getPetForm, type PetUnit } from "./companions";
import type {
  EclipseGameEngine,
  EnemyEntity,
  EquippedVisualSummary,
  ExpGemEntity,
} from "./engine";
import { getGameIconUrl, type GameIconId } from "./icons";
import { spriteAtlas, type SheetKey } from "./sprites";

export interface LandmarkProp {
  kind:
    | "tree"
    | "stump"
    | "ruin_castle"
    | "ruin_tower"
    | "ruin_house"
    | "gold_mine"
    | "rock_large"
    | "signpost"
    | "skull_post"
    | "scarecrow";
  x: number;
  y: number;
  seed: number;
}

// ============================================================================
// INTENTIONAL ASYMMETRIC LAYOUT: "Sân Lâu Đài Đổ Nát" (Ruined Castle Courtyard)
// ============================================================================
// Playable Arena: x ∈ [-640, 640], y ∈ [-430, 460], naturally enclosed by:
// 1. North Boundary & Upper Citadel (y = -430..-760): Continuous Stone Cliff Wall,
//    Offset Keep Stairs (x ≈ +120), NW Gold Mine Quarry & Upper Citadel Plateau
// 2. Asymmetric Central Courtyard: Diagonal NW-to-SE clearing broken up by a
//    NE Ruined Wall Peninsula & SW Pine/Log Tongue (no symmetrical '+' cross!)
// 3. West Quarry Outpost & East Ruined Cloister (x = ±450..±950)
// 4. South Collapsed Gatehouse & Outer Ramparts (y = +260..+720)
const BATTLEFIELD_PROPS: LandmarkProp[] = [
  // --- Asymmetric Central Courtyard & Peninsulas ---
  { kind: "ruin_house", x: 205, y: -145, seed: 1.1 }, // NE Peninsula broken wall cluster
  { kind: "rock_large", x: 145, y: -115, seed: 1.3 },
  { kind: "tree", x: -235, y: -105, seed: 1.6 }, // NW inner courtyard pine (canopy fade)
  { kind: "tree", x: -195, y: 125, seed: 1.9 }, // SW Grass Tongue pine (canopy fade)
  { kind: "stump", x: -125, y: 160, seed: 2.2 },
  { kind: "ruin_castle", x: -345, y: 35, seed: 2.5 }, // West courtyard broken wall
  { kind: "tree", x: 275, y: 95, seed: 2.8 }, // East courtyard pine

  // --- Northern Cliff Line & Offset Keep Terrace (y ≈ -380..-460, Natural N Boundary) ---
  { kind: "ruin_castle", x: 95, y: -455, seed: 3.1 }, // Offset Keep Ruins above stairs
  { kind: "ruin_tower", x: -45, y: -435, seed: 3.4 },
  { kind: "ruin_tower", x: 245, y: -435, seed: 3.7 },
  { kind: "gold_mine", x: -385, y: -355, seed: 4.0 }, // NW Quarry Gold Mine set into the cliff face
  { kind: "tree", x: -215, y: -395, seed: 4.3 },
  { kind: "tree", x: 355, y: -395, seed: 4.6 },
  { kind: "ruin_tower", x: 515, y: -435, seed: 4.9 },
  { kind: "tree", x: -555, y: -410, seed: 5.2 },
  { kind: "tree", x: 645, y: -405, seed: 5.5 },

  // --- Upper Citadel Plateau (y ≈ -540..-760, visible when player walks to North limit) ---
  { kind: "ruin_castle", x: 35, y: -650, seed: 5.8 },
  { kind: "ruin_tower", x: -235, y: -625, seed: 6.1 },
  { kind: "ruin_tower", x: 305, y: -620, seed: 6.4 },
  { kind: "gold_mine", x: -520, y: -615, seed: 6.7 },
  { kind: "ruin_house", x: 525, y: -605, seed: 7.0 },
  { kind: "tree", x: -115, y: -585, seed: 7.3 },
  { kind: "tree", x: 185, y: -580, seed: 7.6 },
  { kind: "tree", x: -380, y: -565, seed: 7.9 },
  { kind: "tree", x: 420, y: -565, seed: 8.2 },
  { kind: "tree", x: -670, y: -590, seed: 8.5 },
  { kind: "tree", x: 675, y: -585, seed: 8.8 },
  { kind: "rock_large", x: -45, y: -555, seed: 9.1 },
  { kind: "scarecrow", x: -310, y: -535, seed: 9.4 },

  // --- Western Quarry & Outpost Boundary (x ≈ -450..-960) ---
  { kind: "ruin_house", x: -535, y: -195, seed: 9.7 },
  { kind: "scarecrow", x: -435, y: -235, seed: 10.0 },
  { kind: "tree", x: -485, y: -75, seed: 10.3 },
  { kind: "rock_large", x: -575, y: -35, seed: 10.6 },
  { kind: "ruin_castle", x: -565, y: 225, seed: 10.9 },
  { kind: "skull_post", x: -425, y: 245, seed: 11.2 },
  { kind: "tree", x: -695, y: -245, seed: 11.5 },
  { kind: "gold_mine", x: -785, y: -95, seed: 11.8 },
  { kind: "tree", x: -725, y: 95, seed: 12.1 },
  { kind: "tree", x: -685, y: 345, seed: 12.4 },
  { kind: "ruin_tower", x: -865, y: -285, seed: 12.7 },
  { kind: "tree", x: -910, y: -45, seed: 13.0 },
  { kind: "tree", x: -885, y: 215, seed: 13.3 },

  // --- Eastern Ruined Cloister & Watchtower Boundary (x ≈ +450..+960) ---
  { kind: "ruin_castle", x: 545, y: -185, seed: 13.6 },
  { kind: "tree", x: 445, y: -265, seed: 13.9 },
  { kind: "signpost", x: 430, y: -45, seed: 14.2 },
  { kind: "tree", x: 515, y: 45, seed: 14.5 },
  { kind: "ruin_house", x: 535, y: 235, seed: 14.8 },
  { kind: "stump", x: 415, y: 265, seed: 15.1 },
  { kind: "ruin_tower", x: 735, y: -235, seed: 15.4 },
  { kind: "tree", x: 695, y: -75, seed: 15.7 },
  { kind: "ruin_castle", x: 765, y: 125, seed: 16.0 },
  { kind: "tree", x: 695, y: 325, seed: 16.3 },
  { kind: "tree", x: 895, y: -155, seed: 16.6 },
  { kind: "tree", x: 885, y: 195, seed: 16.9 },

  // --- Southern Collapsed Gatehouse & Outer Ramparts (y ≈ +260..+720) ---
  { kind: "ruin_tower", x: -85, y: 295, seed: 17.2 }, // Standing West Gate Tower
  { kind: "ruin_castle", x: 285, y: 265, seed: 17.5 }, // Collapsed East Gate Bastion
  { kind: "signpost", x: 35, y: 255, seed: 17.8 },
  { kind: "skull_post", x: 185, y: 285, seed: 18.1 },
  { kind: "tree", x: -295, y: 335, seed: 18.4 },
  { kind: "tree", x: 435, y: 365, seed: 18.7 },
  { kind: "ruin_house", x: -445, y: 485, seed: 19.0 },
  { kind: "ruin_castle", x: -95, y: 545, seed: 19.3 },
  { kind: "ruin_tower", x: 315, y: 535, seed: 19.6 },
  { kind: "tree", x: -265, y: 565, seed: 19.9 },
  { kind: "tree", x: 115, y: 585, seed: 20.2 },
  { kind: "tree", x: 495, y: 555, seed: 20.5 },
  { kind: "tree", x: -585, y: 595, seed: 20.8 },
  { kind: "tree", x: -25, y: 695, seed: 21.1 },
  { kind: "tree", x: 245, y: 685, seed: 21.4 },
];

// ============================================================================
// PRE-BAKED AUTOTILE BATTLEFIELD CANVAS (3840 x 3072 = 60 x 48 tiles of 64x64)
// Built once when TinySwordsAtlas finishes loading.
// Covers [-1920..1920, -1536..1536] so the camera NEVER hits a canvas edge!
// ============================================================================
const WORLD_HALF_W = 1920;
const WORLD_HALF_H = 1536;
const TILE_SZ = 64;
const bakedTerrainByStage: Partial<Record<StageId, HTMLCanvasElement>> = {};

function drawRawTile(
  ctx: CanvasRenderingContext2D,
  sheetKey: SheetKey,
  tileCol: number,
  tileRow: number,
  destX: number,
  destY: number,
  alpha = 1
): void {
  const sheet = spriteAtlas.sheets[sheetKey];
  if (!sheet) return;
  if (alpha < 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
  }
  ctx.drawImage(
    sheet.img,
    tileCol * TILE_SZ,
    tileRow * TILE_SZ,
    TILE_SZ,
    TILE_SZ,
    destX,
    destY,
    TILE_SZ,
    TILE_SZ
  );
  if (alpha < 1) {
    ctx.restore();
  }
}

/**
 * Stamps an elevated stone bastion / terrace using tilemap_elevation.png (4x8 of 64x64):
 * - Top stone surface: rows 0..2, cols 0..2
 * - Front stone cliff wall along bottom row (gy + gh): row 3, cols 0..2
 * - Optional carved stone stairs (row 7, cols 0..2) at stairOffsetX
 */
function stampStoneBastion(
  ctx: CanvasRenderingContext2D,
  gx: number,
  gy: number,
  gw: number,
  gh: number,
  stairDx: number | null = null
): void {
  const w = Math.max(2, gw);
  const h = Math.max(2, gh);

  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      const col = dx === 0 ? 0 : dx === w - 1 ? 2 : 1;
      const row = dy === 0 ? 0 : dy === h - 1 ? 2 : 1;
      const px = WORLD_HALF_W + (gx + dx) * TILE_SZ;
      const py = WORLD_HALF_H + (gy + dy) * TILE_SZ;
      drawRawTile(ctx, "tilemap_elevation", col, row, px, py);
    }
  }

  // Front stone cliff face immediately below the platform
  for (let dx = 0; dx < w; dx++) {
    const col = dx === 0 ? 0 : dx === w - 1 ? 2 : 1;
    const px = WORLD_HALF_W + (gx + dx) * TILE_SZ;
    const py = WORLD_HALF_H + (gy + h) * TILE_SZ;
    drawRawTile(ctx, "tilemap_elevation", col, 3, px, py);
  }

  // Optional carved stone stairs over the cliff face
  if (stairDx !== null && stairDx >= 0 && stairDx + 1 < w) {
    const sx = WORLD_HALF_W + (gx + stairDx) * TILE_SZ;
    const sy = WORLD_HALF_H + (gy + h - 1) * TILE_SZ;
    drawRawTile(ctx, "tilemap_elevation", 0, 7, sx, sy);
    drawRawTile(ctx, "tilemap_elevation", 2, 7, sx + TILE_SZ, sy);
    drawRawTile(ctx, "tilemap_elevation", 0, 7, sx, sy + TILE_SZ);
    drawRawTile(ctx, "tilemap_elevation", 2, 7, sx + TILE_SZ, sy + TILE_SZ);
  }
}

/**
 * Draws an interior 64x64 grass or earth cell by sampling four 32x32 sub-quadrants
 * from the safe interior [40..120, 40..120] of the 3x3 autotile block with a
 * deterministic per-cell phase shift so horizontal rows NEVER align or stripe!
 */
function drawStaggeredInteriorTile(
  ctx: CanvasRenderingContext2D,
  sheetKey: "tilemap_grass" | "tilemap_sand",
  destX: number,
  destY: number,
  c: number,
  r: number
): void {
  const sheet = spriteAtlas.sheets[sheetKey];
  if (!sheet) return;

  for (let qy = 0; qy < 2; qy++) {
    for (let qx = 0; qx < 2; qx++) {
      const hash =
        ((c * 37 + r * 53 + qx * 19 + qy * 29) & 0x7fffffff) % 41;
      const sx = 44 + ((hash * 7) % 64);
      const sy = 44 + ((hash * 13 + c * 17) % 64);
      ctx.drawImage(
        sheet.img,
        sx,
        sy,
        32,
        32,
        destX + qx * 32,
        destY + qy * 32,
        32,
        32
      );
    }
  }
}

function getBakedTerrainCanvas(stageId: StageId = "courtyard"): HTMLCanvasElement | null {
  if (bakedTerrainByStage[stageId]) return bakedTerrainByStage[stageId]!;
  if (!spriteAtlas.ready) return null;

  const cvs = document.createElement("canvas");
  cvs.width = WORLD_HALF_W * 2;
  cvs.height = WORLD_HALF_H * 2;
  const ctx = cvs.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;

  const cols = cvs.width / TILE_SZ; // 60
  const rows = cvs.height / TILE_SZ; // 48
  const centerCol = cols / 2; // 30
  const centerRow = rows / 2; // 24

  if (stageId === "mushroom_woods") {
    // STAGE 2: Rừng Nấm Độc — Winding paths around glowing purple poison swamps
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        drawStaggeredInteriorTile(ctx, "tilemap_grass", c * TILE_SZ, r * TILE_SZ, c, r);
      }
    }
    ctx.fillStyle = "rgba(18, 42, 34, 0.58)";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    // Glowing toxic marsh pools & channels
    const marshPools: ReadonlyArray<readonly [number, number, number, number]> = [
      [-285, -165, 195, 115],
      [255, -210, 185, 110],
      [215, 195, 205, 120],
      [-320, 210, 165, 95],
      [0, -340, 220, 85],
      [-45, 310, 210, 90],
    ];
    for (const [mx, my, rx, ry] of marshPools) {
      const px = WORLD_HALF_W + mx;
      const py = WORLD_HALF_H + my;
      ctx.save();
      ctx.fillStyle = "#1E1035";
      ctx.beginPath();
      ctx.ellipse(px, py, rx + 18, ry + 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#3B0764";
      ctx.beginPath();
      ctx.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(168, 85, 247, 0.38)";
      ctx.strokeStyle = "#C084FC";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(px, py, rx * 0.72, ry * 0.72, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Winding forest trail connecting the 3 Spore Nests & central clearing
    const trailNodes: ReadonlyArray<readonly [number, number, number]> = [
      [-420, -40, 85], [-260, -20, 80], [-120, -10, 95], [0, 0, 135],
      [140, -30, 85], [280, -40, 80], [60, 120, 85], [140, 210, 85],
      [-140, 130, 80], [-60, -170, 80], [90, -180, 80],
    ];
    for (const [tx, ty, tr] of trailNodes) {
      ctx.save();
      ctx.fillStyle = "rgba(54, 41, 28, 0.72)";
      ctx.beginPath();
      ctx.ellipse(WORLD_HALF_W + tx, WORLD_HALF_H + ty, tr, tr * 0.68, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Scattered glowing fungal spores on the forest floor
    for (let i = 0; i < 65; i++) {
      const gx = ((i * 173) % 1500) - 750;
      const gy = ((i * 257) % 1100) - 550;
      const key: SheetKey = i % 2 === 0 ? "deco_01" : "deco_02";
      spriteAtlas.drawCell(ctx, key, 0, 0, 64, 64, WORLD_HALF_W + gx, WORLD_HALF_H + gy, 48, 48);
    }

    bakedTerrainByStage[stageId] = cvs;
    return cvs;
  }

  if (stageId === "abandoned_mine") {
    // STAGE 3: Hầm Mỏ Tinh Thể — Cavern corridors, narrow bridges over chasms & crystal veins
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        drawStaggeredInteriorTile(ctx, "tilemap_sand", c * TILE_SZ, r * TILE_SZ, c, r);
      }
    }
    ctx.fillStyle = "rgba(28, 22, 18, 0.76)";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    // Deep underground chasm trenches flanking the central mining bridges
    const chasms: ReadonlyArray<readonly [number, number, number, number]> = [
      [-680, -290, 440, 130],
      [240, -290, 440, 130],
      [-680, 175, 420, 140],
      [260, 175, 420, 140],
    ];
    for (const [cx, cy, cw, ch] of chasms) {
      const px = WORLD_HALF_W + cx;
      const py = WORLD_HALF_H + cy;
      ctx.fillStyle = "#09070B";
      ctx.fillRect(px, py, cw, ch);
      ctx.strokeStyle = "#44403C";
      ctx.lineWidth = 4;
      ctx.strokeRect(px, py, cw, ch);
      // Glowing crystal veins inside chasm depths
      ctx.fillStyle = "rgba(245, 158, 11, 0.25)";
      ctx.fillRect(px + 24, py + 24, cw - 48, ch - 48);
    }

    // Carved stone bridges & central excavation corridors
    stampStoneBastion(ctx, -3, -5, 6, 3, 2);
    stampStoneBastion(ctx, -3, 2, 6, 3, 2);
    stampStoneBastion(ctx, -11, -2, 4, 3, null);
    stampStoneBastion(ctx, 7, -2, 4, 3, null);

    // Amber lantern light pools & ore rubble along the corridors
    const lightPools = [
      [-260, -185], [275, 165], [-310, 145], [310, -145], [0, 0],
    ];
    for (const [lx, ly] of lightPools) {
      const grad = ctx.createRadialGradient(
        WORLD_HALF_W + lx, WORLD_HALF_H + ly, 10,
        WORLD_HALF_W + lx, WORLD_HALF_H + ly, 155
      );
      grad.addColorStop(0, "rgba(251, 191, 36, 0.28)");
      grad.addColorStop(1, "rgba(251, 191, 36, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(WORLD_HALF_W + lx, WORLD_HALF_H + ly, 155, 0, Math.PI * 2);
      ctx.fill();
    }

    bakedTerrainByStage[stageId] = cvs;
    return cvs;
  }

  if (stageId === "ice_citadel") {
    // STAGE 4: Thành Băng Vĩnh Cửu — Frozen sapphire lake, snowfield ruins & 4 warm brazier plazas
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        drawStaggeredInteriorTile(ctx, "tilemap_sand", c * TILE_SZ, r * TILE_SZ, c, r);
      }
    }
    // Crisp snowfield tint over tile texture
    ctx.fillStyle = "rgba(218, 238, 252, 0.74)";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    // Central Frozen Sapphire Lake with specular ice cracks
    const cx = WORLD_HALF_W;
    const cy = WORLD_HALF_H;
    ctx.save();
    ctx.fillStyle = "#0284C7";
    ctx.beginPath();
    ctx.ellipse(cx, cy, 340, 205, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#38BDF8";
    ctx.beginPath();
    ctx.ellipse(cx, cy, 310, 180, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(224, 242, 254, 0.55)";
    ctx.beginPath();
    ctx.ellipse(cx - 45, cy - 25, 210, 110, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#E0F2FE";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - 220, cy - 40);
    ctx.lineTo(cx - 40, cy + 15);
    ctx.lineTo(cx + 185, cy - 55);
    ctx.moveTo(cx - 40, cy + 15);
    ctx.lineTo(cx + 95, cy + 110);
    ctx.stroke();
    ctx.restore();

    // Elevated Glacial Bastions framing the citadel
    stampStoneBastion(ctx, -12, -8, 8, 2, 3);
    stampStoneBastion(ctx, 4, -8, 8, 2, 3);
    stampStoneBastion(ctx, -12, 6, 7, 2, null);
    stampStoneBastion(ctx, 5, 6, 7, 2, null);

    // Warm stone plazas under the 4 Heater Braziers ([-210,-120], [210,-120], [-210,130], [210,130])
    for (const [bx, by] of [[-210, -120], [210, -120], [-210, 130], [210, 130]]) {
      const px = WORLD_HALF_W + bx;
      const py = WORLD_HALF_H + by;
      ctx.fillStyle = "rgba(120, 53, 15, 0.45)";
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(px, py, 68, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    bakedTerrainByStage[stageId] = cvs;
    return cvs;
  }

  if (stageId === "dark_fortress") {
    // STAGE 5: Pháo Đài Hư Không — Floating obsidian islands over a cosmic void abyss + energy bridges
    ctx.fillStyle = "#070410";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    // Cosmic nebula stars in the abyss
    for (let i = 0; i < 180; i++) {
      const sx = (i * 197) % cvs.width;
      const sy = (i * 263) % cvs.height;
      ctx.fillStyle = i % 3 === 0 ? "#A855F7" : i % 3 === 1 ? "#F43F5E" : "#E2E8F0";
      ctx.fillRect(sx, sy, i % 4 === 0 ? 3 : 2, i % 4 === 0 ? 3 : 2);
    }

    // Glowing arcane energy bridges connecting the floating islands
    const bridges: ReadonlyArray<readonly [number, number, number, number]> = [
      [-320, -165, 0, 0],
      [320, -165, 0, 0],
      [0, 0, 0, 225],
      [-360, 40, 0, 0],
      [360, 40, 0, 0],
    ];
    for (const [x1, y1, x2, y2] of bridges) {
      ctx.save();
      ctx.strokeStyle = "rgba(168, 85, 247, 0.52)";
      ctx.lineWidth = 44;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(WORLD_HALF_W + x1, WORLD_HALF_H + y1);
      ctx.lineTo(WORLD_HALF_W + x2, WORLD_HALF_H + y2);
      ctx.stroke();
      ctx.strokeStyle = "#E9D5FF";
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 10]);
      ctx.stroke();
      ctx.restore();
    }

    // 5 Floating Obsidian Citadel Platforms
    const islands: ReadonlyArray<readonly [number, number, number, number, string]> = [
      [0, 0, 235, 155, "#A855F7"],        // Central Nexus Sanctuary
      [-320, -165, 145, 98, "#EC4899"],   // NW Core [1] Platform
      [320, -165, 145, 98, "#EC4899"],    // NE Core [2] Platform
      [0, 225, 165, 105, "#F43F5E"],      // South Blood Altar Platform
      [-360, 40, 110, 78, "#38BDF8"],     // West Void Portal Platform
      [360, 40, 110, 78, "#38BDF8"],      // East Void Portal Platform
    ];
    for (const [ix, iy, rx, ry, borderCol] of islands) {
      const px = WORLD_HALF_W + ix;
      const py = WORLD_HALF_H + iy;
      ctx.save();
      ctx.fillStyle = "#181028";
      ctx.beginPath();
      ctx.ellipse(px, py + 14, rx + 8, ry + 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#261A3B";
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Arcane geometric circle inscribed on each platform
      ctx.strokeStyle = borderCol + "66";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(px, py, rx * 0.68, ry * 0.68, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    bakedTerrainByStage[stageId] = cvs;
    return cvs;
  }

  // ==========================================================================
  // STAGE 1: "courtyard" — Thành Trì Bị Vây (Default Castle Courtyard)
  // ==========================================================================
  // 1. Fill entire base with staggered interior warm earth (ZERO internal seams or row stripes!)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      drawStaggeredInteriorTile(
        ctx,
        "tilemap_sand",
        c * TILE_SZ,
        r * TILE_SZ,
        c,
        r
      );
    }
  }

  // 2. Build a unified 2D Grass Mask (isGrass[r][c]) and carve an ASYMMETRIC,
  // organic Ruined Castle Courtyard + Diagonal Roads + Outer Sanctuary Clearings
  const isGrass: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(true)
  );

  const carveDirtRect = (gx: number, gy: number, gw: number, gh: number) => {
    for (let dy = 0; dy < gh; dy++) {
      for (let dx = 0; dx < gw; dx++) {
        const c = centerCol + gx + dx;
        const r = centerRow + gy + dy;
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          isGrass[r][c] = false;
        }
      }
    }
  };

  const restoreGrassRect = (gx: number, gy: number, gw: number, gh: number) => {
    for (let dy = 0; dy < gh; dy++) {
      for (let dx = 0; dx < gw; dx++) {
        const c = centerCol + gx + dx;
        const r = centerRow + gy + dy;
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          isGrass[r][c] = true;
        }
      }
    }
  };

  // --- A. Asymmetric Central Courtyard (Diagonal NW-to-SE sweep, NOT a '+' cross!) ---
  carveDirtRect(-5, -4, 7, 4); // NW Courtyard Bowl
  carveDirtRect(-3, -2, 7, 4); // Central Combat Clearing
  carveDirtRect(-1, 0, 6, 4); // SE Courtyard Bowl
  carveDirtRect(0, -6, 5, 3); // Offset NE Keep Forecourt leading to Stone Stairs (x ≈ +96)

  // Intrude lush Grass Peninsulas into the Courtyard to break symmetry!
  restoreGrassRect(2, -3, 3, 2); // NE Ruined Wall Grass Peninsula jutting into courtyard
  restoreGrassRect(-5, 1, 3, 2); // SW Pine & Fallen Log Grass Tongue jutting into courtyard

  // --- B. Diagonal Northwest Quarry & Gold Mine Road ---
  carveDirtRect(-8, -6, 4, 3);
  carveDirtRect(-11, -5, 4, 3);
  carveDirtRect(-13, -3, 4, 3);

  // --- C. Western Outpost & Ruined Camp Clearing ---
  carveDirtRect(-9, -1, 4, 2);
  carveDirtRect(-11, 1, 4, 3);
  carveDirtRect(-8, 3, 3, 3);

  // --- D. Eastern Ruined Cloister & Watchtower Trail ---
  carveDirtRect(5, -2, 4, 3);
  carveDirtRect(8, -5, 4, 4);
  carveDirtRect(8, 1, 4, 3);

  // --- E. Asymmetric Southern Gatehouse & Outer Rampart Roads ---
  carveDirtRect(0, 4, 4, 3); // Diagonal SE exit road
  carveDirtRect(-2, 6, 4, 3);
  carveDirtRect(-5, 7, 4, 3); // SW Gate Outpost clearing
  carveDirtRect(2, 7, 4, 4); // SE Outer Gate road
  carveDirtRect(-1, 10, 4, 4);

  // --- F. Upper Northern Citadel Plateau (y = -520..-860, above the Northern Cliff) ---
  // So walking all the way North shows a complete Upper Citadel & Mountain Pass, never empty grass!
  carveDirtRect(-4, -12, 9, 3);
  carveDirtRect(-8, -11, 5, 2);
  carveDirtRect(4, -11, 5, 2);
  carveDirtRect(-2, -15, 6, 3);

  // 3. Render the unified Grass Layer in a single 4-neighbor autotile pass!
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!isGrass[r][c]) continue;
      const up = r === 0 ? true : isGrass[r - 1][c];
      const down = r === rows - 1 ? true : isGrass[r + 1][c];
      const left = c === 0 ? true : isGrass[r][c - 1];
      const right = c === cols - 1 ? true : isGrass[r][c + 1];

      let col = 1;
      let row = 1;
      if (!up && !down && !left && !right) {
        col = 3;
        row = 3;
      } else if (!up && !down) {
        row = 3;
        col = !left ? 0 : !right ? 2 : 1;
      } else if (!left && !right) {
        col = 3;
        row = !up ? 0 : !down ? 2 : 1;
      } else {
        col = !left ? 0 : !right ? 2 : 1;
        row = !up ? 0 : !down ? 2 : 1;
      }

      if (col === 1 && row === 1) {
        // Pure interior grass: use phase-staggered quadrants so rows never stripe!
        drawStaggeredInteriorTile(
          ctx,
          "tilemap_grass",
          c * TILE_SZ,
          r * TILE_SZ,
          c,
          r
        );
      } else {
        drawRawTile(ctx, "tilemap_grass", col, row, c * TILE_SZ, r * TILE_SZ);
      }
    }
  }

  // 4. Stamp Continuous Natural Perimeter Stone Cliffs, Broken Ramparts & Carved Stairs
  // --- Continuous Northern Boundary Cliff Wall (gy = -8, front cliff base at y = -320) ---
  stampStoneBastion(ctx, -14, -8, 13, 2, null); // West & NW Gold Mine Cliff Wall
  stampStoneBastion(ctx, -1, -8, 7, 2, 2); // Offset Keep Terrace with Carved Stone Stairs
  stampStoneBastion(ctx, 6, -8, 8, 2, null); // NE Watchtower Cliff Wall

  // --- Upper Citadel Inner Keep Platform (y ≈ -896..-768, visible above N cliff) ---
  stampStoneBastion(ctx, -2, -14, 6, 2, 2);
  stampStoneBastion(ctx, -10, -13, 4, 2, null);
  stampStoneBastion(ctx, 6, -13, 4, 2, null);

  // --- Western & Eastern Natural Boundary Cliff Bastions (x ≈ ±700..±890) ---
  stampStoneBastion(ctx, -14, -5, 3, 3, null);
  stampStoneBastion(ctx, -13, 2, 3, 2, null);
  stampStoneBastion(ctx, 11, -5, 3, 3, null);
  stampStoneBastion(ctx, 10, 2, 3, 2, null);

  // --- Asymmetric Inner Courtyard & Southern Gatehouse Bastions ---
  stampStoneBastion(ctx, -3, 4, 2, 2, null); // Standing West Gate Pillar Base
  stampStoneBastion(ctx, 4, 3, 2, 2, null); // Offset East Collapsed Gate Base
  stampStoneBastion(ctx, -9, 7, 4, 2, null); // SW Outer Rampart Wall
  stampStoneBastion(ctx, -3, 8, 4, 2, 1); // South Outer Rampart with Steps
  stampStoneBastion(ctx, 4, 8, 5, 2, null); // SE Outer Rampart Wall

  // 5. Intentional Regional Ground Details across ALL Reachable & Visible Zones
  // Region A: Pebble & worn earth tufts along roads, stairs, quarry & upper citadel
  const earthTuftCoords = [
    [-265, -245],
    [-145, -180],
    [85, -310],
    [175, -285],
    [-35, -45],
    [95, 45],
    [195, 135],
    [-95, 215],
    [145, 235],
    [-465, -295],
    [-585, -155],
    [-535, 125],
    [435, -85],
    [575, -195],
    [545, 115],
    [-195, -565],
    [115, -575],
    [-415, -535],
    [365, -535],
    [-185, 445],
    [195, 465],
  ];
  for (const [ex, ey] of earthTuftCoords) {
    drawRawTile(
      ctx,
      "tilemap_sand",
      4,
      0,
      Math.round(WORLD_HALF_W + ex - 32),
      Math.round(WORLD_HALF_H + ey - 32),
      0.86
    );
  }

  // Region B: Grass blade tufts & bush clusters grouped near ruins, cliffs & tree groves
  const grassClusterCoords = [
    [185, -145], // NE Ruined Wall Peninsula
    [255, -115],
    [-185, 125], // SW Grass Tongue
    [-255, 165],
    [-255, -115], // NW Courtyard edge
    [-335, 45],
    [-215, -385], // North Cliff base
    [355, -385],
    [-525, -385],
    [545, -385],
    [-125, -575], // Upper Citadel Plateau
    [195, -575],
    [-365, -555],
    [415, -555],
    [-495, -215], // West Quarry & Camp
    [-465, -55],
    [-545, 235],
    [455, -245], // East Cloister
    [525, 65],
    [515, 245],
    [-285, 345], // South Gatehouse & Ramparts
    [315, 285],
    [-245, 545],
    [285, 535],
  ];
  for (let i = 0; i < grassClusterCoords.length; i++) {
    const [gx, gy] = grassClusterCoords[i];
    drawRawTile(
      ctx,
      "tilemap_grass",
      4,
      0,
      Math.round(WORLD_HALF_W + gx - 32),
      Math.round(WORLD_HALF_H + gy - 32),
      0.92
    );
    const bushKey: SheetKey =
      i % 3 === 0 ? "deco_07" : i % 3 === 1 ? "deco_08" : "deco_09";
    spriteAtlas.drawCell(
      ctx,
      bushKey,
      0,
      0,
      64,
      64,
      WORLD_HALF_W + gx + (i % 2 === 0 ? 24 : -24),
      WORLD_HALF_H + gy + 12,
      46,
      46
    );
  }

  // Region C: Stone rubble, quarry rocks & woodland mushrooms near landmarks
  const rockClusterCoords: Array<[number, number, SheetKey]> = [
    [155, -125, "deco_06"], // NE Peninsula rubble
    [235, -160, "deco_04"],
    [-155, 145, "deco_01"], // SW Tongue mushroom
    [-225, -80, "deco_02"], // NW Pine mushroom
    [45, -345, "deco_06"], // North Keep Steps rubble
    [225, -345, "deco_05"],
    [-355, -375, "deco_06"], // NW Gold Mine ore rocks
    [-425, -365, "deco_04"],
    [-55, -565, "deco_06"], // Upper Citadel rocks
    [145, -565, "deco_05"],
    [-520, -165, "deco_06"], // West Quarry rocks
    [-490, -145, "deco_04"],
    [515, -155, "deco_06"], // East Cloister rocks
    [545, -135, "deco_05"],
    [-115, 315, "deco_06"], // South Gatehouse rubble
    [255, 285, "deco_05"],
  ];
  for (const [rx, ry, rKey] of rockClusterCoords) {
    spriteAtlas.drawCell(
      ctx,
      rKey,
      0,
      0,
      64,
      64,
      WORLD_HALF_W + rx,
      WORLD_HALF_H + ry,
      44,
      44
    );
  }

  bakedTerrainByStage[stageId] = cvs;
  return cvs;
}

type DepthRenderable =
  | { kind: "prop"; y: number; prop: LandmarkProp }
  | { kind: "enemy"; y: number; e: EnemyEntity }
  | { kind: "pet"; y: number; pet: PetUnit }
  | { kind: "hero"; y: number };

const SHARED_DEPTH_LIST: DepthRenderable[] = [];

const COURTYARD_BRAZIERS: ReadonlyArray<readonly [number, number, number]> = [
  [45, -335, 0], // Left of North Keep Stairs
  [195, -335, 3], // Right of North Keep Stairs
  [165, -135, 5], // NE Ruined Wall Peninsula
  [-35, 275, 2], // South Gatehouse Tower
  [-315, -335, 4], // NW Gold Mine Entrance
];

export function renderEclipseWorld(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number,
  engine: EclipseGameEngine,
  nowMs: number
): void {
  const t0 = performance.now();
  spriteAtlas.ensureLoaded();

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  // Fallback base fill matching current stage palette
  ctx.fillStyle =
    engine.stageId === "mushroom_woods"
      ? "#182822"
      : engine.stageId === "abandoned_mine"
      ? "#1E1916"
      : engine.stageId === "ice_citadel"
      ? "#B8D8EE"
      : engine.stageId === "dark_fortress"
      ? "#070410"
      : "#54764C";
  ctx.fillRect(0, 0, viewW, viewH);

  // Camera center with optional screen shake, clamped to baked terrain bounds
  const shakeX =
    engine.shakeEnabled && engine.shakeTime > 0
      ? Math.round((Math.random() - 0.5) * 2 * engine.shakeIntensity)
      : 0;
  const shakeY =
    engine.shakeEnabled && engine.shakeTime > 0
      ? Math.round((Math.random() - 0.5) * 2 * engine.shakeIntensity)
      : 0;

  const rawCamX = Math.round(engine.px - viewW / 2 + shakeX);
  const rawCamY = Math.round(engine.py - viewH / 2 + shakeY);
  const camX =
    viewW < WORLD_HALF_W * 2
      ? Math.max(-WORLD_HALF_W, Math.min(WORLD_HALF_W - viewW, rawCamX))
      : rawCamX;
  const camY =
    viewH < WORLD_HALF_H * 2
      ? Math.max(-WORLD_HALF_H, Math.min(WORLD_HALF_H - viewH, rawCamY))
      : rawCamY;

  ctx.save();
  ctx.translate(-camX, -camY);

  // 1. Blit Pre-Baked Stage-Specific Terrain (< 0.15ms!)
  const terrain = getBakedTerrainCanvas(engine.stageId);
  if (terrain) {
    ctx.drawImage(terrain, -WORLD_HALF_W, -WORLD_HALF_H);
  }

  // 2. Enemy Dynamite Danger Telegraph Rings (High-Contrast Magenta/Crimson #F43F5E)
  for (const b of engine.enemyBombs) {
    const progress = Math.min(1, b.elapsed / b.duration);
    ctx.save();
    ctx.fillStyle = "rgba(244, 63, 94, 0.2)";
    ctx.strokeStyle = "#F43F5E";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(b.targetX, b.targetY, b.blastRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(236, 72, 153, 0.34)";
    ctx.beginPath();
    ctx.arc(b.targetX, b.targetY, b.blastRadius * progress, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 2b. Expanding Frost Nova Rings (Hàn Băng Hộ Vệ)
  for (const fr of engine.frostRings) {
    const progress = 1 - fr.life / fr.maxLife;
    const curR = fr.maxRadius * (0.25 + progress * 0.75);
    const alpha = Math.max(0, (fr.life / fr.maxLife) * 0.95);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(56, 189, 248, 0.16)";
    ctx.strokeStyle = "#181425";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(Math.round(fr.x), Math.round(fr.y), curR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = fr.color;
    ctx.lineWidth = 3;
    ctx.stroke();

    // 8 Pixel Ice Crystals along ring perimeter
    ctx.fillStyle = "#E0F2FE";
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4 + progress * 0.6;
      const ix = Math.round(fr.x + Math.cos(a) * curR);
      const iy = Math.round(fr.y + Math.sin(a) * curR);
      ctx.fillRect(ix - 3, iy - 3, 6, 6);
    }
    ctx.restore();
  }

  // 2c. Synergy & Oil Torch Fire Patches
  const fireFrame = Math.floor(nowMs / 100) % 7;
  for (const ft of engine.fireTrails) {
    const alpha = Math.min(1, (ft.life / ft.maxLife) * 1.4);
    ctx.save();
    ctx.fillStyle = "rgba(234, 88, 12, 0.22)";
    ctx.strokeStyle = "rgba(251, 146, 60, 0.65)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(Math.round(ft.x), Math.round(ft.y), ft.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    spriteAtlas.drawCell(
      ctx,
      "fire",
      0,
      fireFrame,
      128,
      128,
      ft.x,
      ft.y - 6,
      54,
      54,
      false,
      false,
      alpha
    );
  }

  // 2d. Boss Telegraphed Attack Zones (Line Charge, Wide Cleave, Root Snare, Quake SafeZone & Circle Slam)
  for (const bt of engine.bossTelegraphs) {
    const progress = Math.min(1, bt.elapsed / bt.duration);
    ctx.save();
    if (bt.kind === "line_charge") {
      const ang = Math.atan2(bt.targetY - bt.y, bt.targetX - bt.x);
      const dist = Math.hypot(bt.targetX - bt.x, bt.targetY - bt.y);
      ctx.translate(Math.round(bt.x), Math.round(bt.y));
      ctx.rotate(ang);
      ctx.fillStyle = "rgba(239, 68, 68, 0.24)";
      ctx.strokeStyle = "#EF4444";
      ctx.lineWidth = 2.5;
      ctx.fillRect(0, -bt.radius * 0.6, dist, bt.radius * 1.2);
      ctx.strokeRect(0, -bt.radius * 0.6, dist, bt.radius * 1.2);
      ctx.fillStyle = "rgba(250, 204, 21, 0.38)";
      ctx.fillRect(0, -bt.radius * 0.6, dist * progress, bt.radius * 1.2);
    } else if (bt.kind === "cone_cleave") {
      const ang = Math.atan2(bt.targetY - bt.y, bt.targetX - bt.x);
      ctx.translate(Math.round(bt.x), Math.round(bt.y));
      ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
      ctx.strokeStyle = "#FACC15";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, bt.radius, ang - 0.75, ang + 0.75);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(250, 204, 21, 0.42)";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, bt.radius * progress, ang - 0.75, ang + 0.75);
      ctx.closePath();
      ctx.fill();
    } else if (bt.kind === "root_snare") {
      ctx.fillStyle = "rgba(34, 197, 94, 0.24)";
      ctx.strokeStyle = "#4ADE80";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(Math.round(bt.targetX), Math.round(bt.targetY), bt.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      const vineImg = getCachedAssetImage("/assets/ref_fx/trap_poison_vine.png");
      if (vineImg.complete && vineImg.naturalWidth > 0) {
        ctx.globalAlpha = 0.45 + progress * 0.55;
        ctx.drawImage(
          vineImg,
          Math.round(bt.targetX - bt.radius * 0.65),
          Math.round(bt.targetY - bt.radius * 0.65),
          Math.round(bt.radius * 1.3),
          Math.round(bt.radius * 1.3)
        );
      }
    } else if (bt.kind === "quake_safezone") {
      // Golden Safe Zone telegraph ring during Boss 3 Crystal Golem Slam
      ctx.fillStyle = "rgba(34, 197, 94, 0.22)";
      ctx.strokeStyle = "#4ADE80";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(Math.round(bt.targetX), Math.round(bt.targetY), bt.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.font = "900 12px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#4ADE80";
      ctx.fillText("🛡️ VÙNG AN TOÀN!", Math.round(bt.targetX), Math.round(bt.targetY - bt.radius - 8));
    } else {
      ctx.fillStyle = "rgba(168, 85, 247, 0.22)";
      ctx.strokeStyle = "#EF4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(Math.round(bt.targetX), Math.round(bt.targetY), bt.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(239, 68, 68, 0.36)";
      ctx.beginPath();
      ctx.arc(
        Math.round(bt.targetX),
        Math.round(bt.targetY),
        bt.radius * progress,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    ctx.restore();
  }

  // 2d-ii. Active Safe Zone (Stage 3 Golem Quake) & Player Rooted Vine Overlay (Stage 2)
  if (engine.safeZone && engine.safeZone.timer > 0) {
    ctx.save();
    ctx.fillStyle = "rgba(34, 197, 94, 0.16)";
    ctx.strokeStyle = "#4ADE80";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.arc(Math.round(engine.safeZone.x), Math.round(engine.safeZone.y), engine.safeZone.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = "900 11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#86EFAC";
    ctx.fillText("🛡️ VÙNG AN TOÀN ĐỊA CHẤN", Math.round(engine.safeZone.x), Math.round(engine.safeZone.y - engine.safeZone.radius - 6));
    ctx.restore();
  }

  // 2e-ii. Stage 4 Warmth Heater Braziers (`trụ sưởi`) & Stage 5 Void Portals (`cổng hư không`)
  if (engine.stageId === "ice_citadel" && engine.heaterBraziers.length > 0) {
    const brazierImg = getCachedAssetImage("/assets/wesnoth/scenery/brazier_lit.png");
    const bonfireImg = getCachedAssetImage("/assets/ref_fx/trap_bonfire_spring.png");
    for (const [rawBx, rawBy] of engine.heaterBraziers) {
      const bx = Math.round(rawBx);
      const by = Math.round(rawBy);
      ctx.save();
      const pulse = 1 + Math.sin(nowMs * 0.005) * 0.04;
      ctx.fillStyle = "rgba(251, 146, 60, 0.16)";
      ctx.strokeStyle = "rgba(251, 191, 36, 0.78)";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(bx, by, 135 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      if (bonfireImg.complete && bonfireImg.naturalWidth > 0) {
        ctx.drawImage(bonfireImg, bx - 32, by - 28, 64, 64);
      }
      if (brazierImg.complete && brazierImg.naturalWidth > 0) {
        ctx.drawImage(brazierImg, bx - 28, by - 42, 56, 56);
      }
      spriteAtlas.drawCell(ctx, "fire", 0, fireFrame, 128, 128, bx, by - 22, 48, 48);
      ctx.font = "800 10.5px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#181425";
      ctx.fillText("🔥 TRỤ SƯỞI ẤM (+MÁU/TỐC ĐÁNH)", bx + 1, by - 47);
      ctx.fillStyle = "#FDE047";
      ctx.fillText("🔥 TRỤ SƯỞI ẤM (+MÁU/TỐC ĐÁNH)", bx, by - 48);
      ctx.restore();
    }
  }

  if (engine.stageId === "dark_fortress" && engine.voidPortals.length > 0) {
    const portalImg = getCachedAssetImage("/assets/wesnoth/scenery/void_portal.png");
    for (let idx = 0; idx < engine.voidPortals.length; idx++) {
      const [rawPx, rawPy] = engine.voidPortals[idx];
      const px = Math.round(rawPx);
      const py = Math.round(rawPy);
      const label = idx === 0 ? "🌀 Cổng Hư Không [Tây]" : "🌀 Cổng Hư Không [Đông]";
      ctx.save();
      ctx.translate(px, py);
      ctx.strokeStyle = "#38BDF8";
      ctx.fillStyle = "rgba(56, 189, 248, 0.22)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 42, 26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (portalImg.complete && portalImg.naturalWidth > 0) {
        ctx.save();
        ctx.rotate(nowMs * 0.003);
        ctx.drawImage(portalImg, -32, -32, 64, 64);
        ctx.restore();
      }
      ctx.font = "800 10.5px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#090D16";
      ctx.fillText(label, 1, -35);
      ctx.fillStyle = "#7DD3FC";
      ctx.fillText(label, 0, -36);
      ctx.restore();
    }
  }

  // 2e. Stage 3 Abandoned Mine Railway Tracks & Hurtling Minecarts
  if (engine.stageId === "abandoned_mine") {
    for (const trackY of [-95, 115]) {
      ctx.save();
      ctx.fillStyle = "rgba(41, 37, 36, 0.55)";
      ctx.fillRect(-660, trackY - 12, 1320, 24);
      ctx.strokeStyle = "#78716C";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-660, trackY - 8);
      ctx.lineTo(660, trackY - 8);
      ctx.moveTo(-660, trackY + 8);
      ctx.lineTo(660, trackY + 8);
      ctx.stroke();
      ctx.restore();
    }
    for (const mc of engine.minecarts) {
      ctx.save();
      if (mc.warnTimer > 0) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.28)";
        ctx.fillRect(-650, mc.y - 16, 1300, 32);
      } else {
        const cartImg = getCachedAssetImage("/assets/wesnoth/items/chest-plain-closed.png");
        const anvilImg = getCachedAssetImage("/assets/wesnoth/items/anvil.png");
        ctx.imageSmoothingEnabled = false;
        if (cartImg.complete && cartImg.naturalWidth > 0) {
          ctx.drawImage(cartImg, Math.round(mc.x - 24), Math.round(mc.y - 24), 48, 48);
        }
        if (anvilImg.complete && anvilImg.naturalWidth > 0) {
          ctx.drawImage(anvilImg, Math.round(mc.x - 16), Math.round(mc.y - 28), 32, 32);
        }
      }
      ctx.restore();
    }
  }

  // 2f. Interactive Map Objectives (Camps, Mushroom Nests, Captive Ally, Altar, Barrels, Chests)
  for (const obj of engine.mapObjectives) {
    if (obj.completed) continue;
    const ox = Math.round(obj.x);
    const oy = Math.round(obj.y);

    ctx.save();
    // Poison Spore Cloud (Stage 2) or Freezing Blizzard Aura (Stage 4)
    if (obj.poisonRadius) {
      const isIceStage = engine.stageId === "ice_citadel";
      ctx.fillStyle = isIceStage
        ? "rgba(56, 189, 248, 0.18)"
        : "rgba(147, 51, 234, 0.20)";
      ctx.strokeStyle = isIceStage
        ? "rgba(125, 211, 252, 0.75)"
        : "rgba(192, 132, 252, 0.7)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(ox, oy, obj.poisonRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Objective Ground Ring
    const ringColor =
      obj.kind === "captive_ally"
        ? "#4ADE80"
        : obj.kind === "blood_altar"
        ? "#F43F5E"
        : obj.kind === "challenge_gate"
        ? "#A855F7"
        : "#FACC15";
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(ox, oy + 10, obj.radius, obj.radius * 0.55, 0, 0, Math.PI * 2);
    ctx.stroke();

    if (obj.kind === "monster_camp") {
      if (engine.stageId === "mushroom_woods") {
        const mudImg = getCachedAssetImage("/assets/ref_fx/trap_mud_bath.png");
        const nestImg = getCachedAssetImage("/assets/wesnoth/scenery/spore_nest.png");
        const fungImg = getCachedAssetImage("/assets/wesnoth/monsters/s2_fungus_ab.png");
        if (mudImg.complete && mudImg.naturalWidth > 0) {
          ctx.drawImage(mudImg, ox - 44, oy - 24, 88, 64);
        }
        if (nestImg.complete && nestImg.naturalWidth > 0) {
          ctx.drawImage(nestImg, ox - 36, oy - 36, 72, 72);
        }
        if (fungImg.complete && fungImg.naturalWidth > 0) {
          ctx.drawImage(fungImg, ox - 32, oy - 54, 64, 64);
        }
      } else if (engine.stageId === "ice_citadel") {
        const icePil = getCachedAssetImage("/assets/ref_fx/object_crystal_wall.png");
        const haloImg = getCachedAssetImage("/assets/wesnoth/scenery/ice_halo.png");
        if (haloImg.complete && haloImg.naturalWidth > 0) {
          ctx.drawImage(haloImg, ox - 48, oy - 48, 96, 96);
        }
        if (icePil.complete && icePil.naturalWidth > 0) {
          ctx.drawImage(icePil, ox - 40, oy - 52, 80, 80);
        }
      } else {
        const tentImg = getCachedAssetImage("/assets/wesnoth/scenery/enemy_camp_tent.png");
        if (engine.stageId === "dark_fortress" && (obj.id === 1 || obj.id === 2)) {
          const monoUrl =
            obj.id === 1
              ? "/assets/wesnoth/scenery/void_monolith1.png"
              : "/assets/wesnoth/scenery/void_monolith2.png";
          const monoImg = getCachedAssetImage(monoUrl);
          const runeImg = getCachedAssetImage("/assets/wesnoth/scenery/rune1_glow.png");
          const core1Alive = engine.mapObjectives.some(
            (m) => m.id === 1 && !m.completed
          );
          if (runeImg.complete && runeImg.naturalWidth > 0) {
            ctx.drawImage(runeImg, ox - 32, oy - 20, 64, 64);
          }
          if (monoImg.complete && monoImg.naturalWidth > 0) {
            ctx.drawImage(monoImg, ox - 36, oy - 54, 72, 72);
          }
          if (obj.id === 2 && core1Alive) {
            const haloImg = getCachedAssetImage("/assets/wesnoth/scenery/void_halo.png");
            if (haloImg.complete && haloImg.naturalWidth > 0) {
              ctx.drawImage(haloImg, ox - 48, oy - 56, 96, 96);
            }
            ctx.strokeStyle = "#38BDF8";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(ox, oy - 14, 42, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else if (tentImg.complete && tentImg.naturalWidth > 0) {
          ctx.drawImage(tentImg, ox - 44, oy - 54, 88, 88);
          spriteAtlas.drawCell(ctx, "fire", 0, fireFrame, 128, 128, ox + 16, oy + 4, 42, 42);
        } else {
          spriteAtlas.drawCell(ctx, "ruin_house", 0, 0, 128, 192, ox, oy - 26, 86, 126);
          spriteAtlas.drawCell(ctx, "fire", 0, fireFrame, 128, 128, ox + 16, oy + 4, 42, 42);
        }
      }
    } else if (obj.kind === "captive_ally") {
      const lyraImg = getCachedAssetImage(HEROES.lyra.unitUrl);
      if (lyraImg.complete && lyraImg.naturalWidth > 0) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(lyraImg, ox - 42, oy - 54, 84, 84);
      } else {
        spriteAtlas.drawCell(ctx, "warrior_blue", 0, fireFrame % 6, 192, 192, ox, oy - 6, 98, 98);
      }
      if (obj.progress > 0) {
        ctx.fillStyle = "#181425";
        ctx.fillRect(ox - 26, oy - 48, 52, 7);
        ctx.fillStyle = "#4ADE80";
        ctx.fillRect(ox - 25, oy - 47, Math.round(50 * (obj.progress / 100)), 5);
      }
    } else if (obj.kind === "blood_altar" || obj.kind === "challenge_gate") {
      const altarImg = getCachedAssetImage(
        obj.kind === "blood_altar"
          ? "/assets/wesnoth/items/altar-evil.png"
          : "/assets/wesnoth/items/altar.png"
      );
      if (altarImg.complete && altarImg.naturalWidth > 0) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(altarImg, ox - 32, oy - 44, 64, 64);
      } else {
        spriteAtlas.drawCell(ctx, "deco_16", 0, 0, 64, 128, ox, oy - 22, 54, 108);
      }
      spriteAtlas.drawCell(ctx, "fire", 0, fireFrame, 128, 128, ox, oy - 12, 46, 46);
    } else if (obj.kind === "explosive_barrel") {
      const crystWall = getCachedAssetImage("/assets/ref_fx/object_crystal_wall.png");
      if (crystWall.complete && crystWall.naturalWidth > 0) {
        ctx.drawImage(crystWall, ox + 10, oy - 48, 68, 68);
      }
      const barrelImg = getCachedAssetImage("/assets/wesnoth/items/altar-evil.png");
      if (barrelImg.complete && barrelImg.naturalWidth > 0) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(barrelImg, ox - 26, oy - 36, 52, 52);
      }
      spriteAtlas.drawCell(ctx, "dynamite", 0, fireFrame % 6, 64, 64, ox, oy - 18, 42, 42);
    } else if (obj.kind === "locked_chest") {
      spriteAtlas.drawCell(ctx, "gold_bag", 0, 0, 128, 128, ox, oy - 8, 68, 68);
    }

    // Objective Title & HP Bar
    if (
      obj.kind === "monster_camp" ||
      obj.kind === "locked_chest" ||
      obj.kind === "explosive_barrel" ||
      obj.kind === "challenge_gate"
    ) {
      const bw = 56;
      const bh = 6;
      ctx.fillStyle = "#181425";
      ctx.fillRect(ox - bw / 2 - 1, oy - 46, bw + 2, bh + 2);
      ctx.fillStyle = "#FACC15";
      ctx.fillRect(
        ox - bw / 2,
        oy - 45,
        Math.round(bw * Math.max(0, obj.hp / obj.maxHp)),
        bh
      );
    }

    ctx.font = "800 11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#181425";
    ctx.fillText(obj.title, ox + 1, oy - 51);
    ctx.fillStyle = ringColor;
    ctx.fillText(obj.title, ox, oy - 52);
    ctx.restore();
  }

  // 2g. Active Decoy Bombs (Bom Mồi Nhử) & Pip's Turrets (Ụ Súng)
  for (const db of engine.decoyBombs) {
    ctx.save();
    ctx.strokeStyle = db.isFlamethrower ? "#F97316" : "#38BDF8";
    ctx.fillStyle = db.isFlamethrower
      ? "rgba(249, 115, 22, 0.14)"
      : "rgba(56, 189, 248, 0.14)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(Math.round(db.x), Math.round(db.y), db.pullRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    spriteAtlas.drawCell(
      ctx,
      "dynamite",
      0,
      fireFrame % 6,
      64,
      64,
      db.x,
      db.y - 6,
      50,
      50
    );
    ctx.restore();
  }

  for (const tur of engine.turrets) {
    const tx = Math.round(tur.x);
    const ty = Math.round(tur.y);
    ctx.save();
    ctx.strokeStyle = tur.isRescuedAlly ? "#4ADE80" : "#FACC15";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(tx, ty + 10, 18, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
    if (tur.isRescuedAlly) {
      const lyraImg = getCachedAssetImage(HEROES.lyra.unitUrl);
      if (lyraImg.complete && lyraImg.naturalWidth > 0) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(lyraImg, tx - 40, ty - 52, 80, 80);
      } else {
        spriteAtlas.drawCell(ctx, "warrior_blue", 0, fireFrame % 6, 192, 192, tx, ty - 6, 96, 96);
      }
    } else {
      const baseImg = getCachedAssetImage("/assets/wesnoth/items/anvil.png");
      const topImg = getCachedAssetImage(
        tur.isFlamethrower
          ? "/assets/wesnoth/items/sceptre-of-fire.png"
          : "/assets/wesnoth/icons/magic-missile.png"
      );
      ctx.imageSmoothingEnabled = false;
      if (baseImg.complete && baseImg.naturalWidth > 0) {
        ctx.drawImage(baseImg, tx - 24, ty - 26, 48, 48);
      }
      if (topImg.complete && topImg.naturalWidth > 0) {
        ctx.drawImage(topImg, tx - 14, ty - 38, 28, 28);
      }
    }
    ctx.restore();
  }

  // 2h. Ground-level Ultimate & Beast Nova AoE Rings + Encounter Circle (drawn underneath units!)
  drawSummonGroundEffects(ctx, engine, nowMs);

  // 3. EXP Gems, Meat Heals & Gold Evolution Bags
  for (const g of engine.gems) {
    if (
      g.x < camX - 48 ||
      g.x > camX + viewW + 48 ||
      g.y < camY - 48 ||
      g.y > camY + viewH + 48
    ) {
      continue;
    }
    drawPixelPickup(ctx, g, nowMs);
  }

  // 4. Dash Ghost Afterimages (uses active Hero's authentic Wesnoth sprite)
  const heroUnitImg = getCachedAssetImage(HEROES[engine.hero.id].unitUrl);
  for (const ai of engine.afterimages) {
    const alpha = (ai.life / ai.maxLife) * 0.45;
    if (heroUnitImg.complete && heroUnitImg.naturalWidth > 0) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(Math.round(ai.x), Math.round(ai.y));
      if (ai.facingX < 0) ctx.scale(-1, 1);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(heroUnitImg, -46, -68, 92, 92);
      ctx.restore();
    } else {
      spriteAtlas.drawCell(
        ctx,
        "warrior_blue",
        ai.row,
        ai.col,
        192,
        192,
        ai.x,
        ai.y - 6,
        116,
        116,
        ai.facingX < 0,
        true,
        alpha
      );
    }
  }

  // 5. Y-Depth Sorted Renderables: Landmarks (Trees/Ruins), Enemies, 5 Evolved Beasts, and Hero
  SHARED_DEPTH_LIST.length = 0;
  SHARED_DEPTH_LIST.push({ kind: "hero", y: engine.py });

  for (const pet of engine.pets) {
    SHARED_DEPTH_LIST.push({ kind: "pet", y: pet.y, pet });
  }

  for (const e of engine.enemies) {
    if (
      e.x >= camX - 100 &&
      e.x <= camX + viewW + 100 &&
      e.y >= camY - 100 &&
      e.y <= camY + viewH + 100
    ) {
      SHARED_DEPTH_LIST.push({ kind: "enemy", y: e.y, e });
    }
  }

  for (const prop of BATTLEFIELD_PROPS) {
    if (
      prop.x >= camX - 200 &&
      prop.x <= camX + viewW + 200 &&
      prop.y >= camY - 220 &&
      prop.y <= camY + viewH + 220
    ) {
      SHARED_DEPTH_LIST.push({ kind: "prop", y: prop.y, prop });
    }
  }

  SHARED_DEPTH_LIST.sort((a, b) => a.y - b.y);

  for (const item of SHARED_DEPTH_LIST) {
    if (item.kind === "prop") {
      drawLandmarkProp(ctx, item.prop, engine, nowMs);
    } else if (item.kind === "enemy") {
      drawPixelEnemy(ctx, item.e, engine.stageId);
    } else if (item.kind === "pet") {
      drawSinglePetUnit(ctx, item.pet, nowMs);
    } else {
      drawPixelHero(ctx, engine, nowMs);
    }
  }

  // 5b. Live Flickering Courtyard Braziers (fire.png) — ONLY on Stage 1 Castle Courtyard!
  if (engine.stageId === "courtyard") {
    for (const [bx, by, offset] of COURTYARD_BRAZIERS) {
      if (
        bx >= camX - 64 &&
        bx <= camX + viewW + 64 &&
        by >= camY - 64 &&
        by <= camY + viewH + 64
      ) {
        spriteAtlas.drawCell(
          ctx,
          "fire",
          0,
          (fireFrame + offset) % 7,
          128,
          128,
          bx,
          by,
          54,
          54
        );
      }
    }
  }

  // 5c. Baby Dragon Companion (Rồng Con Đồng Hành - Wesnoth sprite)
  if (engine.passives.baby_dragon > 0) {
    const bob = Math.sin(nowMs * 0.008) * 5;
    const dx = Math.round(engine.px - engine.facingX * 32);
    const dy = Math.round(engine.py - 32 + bob);
    const bImg = getCachedAssetImage("/assets/beasts/dragon_u1.png");
    if (bImg.complete && bImg.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(bImg, dx - 24, dy - 24, 48, 48);
      ctx.restore();
    }
  }

  // 6. Sprite Sheet Effects (13-frame Skull Death & 9-frame Pixel Explosions)
  for (const fx of engine.spriteEffects) {
    if (fx.kind === "dead_skull") {
      const row = Math.floor(fx.frame / 7);
      const col = fx.frame % 7;
      const size = Math.round(92 * fx.scale);
      spriteAtlas.drawCell(
        ctx,
        "dead",
        row,
        col,
        128,
        128,
        fx.x,
        fx.y - 6,
        size,
        size
      );
    } else if (fx.kind === "explosion") {
      const size = Math.round(136 * fx.scale);
      spriteAtlas.drawCell(
        ctx,
        "explosions",
        0,
        fx.frame,
        192,
        192,
        fx.x,
        fx.y - 10,
        size,
        size
      );
    }
  }

  // 7. In-Flight Enemy Dynamite Sticks (Magenta/Red Enemy Projectile)
  for (const b of engine.enemyBombs) {
    ctx.fillStyle = "rgba(18, 22, 18, 0.28)";
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, 7, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    spriteAtlas.drawCell(
      ctx,
      "dynamite",
      0,
      b.frame % 6,
      64,
      64,
      b.x,
      b.y - b.zHeight,
      46,
      46
    );
  }

  // 8. Player Projectiles (Authentic Wesnoth & TinySwords Sprites)
  for (const p of engine.projectiles) {
    ctx.save();
    ctx.translate(Math.round(p.x), Math.round(p.y));
    ctx.rotate(p.angle);
    ctx.imageSmoothingEnabled = false;

    if (p.kind === "arrow") {
      const arrowSheet = spriteAtlas.sheets.arrow;
      if (arrowSheet) {
        ctx.drawImage(arrowSheet.img, 0, 0, 64, 64, -22, -22, 44, 44);
      }
    } else if (p.kind === "ice_shard") {
      const iceImg = getCachedAssetImage(
        p.isEvolved
          ? "/assets/wesnoth/icons/faerie-fire.png"
          : "/assets/wesnoth/icons/iceball.png"
      );
      if (iceImg.complete && iceImg.naturalWidth > 0) {
        ctx.drawImage(iceImg, -14, -14, 28, 28);
      }
    } else if (p.kind === "shield") {
      ctx.rotate(nowMs * 0.018);
      const shImg = getCachedAssetImage(
        p.isEvolved
          ? "/assets/wesnoth/icons/rectangular-shield.png"
          : "/assets/wesnoth/icons/heater-shield.png"
      );
      if (shImg.complete && shImg.naturalWidth > 0) {
        ctx.drawImage(shImg, -18, -18, 36, 36);
      }
    } else if (p.kind === "turret_bolt") {
      const boltImg = getCachedAssetImage(
        p.isEvolved
          ? "/assets/wesnoth/icons/fireball.png"
          : "/assets/wesnoth/icons/magic-missile.png"
      );
      if (boltImg.complete && boltImg.naturalWidth > 0) {
        ctx.drawImage(boltImg, -14, -14, 28, 28);
      }
    } else {
      ctx.strokeStyle = "#181425";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(-6, 0, p.radius, -Math.PI * 0.42, Math.PI * 0.42);
      ctx.stroke();

      ctx.strokeStyle = p.isEvolved ? "#FACC15" : "#38BDF8";
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  }

  // 8b. Jagged Pixel Chain Lightning Bolts (Lôi Thương Phán Quyết)
  for (const lb of engine.lightningBolts) {
    const ratio = Math.max(0, lb.life / lb.maxLife);
    const mx = (lb.x1 + lb.x2) * 0.5 + (lb.y2 - lb.y1) * 0.18;
    const my = (lb.y1 + lb.y2) * 0.5 - (lb.x2 - lb.x1) * 0.18;
    ctx.save();
    ctx.globalAlpha = Math.min(1, ratio * 1.4);
    ctx.lineJoin = "miter";
    ctx.lineCap = "square";

    ctx.strokeStyle = "#181425";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(Math.round(lb.x1), Math.round(lb.y1));
    ctx.lineTo(Math.round(mx), Math.round(my));
    ctx.lineTo(Math.round(lb.x2), Math.round(lb.y2));
    ctx.stroke();

    ctx.strokeStyle = lb.color;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  // 9. Pixel Broadsword Slash Arcs
  for (const sl of engine.slashes) {
    const ratio = Math.max(0, sl.life / sl.maxLife);
    ctx.save();
    ctx.translate(Math.round(sl.x), Math.round(sl.y));
    ctx.rotate(sl.angle);
    ctx.globalAlpha = Math.min(1, ratio * 1.3);

    ctx.strokeStyle = "#181425";
    ctx.lineWidth = Math.max(4, Math.round(14 * ratio));
    ctx.lineCap = "square";
    ctx.beginPath();
    ctx.arc(0, 0, sl.radius * 0.72, -sl.arcSpan * 0.45, sl.arcSpan * 0.45);
    ctx.stroke();

    ctx.strokeStyle = sl.color;
    ctx.lineWidth = Math.max(2, Math.round(9 * ratio));
    ctx.beginPath();
    ctx.arc(0, 0, sl.radius * 0.72, -sl.arcSpan * 0.43, sl.arcSpan * 0.43);
    ctx.stroke();

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = Math.max(1, Math.round(4 * ratio));
    ctx.beginPath();
    ctx.arc(0, 0, sl.radius * 0.74, -sl.arcSpan * 0.36, sl.arcSpan * 0.36);
    ctx.stroke();
    ctx.restore();
  }

  // 10. Crisp Square Pixel Impact Sparks & Dust
  for (const pt of engine.particles) {
    const alpha = Math.max(0, pt.life / pt.maxLife);
    const sz = Math.max(2, Math.round(pt.size * alpha));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#181425";
    ctx.fillRect(
      Math.round(pt.x - sz / 2) - 1,
      Math.round(pt.y - sz / 2) - 1,
      sz + 2,
      sz + 2
    );
    ctx.fillStyle = pt.color;
    ctx.fillRect(Math.round(pt.x - sz / 2), Math.round(pt.y - sz / 2), sz, sz);
    ctx.restore();
  }

  // 11. Floating Damage Popups
  for (const pop of engine.popups) {
    const alpha = Math.min(1, (pop.life / pop.maxLife) * 1.5);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = pop.isCrit
      ? "900 16px 'Courier New', monospace, system-ui"
      : "800 13px 'Courier New', monospace, system-ui";
    ctx.textAlign = "center";
    const rx = Math.round(pop.x);
    const ry = Math.round(pop.y);
    ctx.fillStyle = "#181425";
    ctx.fillText(pop.text, rx + 1, ry + 1);
    ctx.fillStyle = pop.color;
    ctx.fillText(pop.text, rx, ry);
    ctx.restore();
  }

  ctx.restore(); // end world transform

  // 12. Stage Atmosphere Overlay (All 5 Campaign Stages)
  if (engine.stageId === "mushroom_woods") {
    ctx.fillStyle = "rgba(126, 34, 206, 0.07)";
    ctx.fillRect(0, 0, viewW, viewH);
  } else if (engine.stageId === "abandoned_mine") {
    ctx.fillStyle = "rgba(180, 83, 9, 0.07)";
    ctx.fillRect(0, 0, viewW, viewH);
  } else if (engine.stageId === "ice_citadel") {
    ctx.fillStyle = "rgba(56, 189, 248, 0.08)";
    ctx.fillRect(0, 0, viewW, viewH);
  } else if (engine.stageId === "dark_fortress") {
    ctx.fillStyle = "rgba(225, 29, 72, 0.08)";
    ctx.fillRect(0, 0, viewW, viewH);
  }

  ctx.restore();

  engine.recordRenderDuration(performance.now() - t0);
}

/**
 * Renders Landmark Props with proportional foot shadows and canopy fade (alpha=0.35).
 * Note: Tiny Swords ruin_castle, ruin_tower, ruin_house, gold_mine, deco_16/17/18
 * ALREADY include Pixel Frog's baked grey pixel shadow at their base.
 * Only tree.png needs a subtle, trunk-proportional shadow!
 */
function drawLandmarkProp(
  ctx: CanvasRenderingContext2D,
  prop: LandmarkProp,
  engine: EclipseGameEngine,
  nowMs: number
): void {
  let isObscuringUnit =
    prop.y > engine.py - 8 &&
    prop.y - engine.py < 138 &&
    Math.abs(prop.x - engine.px) < 68;

  if (!isObscuringUnit && prop.kind === "tree") {
    for (const e of engine.enemies) {
      if (
        prop.y > e.y - 6 &&
        prop.y - e.y < 115 &&
        Math.abs(prop.x - e.x) < 52
      ) {
        isObscuringUnit = true;
        break;
      }
    }
  }

  const alpha = isObscuringUnit ? 0.35 : 1.0;

  // Stage-specific landmark scenery overrides so Stages 2..5 never reuse Castle Courtyard props!
  if (engine.stageId === "mushroom_woods") {
    const px = Math.round(prop.x);
    const py = Math.round(prop.y);
    ctx.save();
    ctx.globalAlpha = alpha;
    if (prop.kind === "tree" || prop.kind === "stump") {
      const swampTree = getCachedAssetImage("/assets/wesnoth/scenery/swamp_tree.png");
      if (swampTree.complete && swampTree.naturalWidth > 0) {
        ctx.drawImage(swampTree, px - 48, py - 84, 96, 96);
      }
    } else if (prop.kind === "ruin_castle" || prop.kind === "ruin_house" || prop.kind === "gold_mine") {
      const fungImg = getCachedAssetImage("/assets/wesnoth/monsters/s2_fungus_ab.png");
      if (fungImg.complete && fungImg.naturalWidth > 0) {
        ctx.drawImage(fungImg, px - 42, py - 68, 84, 84);
      }
    } else {
      const vineImg = getCachedAssetImage("/assets/ref_fx/trap_poison_vine.png");
      if (vineImg.complete && vineImg.naturalWidth > 0) {
        ctx.drawImage(vineImg, px - 32, py - 36, 64, 64);
      }
    }
    ctx.restore();
    return;
  }

  if (engine.stageId === "abandoned_mine") {
    const px = Math.round(prop.x);
    const py = Math.round(prop.y);
    ctx.save();
    ctx.globalAlpha = alpha;
    if (prop.kind === "gold_mine" || prop.kind === "ruin_castle") {
      const mineImg = getCachedAssetImage("/assets/wesnoth/scenery/mine_entrance.png");
      if (mineImg.complete && mineImg.naturalWidth > 0) {
        ctx.drawImage(mineImg, px - 48, py - 68, 96, 96);
      }
    } else if (prop.kind === "tree" || prop.kind === "ruin_tower") {
      const crystImg = getCachedAssetImage("/assets/ref_fx/object_crystal_wall.png");
      if (crystImg.complete && crystImg.naturalWidth > 0) {
        ctx.drawImage(crystImg, px - 38, py - 58, 76, 76);
      }
    } else {
      const cairnImg = getCachedAssetImage("/assets/wesnoth/scenery/rock_cairn.png");
      if (cairnImg.complete && cairnImg.naturalWidth > 0) {
        ctx.drawImage(cairnImg, px - 32, py - 48, 64, 64);
      }
    }
    ctx.restore();
    return;
  }

  if (engine.stageId === "ice_citadel") {
    const px = Math.round(prop.x);
    const py = Math.round(prop.y);
    ctx.save();
    ctx.globalAlpha = alpha;
    if (prop.kind === "tree" || prop.kind === "stump") {
      const pineImg = getCachedAssetImage("/assets/wesnoth/scenery/snow_pine.png");
      if (pineImg.complete && pineImg.naturalWidth > 0) {
        ctx.drawImage(pineImg, px - 42, py - 76, 84, 84);
      }
    } else if (prop.kind === "ruin_castle" || prop.kind === "ruin_tower") {
      const tempImg = getCachedAssetImage("/assets/wesnoth/scenery/ice_temple.png");
      if (tempImg.complete && tempImg.naturalWidth > 0) {
        ctx.drawImage(tempImg, px - 46, py - 74, 92, 92);
      }
    } else {
      const crystImg = getCachedAssetImage("/assets/ref_fx/object_crystal_wall.png");
      if (crystImg.complete && crystImg.naturalWidth > 0) {
        ctx.drawImage(crystImg, px - 34, py - 52, 68, 68);
      }
    }
    ctx.restore();
    return;
  }

  if (engine.stageId === "dark_fortress") {
    // Only render props near the floating obsidian islands so none float in empty space
    if (Math.hypot(prop.x, prop.y) > 490) return;
    const px = Math.round(prop.x);
    const py = Math.round(prop.y);
    ctx.save();
    ctx.globalAlpha = alpha;
    if (prop.kind === "tree" || prop.kind === "ruin_tower" || prop.kind === "ruin_castle") {
      const monoImg = getCachedAssetImage(
        prop.seed % 2 > 1
          ? "/assets/wesnoth/scenery/void_monolith1.png"
          : "/assets/wesnoth/scenery/void_monolith3.png"
      );
      if (monoImg.complete && monoImg.naturalWidth > 0) {
        ctx.drawImage(monoImg, px - 36, py - 64, 72, 72);
      }
    } else {
      const ventImg = getCachedAssetImage("/assets/ref_fx/fissure_vent.png");
      if (ventImg.complete && ventImg.naturalWidth > 0) {
        ctx.drawImage(ventImg, px - 34, py - 34, 68, 68);
      }
    }
    ctx.restore();
    return;
  }

  if (prop.kind === "tree") {
    // Subtle, proportional trunk shadow (replaces the old dark 88x37 oval!)
    ctx.save();
    ctx.fillStyle = "rgba(18, 28, 18, 0.20)";
    ctx.beginPath();
    ctx.ellipse(prop.x, prop.y - 4, 24, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const frame = Math.floor(nowMs / 220 + prop.seed) % 4;
    spriteAtlas.drawCell(
      ctx,
      "tree",
      0,
      frame,
      192,
      192,
      prop.x,
      prop.y - 58,
      144,
      144,
      false,
      false,
      alpha
    );
  } else if (prop.kind === "stump") {
    ctx.save();
    ctx.fillStyle = "rgba(18, 28, 18, 0.18)";
    ctx.beginPath();
    ctx.ellipse(prop.x, prop.y - 2, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    spriteAtlas.drawCell(
      ctx,
      "tree",
      2,
      0,
      192,
      192,
      prop.x,
      prop.y - 42,
      128,
      128,
      false,
      false,
      1.0
    );
  } else if (prop.kind === "ruin_castle") {
    spriteAtlas.drawCell(
      ctx,
      "ruin_castle",
      0,
      0,
      320,
      256,
      prop.x,
      prop.y - 48,
      188,
      150,
      false,
      false,
      alpha
    );
  } else if (prop.kind === "ruin_tower") {
    spriteAtlas.drawCell(
      ctx,
      "ruin_tower",
      0,
      0,
      128,
      256,
      prop.x,
      prop.y - 56,
      92,
      184,
      false,
      false,
      alpha
    );
  } else if (prop.kind === "ruin_house") {
    spriteAtlas.drawCell(
      ctx,
      "ruin_house",
      0,
      0,
      128,
      192,
      prop.x,
      prop.y - 40,
      96,
      144,
      false,
      false,
      alpha
    );
  } else if (prop.kind === "gold_mine") {
    spriteAtlas.drawCell(
      ctx,
      "gold_mine",
      0,
      0,
      192,
      128,
      prop.x,
      prop.y - 32,
      156,
      104,
      false,
      false,
      alpha
    );
  } else if (prop.kind === "signpost") {
    spriteAtlas.drawCell(
      ctx,
      "deco_17",
      0,
      0,
      64,
      128,
      prop.x,
      prop.y - 28,
      48,
      96,
      false,
      false,
      1.0
    );
  } else if (prop.kind === "skull_post") {
    spriteAtlas.drawCell(
      ctx,
      "deco_16",
      0,
      0,
      64,
      128,
      prop.x,
      prop.y - 28,
      48,
      96,
      false,
      false,
      1.0
    );
  } else if (prop.kind === "scarecrow") {
    spriteAtlas.drawCell(
      ctx,
      "deco_18",
      0,
      0,
      192,
      192,
      prop.x,
      prop.y - 28,
      96,
      96,
      false,
      false,
      1.0
    );
  } else {
    // rock_large
    spriteAtlas.drawCell(
      ctx,
      "deco_06",
      0,
      0,
      64,
      64,
      prop.x,
      prop.y - 12,
      58,
      58,
      false,
      false,
      1.0
    );
  }
}

function drawPixelPickup(
  ctx: CanvasRenderingContext2D,
  g: ExpGemEntity,
  nowMs: number
): void {
  const bob = Math.round(Math.sin(nowMs * 0.006 + g.bobSeed) * 2.5);
  const x = Math.round(g.x);
  const y = Math.round(g.y + bob);

  ctx.fillStyle = "rgba(18, 26, 18, 0.28)";
  ctx.beginPath();
  ctx.ellipse(x, Math.round(g.y) + 7, 7, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  if (g.tier === "chest") {
    spriteAtlas.drawCell(ctx, "gold_bag", 0, 0, 128, 128, x, y - 6, 56, 56);
  } else if (g.tier === "meat") {
    spriteAtlas.drawCell(ctx, "meat_heal", 0, 0, 128, 128, x, y - 6, 52, 52);
  } else if (
    g.tier === "rune_frenzy" ||
    g.tier === "rune_aegis" ||
    g.tier === "rune_magnet"
  ) {
    const runeColor =
      g.tier === "rune_frenzy"
        ? "#FACC15"
        : g.tier === "rune_aegis"
        ? "#38BDF8"
        : "#4ADE80";
    const runeUrl =
      g.tier === "rune_frenzy"
        ? "/assets/wesnoth/icons/frenzy.png"
        : g.tier === "rune_aegis"
        ? "/assets/wesnoth/icons/stone_ring.png"
        : "/assets/wesnoth/icons/ankh_necklace.png";
    ctx.save();
    ctx.strokeStyle = runeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 16 + Math.sin(nowMs * 0.008) * 2, 0, Math.PI * 2);
    ctx.stroke();

    const rImg = getCachedAssetImage(runeUrl);
    if (rImg.complete && rImg.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(rImg, x - 14, y - 14, 28, 28);
    }
    ctx.restore();
  } else {
    const isGold = g.tier === "gold";
    const gemUrl = isGold
      ? "/assets/wesnoth/items/gold-coins-medium.png"
      : "/assets/wesnoth/icons/jewelry_ring_prismatic.png";
    const gImg = getCachedAssetImage(gemUrl);
    if (gImg.complete && gImg.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      const sz = isGold ? 28 : 22;
      ctx.drawImage(gImg, x - sz / 2, y - sz / 2, sz, sz);
      ctx.restore();
    }
  }
}

function drawPixelEnemy(
  ctx: CanvasRenderingContext2D,
  e: EnemyEntity,
  stageId?: EclipseGameEngine["stageId"]
): void {
  const x = Math.round(e.x);
  const y = Math.round(e.y);

  ctx.save();
  ctx.fillStyle = "rgba(15, 22, 16, 0.34)";
  ctx.beginPath();
  ctx.ellipse(
    x,
    y + 14,
    e.isBoss ? 32 : e.isElite ? 20 : 12,
    e.isBoss ? 12 : e.isElite ? 8 : 5,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  if (e.isElite) {
    ctx.strokeStyle = e.isBoss ? "#FACC15" : "#EF4444";
    ctx.lineWidth = e.isBoss ? 3.5 : 2.5;
    ctx.beginPath();
    ctx.ellipse(x, y + 14, e.isBoss ? 36 : 25, e.isBoss ? 14 : 10, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Elemental Frost / Shock foot ring
  if (e.frostTimer > 0) {
    ctx.strokeStyle = "#38BDF8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y + 14, 16, 6, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Authentic Stage Boss sprite from Battle for Wesnoth (with Stage 5 Phase 2 visual transformation!)
  if (e.isBoss && stageId && STAGES[stageId]) {
    const st = STAGES[stageId];
    const isPhase2 = e.bossPhase === 2 && st.bossPhase2UnitUrl;
    const bossImg = getCachedAssetImage(
      isPhase2 ? st.bossPhase2UnitUrl! : st.bossUnitUrl
    );
    if (bossImg.complete && bossImg.naturalWidth > 0) {
      const sz = isPhase2 ? 138 : 122;
      ctx.save();
      ctx.translate(x, y);
      if (isPhase2) {
        const haloImg = getCachedAssetImage("/assets/wesnoth/scenery/void_halo.png");
        if (haloImg.complete && haloImg.naturalWidth > 0) {
          ctx.drawImage(haloImg, -68, -sz * 0.85, 136, 136);
        }
      }
      if (e.facingX < 0) ctx.scale(-1, 1);
      ctx.imageSmoothingEnabled = false;
      if (e.hitFlash > 0) {
        ctx.filter = "brightness(2.2) contrast(1.2)";
      }
      ctx.drawImage(bossImg, -sz / 2, -sz * 0.78, sz, sz);
      ctx.restore();

      const crownImg = getCachedAssetImage("/assets/wesnoth/ui/leader-crown.png");
      if (crownImg.complete && crownImg.naturalWidth > 0) {
        ctx.drawImage(crownImg, x - 12, y - sz * 0.78 - 16, 24, 24);
      }

      // Boss HP bar overhead + Phase 2 badge
      const barW = 84;
      const barH = 8;
      const bx = x - Math.floor(barW / 2);
      const by = y - 72;
      const ratio = Math.max(0, Math.min(1, e.hp / e.maxHp));
      ctx.fillStyle = "#12151c";
      ctx.fillRect(bx - 1, by - 1, barW + 2, barH + 2);
      ctx.fillStyle = isPhase2 ? "#A855F7" : "#dc2626";
      ctx.fillRect(bx, by, Math.round(barW * ratio), barH);
      if (isPhase2) {
        ctx.font = "900 10px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#F5D0FE";
        ctx.fillText("⚡ GIAI ĐOẠN 2", x, by - 4);
      }
      return;
    }
  }

  // Stage-specific regular & elite monsters for Stages 2..5 (Mushroom, Mine, Ice, Void)
  if (stageId && stageId !== "courtyard" && STAGES[stageId]) {
    const st = STAGES[stageId];
    const mobUrl =
      e.arch === "goblin_torch"
        ? st.mobMeleeUrl
        : e.arch === "goblin_tnt"
        ? st.mobRangedUrl
        : st.mobEliteUrl;
    const mobImg = getCachedAssetImage(mobUrl);
    if (mobImg.complete && mobImg.naturalWidth > 0) {
      const sz = e.isElite ? 96 : 74;
      const bob = Math.sin((e.animFrame / 6) * Math.PI * 2) * 3;
      const lunge = e.animState === "attack" ? e.facingX * 7 : 0;
      ctx.save();
      ctx.translate(Math.round(x + lunge), Math.round(y + bob));
      if (e.facingX < 0) ctx.scale(-1, 1);
      ctx.imageSmoothingEnabled = false;
      if (e.hitFlash > 0) {
        ctx.filter = "brightness(2.2) contrast(1.25)";
      }
      ctx.drawImage(mobImg, -sz / 2, -Math.round(sz * 0.78), sz, sz);
      ctx.restore();

      if (e.burnTimer > 0) {
        ctx.fillStyle = "#F97316";
        ctx.fillRect(x - 9, y - 24, 5, 5);
      }
      if (e.frostTimer > 0) {
        ctx.fillStyle = "#38BDF8";
        ctx.fillRect(x - 2, y - 24, 5, 5);
      }
      if (e.shockTimer > 0) {
        ctx.fillStyle = "#FACC15";
        ctx.fillRect(x + 5, y - 24, 5, 5);
      }
      if (e.isElite || e.hp < e.maxHp) {
        const bw = e.isElite ? 48 : 28;
        const bh = e.isElite ? 6 : 4;
        const bx = Math.round(x - bw / 2);
        const by = Math.round(y - (e.isElite ? 48 : 34));
        ctx.fillStyle = "#181425";
        ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
        ctx.fillStyle = e.isElite ? "#EF4444" : "#F97316";
        ctx.fillRect(bx, by, Math.round(bw * Math.max(0, e.hp / e.maxHp)), bh);
      }
      return;
    }
  }

  let sheetKey: SheetKey = "goblin_torch";
  let row = 1;
  let drawSize = 106;

  if (e.arch === "goblin_torch") {
    sheetKey = "goblin_torch";
    drawSize = 106;
    if (e.animState === "attack") {
      row = e.animDir === "down" ? 3 : e.animDir === "up" ? 4 : 2;
    } else {
      row = 1;
    }
  } else if (e.arch === "goblin_tnt") {
    sheetKey = "goblin_tnt";
    drawSize = 106;
    row = e.animState === "attack" ? 2 : 1;
  } else {
    sheetKey = "warrior_red";
    drawSize = e.isBoss ? 156 : 136;
    if (e.animState === "attack") {
      row = e.animDir === "down" ? 4 : e.animDir === "up" ? 6 : 2;
    } else {
      row = 1;
    }
  }

  spriteAtlas.drawCell(
    ctx,
    sheetKey,
    row,
    e.animFrame,
    192,
    192,
    x,
    y - 6,
    drawSize,
    drawSize,
    e.facingX < 0,
    e.hitFlash > 0
  );

  // Elemental status pixel badges above enemy
  if (e.burnTimer > 0) {
    ctx.fillStyle = "#F97316";
    ctx.fillRect(x - 9, y - 24, 5, 5);
  }
  if (e.frostTimer > 0) {
    ctx.fillStyle = "#38BDF8";
    ctx.fillRect(x - 2, y - 24, 5, 5);
  }
  if (e.shockTimer > 0) {
    ctx.fillStyle = "#FACC15";
    ctx.fillRect(x + 5, y - 24, 5, 5);
  }
  if (e.stunTimer > 0) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x - 4, y - 34, 8, 4);
  }

  if (e.isElite || e.hp < e.maxHp) {
    const bw = e.isElite ? 48 : 28;
    const bh = e.isElite ? 6 : 4;
    const bx = Math.round(x - bw / 2);
    const by = Math.round(y - (e.isElite ? 44 : 30));
    ctx.fillStyle = "#181425";
    ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
    ctx.fillStyle = e.isElite ? "#EF4444" : "#F97316";
    ctx.fillRect(bx, by, Math.round(bw * Math.max(0, e.hp / e.maxHp)), bh);
  }
}

function getRarityGlowColor(rarity?: "rare" | "epic" | "legendary"): string {
  if (rarity === "legendary") return "#FBBF24";
  if (rarity === "epic") return "#C084FC";
  return "#38BDF8";
}

function getHeroFrameUrl(
  heroId: HeroId,
  isAttacking: boolean,
  attackAlt: boolean
): string {
  if (heroId === "kael" && isAttacking) {
    return attackAlt
      ? "/assets/wesnoth/heroes/kael_atk2.png"
      : "/assets/wesnoth/heroes/kael_atk1.png";
  }
  if (heroId === "ember" && isAttacking) {
    return attackAlt
      ? "/assets/wesnoth/heroes/ember_atk2.png"
      : "/assets/wesnoth/heroes/ember_atk1.png";
  }
  return HEROES[heroId]?.unitUrl || HEROES.kael.unitUrl;
}

/**
 * Shared renderer for all 4 Heroes + 3 Equipped Gear Visuals (Weapon, Armor, Relic)
 * used in both In-Battle (`drawPixelHero`) and Lobby Stage (`renderHeroPreviewStage`).
 */
function drawHeroUnitWithLoadout(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  heroId: HeroId,
  facingX: number,
  isAttacking: boolean,
  attackAlt: boolean,
  hitFlash: boolean,
  frenzyActive: boolean,
  aegisShield: number,
  effectiveWeapon: WeaponId,
  equipped: EquippedVisualSummary | undefined,
  drawSz: number,
  nowMs: number
): void {
  const heroDef = HEROES[heroId] || HEROES.kael;
  const accentColor = frenzyActive ? "#FACC15" : heroDef.accentColor;

  ctx.save();
  // 1. Foot Shadow & Class Aura Ring
  ctx.fillStyle = "rgba(12, 18, 14, 0.44)";
  ctx.beginPath();
  ctx.ellipse(x, y + 18, 22, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = frenzyActive ? 3 : 2.4;
  ctx.beginPath();
  ctx.ellipse(x, y + 18, 26, 10, 0, 0, Math.PI * 2);
  ctx.stroke();

  // 2. Equipped Armor (`Giáp Chiến`) Protective Ward Ring & Flank Crest
  if (equipped?.armor) {
    const armCol = getRarityGlowColor(equipped.armor.rarity);
    ctx.strokeStyle = armCol;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.ellipse(x, y + 18, 32, 13, nowMs * 0.0015, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Aegis Ice Shield protective ring around Hero
  if (aegisShield > 0) {
    ctx.strokeStyle = "rgba(56, 189, 248, 0.88)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y - 6, 34, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Authentic Battle for Wesnoth Hero Unit Sprite (Kael, Lyra, Ember, Pip)
  const frameUrl = getHeroFrameUrl(heroId, isAttacking, attackAlt);
  const unitImg = getCachedAssetImage(frameUrl);
  const fallbackImg = getCachedAssetImage(heroDef.unitUrl);
  const activeImg =
    unitImg.complete && unitImg.naturalWidth > 0 ? unitImg : fallbackImg;

  const bob = Math.sin(nowMs * 0.0065) * 2.5;
  const lungeX = isAttacking ? facingX * 6 : 0;

  if (activeImg.complete && activeImg.naturalWidth > 0) {
    ctx.save();
    ctx.translate(Math.round(x + lungeX), Math.round(y + bob));
    if (facingX < 0) ctx.scale(-1, 1);
    ctx.imageSmoothingEnabled = false;
    if (hitFlash) {
      ctx.filter = "brightness(2.2) contrast(1.2)";
    }
    ctx.drawImage(
      activeImg,
      -Math.round(drawSz / 2),
      -Math.round(drawSz * 0.76),
      drawSz,
      drawSz
    );
    ctx.restore();
  } else {
    spriteAtlas.drawCell(
      ctx,
      "warrior_blue",
      isAttacking ? 2 : 0,
      Math.floor(nowMs / 110) % 6,
      192,
      192,
      x,
      y - 6,
      drawSz,
      drawSz,
      facingX < 0,
      hitFlash
    );
  }

  // 4. Equipped Armor (`Giáp Chiến`) Floating Ward Crest on Back Flank
  if (equipped?.armor) {
    const armImg = getCachedAssetImage(getGameIconUrl(equipped.armor.iconId));
    if (armImg.complete && armImg.naturalWidth > 0) {
      const ax = Math.round(x - facingX * 30);
      const ay = Math.round(y - 12 + Math.sin(nowMs * 0.005 + 1.5) * 2.5);
      const armCol = getRarityGlowColor(equipped.armor.rarity);
      ctx.save();
      ctx.fillStyle = "rgba(11, 15, 23, 0.9)";
      ctx.strokeStyle = armCol;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(ax, ay, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.drawImage(armImg, ax - 10, ay - 10, 20, 20);
      ctx.restore();
    }
  }

  // 5. Equipped Weapon (`Vũ Khí`) Wielded in Hero's Lead Hand
  const wepIconId: GameIconId = equipped?.weapon
    ? equipped.weapon.iconId
    : WEAPONS[effectiveWeapon]?.icon || "broadsword";
  const wepImg = getCachedAssetImage(getGameIconUrl(wepIconId));
  if (wepImg.complete && wepImg.naturalWidth > 0) {
    const wx = Math.round(x + facingX * 28 + lungeX * 0.8);
    const wy = Math.round(y - 10 + bob * 0.8);
    const wepCol = equipped?.weapon
      ? getRarityGlowColor(equipped.weapon.rarity)
      : accentColor;
    const swingAngle = isAttacking
      ? facingX * (attackAlt ? 0.55 : -0.45)
      : facingX * 0.15;

    ctx.save();
    ctx.translate(wx, wy);
    ctx.rotate(swingAngle);
    ctx.fillStyle = "rgba(11, 15, 23, 0.88)";
    ctx.strokeStyle = wepCol;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.drawImage(wepImg, -12, -12, 24, 24);
    ctx.restore();
  }

  // 6. Equipped Relic (`Bảo Vật`) Orbiting Arcane Talisman
  if (equipped?.relic) {
    const relImg = getCachedAssetImage(getGameIconUrl(equipped.relic.iconId));
    if (relImg.complete && relImg.naturalWidth > 0) {
      const orbitA = nowMs * 0.0032;
      const rx = Math.round(x + Math.cos(orbitA) * 38);
      const ry = Math.round(y - 26 + Math.sin(orbitA) * 12);
      const relCol = getRarityGlowColor(equipped.relic.rarity);
      ctx.save();
      ctx.fillStyle = "rgba(11, 15, 23, 0.9)";
      ctx.strokeStyle = relCol;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(rx, ry, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.drawImage(relImg, rx - 9, ry - 9, 18, 18);
      ctx.restore();
    }
  }
}

function drawPixelHero(
  ctx: CanvasRenderingContext2D,
  engine: EclipseGameEngine,
  nowMs = performance.now()
): void {
  const x = Math.round(engine.px);
  const y = Math.round(engine.py);
  const isAttacking =
    engine.heroAnimState === "attack_1" ||
    engine.heroAnimState === "attack_2" ||
    engine.weaponSwingTimer > 0;
  const attackAlt =
    engine.heroAnimState === "attack_2" ||
    (engine.weaponSwingTimer > 0 && engine.weaponSwingAlt);

  // Determine the highest-level or evolved active weapon to display on the Hero
  let activeWeapon: WeaponId = engine.hero.startingWeapon;
  for (const wId of Object.keys(WEAPONS) as WeaponId[]) {
    if (engine.weapons[wId].evolved) {
      activeWeapon = wId;
      break;
    }
    if (engine.weapons[wId].level > engine.weapons[activeWeapon].level) {
      activeWeapon = wId;
    }
  }

  drawHeroUnitWithLoadout(
    ctx,
    x,
    y,
    engine.hero.id,
    engine.facingX,
    isAttacking,
    attackAlt,
    engine.playerHitFlash > 0,
    engine.frenzyTimer > 0,
    engine.aegisShield,
    activeWeapon,
    engine.equippedVisuals,
    98,
    nowMs
  );

  // Player Rooted Vine Visual (Stage 2 Ancient Treant Boss root_snare)
  if (engine.playerRootTimer > 0) {
    const vineImg = getCachedAssetImage("/assets/ref_fx/trap_poison_vine.png");
    if (vineImg.complete && vineImg.naturalWidth > 0) {
      ctx.save();
      ctx.drawImage(vineImg, x - 34, y - 22, 68, 48);
      ctx.restore();
    }
  }

  // Stage 4 Warmth Aura Indicator around Hero when sheltered near a Heater Brazier
  if (engine.stageId === "ice_citadel" && engine.inWarmthZone) {
    ctx.save();
    ctx.strokeStyle = "rgba(251, 191, 36, 0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y - 6, 38, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Crisp Overhead/Foot HP Bar
  const hpW = 46;
  const hpH = 6;
  const hpRatio = Math.max(0, Math.min(1, engine.hp / engine.maxHp));
  const bx = x - hpW / 2;
  const by = y + 26;
  ctx.fillStyle = "#0b0e14";
  ctx.fillRect(bx - 1, by - 1, hpW + 2, hpH + 2);
  ctx.fillStyle = hpRatio > 0.35 ? "#22C55E" : "#EF4444";
  ctx.fillRect(bx, by, Math.round(hpW * hpRatio), hpH);
}

/**
 * Renders the full atmospheric Courtyard / Stage backdrop & Live Hero + Loadout Stage
 * for the Lobby screen so switching Heroes or Equipped Gear visibly transforms the stage!
 */
export function renderHeroPreviewStage(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  nowMs: number,
  heroId: HeroId = "kael",
  stageId: StageId = "courtyard",
  effectiveWeapon?: WeaponId,
  equipped?: EquippedVisualSummary
): void {
  spriteAtlas.ensureLoaded();
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle =
    stageId === "mushroom_woods"
      ? "#182822"
      : stageId === "abandoned_mine"
      ? "#1E1916"
      : stageId === "ice_citadel"
      ? "#B8D8EE"
      : stageId === "dark_fortress"
      ? "#070410"
      : "#587A4E";
  ctx.fillRect(0, 0, w, h);

  // Blit the selected Stage's baked terrain map!
  const terrain = getBakedTerrainCanvas(stageId);
  if (terrain) {
    const srcCenterX = WORLD_HALF_W + (stageId === "courtyard" ? 128 : 0);
    const srcCenterY = WORLD_HALF_H - (stageId === "courtyard" ? 235 : 40);
    const sx = Math.max(0, Math.min(terrain.width - 1, Math.round(srcCenterX - w / 2)));
    const sy = Math.max(0, Math.min(terrain.height - 1, Math.round(srcCenterY - h / 2)));
    const sw = Math.min(w, terrain.width - sx);
    const sh = Math.min(h, terrain.height - sy);
    ctx.drawImage(terrain, sx, sy, sw, sh, 0, 0, sw, sh);
  }

  const cx = Math.round(w * 0.5);
  const cy = Math.round(h * 0.64);
  const treeFrame = Math.floor(nowMs / 220) % 4;
  const fireFrame = Math.floor(nowMs / 100) % 7;
  const gobFrame = Math.floor(nowMs / 110) % 6;

  if (stageId === "courtyard") {
    // Background Ruined Keep & Flanking Watchtowers on the Terrace
    spriteAtlas.drawCell(ctx, "ruin_castle", 0, 0, 320, 256, cx, cy - 172, 184, 148);
    spriteAtlas.drawCell(ctx, "ruin_tower", 0, 0, 128, 256, cx - 135, cy - 155, 84, 168);
    spriteAtlas.drawCell(ctx, "ruin_tower", 0, 0, 128, 256, cx + 135, cy - 155, 84, 168);

    // Swaying Pine Trees framing the courtyard stage
    spriteAtlas.drawCell(ctx, "tree", 0, treeFrame, 192, 192, cx - 175, cy - 82, 136, 136);
    spriteAtlas.drawCell(ctx, "tree", 0, (treeFrame + 2) % 4, 192, 192, cx + 175, cy - 82, 136, 136);

    // Animated Campfire / Torchlight flanking the stone steps
    spriteAtlas.drawCell(ctx, "fire", 0, fireFrame, 128, 128, cx - 76, cy - 54, 60, 60);
    spriteAtlas.drawCell(ctx, "fire", 0, (fireFrame + 3) % 7, 128, 128, cx + 76, cy - 54, 60, 60);

    // Distant Goblins patrolling near the bottom corners of the diorama
    spriteAtlas.drawCell(ctx, "goblin_torch", 1, gobFrame, 192, 192, cx - 148, cy + 42, 88, 88, false);
    spriteAtlas.drawCell(ctx, "goblin_tnt", 1, (gobFrame + 3) % 6, 192, 192, cx + 150, cy + 44, 88, 88, true);
  } else {
    const st = STAGES[stageId];
    const bossImg = getCachedAssetImage(st.bossUnitUrl);
    const mob1 = getCachedAssetImage(st.mobMeleeUrl);
    const mob2 = getCachedAssetImage(st.mobRangedUrl);
    if (stageId === "mushroom_woods") {
      const treeImg = getCachedAssetImage("/assets/wesnoth/scenery/swamp_tree.png");
      const vineImg = getCachedAssetImage("/assets/ref_fx/trap_poison_vine.png");
      if (treeImg.complete && treeImg.naturalWidth > 0) {
        ctx.drawImage(treeImg, cx - 195, cy - 150, 96, 96);
        ctx.drawImage(treeImg, cx + 100, cy - 150, 96, 96);
      }
      if (vineImg.complete && vineImg.naturalWidth > 0) {
        ctx.drawImage(vineImg, cx - 110, cy - 82, 64, 64);
        ctx.drawImage(vineImg, cx + 46, cy - 82, 64, 64);
      }
    } else if (stageId === "abandoned_mine") {
      const mineImg = getCachedAssetImage("/assets/wesnoth/scenery/mine_entrance.png");
      const crystImg = getCachedAssetImage("/assets/ref_fx/object_crystal_wall.png");
      if (mineImg.complete && mineImg.naturalWidth > 0) {
        ctx.drawImage(mineImg, cx - 48, cy - 175, 96, 96);
      }
      if (crystImg.complete && crystImg.naturalWidth > 0) {
        ctx.drawImage(crystImg, cx - 175, cy - 125, 76, 76);
        ctx.drawImage(crystImg, cx + 100, cy - 125, 76, 76);
      }
    } else if (stageId === "ice_citadel") {
      const tempImg = getCachedAssetImage("/assets/wesnoth/scenery/ice_temple.png");
      const brazImg = getCachedAssetImage("/assets/wesnoth/scenery/brazier_lit.png");
      if (tempImg.complete && tempImg.naturalWidth > 0) {
        ctx.drawImage(tempImg, cx - 46, cy - 178, 92, 92);
      }
      if (brazImg.complete && brazImg.naturalWidth > 0) {
        ctx.drawImage(brazImg, cx - 135, cy - 95, 56, 56);
        ctx.drawImage(brazImg, cx + 80, cy - 95, 56, 56);
      }
    } else if (stageId === "dark_fortress") {
      const monoImg = getCachedAssetImage("/assets/wesnoth/scenery/void_monolith1.png");
      const portImg = getCachedAssetImage("/assets/wesnoth/scenery/void_portal.png");
      if (monoImg.complete && monoImg.naturalWidth > 0) {
        ctx.drawImage(monoImg, cx - 155, cy - 145, 72, 72);
        ctx.drawImage(monoImg, cx + 85, cy - 145, 72, 72);
      }
      if (portImg.complete && portImg.naturalWidth > 0) {
        ctx.drawImage(portImg, cx - 32, cy - 175, 64, 64);
      }
    }
    if (bossImg.complete && bossImg.naturalWidth > 0) {
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.drawImage(bossImg, cx - 42, cy - 162, 84, 84);
      ctx.restore();
    }
    if (mob1.complete && mob1.naturalWidth > 0) {
      ctx.drawImage(mob1, cx - 165, cy - 4, 68, 68);
    }
    if (mob2.complete && mob2.naturalWidth > 0) {
      ctx.drawImage(mob2, cx + 100, cy - 4, 68, 68);
    }
  }

  // Cycle Hero preview states: 0=Idle, 1=Run, 2=Attack 1, 3=Attack 2
  const cycleIdx = Math.floor(nowMs / 820) % 4;
  const isAttacking = cycleIdx === 2 || cycleIdx === 3;
  const attackAlt = cycleIdx === 3;
  const activeWep: WeaponId =
    effectiveWeapon || HEROES[heroId]?.startingWeapon || "broadsword";

  // Draw the Selected Hero + Equipped Weapon, Armor Ward & Orbiting Relic Talisman!
  drawHeroUnitWithLoadout(
    ctx,
    cx,
    cy + 2,
    heroId,
    1,
    isAttacking,
    attackAlt,
    false,
    false,
    0,
    activeWep,
    equipped,
    112,
    nowMs
  );

  // Live Weapon Attack Demonstration matching the Hero's Effective Weapon!
  const phaseProgress = (nowMs % 820) / 820;
  if (isAttacking) {
    ctx.save();
    if (activeWep === "broadsword") {
      ctx.translate(cx + 18, cy - 2);
      ctx.strokeStyle = "#181425";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(0, 0, 54, -Math.PI * 0.42, Math.PI * 0.42);
      ctx.stroke();
      ctx.strokeStyle = attackAlt ? "#FACC15" : "#38BDF8";
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2.5;
      ctx.stroke();
    } else if (activeWep === "astral_bow") {
      const arrowSheet = spriteAtlas.sheets.arrow;
      for (let i = -1; i <= 1; i++) {
        const ax = cx + 28 + phaseProgress * 115;
        const ay = cy - 8 + i * 14;
        if (arrowSheet) {
          ctx.drawImage(arrowSheet.img, 0, 0, 64, 64, ax - 20, ay - 20, 40, 40);
        }
      }
    } else if (activeWep === "flying_shield") {
      const shImg = getCachedAssetImage("/assets/wesnoth/icons/heater-shield.png");
      if (shImg.complete && shImg.naturalWidth > 0) {
        for (let s = 0; s < 2; s++) {
          const a = nowMs * 0.008 + s * Math.PI;
          const sx = cx + Math.cos(a) * 64;
          const sy = cy - 6 + Math.sin(a) * 28;
          ctx.drawImage(shImg, sx - 16, sy - 16, 32, 32);
        }
      }
    } else if (activeWep === "quake_hammer") {
      const r = 20 + phaseProgress * 58;
      ctx.strokeStyle = "#F97316";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.ellipse(cx + 28, cy + 14, r, r * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (activeWep === "frost_tome") {
      const r = 24 + phaseProgress * 64;
      ctx.strokeStyle = "#38BDF8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 10, r, r * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
      const iceImg = getCachedAssetImage("/assets/wesnoth/icons/iceball.png");
      if (iceImg.complete && iceImg.naturalWidth > 0) {
        for (let k = 0; k < 3; k++) {
          const a = nowMs * 0.006 + (k * Math.PI * 2) / 3;
          ctx.drawImage(
            iceImg,
            cx + Math.cos(a) * 52 - 12,
            cy + Math.sin(a) * 24 - 12,
            24,
            24
          );
        }
      }
    } else if (activeWep === "lightning_magnet") {
      ctx.strokeStyle = "#FACC15";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cx + 20, cy - 16);
      ctx.lineTo(cx + 75, cy - 32);
      ctx.lineTo(cx + 138, cy + 28);
      ctx.stroke();
    } else if (activeWep === "oil_torch" || activeWep === "decoy_bomb") {
      spriteAtlas.drawCell(
        ctx,
        "dynamite",
        0,
        fireFrame % 6,
        64,
        64,
        cx + 32 + phaseProgress * 80,
        cy - 18 + Math.sin(phaseProgress * Math.PI) * -24,
        42,
        42
      );
    }
    ctx.restore();
  }

  // Stage-specific atmosphere tint in Lobby Diorama
  if (stageId === "mushroom_woods") {
    ctx.fillStyle = "rgba(88, 28, 135, 0.14)";
    ctx.fillRect(0, 0, w, h);
  } else if (stageId === "abandoned_mine") {
    ctx.fillStyle = "rgba(120, 53, 15, 0.16)";
    ctx.fillRect(0, 0, w, h);
  } else if (stageId === "ice_citadel") {
    ctx.fillStyle = "rgba(14, 116, 144, 0.16)";
    ctx.fillRect(0, 0, w, h);
  } else if (stageId === "dark_fortress") {
    ctx.fillStyle = "rgba(136, 19, 55, 0.16)";
    ctx.fillRect(0, 0, w, h);
  }

  ctx.restore();
}

/**
 * Renders a crisp, magnified pixel portrait of one of the 3 Courtyard Enemies
 * by cropping the central 84x84 character bounding box from the 192x192 cell!
 */
export function renderEnemyPortrait(
  ctx: CanvasRenderingContext2D,
  arch: "goblin_torch" | "goblin_tnt" | "elite_knight",
  w: number,
  h: number,
  nowMs: number
): void {
  spriteAtlas.ensureLoaded();
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#1E192B";
  ctx.fillRect(0, 0, w, h);

  const frame = Math.floor(nowMs / 140) % 6;
  const sheetKey: SheetKey =
    arch === "goblin_torch"
      ? "goblin_torch"
      : arch === "goblin_tnt"
      ? "goblin_tnt"
      : "warrior_red";
  const sheet = spriteAtlas.sheets[sheetKey];
  if (sheet) {
    const cropSz = arch === "elite_knight" ? 90 : 80;
    const sx = frame * 192 + Math.round((192 - cropSz) / 2);
    const sy = Math.round((192 - cropSz) / 2) - 4;
    ctx.drawImage(sheet.img, sx, sy, cropSz, cropSz, 1, 1, w - 2, h - 2);
  }
  ctx.restore();
}


const companionImages = new Map<string, HTMLImageElement>();
const novaGlowCache = new Map<string, HTMLCanvasElement>();

function getCachedAssetImage(url: string): HTMLImageElement {
  let img = companionImages.get(url);
  if (!img) {
    img = new Image();
    img.src = url;
    companionImages.set(url, img);
  }
  return img;
}

function getNovaGlowCanvas(color: string, intense: boolean): HTMLCanvasElement {
  const key = `${color}_${intense ? 1 : 0}`;
  let c = novaGlowCache.get(key);
  if (!c) {
    c = document.createElement("canvas");
    c.width = 96;
    c.height = 96;
    const gctx = c.getContext("2d")!;
    const glow = gctx.createRadialGradient(48, 48, 2, 48, 48, 48);
    glow.addColorStop(0, color + (intense ? "55" : "38"));
    glow.addColorStop(0.72, color + "22");
    glow.addColorStop(1, color + "00");
    gctx.fillStyle = glow;
    gctx.fillRect(0, 0, 96, 96);
    novaGlowCache.set(key, c);
  }
  return c;
}

function drawSummonGroundEffects(
  ctx: CanvasRenderingContext2D,
  engine: EclipseGameEngine,
  now: number
): void {
  ctx.save();
  for (const fx of engine.novas) {
    const age = 1 - fx.life / fx.maxLife;
    const r = fx.radius * (0.25 + Math.min(1, age * 2) * 0.75);
    const big =
      fx.kind === "meteor" ||
      fx.kind === "blizzard" ||
      fx.kind === "thunder" ||
      fx.kind === "blackhole" ||
      fx.kind === "summon_overdrive";
    const evo = fx.evolutionStage ?? 0;

    ctx.save();
    ctx.translate(fx.x, fx.y);
    ctx.globalAlpha = Math.min(1, fx.life * 2.1);

    const glowCanvas = getNovaGlowCanvas(fx.color, big || evo >= 2);
    ctx.drawImage(glowCanvas, -r, -r, r * 2, r * 2);

    ctx.strokeStyle = fx.color;
    ctx.lineWidth = big ? 2.8 : 1.5 + evo * 0.4;
    ctx.globalAlpha *= big ? 0.65 : 0.42;
    const ringCount = big ? 2 : 1;
    for (let ring = 0; ring < ringCount; ring++) {
      ctx.beginPath();
      ctx.arc(
        0,
        0,
        r * (1 - ring * 0.16),
        age * 2.4 + ring,
        age * 2.4 + ring + Math.PI * 1.82
      );
      ctx.stroke();
    }

    if (fx.kind === "blackhole" || fx.kind === "slime") {
      ctx.fillStyle = "#160a29";
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        (big ? 58 : 38) + age * 22,
        (big ? 32 : 20) + age * 12,
        age * 5,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.strokeStyle = "#e9d5ff";
      ctx.lineWidth = 2;
      ctx.stroke();
      for (let j = 0; j < (big ? 22 : 14); j++) {
        const a = j * 2.4 + age * 9;
        const d = r * (1 - age * 0.85) * (0.35 + (j % 3) * 0.25);
        ctx.fillStyle = j % 2 ? "#f5d0fe" : "#a855f7";
        ctx.fillRect(Math.cos(a) * d, Math.sin(a) * d, big ? 5 : 4, big ? 5 : 4);
      }
    } else if (fx.kind === "meteor" || fx.kind === "dragon") {
      const count = big ? 14 : 6 + evo * 2;
      for (let j = 0; j < count; j++) {
        const a = j * 2.399;
        const d = r * (0.22 + (j % 4) * 0.19);
        const x = Math.cos(a) * d;
        const y = Math.sin(a) * d;
        const fall = Math.max(0, 1 - age * 3 - (j % 3) * 0.05) * 185;
        ctx.strokeStyle = "#ffaf6688";
        ctx.lineWidth = big ? 13 : 5 + evo;
        ctx.beginPath();
        ctx.moveTo(x + fall * 0.55, y - fall - 55);
        ctx.lineTo(x, y - fall);
        ctx.stroke();
        ctx.fillStyle = j % 2 ? "#fde68a" : "#fb923c";
        ctx.beginPath();
        ctx.arc(x, y - fall, big ? 12 : 6 + evo, 0, Math.PI * 2);
        ctx.fill();
        if (age > 0.28) {
          ctx.strokeStyle = "#fed7aa";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(x, y, 10 + age * 22, 5 + age * 9, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    } else if (fx.kind === "blizzard" || fx.kind === "fox") {
      const count = big ? 18 : 8 + evo * 2;
      const h = big ? 16 : 9 + evo * 2;
      for (let j = 0; j < count; j++) {
        const a = j * 2.399 + age * 1.9;
        const d = r * (0.28 + (j % 5) * 0.14);
        const x = Math.cos(a) * d;
        const y = Math.sin(a) * d;
        ctx.fillStyle = j % 2 ? "#e0f2fe" : "#7dd3fc";
        ctx.beginPath();
        ctx.moveTo(x, y - h);
        ctx.lineTo(x + 6, y);
        ctx.lineTo(x, y + h * 0.65);
        ctx.lineTo(x - 6, y);
        ctx.closePath();
        ctx.fill();
      }
    } else if (fx.kind === "thunder" || fx.kind === "owl") {
      const count = big ? 12 : 5 + evo * 2;
      for (let j = 0; j < count; j++) {
        const a = j * 2.399;
        const d = r * (0.25 + (j % 4) * 0.2);
        const x = Math.cos(a) * d;
        const y = Math.sin(a) * d;
        ctx.strokeStyle = j % 2 ? "#fef08a" : "#e9d5ff";
        ctx.lineWidth = big ? 4 : 2.2 + evo * 0.5;
        ctx.beginPath();
        ctx.moveTo(x + 14, y - (big ? 210 : 75));
        ctx.lineTo(x - 8, y - 60);
        ctx.lineTo(x + 12, y - 42);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(x, y, 20, 8, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (fx.kind === "summon_overdrive") {
      for (let j = 0; j < 12; j++) {
        const a = (j * Math.PI) / 6 + age * 1.5;
        const x = Math.cos(a) * r * 0.72;
        const y = Math.sin(a) * r * 0.72;
        ctx.strokeStyle = "#fde68a";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y - 160);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    } else {
      for (let j = 0; j < 10 + evo * 2; j++) {
        const a = (j * Math.PI) / 5 + age * 0.6;
        const x = Math.cos(a) * r * 0.65;
        const y = Math.sin(a) * r * 0.65;
        ctx.fillStyle = fx.color;
        ctx.beginPath();
        if (fx.kind === "rabbit") {
          ctx.fillRect(x - 2, y - 8, 4, 16);
          ctx.fillRect(x - 8, y - 2, 16, 4);
        } else {
          for (let n = 0; n < 6; n++) {
            const aa = (n * Math.PI) / 3;
            const xx = x + Math.cos(aa) * 10;
            const yy = y + Math.sin(aa) * 10;
            n ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  const event = engine.encounter;
  if (event && !event.claimed) {
    ctx.save();
    ctx.translate(event.x, event.y);
    const pulse = 1 + Math.sin(now * 0.004) * 0.1;
    ctx.strokeStyle =
      event.kind === "feast"
        ? "#ffe3a0"
        : event.kind === "merchant"
          ? "#38bdf8"
          : "#ceacff";
    ctx.lineWidth = 2.2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.ellipse(0, 0, 65 * pulse, 35 * pulse, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#121620ee";
    ctx.fillRect(-74, -66, 148, 22);
    ctx.fillStyle = "#ffe3a0";
    ctx.textAlign = "center";
    ctx.font = "bold 11px system-ui";
    ctx.fillText(
      event.kind === "feast"
        ? "TIỆC LINH THÚ · E"
        : event.kind === "merchant"
          ? "THƯƠNG NHÂN · E"
          : "ĐÀI CỔ NGỮ · E",
      0,
      -51
    );
    const evSpriteUrl =
      event.kind === "feast"
        ? "/assets/tinyswords/meat_heal.png"
        : event.kind === "merchant"
          ? "/assets/wesnoth/items/chest.png"
          : "/assets/wesnoth/items/altar.png";
    const evImg = getCachedAssetImage(evSpriteUrl);
    if (evImg.complete && evImg.naturalWidth > 0) {
      ctx.drawImage(evImg, -26, -38, 52, 52);
    }
    ctx.restore();
  }
  ctx.restore();
}

function drawSinglePetUnit(
  ctx: CanvasRenderingContext2D,
  pet: PetUnit,
  now: number
): void {
  const def = PETS.find((p) => p.id === pet.id)!;
  const form = getPetForm(pet.id, pet.evolution);
  const img = getCachedAssetImage(form.spriteUrl);
  if (!img.complete || !img.naturalWidth) return;

  const bob = Math.sin(now * 0.0045 + pet.id.length * 2) * 3;
  const clampedScale = Math.min(1.38, form.scale);
  const isCasting = pet.aiState === "cast";
  const isApproaching = pet.aiState === "approach";
  const castPulse = isCasting ? 1.15 : 1.0;
  const drawSz = Math.round(58 * clampedScale * castPulse);

  ctx.save();
  ctx.translate(Math.round(pet.x), Math.round(pet.y));

  // Evolution & AI State aura ring beneath the beast
  ctx.fillStyle = "rgba(10, 14, 22, 0.42)";
  ctx.beginPath();
  ctx.ellipse(0, 7, 17 * clampedScale, 6.5 * clampedScale, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle =
    (pet.comboFlashTimer ?? 0) > 0
      ? "#FACC15"
      : isCasting
      ? "#FFFFFF"
      : pet.evolution >= 3
      ? "#fbbf24"
      : def.color + "cc";
  ctx.lineWidth = isCasting ? 3.2 : 1.8 + pet.evolution * 0.4;
  ctx.beginPath();
  ctx.ellipse(0, 7, 17 * clampedScale * castPulse, 6.5 * clampedScale * castPulse, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Cast Windup Telegraph Ring (Open-RPG 3-phase skill windup -> impact -> recovery)
  if (isCasting) {
    ctx.strokeStyle = def.color;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.arc(0, -12, 34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (isApproaching) {
    // Steering Pursue Dash Trail line
    ctx.strokeStyle = def.color + "88";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-(pet.vx ?? 0) * 0.09, -(pet.vy ?? 0) * 0.09);
    ctx.stroke();
  }

  ctx.imageSmoothingEnabled = false;
  if (isCasting || (pet.comboFlashTimer ?? 0) > 0) {
    ctx.filter = "brightness(1.45) contrast(1.15)";
  }
  ctx.drawImage(
    img,
    -Math.round(drawSz / 2),
    -Math.round(drawSz * 0.82) + bob,
    drawSz,
    drawSz
  );
  ctx.filter = "none";

  // Compact dark pill badge with AI state indicator so beast role & state are immediately readable
  const stateIcon =
    pet.aiState === "cast"
      ? "⚡"
      : pet.aiState === "approach"
      ? "⚔"
      : pet.aiState === "return"
      ? "↩"
      : "";
  const stars = pet.evolution > 0 ? `★${pet.evolution}` : "";
  const label = `${stateIcon}Lv.${pet.level}${stars}`;
  ctx.font = "800 9.5px system-ui, sans-serif";
  ctx.textAlign = "center";
  const pillW = 52;
  ctx.fillStyle = "rgba(9, 13, 20, 0.86)";
  ctx.fillRect(-pillW / 2, 11, pillW, 13);
  ctx.fillStyle =
    (pet.comboFlashTimer ?? 0) > 0
      ? "#FACC15"
      : pet.evolution >= 2
      ? "#fde047"
      : "#f8fafc";
  ctx.fillText(label, 0, 20.5);
  ctx.restore();
}
