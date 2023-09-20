type DictAbbr = 'fd' | 'wikt';
type Page = 'cards' | 'decks' | 'home' | 'infobox' | 'login' | 'logout' | 'profile' | 'signup';

interface FDError {
  title: string;
  message: string;
  resolution: string;
}

interface FDDefinition {
  antonyms?: Array<string>;
  synonyms?: Array<string>;
  definition: string;
}

interface FDMeaning {
  antonyms?: Array<string>;
  synonyms?: Array<string>;
  partOfSpeech?: string;
  definitions: Array<FDDefinition>;
}

interface WiktDefinition {
  definition: string;
}

interface WiktMeaning {
  definitions: Array<WiktDefinition>;
  language: string;
  partOfSpeech: string;
}

interface WiktResponse {
  [key: string]: Array<WiktMeaning>;
}

interface FDResponse {
  license: object;
  meanings: Array<FDMeaning>;
}

interface DictInfo {
  abbr: string;
  name: string;
  response: Array<FDResponse> | WiktResponse;
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

export type { DictAbbr, DictInfo, FDError, FDMeaning, FDResponse, Lookup, Page, Result, WiktResponse };