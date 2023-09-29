import { useState } from 'react';
import { CardDraft, DictAbbr, Lookup, Page } from '../../services/types';
import { User } from '../../services/interfaces';
import Header from './Header';
import Main from './Main';
import Nav from './Nav';

interface InfoboxProps {
  cardDraft: [CardDraft | null, React.Dispatch<React.SetStateAction<CardDraft | null>>];
  currentPage: [Page, React.Dispatch<React.SetStateAction<Page>>];
  lookupHistory: [
    Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>
  ];
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
  selLang: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
  textInputIsActive: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  user: [User | null, React.Dispatch<React.SetStateAction<User | null>>];
}

function Infobox(props: InfoboxProps) {
  const [activeDict, setActiveDict] = useState<DictAbbr>('fd');
  
  console.log(`loading Infobox`)
  console.log(props.lookupHistory[0][props.lookupIdx[0]])

  return (
    <div className="infobox">
      <Header
        currentPage={props.currentPage}
        lookupHistory={props.lookupHistory}
        lookupIdx={props.lookupIdx}
        selLang={props.selLang}
        textInputIsActive={props.textInputIsActive}
      />
      <Nav activeDict={[activeDict, setActiveDict]} />
      <Main
        activeDict={[activeDict, setActiveDict]}
        cardDraft={props.cardDraft}
        currentPage={props.currentPage}
        isLogged={props.user ? true : false}
        lookupIdx={props.lookupIdx}
        lookupHistory={props.lookupHistory}
        selLang={props.selLang}
        user={props.user}
      />
    </div>
  );
}

export default Infobox;