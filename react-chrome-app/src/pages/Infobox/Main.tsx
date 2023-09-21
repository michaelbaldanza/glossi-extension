import type { DictAbbr, DictInfo, Lookup, Result } from '../../services/types';
import Dictionary from './Dictionary';

interface MainProps {
  activeDict: [DictAbbr, React.Dispatch<React.SetStateAction<DictAbbr>>];
  current: Lookup;
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
      return (
        <div
          key={`${dictabbr}-${idx0}`}
          id={dictabbr}
          style={{'display': activeDict ===  dictabbr ? 'block' : 'none'}}
        >
          <Dictionary
            activeDict={activeDict}
            quarry={quarry}
            resp={current.result[dictabbr]}
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