const { Jimp } = require('jimp');

async function cropImage() {
  try {
    const images = [
      {
        in: 'C:/Users/baha/.gemini/antigravity/brain/8def928c-8c15-41aa-869e-0300dc7079ba/ayn_sof_aur_diagram_1779376755467.png',
        out: 'C:/projeler/proje1/assets/images/kabbalah/ai_generated/ayn_sof_aur_diagram.png'
      },
      {
        in: 'C:/Users/baha/.gemini/antigravity/brain/8def928c-8c15-41aa-869e-0300dc7079ba/eheieh_evolution_diagram_1779376961609.png',
        out: 'C:/projeler/proje1/assets/images/kabbalah/ai_generated/eheieh_evolution_diagram.png'
      },
      {
        in: 'C:/Users/baha/.gemini/antigravity/brain/8def928c-8c15-41aa-869e-0300dc7079ba/geometric_evolution_notext_1779378022800.png',
        out: 'C:/projeler/proje1/assets/images/kabbalah/ai_generated/geometric_evolution.png'
      }
    ];

    for (let config of images) {
      const image = await Jimp.read(config.in);
      const width = image.bitmap.width;
      const height = image.bitmap.height;
      
      const newHeight = Math.floor(height * 0.35);
      const yOffset = Math.floor((height - newHeight) / 2);
      
      image.crop({ x: 0, y: yOffset, w: width, h: newHeight });
      await image.write(config.out);
      console.log('Successfully cropped ' + config.out);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

cropImage();
