import NavButton from './NavButton';
import type { DictAbbr, DictAbbrToDictNameMap, DictName } from '../../services/types';

interface NavProps {
  activeDict: [DictAbbr | '', React.Dispatch<React.SetStateAction<DictAbbr>>];
}

function Nav(props: NavProps) {
  const refOrder: Array<DictAbbr> = ['wikt', 'fd'];
  const dictMap: DictAbbrToDictNameMap = {
    'wikt': 'Wiktionary',
    'fd': 'Free Dictionary',
  };
  const [activeDict, setActiveDict] = props.activeDict;

  return (
    <div className="dictionary-bar">
      {refOrder.map((dictAbbr, idx0) => {
        const dictName = dictMap[dictAbbr];

        return (
          <NavButton
            key={`${dictAbbr}-btn`}
            activeDict={[activeDict, setActiveDict]}
            dictAbbr={dictAbbr}
            dictName={dictName}
          >
            {dictName}
          </NavButton>
        )
      })}
    </div>
  );
}

export default Nav;