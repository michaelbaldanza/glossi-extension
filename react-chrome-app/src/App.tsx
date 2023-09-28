import { useEffect, useRef,useState } from 'react';
import Nav from './components/Nav';
import Login from './pages/Login';
import NewCard from './pages/NewCard/NewCard';
import { User } from './services/interfaces';
import type { Lookup, Page } from './services/types';
import { collect } from './services/dictionaries';
import Infobox from './pages/Infobox/Infobox';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [lookupHistory, setLookupHistory] = useState<Array<Lookup>>([]);
  const [textInputIsActive, setTextInputIsActive] = useState<boolean>(false);
  const [lookupIdx, setLookupIdx] = useState<number>(0);
  const [selLang, setSelLang] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('infobox');
  const fetchDataRef = useRef<((lookup: string) => Promise<void>) | null> (null);
  console.log(`textInput is ${textInputIsActive ? 'active' : 'inactive'}`)
  function turnPage() {
    const pages: Record<Page, JSX.Element> = {
      'cards': <div>Cards</div>,
      'decks': <div>Decks</div>,
      'infobox': <Infobox
        lookupIdx={[lookupIdx, setLookupIdx]}
        lookupHistory={[lookupHistory, setLookupHistory]}
        selLang={[selLang, setSelLang]}
        textInputIsActive={[textInputIsActive, setTextInputIsActive]}
        />,
      'login': <Login
        currentPage={[currentPage, setCurrentPage]}
        user={[user, setUser]}
      />,
      'logout': <div>Log out</div>,
      'new-card': <NewCard
        currentPage={[currentPage, setCurrentPage]}
      />,
      'profile': <div>Profile</div>,
      'signup': <div>Sign up</div>
    };


    return pages[currentPage];
  }

  useEffect(() => {
    /* Note for development:
      Letting the React server run can speed up development. The `chrome`
      API communicates with the service worker and local storage, but it
      the React server. To let it run, initialize `prevLookup`, move the
      `fetchDataRef.current` call out of the block opened by
      `chrome.runtime.onMessage.addListener`, and comment out the `chrome`
      calls.
    */
    
      let prevLookup: string = '';

    if (!user) {
      chrome.storage.local.get(['user']).then((result) => {
        if (result.hasOwnProperty('user')) {
          setUser(result.user);
        }
      });
    }

    fetchDataRef.current = async (lookup) => {
      try {
        if (prevLookup !== lookup) { 
          prevLookup = lookup;
          const newLookup: Lookup = {
            quarry: lookup,
            result: await collect(lookup)
          };
          
          /* Check for an error from the Wiktionary API.

            If the response doesn't have the key `'title'`, then check for the
            key `'en'` to see if English definitions are available.

            If `'en'` is there, pass it to 'setSelLang'. If not, take the first
            language found on the response object by making an array of its
            keys and taking the zeroth value.

            If the response doesn't have the key `'title'`, then set `selLang`
            to null.

            This ensures that the Wiktionary panel is not blank, as populated
            with either the definitions of a language or an error message.
          */
          const wiktRes = newLookup.result.wikt.response;
          if (!wiktRes.hasOwnProperty('title')) {
            setSelLang(wiktRes.hasOwnProperty('en') ? 'en' : Object.keys(wiktRes)[0])
          } else {
            setSelLang(null);
          }

          /* Pass a function to `setLookupHistory` `setCurrentPage`.
            Instead of passing `lookupHistory` directly, use
            the `prevLookupHistory` parameter to avoid the extra `useEffect` 
            calls that would be triggered by including `lookupHistory` as a
            dependency.
            Calculate the new `lookupIdx`. If there are no previous lookups,
            then the it should be zero (since arrays are zero-indexed). If not,
            increment the old `lookupIdx` by one.
            Return a slice of the old lookup history spread into an new array
            where the new lookup object is the final item.
            Pass `slice` zero as its `start` argument. `lookupHistory`
            always starts from the beginning.
            Also pass `slice` the new index as its `end` argument. The new
            history array should include the most recently viewed lookup.
            `slice` excludes the item at the `end` index, so argument should be
            one greater than the current index value.
          */

          setLookupHistory((prevLookupHistory) => {
            let newIdx: number = prevLookupHistory.length === 0 ? 0 : lookupIdx + 1;
            setLookupIdx(() => newIdx);
            return [...prevLookupHistory.slice(0, newIdx), newLookup];
          });
          setCurrentPage(() => 'infobox');
          setTextInputIsActive(false);
        }
      } catch(err) {
        console.error('Error fetching data', err)
      }
    }

    chrome.runtime.onMessage.addListener(({ name, data }) => {
      /*
        Adapted from Google Chrome's Dictionary side panel example.
        https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.sidepanel-dictionary/sidepanel.js
      */
      const lookup: string = data.value;
      if (name === 'glossi-define' && fetchDataRef.current) {
        fetchDataRef.current(lookup);
      }
    });
  }, [lookupIdx])

  return (
    <div>
      <Nav currentPage={[currentPage, setCurrentPage]} user={[user, setUser]} />
      <main className="container-fluid">{turnPage()}</main>
    </div>
  );
}

export default App;