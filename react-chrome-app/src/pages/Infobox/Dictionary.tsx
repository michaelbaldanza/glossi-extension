import Entry from './Entry';
import NavButton  from './NavButton';
import type { DictAbbr, DictInfo, FdError, FdInfo, Lookup, Meaning, FdResponse, WiktError, WiktResponse } from '../../services/types';

interface DictionaryProps {
  activeDict: DictAbbr;
  resp: DictInfo;
  selLang?: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
  lookupHistory: [
    Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>
  ];
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
}

function Dictionary(props: DictionaryProps) {
  let { activeDict, resp } = props;
  let content: JSX.Element | null = null;

  function mapEntries(entryArr: Array<Meaning>, idx0: number, headword?: string) {
    return entryArr.map((entry, idx1) => {
      const entryId = `${activeDict}${idx0}-entry${idx1}`;
      return (
        <Entry
          key={entryId}
          entryId={entryId}
          activeDict={activeDict}
          entry={entry}
          headword={headword}
          lookupHistory={props.lookupHistory}
          lookupIdx={props.lookupIdx}
          selLang={props.selLang}
        />
      );
    });
  }

  if (activeDict === 'fd' && resp.abbr === 'fd' && !resp.response.hasOwnProperty('title')) {
    const fdResp = resp.response as Array<FdResponse>;
    content = ( <>{fdResp.map((term, idx0) => {
      const { word, meanings } = term;
      return mapEntries(meanings, idx0, word);
    })}</>);
  } else if (activeDict === 'fd' && resp.abbr === 'fd' && resp.response.hasOwnProperty('title')) {
    const fdError = resp.response as FdError;
    const { title, message, resolution } = fdError;
    content = (
      <div className="error-message">
      <div>{title}</div>
      <div>{message}</div>
      <div>{resolution}</div>
    </div>
    )
  } else if (activeDict === 'wikt' && resp.abbr === 'wikt' && !resp.response.hasOwnProperty('title') && props.selLang) {
    const [selLang, setSelLang] = props.selLang;
    const wiktResp = resp.response as WiktResponse;
    const languages = Object.keys(wiktResp);
    const languageBar = languages.map((lang, idx) => (
      <NavButton
        key={lang + '-' + idx}
        selLang={selLang}
        setSelLang={setSelLang}
        lang={lang}
      >
        {lang}
      </NavButton>
    ));

    content = (
      <>
        <div className="language-bar">
          {languageBar}
        </div>
        {
          languages.map((lang, idx) => (
            <div
              className={
                `wiktionary-entries-container
                ${lang === selLang ? 'd-block' : 'd-none'}`
              }
            >
              {mapEntries(wiktResp[lang], idx)}
            </div>
          ))
        }
      </>
    );
  } else if (activeDict === 'wikt' && resp.abbr === 'wikt' && resp.response.hasOwnProperty('title')) {
    const wiktError = resp.response as WiktError;
    const { title, detail } = wiktError;
    content = (
      <div className="error-message">
        <div>{title}</div>
        <div>{detail}</div>
      </div>
    );
  } else {
    content = (
      <>No API response.</>
    );
  }

  return content;
}

export default Dictionary;