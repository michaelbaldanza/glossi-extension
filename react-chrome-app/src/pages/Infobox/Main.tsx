import type { DictAbbr, DictInfo, FdInfo, Lookup, Result, WiktInfo } from '../../services/types';
import Dictionary from './Dictionary';

interface MainProps {
  activeDict: [DictAbbr, React.Dispatch<React.SetStateAction<DictAbbr>>];
  current: Lookup;
  selLang?: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
  setLookupHistory: React.Dispatch<React.SetStateAction<Array<Lookup>>>;
  setLookupIdx: React.Dispatch<React.SetStateAction<number>>;
}

function Main(props: MainProps) {
  const [activeDict, setActiveDict] = props.activeDict;

  const current = props.current;
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
      console.log(`
      Right now, trying to get ${dictabbr} ready.
      The activeDict is ${activeDict}
      respProps are like this:
      `)
      console.log(respProp)
      return (
        <div
          key={`${dictabbr}-${idx0}`}
          id={dictabbr}
          style={{'display': activeDict ===  dictabbr ? 'block' : 'none'}}
        >
          <Dictionary
            {...respProp}
            activeDict={activeDict}
            quarry={quarry}
            setLookupHistory={props.setLookupHistory}
            setLookupIdx={props.setLookupIdx}
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