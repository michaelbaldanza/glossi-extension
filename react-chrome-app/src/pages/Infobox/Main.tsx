import type { DictAbbr, DictInfo, FdInfo, Lookup, Result, WiktInfo } from '../../services/types';
import Dictionary from './Dictionary';

interface MainProps {
  activeDict: [DictAbbr, React.Dispatch<React.SetStateAction<DictAbbr>>];
  selLang?: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
  lookupHistory:[
    Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>
  ];
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
}

function Main(props: MainProps) {
  const [activeDict, setActiveDict] = props.activeDict;
  const [lookupIdx, setLookupIdx] = props.lookupIdx;
  const [lookupHistory, setLookupHistory] = props.lookupHistory;
  const current = lookupHistory[lookupIdx];
  const quarry = current.quarry;

  function makeDictionaryPanels() {
    const refOrder: Array<DictAbbr> = ['wikt', 'fd'];
    return refOrder.map((dictabbr, idx0) => {
      const resp = current.result[dictabbr];
      const key = dictabbr + 'Resp';
      const respProp: {
        'wikt'?: WiktInfo,
        'fd'?: FdInfo,
        'selLang'?: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
      } = {
        [key]: resp
      };
      if (dictabbr === 'wikt') {
        respProp.selLang = props.selLang;
      }

      return (
        <div
          key={`${dictabbr}-${idx0}`}
          id={dictabbr}
          className={`dictionary-container ${dictabbr === activeDict ? 'd-block' : 'd-none'}`}
        >
          <Dictionary
            {...respProp}
            activeDict={activeDict}
            lookupHistory={props.lookupHistory}
            lookupIdx={props.lookupIdx}
          />
        </div>
      );
    });
  }

  return (
    <div>
      {makeDictionaryPanels()}
    </div>
  );
}

export default Main;