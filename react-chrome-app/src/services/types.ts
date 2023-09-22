type DictAbbr = 'fd' | 'wikt';
type DictName = 'Free Dictionary' | 'Wiktionary';
type Page = 'cards' | 'decks' | 'home' | 'infobox' | 'login' | 'logout' | 'profile' | 'signup';

type DictAbbrToDictNameMap = {
  [key in DictAbbr]: DictName;
}

interface WiktError {
  title: string;
  detail: string;
}

interface FDError {
  title: string;
  message: string;
  resolution: string;
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

interface FDDefinition {
  antonyms?: Array<string>;
  synonyms?: Array<string>;
  definition: string;
}

interface Definition {
  antonyms?: Array<string>;
  synonyms?: Array<string>;
  definition: string;
}

interface Meaning {
  antonyms?: Array<string>;
  synonyms?: Array<string>;
  partOfSpeech: string;
  definitions: Array<Definition>;
  language?: string;
}

interface WiktResponse {
  // [key: string]: Array<WiktMeaning>;
  [key: string]: Array<Meaning>;
}

interface FDResponse {
  license: object;
  meanings: Array<Meaning>;
  word: string;
}

interface DictBasics {
  abbr: string;
  name: string;
}

interface FdInfo extends DictBasics {
  response: Array<FDResponse>;
}

interface WiktInfo extends DictBasics {
  response: WiktResponse;
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
  [key: string]: FdInfo | WiktInfo;
}

// type Result = Record<DictAbbr, DictInfo>;
// interface Result {
//   result: Dicts;
// }

interface Lookup {
  quarry: string;
  result: Result;
}

export type { DictAbbr, DictAbbrToDictNameMap, DictInfo, DictName, FDError, FdInfo, FDMeaning, FDResponse, Lookup, Meaning, Page, Result, WiktError, WiktInfo, WiktResponse };