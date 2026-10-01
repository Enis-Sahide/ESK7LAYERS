/**
 * 7Layers - Kelt Druid Ağacı Canlı Maskot GIF Kaynakları
 */

export const DRUID_TREE_GIFS: Record<string, any> = {
  birch: require('@/assets/druid-tree-gifs/birch.gif'),
  rowan: require('@/assets/druid-tree-gifs/rowan.gif'),
  ash: require('@/assets/druid-tree-gifs/ash.gif'),
  alder: require('@/assets/druid-tree-gifs/alder.gif'),
  willow: require('@/assets/druid-tree-gifs/willow.gif'),
  hawthorn: require('@/assets/druid-tree-gifs/hawthorn.gif'),
  oak: require('@/assets/druid-tree-gifs/oak.gif'),
  holly: require('@/assets/druid-tree-gifs/holly.gif'),
  hazel: require('@/assets/druid-tree-gifs/hazel.gif'),
  vine: require('@/assets/druid-tree-gifs/vine.gif'),
  ivy: require('@/assets/druid-tree-gifs/ivy.gif'),
  reed: require('@/assets/druid-tree-gifs/reed.gif'),
  elder: require('@/assets/druid-tree-gifs/elder.gif'),
};

export function getDruidTreeGif(id: string): any {
  return DRUID_TREE_GIFS[id] || { uri: `https://7layers.tr/druid-tree-gifs/${id}.gif` };
}
