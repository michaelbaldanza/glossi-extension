import { useState } from 'react';
import type { Lookup } from '../../services/types';
import { collect } from '../../services/dictionaries';

interface TextInputProps {
  lookupHistory: [Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>];
  selLang: [string | null, React.Dispatch<React.SetStateAction<string | null>>];
}

function TextInput(props: TextInputProps) {
  const [lookupHistory, setLookupHistory] = props.lookupHistory;
  const [selLang, setSelLang] = props.selLang;
  const [search, setSearch] = useState<string>('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.currentTarget.value);
    console.log(search);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    console.log(`fetching data`)
    const fetchData = async () => {
      try {
        const newLookupHistory = lookupHistory.slice();
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
        newLookupHistory.push(newLookup);
        setLookupHistory(newLookupHistory);
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
      className="form-control"
      type="text"
      placeholder="Enter the word you would like to look up"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      value={search}
      autoFocus
    />
  );
}

export default TextInput;