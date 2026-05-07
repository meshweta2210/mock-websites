const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const generateCaptchaImage = async (text) => {
  const width = 200;
  const height = 80;
  const fontSize = 40;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f0f0f0"/>
      <line x1="10" y1="30" x2="190" y2="50" stroke="#999" stroke-width="2" opacity="0.3"/>
      <line x1="20" y1="60" x2="180" y2="20" stroke="#999" stroke-width="2" opacity="0.3"/>
      <circle cx="50" cy="40" r="20" fill="none" stroke="#ddd" stroke-width="1" opacity="0.5"/>
      <circle cx="150" cy="60" r="25" fill="none" stroke="#ddd" stroke-width="1" opacity="0.5"/>
      <text x="50%" y="55%"
            font-size="${fontSize}"
            font-family="Arial, sans-serif"
            font-weight="bold"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="#333"
            transform="rotate(${Math.random() * 10 - 5} 100 40)"
            letter-spacing="5">
        ${text.toUpperCase()}
      </text>
    </svg>
  `;

  const fileName = `captcha_${Date.now()}.png`;
  const filePath = path.join(__dirname, '../public/img', fileName);

  const imgDir = path.join(__dirname, '../public/img');
  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
  }

  await sharp(Buffer.from(svg))
    .png()
    .toFile(filePath);

  return fileName;
};

module.exports = { generateCaptchaImage };
