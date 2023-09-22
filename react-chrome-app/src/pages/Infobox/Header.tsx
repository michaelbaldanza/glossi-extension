interface HeaderProps {
  lookup: string;
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
}

function Header(props: HeaderProps) {
  const [lookupIdx, setLookupIdx] = props.lookupIdx;
  const quarry = props.lookup;

  return (
    <div className="action-heading">
      <h5>{quarry}</h5>
    </div>
  );
}

export default Header;