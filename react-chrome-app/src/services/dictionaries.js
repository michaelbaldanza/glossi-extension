export const refOrder = ['wikt', 'fd'];

export const lexica = {
  'fd': {
    'name': 'Free Dictionary',
    'link': 'https://dictionaryapi.dev/',
    'args': function(term) {
      const endpoint = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + term; 
      return endpoint;
    },
  },
  'wikt': {
    'name': 'Wiktionary',
    'link': 'https://en.wiktionary.org/api/rest_v1/#/',
    'args': function(term) {
      const endpoint = 'https://en.wiktionary.org/api/rest_v1/page/definition/' + term;
      const ro = { // request object
        method: 'GET',  
        headers: {
            'accept': 'application/json; charset=utf-8; profile="https://www.mediawiki.org/wiki/Specs/definition/0.8.0"',
            // 'User-Agent': 'michael',
          },
      };
      return [endpoint, ro];
    },
  },
};

export async function get(args) {
  try {
    const data = Array.isArray(args) ?
      await fetch(...args) : await fetch(args)
    ;
    return data.json();
  } catch (error) {
    return `error`;
  }
}

export async function collect(term) {
  const responses = {};
  for (let i = 0; i < refOrder.length; i++) {
    let ref = refOrder[i];
    let response = await get(lexica[ref].args(term));
    if (
      ref === 'wikt' && response &&
      response.detail
      ) {
      response = await get(lexica[ref].args(term.toLowerCase()));
    }
    responses[ref] = {
      'name': lexica[ref].name,
      'abbr': ref,
      'response': response,
    };
  }
  return responses;
}