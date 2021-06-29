import Fuse from 'fuse.js';

import Searcher from '..';

import { icos } from './icos.json';

const KEYS = [
  { name: 'name', weight: 0.1 },
  { name: 'team.firstName', weight: 1.0 },
  { name: 'team.lastName',  weight: 0.6 },
  { name: 'investors.name', weight: 0.6 },
  { name: 'advisors.firstName', weight: 0.4 },
  { name: 'advisors.lastName',  weight: 0.4 },
  { name: 'tagline', weight: 0.4 },
  { name: 'partners.name', weight: 0.3 },
  { name: 'shortDescription', weight: 0.1 },
  { name: 'description', weight: 0.05 },
];


test('benchmark fuse search', () => {
  const options = {
    shouldSort: true,
    tokenize: true,
    includeScore: true,
    includeMatches: true,
    threshold: 0.1,
    location: 0,
    distance: 1000,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: KEYS,
  };

  const fuse = new Fuse(icos, options);
  for (let i = 0; i < 1000; ++i) {
    const result = fuse.search(Math.random().toString(36).substr(2, 3));
  }
});

test('benchmark search', () => {
  const options = {
    idField: 'termsId',
    keys: KEYS,
  };

  const searcher = new Searcher(icos, options);
  for (let i = 0; i < 50000; ++i) {
    const result1 = searcher.search(Math.random().toString(36).substr(2, 3));
  }
});

test('benchmark rand search', () => {
  const options = {
    idField: 'id',
    keys: [ { name: 's' } ],
  };

  const randData = (new Array(10000)).fill(0).map(() => {
    const id = Math.random().toString(10).slice(2);
    return { id, s: id };
  });

  const searcher = new Searcher(randData, options);
  for (let i = 0; i < 40000; ++i) {
    const result1 = searcher.search(Math.random().toString(10).substr(2, 2));
    const result2 = searcher.search(Math.random().toString(10).substr(2, 3));
  }
});

test('benchmark fuse index', () => {
  const options = {
    shouldSort: true,
    tokenize: true,
    includeScore: true,
    includeMatches: true,
    threshold: 0.1,
    location: 0,
    distance: 1000,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: KEYS,
  };

  for (let i = 0; i < 1000; ++i) {
    const fuse = new Fuse(icos, options);
  }
});

test('benchmark index', () => {
  const options = {
    idField: 'termsId',
    keys: KEYS,
  };

  for (let i = 0; i < 1000; ++i) {
    const searcher = new Searcher(icos, options);
  }
});
