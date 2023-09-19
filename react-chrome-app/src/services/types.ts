type DictAbbr = 'fd' | 'wikt';
type Page = 'cards' | 'decks' | 'home' | 'infobox' | 'login' | 'logout' | 'profile' | 'signup';

interface DictInfo {
  abbr: string;
  name: string;
  response: object[];
}

interface Dicts {
  fd: DictInfo;
  wikt: DictInfo;
}

interface Result {
  [key: string]: DictInfo;
}

// type Result = Record<DictAbbr, DictInfo>;
// interface Result {
//   result: Dicts;
// }

interface Lookup {
  quarry: string;
  result: Result;
}

export type { Lookup, DictAbbr, DictInfo, Page, Result };