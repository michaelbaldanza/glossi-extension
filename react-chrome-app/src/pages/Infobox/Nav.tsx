import { type DictAbbr } from '../../services/types';

interface NavProps {
  activeDict: [DictAbbr | '', React.Dispatch<React.SetStateAction<DictAbbr>>];
}

function Nav(props: NavProps) {
  const [activeDict, setActiveDict] = props.activeDict;

  return (
    <div>
      {activeDict}
    </div>
  );
}

export default Nav;