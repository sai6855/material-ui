const fs = require('node:fs');
const path = require('node:path');
const directory = process.argv[2] || path.join(__dirname, 'traces', 'autocomplete-props-baseline');
const events = JSON.parse(fs.readFileSync(path.join(directory, 'trace.json'), 'utf8'));
const types = new Map(JSON.parse(fs.readFileSync(path.join(directory, 'types.json'), 'utf8')).map((type) => [type.id, type]));
const describe = (id) => {
  const type = types.get(id);
  if (!type) return id;
  return {
    id,
    name: type.symbolName || type.display,
    arguments: type.typeArguments || type.aliasTypeArguments,
    declaration: type.firstDeclaration,
    flags: type.flags,
  };
};
console.log(JSON.stringify(events.filter((event) => event.dur && event.args && event.args.sourceId)
  .sort((a, b) => b.dur - a.dur).slice(0, 30)
  .map((event) => ({ms: Math.round(event.dur / 1000), name: event.name,
    source: describe(event.args.sourceId), target: describe(event.args.targetId)})), null, 2));
console.log(JSON.stringify(events.filter((event) => event.dur && !event.args?.sourceId)
  .sort((a, b) => b.dur - a.dur).slice(0, 12), null, 2));
