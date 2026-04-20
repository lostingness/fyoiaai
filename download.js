import fs from 'fs';
fetch('https://framerusercontent.com/modules/VpkXrHDg8V7zkqNIQBoY/GtbwxUyEM00ot0IvE5vR/Spiral.js')
  .then(res => res.text())
  .then(text => fs.writeFileSync('src/Spiral.js', text));
