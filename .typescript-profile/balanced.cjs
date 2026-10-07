const cp = require('node:child_process');
const path = require('node:path');
const [scenario, experiment, compiler = '7', repetitions = '5'] = process.argv.slice(2);
for (let repeat = 0; repeat < Number(repetitions); repeat += 1) {
  const order = repeat % 2 ? [experiment, 'baseline'] : ['baseline', experiment];
  for (const variant of order) {
    const result = cp.spawnSync(process.execPath, [path.join(__dirname, 'cli.cjs'), scenario, variant, compiler], {
      stdio: 'inherit', windowsHide: true,
      env: {...process.env, MUI_PROFILE_RUN_LABEL: 'balanced-final', MUI_PROFILE_COMPACT: '1'},
    });
    if (result.status !== 0) process.exit(result.status || 1);
  }
}
