import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const parsed = path.parse(fullPath);
        // Exclude the placeholder and favicon if needed, but webp is universally better now
        // Let's keep apple-touch-icon.png or favicon.png as png if they exist just in case, but they are small.
        if (file === 'favicon.png' || file === 'apple-touch-icon.png') continue;

        const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);
        console.log(`Converting: ${file}`);

        try {
          await sharp(fullPath)
            .webp({ quality: 80, effort: 6 })
            .toFile(webpPath);

          console.log(`Success: -> ${parsed.name}.webp`);
          // Delete original
          fs.unlinkSync(fullPath);
        } catch (e) {
          console.error(`Error processing ${file}:`, e);
        }
      }
    }
  }
}

console.log('Starting image optimization...');
processDirectory(publicDir)
  .then(() => {
    console.log('Done!');
  })
  .catch(console.error);
