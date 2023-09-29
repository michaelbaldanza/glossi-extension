import type { CardDraft, Meaning, Page } from '../../services/types';

interface EntryHeadingProps {
  cardDraft: [CardDraft | null, React.Dispatch<React.SetStateAction<CardDraft | null>>];
  currentPage: [Page, React.Dispatch<React.SetStateAction<Page>>];
  entry: Meaning;
  headword?: string;
  isLogged: boolean;
  quarry: string;
  selLang: string | null;
}

function EntryHeading(props: EntryHeadingProps) {
  const { entry, headword, isLogged, quarry, selLang } = props;
  const [cardDraft, setCardDraft] = props.cardDraft;
  const [currentPage, setCurrentPage] = props.currentPage;

  return (
    <div className="entry-heading-container">
      {
        headword && headword !== quarry.toLowerCase() ?
        <h6 className="faded">{headword}</h6>
        :
        ''
      }
      {
        entry.partOfSpeech ?
        <div className="part-of-speech-container d-flex">
          <h6 className="part-of-speech-heading faded">
            {entry.partOfSpeech.toLowerCase()}
          </h6>
          {
            isLogged ?
            <button
              className="btn btn-link link-dark toolbar-btn text-decoration-none"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                const newCardDraft: CardDraft = {
                  ...entry,
                  headword: quarry
                }
                if (selLang) newCardDraft.languageCode = selLang;
                setCardDraft(newCardDraft);
                setCurrentPage('new-card');
              }}
            >
              +
            </button>
            :
            ''
          }
        </div>
        :
        ''
      }
    </div>
  );
}

export default EntryHeading;