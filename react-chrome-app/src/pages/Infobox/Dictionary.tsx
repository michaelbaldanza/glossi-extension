import Entry from './Entry';
import NavButton  from './NavButton';
import type { DictAbbr, DictInfo, FDError, FdInfo, Lookup, Meaning, FDResponse, WiktError, WiktInfo, WiktResponse } from '../../services/types';
interface DictionaryProps {
  activeDict: DictAbbr;
  fdResp?: FDError | FdInfo;
  wiktResp?: WiktError | WiktInfo;
  selLang?: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
  lookupHistory: [
    Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>
  ];
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
}

function Dictionary(props: DictionaryProps) {
  const { activeDict } = props;

  console.log(props.lookupHistory)

  function loadActiveDictionary() {
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
      })
    }
    if (activeDict === 'fd' && props.fdResp) {
      const fdResp = props.fdResp;
      if (isFDError(fdResp)) { // error handling
        const { title, message, resolution } = fdResp;
        return (
          <div className="error-message">
            <div>{title}</div>
            <div>{message}</div>
            <div>{resolution}</div>
          </div>
        );
      } else if (isFDResponse(fdResp.response)) {
        return <>{fdResp.response.map((term, idx0) => {
          const { word, meanings } = term;
          return mapEntries(meanings, idx0, word);
        })}</>;
      }
    } else if (activeDict === 'wikt' && props.wiktResp) {
      console.log(`going to have a Wiktionary error`)
      const wiktResp = props.wiktResp;
      console.log(wiktResp)
      if (isWiktError(wiktResp)) {
        const { title, detail } = wiktResp;
        console.log(`trying to offer up a wikt error`)
        return (
          <div className="error-message">
            <div>{title}</div>
            <div>{detail}</div>
          </div>
        )
      } else if (isWiktResponse(wiktResp.response) && props.selLang) {
        const [selLang, setSelLang] = props.selLang;
        const res = wiktResp.response;
        const languages = Object.keys(res);
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
        return (
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
                  {mapEntries(res[lang], idx)}
                </div>
              ))
            }
          </>
        );
      }
    }
    return (<></>)
  }

  return loadActiveDictionary();
}

export default Dictionary;

// Error handling and type guards

function isFDResponse(response: Array<FDResponse>): response is Array<FDResponse> {
  return Array.isArray(response);
}

function isFDError(resp: FdInfo | FDError): resp is FDError {
  return (resp as FDError).title !== undefined;
}

function isWiktResponse(response: WiktResponse): response is WiktResponse {
  return typeof response == 'object';
}

function isWiktError(resp: WiktInfo | WiktError): resp is WiktError {
  return (resp as WiktError).title !== undefined;
}