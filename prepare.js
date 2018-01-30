process.env.NODE_ENV = 'production';

const readFileSync = require('fs').readFileSync;
const writeFileSync = require('fs').writeFileSync;
const unlinkSync = require('fs').unlinkSync;
const babel = require('babel-core');
const lsrSync = require('lsr').lsrSync;

lsrSync(__dirname + '/lib').forEach(entry => {
  if (entry.isFile() && /\.jsx?$/.test(entry.path)) {
    writeFileSync(
      entry.fullPath.replace(/\.jsx$/, '.js'),
      babel.transformFileSync(entry.fullPath, {
        babelrc: false,
        presets: [require.resolve('@moped/babel-preset/browser-commonjs')],
      }).code
    );
    if (/\.jsx$/.test(entry.fullPath)) {
      unlinkSync(entry.fullPath);
    }
  }
});
writeFileSync(__dirname + '/lib/index.d.ts', 'export default Promise;');
