interface HeaderProps {
  lookup: string;
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
}

function Header(props: HeaderProps) {
  const [lookupIdx, setLookupIdx] = props.lookupIdx;
  const quarry = props.lookup;

  return (
    <div className="action-heading">
      {props.lookup.length > 0 ? quarry : 'no look up yet'}
    </div>
  );
}

export default Header;