const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  require.resolve('terser');
  require.resolve('clean-css');
} catch (e) {
  console.log('Menginstall dependencies untuk minifier...');
  execSync('npm install terser clean-css --no-save', { stdio: 'inherit' });
}

const { minify } = require('terser');
const CleanCSS = require('clean-css');

const rootDir = __dirname;
const cssDir = path.join(rootDir, 'css');
const jsDir = path.join(rootDir, 'js');

const jsFiles = ['main.js', 'i18n.js', 'feedback.js'];
const cssFiles = ['style.css', 'feedback.css'];

async function minifyFiles() {
  console.log('\n--- Minifying JavaScript ---');
  for (const file of jsFiles) {
    const inputPath = path.join(jsDir, file);
    const outputPath = path.join(jsDir, file.replace('.js', '.min.js'));
    
    if (fs.existsSync(inputPath)) {
      const code = fs.readFileSync(inputPath, 'utf8');
      const result = await minify(code, {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      });
      fs.writeFileSync(outputPath, result.code);
      
      const inSize = (fs.statSync(inputPath).size / 1024).toFixed(2);
      const outSize = (fs.statSync(outputPath).size / 1024).toFixed(2);
      console.log(`[OK] ${file}: ${inSize}KB -> ${outSize}KB`);
    }
  }

  console.log('\n--- Minifying CSS ---');
  for (const file of cssFiles) {
    const inputPath = path.join(cssDir, file);
    const outputPath = path.join(cssDir, file.replace('.css', '.min.css'));
    
    if (fs.existsSync(inputPath)) {
      const code = fs.readFileSync(inputPath, 'utf8');
      const result = new CleanCSS({ level: 2 }).minify(code);
      fs.writeFileSync(outputPath, result.styles);
      
      const inSize = (fs.statSync(inputPath).size / 1024).toFixed(2);
      const outSize = (fs.statSync(outputPath).size / 1024).toFixed(2);
      console.log(`[OK] ${file}: ${inSize}KB -> ${outSize}KB`);
    }
  }
  
  console.log('\nMinifikasi Selesai!');
}

minifyFiles();
