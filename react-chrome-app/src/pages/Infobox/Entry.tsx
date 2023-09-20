import type { DictAbbr, FDMeaning } from '../../services/types';

interface EntryProps {
  activeDict: DictAbbr;
  entry: FDMeaning;
  entryId: string;
  quarry: string;
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
      <h6>{quarry}</h6>
      {
        entry.partOfSpeech ?
        <div className="part-of-speech-container">
          <h6>{entry.partOfSpeech.toLowerCase()}</h6>
        </div>
        :
        ''
      }
      <ol>
        {
          entry.definitions.map((def, idx2) => {
            const defId = `${props.entryId}-def${idx2}`;
            return(
              <li className="definition" id={defId} key={defId}>
                {def.definition}
              </li>
            );
          })
        }
      </ol>
    </div>
  );
}

export default Entry;