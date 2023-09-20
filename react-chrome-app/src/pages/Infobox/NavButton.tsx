import { DictAbbr, DictName } from '../../services/types';

interface NavButtonProps {
  children: React.ReactNode;
  activeDict: [DictAbbr | '', React.Dispatch<React.SetStateAction<DictAbbr>>];
  dictAbbr: DictAbbr;
  dictName: DictName;
}

function NavButton(props: NavButtonProps) {
  const [activeDict, setActiveDict] = props.activeDict;
  const dictAbbr = props.dictAbbr;

  return(
    <button
      className={`btn btn-link link-secondary toolbar-btn ${dictAbbr === activeDict ? 'active' : 'text-decoration-none'}`}
      data-bs-toggle={dictAbbr === activeDict ? 'button' : ''}
      aria-pressed={dictAbbr === activeDict ? 'true' : 'false'}
      onClick={(e) => {
        e.stopPropagation();
        setActiveDict(dictAbbr);
      }}
      style={{'fontSize': 'small'}}
    >
      {props.children}
    </button>
  );
}

export default NavButton;