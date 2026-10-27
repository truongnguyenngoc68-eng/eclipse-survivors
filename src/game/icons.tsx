import React from "react";

export type GameIconId =
  | "broadsword"
  | "broadsword_evo"
  | "astral_bow"
  | "astral_bow_evo"
  | "flying_shield"
  | "flying_shield_evo"
  | "quake_hammer"
  | "quake_hammer_evo"
  | "frost_tome"
  | "frost_tome_evo"
  | "oil_torch"
  | "oil_torch_evo"
  | "lightning_magnet"
  | "lightning_magnet_evo"
  | "decoy_bomb"
  | "decoy_bomb_evo"
  | "dragon_fire"
  | "dragon_fire_evo"
  | "thunder_lance"
  | "thunder_lance_evo"
  | "frost_nova"
  | "frost_nova_evo"
  | "might"
  | "haste"
  | "phantom_boots"
  | "boots"
  | "baby_dragon"
  | "wisdom"
  | "crit_tome"
  | "armor"
  | "armor_leather"
  | "breastplate"
  | "steel_armor"
  | "helmet_shiny"
  | "ring"
  | "ring_prismatic"
  | "necklace_amber"
  | "ankh_necklace"
  | "skull_ring"
  | "chest"
  | "chest_open"
  | "chest_ornate"
  | "gold"
  | "heart"
  | "dash"
  | "pause"
  | "synergy"
  | "nova_meteor"
  | "nova_blizzard"
  | "nova_thunder"
  | "nova_blackhole"
  | "nova_overdrive"
  | "stone"
  | "essence"
  | "dragon_emblem"
  | "scroll"
  | "map"
  | "gacha_star";

const WESNOTH_ICON_PATHS: Record<GameIconId, string> = {
  broadsword: "/assets/wesnoth/icons/greatsword-human.png",
  broadsword_evo: "/assets/wesnoth/icons/sword-holy.png",
  astral_bow: "/assets/wesnoth/icons/bow-elven.png",
  astral_bow_evo: "/assets/wesnoth/icons/bow-elven-magic.png",
  flying_shield: "/assets/wesnoth/icons/heater-shield.png",
  flying_shield_evo: "/assets/wesnoth/icons/rectangular-shield.png",
  quake_hammer: "/assets/wesnoth/icons/hammer-dwarven.png",
  quake_hammer_evo: "/assets/wesnoth/icons/hammer-dwarven-runic.png",
  frost_tome: "/assets/wesnoth/icons/iceball.png",
  frost_tome_evo: "/assets/wesnoth/icons/faerie-fire.png",
  oil_torch: "/assets/wesnoth/icons/torch.png",
  oil_torch_evo: "/assets/wesnoth/icons/fire-blast.png",
  lightning_magnet: "/assets/wesnoth/icons/lightning.png",
  lightning_magnet_evo: "/assets/wesnoth/icons/lightbeam.png",
  decoy_bomb: "/assets/wesnoth/icons/thunderstick.png",
  decoy_bomb_evo: "/assets/wesnoth/icons/fireball.png",
  dragon_fire: "/assets/wesnoth/icons/fire-breath-drake.png",
  dragon_fire_evo: "/assets/wesnoth/icons/fire-breath-drake.png",
  thunder_lance: "/assets/wesnoth/icons/lance.png",
  thunder_lance_evo: "/assets/wesnoth/icons/lance.png",
  frost_nova: "/assets/wesnoth/icons/waterspray.png",
  frost_nova_evo: "/assets/wesnoth/icons/waterspray.png",
  might: "/assets/wesnoth/icons/crossed_sword_and_hammer.png",
  haste: "/assets/wesnoth/icons/circlet_winged.png",
  phantom_boots: "/assets/wesnoth/icons/boots_elven.png",
  boots: "/assets/wesnoth/icons/boots_elven.png",
  baby_dragon: "/assets/wesnoth/icons/claws-drake.png",
  wisdom: "/assets/wesnoth/icons/book.png",
  crit_tome: "/assets/wesnoth/icons/book2.png",
  armor: "/assets/wesnoth/icons/cuirass_muscled.png",
  armor_leather: "/assets/wesnoth/icons/armor_leather.png",
  breastplate: "/assets/wesnoth/icons/breastplate.png",
  steel_armor: "/assets/wesnoth/icons/steel_armor.png",
  helmet_shiny: "/assets/wesnoth/icons/helmet_shiny.png",
  ring: "/assets/wesnoth/icons/ring_gold.png",
  ring_prismatic: "/assets/wesnoth/icons/jewelry_ring_prismatic.png",
  necklace_amber: "/assets/wesnoth/icons/jewelry_necklace_amber.png",
  ankh_necklace: "/assets/wesnoth/icons/ankh_necklace.png",
  skull_ring: "/assets/wesnoth/icons/skull_ring.png",
  chest: "/assets/wesnoth/items/chest-plain-closed.png",
  chest_open: "/assets/wesnoth/items/chest-plain-open.png",
  chest_ornate: "/assets/wesnoth/items/chest.png",
  gold: "/assets/wesnoth/items/gold-coins-medium.png",
  heart: "/assets/wesnoth/icons/potion_red_medium.png",
  dash: "/assets/wesnoth/icons/foot-boot.png",
  pause: "/assets/wesnoth/icons/key_silver.png",
  synergy: "/assets/wesnoth/icons/magic-missile.png",
  nova_meteor: "/assets/wesnoth/icons/fireball.png",
  nova_blizzard: "/assets/wesnoth/icons/iceball.png",
  nova_thunder: "/assets/wesnoth/icons/lightning.png",
  nova_blackhole: "/assets/wesnoth/icons/dark-missile.png",
  nova_overdrive: "/assets/wesnoth/icons/frenzy.png",
  stone: "/assets/wesnoth/icons/stone_ring.png",
  essence: "/assets/wesnoth/icons/potion_green_medium.png",
  dragon_emblem: "/assets/wesnoth/icons/claws-drake.png",
  scroll: "/assets/wesnoth/icons/scroll_red.png",
  map: "/assets/wesnoth/icons/letter_and_ale.png",
  gacha_star: "/assets/wesnoth/items/sceptre-of-fire.png",
};

export function getGameIconUrl(id: GameIconId): string {
  return WESNOTH_ICON_PATHS[id] || WESNOTH_ICON_PATHS.broadsword;
}

export function GameSvgIcon({
  id,
  size = 44,
  className = "",
}: {
  id: GameIconId;
  size?: number;
  className?: string;
}) {
  const src = getGameIconUrl(id);
  const isMapItemSprite = src.includes("/items/");
  return (
    <img
      src={src}
      alt={id}
      width={size}
      height={size}
      loading="eager"
      draggable={false}
      className={`game-wesnoth-icon ${className}`.trim()}
      style={{
        width: size,
        height: size,
        objectFit: "cover",
        display: "block",
        flexShrink: 0,
        borderRadius: size >= 24 ? 7 : 4,
        transform: isMapItemSprite ? "scale(1.36)" : undefined,
      }}
    />
  );
}
