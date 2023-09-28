import type { Page } from '../../services/types';

interface HeaderProps {
  currentPage: [string, React.Dispatch<React.SetStateAction<Page>>];
}

function Header(props: HeaderProps) {
  const [currentPage, setCurrentPage] = props.currentPage;
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setCurrentPage('infobox');
  }
  return (
    <div className="action-heading d-flex justify-content-between">
      <h5>Make a card</h5>
      <button
        className="new-card-return-btn btn btn-link link-dark toolbar-btn text-decoration-none"
        onClick={handleClick}
        title="Return to look up"
      >
        '↩'
      </button>
    </div>
  );
}

export default Header;