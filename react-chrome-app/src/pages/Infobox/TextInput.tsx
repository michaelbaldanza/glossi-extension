import { useState } from 'react';
import type { Lookup } from '../../services/types';
import { collect } from '../../services/dictionaries';

interface TextInputProps {
  isActive: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  lookupHistory: [Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>];
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
  selLang: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
}

function TextInput(props: TextInputProps) {
  const [isActive, setIsActive] = props.isActive;
  const [lookupHistory, setLookupHistory] = props.lookupHistory;
  const [lookupIdx, setLookupIdx] = props.lookupIdx;
  const [selLang, setSelLang] = props.selLang;
  const [search, setSearch] = useState<string>('');
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
        setIsActive(!isActive);
        setLookupIdx(newLookupHistory.length - 1);
      } catch (err) {
        console.error('Error fetching data', err);
      }
    }

    if (e.key === 'Enter') {
      fetchData();
    }
  }

  return (
    <input
      className="form-control infobox-text-input"
      type="text"
      placeholder="Search"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      value={search}
      autoFocus
    />
  );
}

export default TextInput;