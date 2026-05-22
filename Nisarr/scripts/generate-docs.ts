import * as fs from 'fs';
import * as path from 'path';

const TARGET_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const DIRECTORIES_TO_SCAN = ['src', 'scripts', 'api', 'mcp-server'];
const DOCS_DIR = 'DOCS';

function generateDocs() {
  const rootDir = process.cwd();
  const docsRoot = path.join(rootDir, DOCS_DIR);

  if (!fs.existsSync(docsRoot)) {
    fs.mkdirSync(docsRoot, { recursive: true });
  }

  DIRECTORIES_TO_SCAN.forEach(dir => {
    const dirPath = path.join(rootDir, dir);
    if (fs.existsSync(dirPath)) {
      scanDirectory(dirPath, rootDir, docsRoot);
    }
  });

  console.log('Documentation generation complete.');
}

function scanDirectory(currentPath: string, rootDir: string, docsRoot: string) {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentPath, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath, rootDir, docsRoot);
    } else {
      const ext = path.extname(entry.name);
      if (TARGET_EXTENSIONS.includes(ext)) {
        createDocFile(fullPath, rootDir, docsRoot);
      }
    }
  }
}

function createDocFile(sourcePath: string, rootDir: string, docsRoot: string) {
  const relativePath = path.relative(rootDir, sourcePath);
  
  // Creates Docs/scripts/dev-api.ts.md maintaining exact pathing but as markdown
  const docFilePath = path.join(docsRoot, `${relativePath}.md`);
  
  const docFileDir = path.dirname(docFilePath);
  if (!fs.existsSync(docFileDir)) {
    fs.mkdirSync(docFileDir, { recursive: true });
  }

  const dartSection = `\n\n## Dart Implementation\n\nHow to implement this code in Dart for APK, iOS, Web, and all platforms:\n\n\`\`\`dart\n// Dart implementation guide and code here\n\`\`\`\n`;

  if (!fs.existsSync(docFilePath)) {
    const content = `# ${relativePath}\n\nDocumentation for \`${relativePath}\`.\n\n## Overview\n\n` + dartSection;
    fs.writeFileSync(docFilePath, content, 'utf8');
    console.log(`Created: ${docFilePath}`);
  } else {
    let existingContent = fs.readFileSync(docFilePath, 'utf8');
    if (!existingContent.includes('## Dart Implementation')) {
      existingContent += dartSection;
      fs.writeFileSync(docFilePath, existingContent, 'utf8');
      console.log(`Updated: ${docFilePath}`);
    } else {
      // console.log(`Skipped (already exists): ${docFilePath}`);
    }
  }
}

generateDocs();
