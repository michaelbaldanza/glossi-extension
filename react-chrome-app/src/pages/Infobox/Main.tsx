import type { User } from '../../services/interfaces';
import type { CardDraft, DictAbbr, DictInfo, FdInfo, Lookup, Page, Result, WiktInfo } from '../../services/types';
import Dictionary from './Dictionary';

interface MainProps {
  activeDict: [DictAbbr, React.Dispatch<React.SetStateAction<DictAbbr>>];
  cardDraft:[CardDraft | null, React.Dispatch<React.SetStateAction<CardDraft | null>>];
  currentPage: [Page, React.Dispatch<React.SetStateAction<Page>>];
  isLogged: boolean;
  lookupHistory:[
    Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>
  ];
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
  selLang?: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
  user: [User | null, React.Dispatch<React.SetStateAction<User | null>>];
}

function Main(props: MainProps) {
  const [activeDict, setActiveDict] = props.activeDict;
  const [lookupIdx, setLookupIdx] = props.lookupIdx;
  const [lookupHistory, setLookupHistory] = props.lookupHistory;
  const current = lookupHistory[lookupIdx];
  const quarry = current.quarry;
  const dictProps: {
    resp: DictInfo,
    selLang?: [string | null, React.Dispatch<React.SetStateAction<string | null>>]
  } = {
    resp: current.result[activeDict]
  };
  if (activeDict === 'wikt') dictProps.selLang = props.selLang;
  return (
    <div
      id={activeDict}
      className={`dictionary-container`}
    >
      <Dictionary
        {...dictProps}
        activeDict={activeDict}
        cardDraft={props.cardDraft}
        currentPage={props.currentPage}
        isLogged={props.isLogged}
        lookupHistory={props.lookupHistory}
        lookupIdx={props.lookupIdx}
      />
    </div>
  );
}

export default Main;