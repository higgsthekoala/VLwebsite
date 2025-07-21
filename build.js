// Add at the top
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const esbuild = require('esbuild');
const glob = require('glob');
const fs = require('fs');
const path = require('path');

const isWatchMode = process.argv.includes('--watch');

// Add this function above copyEssentialFiles
const processCSS = async () => {
  const cssPath = path.resolve(__dirname, 'src/styles/globals.css');
  const destPath = path.resolve(__dirname, 'dist/index.css');
  
  try {
    const css = fs.readFileSync(cssPath, 'utf8');
    const result = await postcss([
      tailwindcss(),
      autoprefixer()
    ]).process(css, { from: cssPath, to: destPath });
    
    await ensureDir(path.dirname(destPath));
    fs.writeFileSync(destPath, result.css);
    console.log('✅ Processed CSS with Tailwind');
  } catch (err) {
    console.error('❌ CSS processing failed:', err);
  }
};

// Update runBuild function
const runBuild = async () => {
  try {
    await esbuild.build(esbuildOptions);
    await processCSS(); // Add this line
    await copyEssentialFiles();
    console.log('🚀 Build successful!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
};