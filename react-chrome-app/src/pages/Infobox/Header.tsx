interface HeaderProps {
  lookup: string;
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
}

function Header(props: HeaderProps) {
  const [lookupIdx, setLookupIdx] = props.lookupIdx;
  const quarry = props.lookup;

  return (
    <div className="action-heading">
      <h6>{quarry}</h6>
    </div>
  );
}

export default Header;