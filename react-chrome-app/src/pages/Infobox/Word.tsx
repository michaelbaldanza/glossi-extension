import type { DictAbbr, DictInfo, FDError, FdInfo, Lookup, Meaning, FDResponse, WiktError, WiktInfo, WiktResponse } from '../../services/types';
import { depunctuate, swapMacron } from '../../services/helpers';
import { collect } from '../../services/dictionaries';

interface WordProps {
  lookupHistory: [
    Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>
  ];
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
  selLang?: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
  text: string;
}

function Word(props: WordProps) {
  const [lookupHistory, setLookupHistory] = props.lookupHistory;
  const [lookupIdx, setLookupIdx] = props.lookupIdx;
  const quarry = lookupHistory[lookupIdx].quarry;
  const text = props.text;

  async function handleClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    if (quarry === text) return;
    const term = swapMacron(depunctuate(text));
    const newLookup: Lookup = {
      quarry: term,
      result: await collect(term),
    };
    setLookupHistory([...lookupHistory.slice(0, lookupIdx + 1), newLookup]);
    setLookupIdx(lookupIdx + 1);
  }

  return (
    <span onClick={(e) => handleClick(e)}>{text}</span>
  );
}

export default Word;