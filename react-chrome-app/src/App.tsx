import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Login from './pages/Login';
import { User } from './services/interfaces';
import type { Lookup, Page } from './services/types';
import { collect } from './services/dictionaries';
import Home from './pages/Home';
import Infobox from './pages/Infobox/Infobox';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [lookupHistory, setLookupHistory] = useState<Array<Lookup>>([]);
  const [lookupIdx, setLookupIdx] = useState<number>(0);
  const [selLang, setSelLang] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('infobox');

  function turnPage() {
    const pages: Record<Page, JSX.Element> = {
      'cards': <div>Cards</div>,
      'decks': <div>Decks</div>,
      'infobox': <Infobox
          lookupIdx={[lookupIdx, setLookupIdx]}
          lookupHistory={[lookupHistory, setLookupHistory]}
          selLang={[selLang, setSelLang]}
        />,
      'home': <Home />,
      'login': <Login user={[user, setUser]} />,
      'logout': <div>Log out</div>,
      'profile': <div>Profile</div>,
      'signup': <div>Sign up</div>
    };


    return pages[currentPage];
  }

  useEffect(() => {
    chrome.storage.local.get(['user']).then((result) => {
      if (result.hasOwnProperty('user')) {
        setUser(result.user);
      }
    });

    chrome.runtime.onMessage.addListener(({ name, data }) => {
      /*
        Adapted from Google Chrome's Dictionary side panel example.
        https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.sidepanel-dictionary/sidepanel.js
      */
      console.log('check if user state has been set in chrome.runtime')
      console.log(user);
      const lookup: string = data.value;
      if (name === 'glossi-define') {
        const fetchData = async () => {
          try {
            const newLookupHistory = lookupHistory.slice();
            const newLookup: Lookup = {
              quarry: lookup,
              result: await collect(lookup)
            };
            const wiktRes = newLookup.result.wikt.response;
            if (!wiktRes.hasOwnProperty('title')) {
              setSelLang(wiktRes.hasOwnProperty('en') ? 'en' : Object.keys(wiktRes)[0])
            } else {
              setSelLang(null);
            }
            newLookupHistory.push(newLookup);
            
            setLookupHistory(newLookupHistory);
            setCurrentPage('infobox')
            // });
          } catch(err) {
            console.error('Error fetching data', err)
          }
        }
        fetchData();
      }
    });
  //   if (lookup.length > 0) {
  //     const fetchData = async () => {
  //       try {
  //         const newLookupHistory = lookupHistory.slice();
  //         // await collect(lookup).then((result) => {
  //           const newLookup: Lookup = {
  //             quarry: lookup,
  //             result: await collect(lookup)
  //           };
  //           newLookupHistory.push(newLookup);
  //           setLookupHistory(newLookupHistory);
  //         // });
  //       } catch(err) {
  //         console.error('Error fetching data', err)
  //       }
  //     }
  //     fetchData();
  //   }
  }, [])

  return (
    <div>
      <Nav currentPage={[currentPage, setCurrentPage]} user={[user, setUser]} />
      <main className="container-fluid">{turnPage()}</main>
    </div>
  );
}

export default App;