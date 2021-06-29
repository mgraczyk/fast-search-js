const DEFAULT_OPTIONS = {
  idField: 'id',
  caseSensitive: false,
  noTokenize: false,
  keys: [],
};

const parseOptions = (options) => {
  const optionsFilled = {...DEFAULT_OPTIONS, ...options};
  return {
    ...optionsFilled,
    keys: optionsFilled.keys.map(k => (
      typeof k === 'string' ?
        {weight: 1, name: k, pathParts: k.split('.')} :
        {weight: 1, ...k, pathParts: k.name.split('.')}
      )
    ),
  };
};

export { parseOptions };
