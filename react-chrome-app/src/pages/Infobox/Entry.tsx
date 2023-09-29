import Word from './Word';
import EntryHeading from './EntryHeading';
import NymContainer from './NymContainer';
import type { CardDraft, DictAbbr, Lookup, Meaning, Page } from '../../services/types';
import { breakLines, clipTags, escape } from '../../services/helpers';

interface EntryProps {
  activeDict: DictAbbr;
  cardDraft: [CardDraft | null, React.Dispatch<React.SetStateAction<CardDraft | null>>];
  currentPage: [Page, React.Dispatch<React.SetStateAction<Page>>];
  entry: Meaning;
  entryId: string;
  headword?: string;
  isLogged: boolean;
  lookupHistory: [
    Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>
  ];
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
  selLang?: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
}

function Entry(props: EntryProps) {
  const activeDict = props.activeDict;
  const entry = props.entry;
  const entryId = props.entryId;
  const [lookupHistory, setLookupHistory] = props.lookupHistory;
  const [lookupIdx, setLookupIdx] = props.lookupIdx;
  const quarry = lookupHistory[lookupIdx].quarry;

  return (
    <div
      className={`entry-container`}
      id={entryId}
    >
      <EntryHeading
        cardDraft={props.cardDraft}
        currentPage={props.currentPage}
        entry={props.entry}
        headword={props.headword}
        isLogged={props.isLogged}
        quarry={quarry}
        selLang={props.selLang ? props.selLang[0] : null} // assign only the
        // languageCode to selLang.
      />
      <ol className="def-list">
        {
          entry.definitions.map((def, idx2) => {
            const defId = `${props.entryId}-def${idx2}`;
            function makeLi(def: string) {
              return (
                <li
                  key={defId}
                  id={defId}
                  className="definition"
                >
                  {
                    breakLines(def).map((line, idx3) => (
                      line.split(/(\s|\/)/g).map((text, idx4) => (
                        escape(text) ?
                          text :
                          <Word
                            key={`${activeDict}-def${idx2}-line${idx3}-word${idx4}`}
                            spanId={`${activeDict}-def${idx2}-line${idx3}-word${idx4}`}
                            lookupHistory={props.lookupHistory}
                            lookupIdx={props.lookupIdx}
                            text={text}
                          />
                      ))
                    ))
                  }
                </li>
              )
            }

            return (
              def.definition.length ? makeLi(clipTags(def.definition)) : ''
            );
          })
        }
      </ol>
        {
          entry.synonyms && entry.synonyms.length > 0 ?
            <NymContainer
              lookupHistory={props.lookupHistory}
              lookupIdx={props.lookupIdx}
              nymType={'synonyms'}
              nyms={entry.synonyms}
            />
          : ''
        }
        {
          entry.antonyms && entry.antonyms.length > 0 ?
            <NymContainer
              lookupHistory={props.lookupHistory}
              lookupIdx={props.lookupIdx}
              nymType={'antonyms'}
              nyms={entry.antonyms}
            />
          : ''
        }
    </div>
  );
}

export default Entry;