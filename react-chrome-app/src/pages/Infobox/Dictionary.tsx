import Entry from './Entry';
import type { DictAbbr, DictInfo, FDError, FDMeaning, FDResponse, Lookup, WiktResponse } from '../../services/types';

interface DictionaryProps {
  activeDict: DictAbbr;
  quarry: string;
  resp: FDError | DictInfo;
  setLookupHistory: React.Dispatch<React.SetStateAction<Array<Lookup>>>;
  setLookupIdx: React.Dispatch<React.SetStateAction<number>>;
}

function isFDResponse(response: Array<FDResponse> | WiktResponse): response is Array<FDResponse> {
  return Array.isArray(response);
}

function isFDError(resp: DictInfo | FDError): resp is FDError {
  return (resp as FDError).title !== undefined;
}

function Dictionary(props: DictionaryProps) {
  const { activeDict, resp } = props;

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
      if (isFDError(resp)) { // error handling
        const { title, message, resolution } = resp;
        return (
          <div className="error-message">
            <div>{title}</div>
            <div>{message}</div>
            <div>{resolution}</div>
          </div>
        );
      } else if (isFDResponse(resp.response)) {
        return <>{resp.response.map((term, idx0) => {
          const { word, meanings } = term;
          return mapEntries(meanings, idx0, word);
        })}</>;
      }
      return <div>Something went wrong.</div>
    },
    'wikt': function() {
      return (
        <div>Wiktionary</div>
      )
    }
  }

  return (
    books[activeDict]()
  );
}

export default Dictionary;