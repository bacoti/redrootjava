const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, 'images');

async function resizeImages() {
  console.log('Mulai melakukan resize gambar besar...\n');

  // 1. Resize product_new.webp (dari 1122px ke maks 672px)
  const heroImg = path.join(imagesDir, 'product_new.webp');
  const heroImgOpt = path.join(imagesDir, 'product_new_opt.webp');
  if (fs.existsSync(heroImg)) {
    try {
      const buffer = await sharp(heroImg)
        .resize({ width: 672, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      
      fs.writeFileSync(heroImgOpt, buffer);
      console.log('[OK] product_new_opt.webp berhasil di-resize ke max-width 672px');
    } catch (e) {
      console.error('[ERROR] Gagal resize product_new.webp:', e.message);
    }
  }

  // 2. Resize logo.png (dari 442px ke maks 88px)
  const logoImg = path.join(imagesDir, 'logo.png');
  const logoImgOpt = path.join(imagesDir, 'logo_opt.png');
  if (fs.existsSync(logoImg)) {
    try {
      const buffer = await sharp(logoImg)
        .resize({ width: 88, withoutEnlargement: true })
        .png({ quality: 90 })
        .toBuffer();
      
      fs.writeFileSync(logoImgOpt, buffer);
      console.log('[OK] logo_opt.png berhasil di-resize ke max-width 88px');
    } catch (e) {
      console.error('[ERROR] Gagal resize logo.png:', e.message);
    }
  }

  console.log('\nSelesai resize gambar!');
}

resizeImages();
