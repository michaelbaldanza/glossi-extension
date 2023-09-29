import TextInput from './Infobox/TextInput';
import type { DictAbbr, Lookup, Page } from '../services/types';

interface HomeProps {
  currentPage: [Page, React.Dispatch<React.SetStateAction<Page>>];
  lookupHistory: [
    Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>
  ];
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
  selLang: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
  textInputIsActive: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

function Home(props: HomeProps) {
  return (
    <div>
      <TextInput
        currentPage={props.currentPage}
        isActive={props.textInputIsActive}
        lookupHistory={props.lookupHistory}
        lookupIdx={props.lookupIdx}
        selLang={props.selLang}
      />
      <p>
        Welcome to the Glossi extension.
      </p>
      <p>
        Enter a search, or right-click any word on the web and select "Look up on Glossi".
      </p>
    </div>
  );
}

export default Home;