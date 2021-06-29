const insertChars = "abcdefghijklmnopqrstuvwxyz0123456789";

const fuzzyVisitor = (s, visit, depth=0, visited={}) => {
  if (s.length === 0 || depth > 2 || s in visited) {
    return;
  }

  // Visit this.
  visit(s);
  visited[s] = true;

  if (s.length === 1) {
    return;
  }

  // Charge 2 depth units when we make the string longer.
  // Delete every character.
  for (let i = 0; i < s.length; ++i) {
    const sNew = s.slice(0, i) + s.slice(i + 1, s.length)
    fuzzyVisitor(sNew, visit, depth + 1, visited);
  }

  // Duplicate every character.
  for (let i = 0; i < s.length; ++i) {
    const sNew = s.slice(0, i) + s[i] + s.slice(i, s.length)
    fuzzyVisitor(sNew, visit, depth + 2, visited);
  }

  // Swap every adjacent pair.
  for (let i = 0; i < s.length - 1; ++i) {
    const sNew = s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2, s.length)
    fuzzyVisitor(sNew, visit, depth + 1, visited);
  }

  // Insert every character at the beginning and end
  for (let j = 0; j < insertChars.length; ++j) {
    fuzzyVisitor(insertChars[j] + s, visit, depth + 2, visited);
    fuzzyVisitor(s + insertChars[j], visit, depth + 2, visited);
  }
};

export default fuzzyVisitor;
