const fs = require('fs');
const path = require('path');

/**
 * Texas Total Loss — Series B Global Verifier
 * Ensures all hex colors in src/ originate from theme.json brand tokens.
 * Forces design system consistency across the entire TTL platform.
 *
 * Usage: node scripts/verifier.js
 * CI: Add to package.json scripts as "verify": "node scripts/verifier.js"
 */

const THEME_PATH = path.join(__dirname, '../theme.json');
const SRC_PATH   = path.join(__dirname, '../src');
const ALLOWED_EXTENSIONS = ['.css', '.tsx', '.ts', '.html'];

// Load official tokens from theme.json
let officialTokens = [];
try {
  const themeData = JSON.parse(fs.readFileSync(THEME_PATH, 'utf8'));

  const extractHex = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && /^#([A-Fa-f0-9]{3}){1,2}$/.test(obj[key])) {
        officialTokens.push(obj[key].toLowerCase());
      } else if (typeof obj[key] === 'object') {
        extractHex(obj[key]);
      }
    }
  };

  extractHex(themeData.tokens.colors);
  console.log(`✅ Loaded ${officialTokens.length} official brand tokens from theme.json`);
} catch (err) {
  console.error(`❌ Error loading theme.json: ${err.message}`);
  process.exit(1);
}

// Audit src/ files for rogue hex codes
const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;
let violations = [];

const walk = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath);
    } else if (ALLOWED_EXTENSIONS.includes(path.extname(file))) {
      const content = fs.readFileSync(filePath, 'utf8');
      let match;
      // Reset regex for each file
      hexRegex.lastIndex = 0;
      while ((match = hexRegex.exec(content)) !== null) {
        const hex = match[0].toLowerCase();
        if (!officialTokens.includes(hex)) {
          const lineNum = content.substring(0, match.index).split('\n').length;
          violations.push({
            file: path.relative(path.join(__dirname, '..'), filePath),
            hex: match[0],
            line: lineNum,
          });
        }
      }
    }
  });
};

console.log(`🔍 Auditing src/ for rogue hex codes...`);
if (fs.existsSync(SRC_PATH)) {
  walk(SRC_PATH);
}

if (violations.length > 0) {
  console.error(`\n❌ Design Token Violations Found (${violations.length}):`);
  violations.forEach((v) => {
    console.error(`  - ${v.file}:${v.line} → Found raw color "${v.hex}" — add to theme.json`);
  });
  process.exit(1);
} else {
  console.log(`\n✨ All colors verified against theme.json brand tokens.`);
  process.exit(0);
}
