const fs = require('fs');
const path = require('path');

try {
  fs.unlinkSync('sass/bulma');
}
catch (e) {}

const bulma = path.dirname(require.resolve('bulma'));

fs.symlinkSync(path.join(bulma, 'sass'), 'sass/bulma', 'dir');
