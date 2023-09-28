import { useState } from 'react';
import useComponentVisible from '../../components/useComponentVisible';
import type { Lookup } from '../../services/types';
import { collect } from '../../services/dictionaries';

interface TextInputProps {
  initialValue?: string;
  isActive: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  lookupHistory: [Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>];
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
  selLang: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
}

function TextInput(props: TextInputProps) {
  const [isActive, setIsActive] = props.isActive;
  const { ref, isComponentVisible } = useComponentVisible(props.isActive);
  const [lookupHistory, setLookupHistory] = props.lookupHistory;
  const [lookupIdx, setLookupIdx] = props.lookupIdx;
  const [selLang, setSelLang] = props.selLang;
  const initialValue = props.initialValue;
  const [search, setSearch] = useState<string>(initialValue ?? '');
  console.log(`TextInput is ${isActive ? 'active' : 'inactive'}
  lookupHistory.length is ${lookupHistory.length}`)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.currentTarget.value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const fetchData = async () => {
      try {
        const newLookup: Lookup = {
          quarry: search,
          result: await collect(search)
        };
        const wiktRes = newLookup.result.wikt.response;
        if (!wiktRes.hasOwnProperty('title')) {
          setSelLang(
            wiktRes.hasOwnProperty('en') ? 'en' : Object.keys(wiktRes)[0]
          );
        } else {
          setSelLang(null);
        }
        const newLookupHistory = [...lookupHistory.slice(0, lookupIdx + 1), newLookup];
        setLookupHistory(newLookupHistory);
        setIsActive(false);
        setLookupIdx(newLookupHistory.length - 1);
      } catch (err) {
        console.error('Error fetching data', err);
      }
    }

    if (e.key === 'Enter') {
      search === initialValue ? setIsActive(false) : fetchData();
    } else if (e.key === 'Tab') {
      setIsActive(false);
    }
  }

  return (
    <input
      className="form-control infobox-text-input"
      type="text"
      placeholder={initialValue ?? 'Search'}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      ref={ref}
      value={search}
      autoFocus
    />
  );
}

export default TextInput;