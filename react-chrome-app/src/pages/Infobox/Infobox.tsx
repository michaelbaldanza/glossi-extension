import { useState } from 'react';
import { DictAbbr, Lookup } from '../../services/types';
import Header from './Header';
import Main from './Main';
import Nav from './Nav';

interface InfoboxProps {
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
  lookupHistory: [
    Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>
  ];
  selLang?: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
}

function Infobox(props: InfoboxProps) {
  const [activeDict, setActiveDict] = useState<DictAbbr>('fd');
  const [lookupHistory, setLookupHistory] = props.lookupHistory;
  const [lookupIdx, setLookupIdx] = props.lookupIdx;
  const current = lookupHistory[lookupIdx];
  if (lookupHistory.length < 1) {
    return <div>No look ups yet</div>
  }

  return (
    <div className="infobox">
      <Header lookup={current.quarry} lookupIdx={props.lookupIdx} />
      <Nav activeDict={[activeDict, setActiveDict]} />
      <Main
        activeDict={[activeDict, setActiveDict]}
        current={current}
        selLang={props.selLang}
        setLookupIdx={setLookupIdx}
        setLookupHistory={setLookupHistory}
      />
    </div>
  );
}

export default Infobox;