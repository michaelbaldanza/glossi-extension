import type { DictAbbr, Meaning } from '../../services/types';
import { breakLines, clipTags, escape } from '../../services/helpers';

interface EntryProps {
  activeDict: DictAbbr;
  entry: Meaning;
  entryId: string;
  headword?: string;
  quarry: string;
  selLang?: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
}

function Entry(props: EntryProps) {
  const activeDict = props.activeDict;
  const entry = props.entry;
  const entryId = props.entryId;
  const quarry = props.quarry

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
            if (props.selLang) {
              console.log(`selLang is ${props.selLang}`)
            }
            function makeLi(def: string) {
              return (
                <li
                  key={defId}
                  id={defId}
                  className="definition"
                >
                  {
                    breakLines(def).map((line, idx3) => (
                      line.split(/(\s|\/)/g).map((word, idx4) => (
                        escape(word) ? word : word
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