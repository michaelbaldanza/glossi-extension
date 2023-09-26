import { useState } from 'react';
import TextInput from './TextInput';
import TextInputToggler from './TextInputToggler';
import type { Lookup } from '../../services/types';

interface HeaderProps {
  lookupHistory: [Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>];
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
  selLang: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
  textInputIsActive: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

function Header(props: HeaderProps) {
  const [lookupHistory, setLookupHistory] = props.lookupHistory;
  const [lookupIdx, setLookupIdx] = props.lookupIdx;
  const [textInputIsActive, setTextInputIsActive] = props.textInputIsActive;
  // console.log(`logging in InfoboxHeader`)
  // console.log(`lookupHistory.length is ${lookupHistory.length}, lookupIdx is ${lookupIdx}`)

  const current = lookupHistory[lookupIdx];
  const quarry = current.quarry;

  return (
    <div className="action-heading d-flex">
      <div className="quarry-and-input-container">
        {
          !textInputIsActive ?
            <h5>{quarry}</h5>
          :
            <TextInput
              lookupHistory={props.lookupHistory}
              lookupIdx={props.lookupIdx}
              selLang={props.selLang}
              isActive={props.textInputIsActive}
            />
        }
        <TextInputToggler isActive={[textInputIsActive, setTextInputIsActive]} />
      </div>
      <div className="history navigation">

      </div>
    </div>
  );
}

export default Header;