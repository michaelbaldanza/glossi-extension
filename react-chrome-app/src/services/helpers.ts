function breakLines(str: string) {
  return str.split(/\r?\n|\r|\n/g);
}

function clipTags(str: string) {
  const re = /<[^>]*>/g;
  return str.replace(re, '');
}

function escape(char: string) {
  const escs:{[key: string]: boolean} = {
    ' ': true,
    '/': true,
  };

  return escs[char];
}

export { breakLines, clipTags, escape };