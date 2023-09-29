import Header from './Header';
import type { User } from '../../services/interfaces';
import type { CardDraft, Page } from '../../services/types';

interface NewCardProps {
  cardDraft: [CardDraft | null, React.Dispatch<React.SetStateAction<CardDraft | null>>];
  currentPage: [Page, React.Dispatch<React.SetStateAction<Page>>];
  user: [User | null, React.Dispatch<React.SetStateAction<User | null>>];
}

function NewCard(props: NewCardProps) {
  const [cardDraft, setCardDraft] = props.cardDraft;
  
  return (
    <div className="new-card">
      <Header
        currentPage={props.currentPage}
      />
      <form onSubmit={e => e.preventDefault()}>

        <button
          type="submit"
          className="btn btn-primary"

        >
          Add to deck
        </button>
      </form>
    </div>
  );
}

export default NewCard;