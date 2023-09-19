import { useState } from 'react';
import { DictAbbr, Lookup } from '../../services/types';
import Header from './Header';
import Main from './Main';
import Nav from './Nav';

interface InfoboxProps {
  lookup: string;
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
  lookupHistory: [
    Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>
  ];
}

function Infobox(props: InfoboxProps) {
  const [activeDict, setActiveDict] = useState<DictAbbr>('wikt');
  const [lookupHistory, setLookupHistory] = props.lookupHistory;
  const [lookupIdx, setLookupIdx] = props.lookupIdx;
  if (lookupHistory.length < 1) {
    return <div>No look ups yet</div>
  }
  const current = lookupHistory[lookupIdx];

  console.log(current)

  return (
    <div className="infobox">
      <Header lookup={props.lookup} lookupIdx={props.lookupIdx} />
      <Nav activeDict={[activeDict, setActiveDict]} />
      <Main
        activeDict={[activeDict, setActiveDict]}
        lookupIdx={[lookupIdx, setLookupIdx]}
        lookupHistory={[lookupHistory, setLookupHistory]}
      />
    </div>
  );
}

export default Infobox;