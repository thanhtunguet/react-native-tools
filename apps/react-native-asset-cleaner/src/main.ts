import * as program from 'commander';
import * as path from 'path';
import { description, name, version } from 'package.json';
import { execSync, ExecSyncOptions } from 'child_process';

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

program
  .version(version)
  .description(description)
  .option('-a, --asset <asset-dir>', 'Asset folder')
  .option('-s, --source <source-dir>', 'Source folder')
  .action(() => {
    const { asset, source } = program.opts();

    const assetPath: string = path.resolve(process.cwd(), asset);
    const sourcePath: string = path.resolve(process.cwd(), source);

    console.log(assetPath, sourcePath);
  });

program.parse(process.argv);
