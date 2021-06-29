import Searcher from '..';

test('create empty', () => {
  const searcher = new Searcher([]);
});

test('search simple', () => {
  const options = {
    keys: [ 'name' ],
  };
  const key = {name: 'name', weight: 1};

  const items = [
    { id: 'x', name: 'A', value: 0, },
    { id: 'y', name: 'B', value: 1, },
  ];

  const searcher = new Searcher(items, options);

  const aResult = searcher.search('a');
  expect(aResult).toEqual([
    { item: items[0],
      matches: [
        { id: 'x', key, value: 'a', },
      ],
      score: 1,
    },
  ]);

  const bResult = searcher.search('b');
  expect(bResult).toEqual([
    { item: items[1],
      matches: [
        { id: 'y', key, value: 'b', },
      ],
      score: 1,
    },
  ]);

  const emptyResult1 = searcher.search('c');
  expect(emptyResult1).toEqual([]);

  const emptyResult2 = searcher.search('ba');
  expect(emptyResult2).toEqual([]);
});


test('create complex', () => {
  const options = {
    keys: [
      { name: 'member.name.first' },
      { name: 'tagline' }
    ],
  };
  const k0 = {weight: 1, ...options.keys[0] };

  const items = [
    { id: 'x', member: [
        { name: { first: 'Harold', last: 'Smith' } },
        { name: { first: 'Joe', last: 'Doe' } },
        { name: { first: 'Harten', last: 'K' } },
      ]
    },
    { id: 'y', member: [
        { name: { first: 'Don', last: 'Juan' } },
        { name: { first: 'Harry', last: 'Jones' } },
      ]
    },
    { id: 'z', tagline: 'first second' },
  ];

  const searcher = new Searcher(items, options);

  const prefixResult = searcher.search('har');
  expect(prefixResult).toHaveLength(2);
  expect(prefixResult).toEqual(expect.arrayContaining([
    { item: items[0],
      matches: [
        { id: 'x', key: k0, value: 'harold', },
        { id: 'x', key: k0, value: 'harten', },
      ],
      score: 2 * 1/2,
    },
    { item: items[1],
      matches: [
        { id: 'y', key: k0, value: 'harry', },
      ],
      score: 3/5,
    },
  ]));
});


test('fuzzy simple', () => {
  const options = {
    keys: [ 'name' ],
  };
  const key = {name: 'name', weight: 1};

  const items = [
    { id: 'x', name: 'california', value: 0, },
  ];

  const searcher = new Searcher(items, options);
  const result1 = searcher.searchFuzzy('california');
});
