/**
 * 7Layers - Kelt Druid Ağacı Yüksek Çözünürlüklü Karakter ve Hikaye Kartı Kaynakları
 */

export const DRUID_TREE_IMAGES: Record<string, any> = {
  birch: require('@/assets/druid-trees/birch.jpg'),
  rowan: require('@/assets/druid-trees/rowan.jpg'),
  ash: require('@/assets/druid-trees/ash.jpg'),
  alder: require('@/assets/druid-trees/alder.jpg'),
  willow: require('@/assets/druid-trees/willow.jpg'),
  hawthorn: require('@/assets/druid-trees/hawthorn.jpg'),
  oak: require('@/assets/druid-trees/oak.jpg'),
  holly: require('@/assets/druid-trees/holly.jpg'),
  hazel: require('@/assets/druid-trees/hazel.jpg'),
  vine: require('@/assets/druid-trees/vine.jpg'),
  ivy: require('@/assets/druid-trees/ivy.jpg'),
  reed: require('@/assets/druid-trees/reed.jpg'),
  elder: require('@/assets/druid-trees/elder.jpg'),
};

export const DRUID_TREE_CARDS: Record<string, any> = {
  birch: require('@/assets/druid-trees/birch-card.jpg'),
  rowan: require('@/assets/druid-trees/rowan-card.jpg'),
  ash: require('@/assets/druid-trees/ash-card.jpg'),
  alder: require('@/assets/druid-trees/alder-card.jpg'),
  willow: require('@/assets/druid-trees/willow-card.jpg'),
  hawthorn: require('@/assets/druid-trees/hawthorn-card.jpg'),
  oak: require('@/assets/druid-trees/oak-card.jpg'),
  holly: require('@/assets/druid-trees/holly-card.jpg'),
  hazel: require('@/assets/druid-trees/hazel-card.jpg'),
  vine: require('@/assets/druid-trees/vine-card.jpg'),
  ivy: require('@/assets/druid-trees/ivy-card.jpg'),
  reed: require('@/assets/druid-trees/reed-card.jpg'),
  elder: require('@/assets/druid-trees/elder-card.jpg'),
};

export function getDruidTreeImage(id: string): any {
  return DRUID_TREE_IMAGES[id] || { uri: `https://7layers.tr/druid-trees/${id}.jpg` };
}

export function getDruidTreeCard(id: string): any {
  return DRUID_TREE_CARDS[id] || { uri: `https://7layers.tr/druid-trees/${id}-card.jpg` };
}

// Geriye dönük uyumluluk
export const getDruidTreeGif = getDruidTreeCard;
