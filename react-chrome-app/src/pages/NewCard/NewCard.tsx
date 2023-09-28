import Header from './Header';
import type { Page } from '../../services/types';

interface NewCardProps {
  currentPage: [string, React.Dispatch<React.SetStateAction<Page>>];
}

function NewCard(props: NewCardProps) {
  return (
    <div className="new-card">
      <Header
        currentPage={props.currentPage}
      />
    </div>
  );
}

export default NewCard;