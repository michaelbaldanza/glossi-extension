import HeaderArrow from './HeaderArrow';
import TextInput from './TextInput';
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
  const current = lookupHistory[lookupIdx];
  const quarry = current.quarry;

  return (
    <div className="action-heading d-flex align-items-center">
      <div className="flex-grow-1">
      { 
        !textInputIsActive ?
          <h5
            className="clickable"
            title="Modify lookup"
            onClick={(e) => {
              e.stopPropagation();
              setTextInputIsActive(true);
            }}
          >
            {quarry}
          </h5>
        :
          <TextInput
            lookupHistory={props.lookupHistory}
            lookupIdx={props.lookupIdx}
            selLang={props.selLang}
            isActive={props.textInputIsActive}
            initialValue={quarry}
          />
      }
      </div>
      <div className="lookup-nav-arrow-container">
        <HeaderArrow
          lookupHistory={props.lookupHistory}
          lookupIdx={props.lookupIdx}
          val={-1}
        />
        <HeaderArrow
          lookupHistory={props.lookupHistory}
          lookupIdx={props.lookupIdx}
          val={1}
        />
      </div>
    </div>
  );
}

export default Header;