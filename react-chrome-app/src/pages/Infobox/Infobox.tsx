import { useState } from 'react';
import { DictAbbr, Lookup, Page } from '../../services/types';
import Header from './Header';
import Main from './Main';
import Nav from './Nav';
import TextInput from './TextInput';

interface InfoboxProps {
  lookupHistory: [
    Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>
  ];
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
  selLang: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
}

function Infobox(props: InfoboxProps) {
  const [activeDict, setActiveDict] = useState<DictAbbr>('fd');
  const [lookupHistory, setLookupHistory] = props.lookupHistory;
  const [lookupIdx, setLookupIdx] = props.lookupIdx;
  const current = lookupHistory[lookupIdx];
  console.log(lookupHistory)
  return (
    lookupHistory.length > 0 ?
    <div className="infobox">
      <Header lookup={current.quarry} lookupIdx={props.lookupIdx} />
      <Nav activeDict={[activeDict, setActiveDict]} />
      <Main
        activeDict={[activeDict, setActiveDict]}
        selLang={props.selLang}
        lookupIdx={[lookupIdx, setLookupIdx]}
        lookupHistory={[lookupHistory, setLookupHistory]}
      />
    </div>
    :
    <TextInput
      lookupHistory={[lookupHistory, setLookupHistory]}
      selLang={props.selLang}
    />
  );
}

export default Infobox;