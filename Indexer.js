import { parseOptions } from './common';

const indexDatumForKey = (datum, options, key=null, id=null, out=[]) => {
  if (!datum || datum === '') {
    return out;
  }

  if (datum instanceof Array) {
    datum.forEach(d => indexDatumForKey(d, options, key, id || d[options.idField], out));
    return out;
  }
  if (key === null) {
    const newId = id || datum[options.idField];
    options.keys.forEach(k => indexDatumForKey(datum, options, k, newId, out));
    return out;
  }
  if (key.pathParts.length > 0) {
    const newKey = {...key, pathParts: key.pathParts.slice(1)};
    return indexDatumForKey(datum[key.pathParts[0]], options, newKey, id, out);
  }

  if (typeof datum !== 'string') {
    throw new Error(`cannot index ${datum}`);
  }

  const datumAlphaNum = datum.replace(/[^\w ]/g, ' ');
  const tokens = options.noTokenize ? [] : datumAlphaNum.split(' ');

  // TODO(mgraczyk): Revisit this. It adversely affects scoring fairness.
  if (tokens.length > 1) {
    tokens.push(datumAlphaNum);
  }

  const lower = !options.caseSensitive;
  tokens.forEach(t => {
    if (t.length) {
      const value = lower ? t.toLowerCase() : t;
      const { pathParts, ...externalKey } = key;
      out.push({id, value, key: externalKey});
    }
  });
  return out;
}

class Indexer {
  constructor(data, options={}) {
    this.options = parseOptions(options);
    this.tuples = indexDatumForKey(data, this.options);
  }

  getTuples() {
    return this.tuples;
  }
}

export default Indexer;
