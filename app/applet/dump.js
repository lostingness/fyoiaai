import fs from 'fs';
import * as icons from 'simple-icons';
const data = {
  openai: icons.siOpenai?.path,
  openai2: icons.siOpenAI?.path,
  anthropic: icons.siAnthropic?.path,
  google: icons.siGoogle?.path,
  meta: icons.siMeta?.path,
  x: icons.siX?.path,
  huggingface: icons.siHuggingface?.path
};
fs.writeFileSync('paths.json', JSON.stringify(data, null, 2));
console.log("Done");
