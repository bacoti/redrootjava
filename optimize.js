const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define directories
const imagesDir = path.join(__dirname, 'images');

// Check if sharp is installed, if not, try to install it or warn the user
try {
  require.resolve('sharp');
} catch (e) {
  console.log('\x1b[33m%s\x1b[0m', 'Module "sharp" belum terinstall. Menginstall secara otomatis...');
  try {
    execSync('npm install sharp --no-save', { stdio: 'inherit' });
    console.log('\x1b[32m%s\x1b[0m', 'Berhasil menginstall sharp!\n');
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', 'Gagal menginstall sharp. Silakan jalankan "npm install sharp" secara manual terlebih dahulu.');
    process.exit(1);
  }
}

const sharp = require('sharp');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
  console.error(`Direktori ${imagesDir} tidak ditemukan!`);
  process.exit(1);
}

// Allowed extensions
const allowedExtensions = ['.png', '.jpg', '.jpeg'];

// Start optimization
console.log('\x1b[36m%s\x1b[0m', 'Mulai mengonversi gambar ke WebP...');

fs.readdir(imagesDir, async (err, files) => {
  if (err) {
    console.error('Gagal membaca folder images:', err);
    return;
  }

  let convertedCount = 0;
  let totalSavedBytes = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    
    if (allowedExtensions.includes(ext)) {
      const inputPath = path.join(imagesDir, file);
      const filenameWithoutExt = path.basename(file, ext);
      const outputPath = path.join(imagesDir, `${filenameWithoutExt}.webp`);

      // Skip if webp already exists
      if (fs.existsSync(outputPath)) {
        console.log(`[SKIP] ${outputPath} sudah ada.`);
        continue;
      }

      try {
        const inputSize = fs.statSync(inputPath).size;
        
        await sharp(inputPath)
          .webp({ quality: 80, effort: 6 }) // 80 quality is a great balance
          .toFile(outputPath);

        const outputSize = fs.statSync(outputPath).size;
        const savedMB = ((inputSize - outputSize) / (1024 * 1024)).toFixed(2);
        totalSavedBytes += (inputSize - outputSize);

        console.log(`\x1b[32m[OK]\x1b[0m ${file} -> .webp (Hemat ${savedMB} MB)`);
        convertedCount++;
      } catch (error) {
        console.error(`\x1b[31m[ERROR]\x1b[0m Gagal mengonversi ${file}:`, error.message);
      }
    }
  }

  const totalSavedMB = (totalSavedBytes / (1024 * 1024)).toFixed(2);
  console.log('\n\x1b[36m%s\x1b[0m', '===================================');
  console.log('\x1b[32m%s\x1b[0m', `Selesai! Berhasil mengonversi ${convertedCount} gambar.`);
  console.log('\x1b[33m%s\x1b[0m', `Total penyimpanan yang dihemat: ${totalSavedMB} MB!`);
  console.log('\x1b[36m%s\x1b[0m', '===================================');
});
