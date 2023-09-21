import Entry from './Entry';
import type { DictAbbr, DictInfo, FDError, FdInfo, FDMeaning, FDResponse, Lookup, WiktError, WiktInfo, WiktResponse } from '../../services/types';

interface DictionaryProps {
  activeDict: DictAbbr;
  quarry: string;
  fdResp?: FDError | FdInfo;
  wiktResp?: WiktError | WiktInfo;
  setLookupHistory: React.Dispatch<React.SetStateAction<Array<Lookup>>>;
  setLookupIdx: React.Dispatch<React.SetStateAction<number>>;
}

function Dictionary(props: DictionaryProps) {
  const { activeDict } = props;

  function mapEntries(entryArr: Array<FDMeaning>, idx0: number, headword?: string) {
    return entryArr.map((entry, idx1) => {
      const entryId = `${activeDict}${idx0}-entry${idx1}`;
      return (
        <Entry
          key={entryId}
          entryId={entryId}
          activeDict={activeDict}
          entry={entry}
          headword={headword}
          quarry={props.quarry}
        />
      );
    })
  }

  const books: Record<DictAbbr, () => JSX.Element> = {
    'fd': function() {
      if (props.fdResp) {
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
      }
      return <div>Something went wrong.</div>
    },
    'wikt': function() {
      if (props.wiktResp) {
        const wiktResp = props.wiktResp;
        if (isWiktError(wiktResp)) {
          const { title, detail } = wiktResp;
          return (
            <div className="error-message">
              <div>{title}</div>
              <div>{detail}</div>
            </div>
          )
        } else if (isWiktResponse(wiktResp.response)) {
          return (
            <div>
              Wiktionary response!
            </div>
          )
        }
      }
      return (
        <div>Something went wrong.</div>
      )
    }
  }

  return (
    books[activeDict]()
  );
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