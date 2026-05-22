import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..', 'public');
const svgPath = resolve(publicDir, 'logo.svg');
const svgBuffer = readFileSync(svgPath);

const sizes = [
    { name: 'favicon-16.png', size: 16 },
    { name: 'favicon-32.png', size: 32 },
    { name: 'logo-192.png', size: 192 },
    { name: 'logo-512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
];

for (const { name, size } of sizes) {
    await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(resolve(publicDir, name));
    console.log(`✅ Generated ${name} (${size}x${size})`);
}

// Generate proper ICO file from the 32x32 PNG
const png32Path = resolve(publicDir, 'favicon-32.png');
const icoBuffer = await pngToIco(png32Path);
writeFileSync(resolve(publicDir, 'favicon.ico'), icoBuffer);
console.log('✅ Generated favicon.ico (proper ICO format)');

console.log('\n🎉 All icons generated from logo.svg!');
