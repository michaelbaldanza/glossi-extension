import type { Lookup } from '../../services/types';

interface HeaderArrowProps {
  val: number;
  lookupHistory: [Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>];
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
}

function HeaderArrow(props: HeaderArrowProps) {
  const val = props.val;
  const isMore: boolean = val > 0 ? true : false;
  const [lookupHistory, setLookupHistory] = props.lookupHistory;
  const [lookupIdx, setLookupIdx] = props.lookupIdx;

  const canClick: boolean = (
    (
      isMore &&
      lookupHistory.length > 1 &&
      lookupIdx !== (lookupHistory.length - 1)
    )
    ||
    (
      !isMore &&
      lookupIdx > 0
    ) ?
    true : false
  );

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (!canClick) return;
    setLookupIdx(lookupIdx + val);
  }

  return (
    <button
      onClick={handleClick}
      className={`btn btn-link link-dark toolbar-btn text-decoration-none ${canClick ? '' : 'faded unclickable'}`}
      id={isMore ? 'fwd-btn' : 'bwd-btn'}
    >
      {isMore ? '→' : '←'}
    </button>
  );
}

export default HeaderArrow;