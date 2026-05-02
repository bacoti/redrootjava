const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, 'images');

async function resizeImages() {
  console.log('Mulai melakukan resize gambar besar...\n');

  // 1. Resize product_new.webp (dari 1122px ke maks 800px)
  const heroImg = path.join(imagesDir, 'product_new.webp');
  const heroImgOpt = path.join(imagesDir, 'product_new_opt.webp');
  if (fs.existsSync(heroImg)) {
    try {
      const buffer = await sharp(heroImg)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      
      fs.writeFileSync(heroImgOpt, buffer);
      console.log('[OK] product_new_opt.webp berhasil di-resize ke max-width 800px');
    } catch (e) {
      console.error('[ERROR] Gagal resize product_new.webp:', e.message);
    }
  }

  // 2. Resize logo.png (dari 442px ke maks 200px)
  const logoImg = path.join(imagesDir, 'logo.png');
  if (fs.existsSync(logoImg)) {
    try {
      const buffer = await sharp(logoImg)
        .resize({ width: 200, withoutEnlargement: true })
        .png({ quality: 90 })
        .toBuffer();
      
      fs.writeFileSync(logoImg, buffer);
      console.log('[OK] logo.png berhasil di-resize ke max-width 200px');
    } catch (e) {
      console.error('[ERROR] Gagal resize logo.png:', e.message);
    }
  }

  console.log('\nSelesai resize gambar!');
}

resizeImages();
