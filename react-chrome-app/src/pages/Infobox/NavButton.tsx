import { DictAbbr, DictName } from '../../services/types';

interface NavButtonProps {
  children: React.ReactNode;
  activeDict?: DictAbbr | '';
  setActiveDict?: React.Dispatch<React.SetStateAction<DictAbbr>>;
  dictAbbr?: DictAbbr;
  dictName?: DictName;
  lang?: string;
  selLang?: string | null;
  setSelLang?: React.Dispatch<React.SetStateAction<string | null>>;
}

function NavButton(props: NavButtonProps) {
  const isDictBtn = props.dictAbbr ? true: false;
  function isActive() {
    let activity = false;
    if (isDictBtn) {
      const { dictAbbr, activeDict } = props;
      if (dictAbbr === activeDict) activity = true;
    } else if (!isDictBtn) {
      const { lang, selLang } = props;
      if (lang === selLang) activity = true;
    }
    return activity;
  }

  function setClickState() {
    if (isDictBtn) {
      const { dictAbbr, setActiveDict } = props;
      if (dictAbbr && setActiveDict) setActiveDict(dictAbbr);
    } else if (!isDictBtn) {
      const { lang, setSelLang } = props;
      if (lang && setSelLang) setSelLang(lang);
    }
  }


  return(
    <button
      className={
        `btn btn-link ${isDictBtn ? 'btn-dict-bar' : 'btn-lang-bar'} link-secondary toolbar-btn infobox-nav-btn ${isActive() ? 'active' : 'text-decoration-none'}`
      }
      data-bs-toggle={isActive() ? 'button' : ''}
      aria-pressed={isActive() ? 'true' : 'false'}
      onClick={(e) => {
        e.stopPropagation();
        setClickState();
      }}
    >
      {props.children}
    </button>
  );
}

export default NavButton;