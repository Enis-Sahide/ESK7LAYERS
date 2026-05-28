import { Jimp } from 'jimp';
async function main() {
  const img = await Jimp.read('https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/backgrounds/esoteric_bg.png');
  img.color([{ apply: 'hue', params: [-40] }]);
  await img.write('assets/images/esoteric_bg_indigo.png');
  console.log('Done');
}
main().catch(err => console.error(err));
