import type { Lookup } from '../../services/types';

interface DictionaryProps {
  quarry: string;
  setLookupHistory: React.Dispatch<React.SetStateAction<Array<Lookup>>>;
}

function Dictionary(props: DictionaryProps) {
  return (
    <div>Dictionary</div>
  );
}

export default Dictionary;