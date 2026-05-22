const fs = require('fs');
const path = require('path');

const srcUi = 'c:/Users/Adnan/Downloads/LifeSolver/src/components/ui';
const docsUi = 'c:/Users/Adnan/Downloads/LifeSolver/DOCS/src/components/ui';

if (!fs.existsSync(docsUi)) {
    fs.mkdirSync(docsUi, { recursive: true });
}

const files = fs.readdirSync(srcUi).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

files.forEach(file => {
    const mdPath = path.join(docsUi, `${file}.md`);
    
    const content = `# src/components/ui/${file}

Documentation for \`src/components/ui/${file}\`.

## Overview
This is a standard [shadcn/ui](https://ui.shadcn.com/) functional component port adapted for React and tailwindcss. It primarily manages accessible headless UI primitives (via Radix UI) and applies generic utility classes using \`cn()\`.

## Dart Implementation

In Flutter, standard material/cupertino widgets naturally handle the vast majority of these micro-interaction constraints natively out of the box. Do not attempt to re-write a 1:1 headless UI paradigm in Dart; simply map the intent (e.g., \`dialog.tsx\` -> \`showDialog()\`, \`sheet.tsx\` -> \`showModalBottomSheet()\`, \`progress.tsx\` -> \`LinearProgressIndicator\`).

If exact visual replication of shadcn design language is desired, custom \`ThemeData\` configurations or third-party packages like [shadcn_ui for flutter](https://pub.dev/packages/shadcn_ui) can be installed.
`;

    fs.writeFileSync(mdPath, content);
    console.log(`Generated: ${mdPath}`);
});
