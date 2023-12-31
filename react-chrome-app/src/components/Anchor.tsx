import { Page } from '../services/types';

interface AnchorProps {
  children: React.ReactNode;
  currentPage: [Page, React.Dispatch<React.SetStateAction<Page>>];
  isDropItem?: Boolean,
  link?: string;
  linkedPage: Page;
}

export default function Anchor(props: AnchorProps) {
  const [currentPage, setCurrentPage] = props.currentPage;
  const linkedPage = props.linkedPage;
  const link = props.link ?? '#';

  return (
    <a
      href={link}
      className={props.isDropItem ? 'dropdown-link' : 'nav-link'}
      target={props.link ? '_blank' : ''}
      onClick={(e) => {
        e.stopPropagation();
        setCurrentPage(linkedPage);
      }}
    >
      {props.children}
    </a>
  );
}