export type SheetKey =
  | "warrior_blue"
  | "warrior_red"
  | "goblin_torch"
  | "goblin_tnt"
  | "dynamite"
  | "arrow"
  | "dead"
  | "explosions"
  | "fire"
  | "tree"
  | "tilemap_grass"
  | "tilemap_sand"
  | "tilemap_elevation"
  | "ruin_castle"
  | "ruin_tower"
  | "ruin_house"
  | "gold_mine"
  | "gold_bag"
  | "meat_heal"
  | "deco_01"
  | "deco_02"
  | "deco_04"
  | "deco_05"
  | "deco_06"
  | "deco_07"
  | "deco_08"
  | "deco_09"
  | "deco_16"
  | "deco_17"
  | "deco_18";

export interface LoadedSheet {
  img: HTMLImageElement | HTMLCanvasElement;
  rawImg: HTMLImageElement;
  flashCanvas: HTMLCanvasElement | null;
}

const SHEET_FILES: Record<SheetKey, string> = {
  warrior_blue: "/assets/tinyswords/warrior_blue.png",
  warrior_red: "/assets/tinyswords/warrior_red.png",
  goblin_torch: "/assets/tinyswords/goblin_torch.png",
  goblin_tnt: "/assets/tinyswords/goblin_tnt.png",
  dynamite: "/assets/tinyswords/dynamite.png",
  arrow: "/assets/tinyswords/arrow.png",
  dead: "/assets/tinyswords/dead.png",
  explosions: "/assets/tinyswords/explosions.png",
  fire: "/assets/tinyswords/fire.png",
  tree: "/assets/tinyswords/tree.png",
  tilemap_grass: "/assets/tinyswords/tilemap_grass.png",
  tilemap_sand: "/assets/tinyswords/tilemap_sand.png",
  tilemap_elevation: "/assets/tinyswords/tilemap_elevation.png",
  ruin_castle: "/assets/tinyswords/ruin_castle.png",
  ruin_tower: "/assets/tinyswords/ruin_tower.png",
  ruin_house: "/assets/tinyswords/ruin_house.png",
  gold_mine: "/assets/tinyswords/gold_mine.png",
  gold_bag: "/assets/tinyswords/gold_bag.png",
  meat_heal: "/assets/tinyswords/meat_heal.png",
  deco_01: "/assets/tinyswords/deco_01.png",
  deco_02: "/assets/tinyswords/deco_02.png",
  deco_04: "/assets/tinyswords/deco_04.png",
  deco_05: "/assets/tinyswords/deco_05.png",
  deco_06: "/assets/tinyswords/deco_06.png",
  deco_07: "/assets/tinyswords/deco_07.png",
  deco_08: "/assets/tinyswords/deco_08.png",
  deco_09: "/assets/tinyswords/deco_09.png",
  deco_16: "/assets/tinyswords/deco_16.png",
  deco_17: "/assets/tinyswords/deco_17.png",
  deco_18: "/assets/tinyswords/deco_18.png",
};

/**
 * Harmonizes terrain tilemaps once at load time so Pixel Frog's hand-drawn
 * grass blades, scalloped edges, corners, and #181425 pixel outlines remain
 * crisp while reducing ground saturation/contrast so characters & FX pop.
 */
function createHarmonizedTerrainCanvas(
  rawImg: HTMLImageElement,
  mode: "grass" | "earth"
): HTMLCanvasElement {
  const cvs = document.createElement("canvas");
  cvs.width = rawImg.width;
  cvs.height = rawImg.height;
  const ctx = cvs.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(rawImg, 0, 0);

  const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height);
  const d = imgData.data;

  for (let i = 0; i < d.length; i += 4) {
    const a = d[i + 3];
    if (a < 10) continue;
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];

    // Soften pitch-black #181425 terrain border outlines into natural moss/earth shadow
    // so grass-to-dirt transitions on the same ground plane don't look like black-outlined stickers
    if (r < 48 && g < 52 && b < 64) {
      if (mode === "grass") {
        d[i] = 66;
        d[i + 1] = 88;
        d[i + 2] = 56;
      } else {
        d[i] = 104;
        d[i + 1] = 86;
        d[i + 2] = 62;
      }
      continue;
    }

    if (mode === "grass") {
      // Unify yellow-green vs blue-green horizontal wave bands into a calm,
      // low-contrast forest meadow green (#54764C) so interior tiles don't stripe
      const lum = (r * 0.32 + g * 0.54 + b * 0.14) / 255;
      const delta = (lum - 0.58) * 22;
      d[i] = Math.max(58, Math.min(112, Math.round(84 + delta * 0.85)));
      d[i + 1] = Math.max(82, Math.min(146, Math.round(118 + delta)));
      d[i + 2] = Math.max(50, Math.min(98, Math.round(76 + delta * 0.65)));
    } else {
      // Shift bright yellow sand into warm, low-contrast castle-courtyard earth (#887152)
      const lum = (r * 0.35 + g * 0.5 + b * 0.15) / 255;
      const delta = (lum - 0.78) * 28;
      d[i] = Math.max(76, Math.min(162, Math.round(136 + delta)));
      d[i + 1] = Math.max(62, Math.min(140, Math.round(113 + delta * 0.85)));
      d[i + 2] = Math.max(44, Math.min(106, Math.round(82 + delta * 0.65)));
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return cvs;
}

class TinySwordsAtlas {
  public ready = false;
  public sheets: Partial<Record<SheetKey, LoadedSheet>> = {};
  private loadingPromise: Promise<void> | null = null;

  public ensureLoaded(): Promise<void> {
    if (this.loadingPromise) return this.loadingPromise;

    const entries = Object.entries(SHEET_FILES) as Array<[SheetKey, string]>;
    this.loadingPromise = Promise.all(
      entries.map(async ([key, url]) => {
        const rawImg = await this.loadImage(url);

        let img: HTMLImageElement | HTMLCanvasElement = rawImg;
        if (key === "tilemap_grass") {
          img = createHarmonizedTerrainCanvas(rawImg, "grass");
        } else if (key === "tilemap_sand") {
          img = createHarmonizedTerrainCanvas(rawImg, "earth");
        }

        // Pre-build white hit-flash silhouette ONLY for unit sheets (no wasted DOM canvases)
        const needsFlash =
          key === "warrior_blue" ||
          key === "warrior_red" ||
          key === "goblin_torch" ||
          key === "goblin_tnt";
        let flashCanvas: HTMLCanvasElement | null = null;
        if (needsFlash) {
          flashCanvas = document.createElement("canvas");
          flashCanvas.width = rawImg.width;
          flashCanvas.height = rawImg.height;
          const fctx = flashCanvas.getContext("2d")!;
          fctx.imageSmoothingEnabled = false;
          fctx.drawImage(rawImg, 0, 0);
          fctx.globalCompositeOperation = "source-in";
          fctx.fillStyle = "#FFFFFF";
          fctx.fillRect(0, 0, rawImg.width, rawImg.height);
        }
        this.sheets[key] = { img, rawImg, flashCanvas };
      })
    )
      .then(() => {
        this.ready = true;
      })
      .catch((err) => {
        console.warn("TinySwordsAtlas load error:", err);
      });

    return this.loadingPromise;
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  public drawCell(
    ctx: CanvasRenderingContext2D,
    key: SheetKey,
    row: number,
    col: number,
    cellW: number,
    cellH: number,
    x: number,
    y: number,
    drawW: number,
    drawH: number,
    flipX = false,
    flashWhite = false,
    alpha = 1
  ): void {
    const sheet = this.sheets[key];
    if (!sheet) return;

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (alpha < 1) ctx.globalAlpha = alpha;
    ctx.translate(Math.round(x), Math.round(y));
    if (flipX) ctx.scale(-1, 1);

    const sx = col * cellW;
    const sy = row * cellH;
    const source =
      flashWhite && sheet.flashCanvas ? sheet.flashCanvas : sheet.img;

    ctx.drawImage(
      source,
      sx,
      sy,
      cellW,
      cellH,
      Math.round(-drawW / 2),
      Math.round(-drawH / 2),
      drawW,
      drawH
    );
    ctx.restore();
  }
}

export const spriteAtlas = new TinySwordsAtlas();
