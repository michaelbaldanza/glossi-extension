import Word from './Word';
import type { DictAbbr, Lookup, Meaning } from '../../services/types';
import { breakLines, clipTags, escape } from '../../services/helpers';

interface EntryProps {
  activeDict: DictAbbr;
  entry: Meaning;
  entryId: string;
  headword?: string;
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
      {
        props.headword && props.headword !== quarry.toLowerCase() ?
        <h6>{props.headword}</h6>
        :
        ''
      }
      {
        entry.partOfSpeech ?
        <div className="part-of-speech-container">
          <h6 className="part-of-speech-heading faded">{entry.partOfSpeech.toLowerCase()}</h6>
        </div>
        :
        ''
      }
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
    </div>
  );
}

export default Entry;