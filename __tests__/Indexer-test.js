import Indexer from '../Indexer';

test('create empty', () => {
  const indexer = new Indexer([]);
});

test('create simple', () => {
  const options = {
    keys: [ 'name' ],
  };
  const key = {name: 'name', weight: 1};

  const items = [
    { id: 'x', name: 'A', value: 0, },
    { id: 'y', name: 'B', value: 1, },
  ];

  const indexer = new Indexer(items, options);
  const tuples = indexer.getTuples();

  expect(tuples).toHaveLength(2);
  expect(tuples).toEqual(expect.arrayContaining([
    { id: 'x', value: 'a', key },
    { id: 'y', value: 'b', key },
  ]));
});


test('create complex', () => {
  const options = {
    keys: [
      { name: 'member.name.first' },
      { name: 'tagline' }
    ],
  };
  const k0 = {weight: 1, ...options.keys[0] };
  const k1 = {weight: 1, ...options.keys[1] };

  const items = [
    { id: 'x', member: [
        { name: { first: 'Harold', last: 'Smith' } },
        { name: { first: 'Joe', last: 'Doe' } },
      ]
    },
    { id: 'y', member: [
        { name: { first: 'Don', last: 'Juan' } },
      ]
    },
    { id: 'z', tagline: 'first second' },
  ];

  const indexer = new Indexer(items, options);
  const tuples = indexer.getTuples();

  const expected = [
    { id: 'x', value: 'harold', key: k0 },
    { id: 'x', value: 'joe', key: k0 },
    { id: 'y', value: 'don', key: k0 },
    { id: 'z', value: 'first', key: k1 },
    { id: 'z', value: 'second', key: k1 },
    { id: 'z', value: 'first second', key: k1 },
  ];
  expect(tuples).toHaveLength(expected.length);
  expect(tuples).toEqual(expect.arrayContaining(expected));
});
