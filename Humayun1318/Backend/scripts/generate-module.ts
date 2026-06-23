import fs from 'fs';
import path from 'path';
import readline from 'readline';
import 'colors';

type ModuleContentGenerator = (
  moduleName: string,
  moduleNameCased: string,
) => string;

const moduleContentGenerators: Record<string, ModuleContentGenerator> = {
  service: (
    moduleName,
    moduleNameCased,
  ) => `const create${moduleNameCased} = async () => {};
const getAll${moduleNameCased} = async () => {};
const get${moduleNameCased}ById = async () => {};
const update${moduleNameCased} = async () => {};
const delete${moduleNameCased} = async () => {};

export const ${moduleName}Service = {
  create${moduleNameCased},
  getAll${moduleNameCased},
  get${moduleNameCased}ById,
  update${moduleNameCased},
  delete${moduleNameCased},
};`,

  controller: (
    moduleName,
    moduleNameCased,
  ) => `import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { ${moduleName}Service } from './${moduleName}.service';

const create${moduleNameCased} = catchAsync(async (req: Request, res: Response) => {});
const getAll${moduleNameCased} = catchAsync(async (req: Request, res: Response) => {});
const get${moduleNameCased}ById = catchAsync(async (req: Request, res: Response) => {});
const update${moduleNameCased} = catchAsync(async (req: Request, res: Response) => {});
const delete${moduleNameCased} = catchAsync(async (req: Request, res: Response) => {});

export const ${moduleName}Controller = {
  create${moduleNameCased},
  getAll${moduleNameCased},
  get${moduleNameCased}ById,
  update${moduleNameCased},
  delete${moduleNameCased},
};`,

  route: (moduleName, moduleNameCased) => `import { Router } from 'express';
import { ${moduleName}Controller } from './${moduleName}.controller';

const router = Router();

router.post('/create', ${moduleName}Controller.create${moduleNameCased});
router.patch('/update/:id', ${moduleName}Controller.update${moduleNameCased});
router.delete('/delete/:id', ${moduleName}Controller.delete${moduleNameCased});
router.get('/:id', ${moduleName}Controller.get${moduleNameCased}ById);
router.get('/', ${moduleName}Controller.getAll${moduleNameCased});

export const ${moduleName}Routes = router;`,
};

function createModule(moduleName: string): void {
  console.log(`Creating module "${moduleName}"...`.blue);

  try {
    const folderPath = path.join('src', 'app', 'modules', moduleName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const files = [
      `${moduleName}.constants.ts`,
      `${moduleName}.controller.ts`,
      `${moduleName}.interface.ts`,
      `${moduleName}.models.ts`,
      `${moduleName}.route.ts`,
      `${moduleName}.service.ts`,
      `${moduleName}.utils.ts`,
      `${moduleName}.validation.ts`,
    ];

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const fileType = file.split('.').slice(-2, -1)[0];
      const moduleNameCased =
        moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
      const content =
        moduleContentGenerators[fileType]?.(moduleName, moduleNameCased) || '';
      fs.writeFileSync(filePath, content, 'utf8');
    });

    console.log(`✓ Module "${moduleName}" created successfully!`.green.bold);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`✗ Error creating module: ${error.message}`.red.bold);
    } else {
      console.log('✗ An unknown error occurred.'.red.bold);
      console.error(error);
    }
  }
}

function promptUser(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the module name: '.cyan, (moduleName) => {
    createModule(moduleName);
    rl.close();
  });
}

promptUser();