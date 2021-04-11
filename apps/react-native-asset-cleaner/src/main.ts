import * as program from 'commander';
import * as path from 'path';
import { description, name, version } from 'package.json';
import { execSync, ExecSyncOptions } from 'child_process';
import * as fs from 'fs';

program.command('publish').action(async () => {
  const execOpts: ExecSyncOptions = {
    stdio: [process.stdout, process.stdin, process.stderr],
  };
  execSync(
    `cp apps/${name}/package.json apps/${name}/README.md dist/apps/${name}/`,
    execOpts
  );
  try {
    execSync(`yarn --cwd dist/apps/${name} publish`, execOpts);
  } catch (error) {
    console.error(error.message);
  }
});

function getFileList(dir: string): string[] {
  const fileList = [];
  const listFile = fs
    .readdirSync(dir)
    .filter((entry: string) => entry !== '.' && entry !== '..')
    .map((entry: string) => path.join(dir, entry));
  listFile.forEach((entry) => {
    if (fs.lstatSync(entry).isDirectory()) {
      fileList.push(...getFileList(entry));
    } else {
      fileList.push(entry);
    }
  });
  return fileList;
}

function unlink(file: string) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}

program
  .version(version)
  .description(description)
  .option('-a, --asset <asset-dir>', 'Asset folder')
  .option('-s, --source <source-dir>', 'Source folder')
  .action(() => {
    const { asset, source } = program.opts();

    const assetPath: string = path.resolve(process.cwd(), asset);
    const sourcePath: string = path.resolve(process.cwd(), source);

    const assetDirname: string = path.dirname(assetPath);

    const assetList = getFileList(assetPath).map((entry: string) =>
      entry.replace(`${assetDirname}/`, '')
    );

    const srcList = getFileList(sourcePath).filter((entry: string) =>
      entry.match(/\.tsx?$/)
    );

    const hasBeenUsedMap: Record<string, boolean> = Object.fromEntries(
      assetList.map((assetFile: string) => [assetFile, false])
    );

    srcList.forEach((srcFile: string) => {
      const content = fs.readFileSync(srcFile, {
        encoding: 'utf-8',
      });
      assetList.forEach((assetFile: string) => {
        if (content.indexOf(assetFile) > -1) {
          hasBeenUsedMap[assetFile] = true;
        }
      });
    });

    const unusedFiles = Object.entries(hasBeenUsedMap)
      .filter(([, used]) => !used)
      .filter(([filename]) => !filename.match(/fonts/))
      .map(([filename]) => filename);

    unusedFiles.forEach((file) => {
      if (file.match(/@(2x|3x)/)) {
        const original = file.replace(/@(2x|3x)/, '');
        if (!hasBeenUsedMap[original]) {
          unlink(path.join(assetDirname, file));
          unlink(path.join(assetDirname, original));
        }
        return;
      }
      if (!hasBeenUsedMap[file]) {
        unlink(path.join(assetDirname, file));
      }
    });
  });

program.parse(process.argv);
