function breakLines(str: string) {
  return str.split(/\r?\n|\r|\n/g);
}

function clipTags(str: string) {
  const re = /<[^>]*>/g;
  return str.replace(re, '');
}

function depunctuate(str: string) {
  const re = /[,.?!()/"”“:;—']/g;
  return str.replace(re, '')
}

function escape(char: string) {
  const escs:{[key: string]: boolean} = {
    ' ': true,
    '/': true,
  };

  return escs[char];
}

function swapMacron(str: string) {
  const macra: Record<string, string> = {
    'ā': 'a',
    'ē': 'e',
    'ī': 'i',
    'ō': 'o',
    'ū': 'u',
  };
  const letters = str.split('');
  const newLetters = [];
  for (let i = 0; i < letters.length; i++) {
    if (macra[letters[i]]) {
      newLetters.push(macra[letters[i]]);
    } else {
      newLetters.push(letters[i]);
    }
  }
  return newLetters.join('');
}

export { breakLines, clipTags, depunctuate, escape, swapMacron };