import Indexer from './Indexer';
import Trie from '../trie';
import fuzzyVisitor from './Fuzzy';
import { parseOptions } from './common';


class Searcher {
  constructor(data, options={}) {
    this.options = parseOptions(options);
    this.search = this.search.bind(this);
    this.searchFuzzy = this.searchFuzzy.bind(this);
    this.searchUnordered = this.searchUnordered.bind(this);

    const trie = new Trie();
    this.dataById = {}

    const indexer = new Indexer(data, this.options);
    const tuples = indexer.getTuples();
    const sortedTuples = tuples.sort((a, b) => {
      if (b.value < a.value) return -1;
      else if (b.value === a.value) return 0;
      else return 1;
    });
    sortedTuples.forEach(t => trie.insert(t.value, t));
    data.forEach(d => this.dataById[d[this.options.idField]] = d);

    this.trie = trie.toFrozen();
  }

  _mergeResultsById(s, resultsByItemId) {
    const trieValues = this.trie.flatValues;
    const [start, end] = this.trie.getSubRange(s);
    for (let i = start; i < end; ++i) {
      const m = trieValues[i];
      let result;
      if (m.id in resultsByItemId) {
        result = resultsByItemId[m.id];
      } else {
        result = { item: this.dataById[m.id], matches: [], score: 0 };
        resultsByItemId[m.id] = result;
      }

      // TODO(mgraczyk): Move score computation to after.
      result.matches.push(m);
      result.score += m.key.weight * Math.max(0.1, s.length / m.value.length);
    };
  }

  searchUnordered(query) {
    const s = this.options.caseSensitive ? query : query.toLowerCase();
    const resultsByItemId = {};
    this._mergeResultsById(s, resultsByItemId);
    return resultsByItemId;
  }

  search(query) {
    return Object.values(this.searchUnordered(query)).sort((a, b) => b.score - a.score);
  }

  searchFuzzy(query) {
    const resultsByItemId = {};
    const visit = s => this._mergeResultsById(s, resultsByItemId);
    const sOriginal = this.options.caseSensitive ? query : query.toLowerCase();

    fuzzyVisitor(sOriginal, visit);

    return Object.values(resultsByItemId).sort((a, b) => b.score - a.score);
  }
}

export default Searcher;
