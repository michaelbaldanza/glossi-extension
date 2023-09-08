interface MongoDoc {
  _id?: string,
  __v?: number,
}

interface Source {
  name: string,
  link: string,
  userSubmitted: boolean,
  card: Card,
  notes: Note[],
}

interface Definition extends MongoDoc {
  definition: string,
  synonyms: Array<string>,
  antonyms: Array<string>,
  examples: Array<string>,
  senes: Definition[],
  source: Source,
}

interface Note extends MongoDoc {
  heading: string,
  body: string,
  createdBy: | string | User
}

interface Card extends MongoDoc {
  title: string,
  partOfSpeech: string,
  languageCode: string,
  definitions: Array<string>,
}

interface Scroll extends MongoDoc {
  title?: string,
  body?: string,
  draft?: boolean,
  createdBy: | string | User,
  cards: | Array<string> | Card[],
}

interface Collaborator {
  user: | string | User,
  canAddOwnCards: boolean,
  canEditOthersCards: boolean,
  canAddOwnNotes: boolean,
  canEditOthersNotes: boolean,
}

interface Deck extends MongoDoc {
  name: string,
  createdBy: string | User,
  collaborators: Collaborator[],
}

interface User extends MongoDoc {
  _id: string,
  username: string,
  email: string,
  password: string,
  bio?: string,
  profilePictureUrl?: string,
  scrolls: | Array<string> | Scroll[],
  decks: | Array<string> | Deck[],
}

export type { User };