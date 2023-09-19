import type { DictAbbr, DictInfo, Lookup, Result } from '../../services/types';
import Dictionary from './Dictionary';

interface MainProps {
  activeDict: [DictAbbr, React.Dispatch<React.SetStateAction<DictAbbr>>];
  lookupHistory: [
    Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>
  ];
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
}

function Main(props: MainProps) {
  const [lookupHistory, setLookupHistory] = props.lookupHistory;
  const [lookupIdx, setLookupIdx] = props.lookupIdx;
  const [activeDict, setActiveDict] = props.activeDict;

  const current = lookupHistory[lookupIdx];
  const quarry = current.quarry;
  console.log(current.result)
  const result: Result = current.result;
  console.log(`here's the result`);
  console.log(result['wikt'])
  

  function makeDictionaryPanels() {
    const refOrder: Array<DictAbbr> = ['wikt', 'fd'];
    return refOrder.map((dictabbr, idx0) => {
      return (
      <div
        key={`${dictabbr}-${idx0}`}
        id={dictabbr}
        style={{'display': activeDict ===  dictabbr ? 'block' : 'none'}}
      >
        <Dictionary
          quarry={quarry}
          setLookupHistory={setLookupHistory}
        />
        {dictabbr}
      </div>)
    });
  }

  return (
    <div>
      {makeDictionaryPanels()}
    </div>
  );
}

export default Main;